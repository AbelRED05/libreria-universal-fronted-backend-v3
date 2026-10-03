<?php

namespace App\Services;

use App\DTOs\LoanDTO;
use App\Exceptions\BookNotAvailableException;
use App\Exceptions\LoanAlreadyReturnedException;
use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use App\Repositories\Contracts\BookRepositoryInterface;
use App\Repositories\Contracts\LoanRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class LoanService
{
    public const DEFAULT_LOAN_DAYS = 14;

    public function __construct(
        protected LoanRepositoryInterface $loanRepository,
        protected BookRepositoryInterface $bookRepository,
        protected UserRepositoryInterface $userRepository
    ) {}

    public function getAllLoans(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->loanRepository->getAllPaginated($filters, $perPage);
    }

    public function getUserLoans(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->loanRepository->getByUserId($userId, $filters, $perPage);
    }

    public function getLoanById(int $id): Loan
    {
        $loan = $this->loanRepository->findById($id);
        if (!$loan) {
            $e = new ModelNotFoundException();
            $e->setModel(Loan::class, [$id]);
            throw $e;
        }

        return $loan;
    }

    /**
     * Create a loan with atomic inventory reduction and lock protection against race conditions.
     */
    public function createLoan(LoanDTO $dto): Loan
    {
        return DB::transaction(function () use ($dto) {
            // Check user exists
            $user = $this->userRepository->findById($dto->userId);
            if (!$user) {
                $e = new ModelNotFoundException();
                $e->setModel(User::class, [$dto->userId]);
                throw $e;
            }

            // Lock book row for update to prevent concurrent over-borrowing
            $book = $this->bookRepository->lockForUpdate($dto->bookId);
            if (!$book) {
                $e = new ModelNotFoundException();
                $e->setModel(Book::class, [$dto->bookId]);
                throw $e;
            }

            // Verify stock availability
            if ($book->available_copies <= 0) {
                throw new BookNotAvailableException(
                    "El libro '{$book->title}' no tiene ejemplares disponibles para préstamo en este momento."
                );
            }

            // Decrement available copies
            $book->available_copies -= 1;
            $book->save();

            // Create loan record
            $loanDate = $dto->loanDate ?: Carbon::today()->toDateString();
            $dueDate = $dto->dueDate ?: Carbon::parse($loanDate)->addDays(self::DEFAULT_LOAN_DAYS)->toDateString();

            $loan = $this->loanRepository->create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'loan_date' => $loanDate,
                'due_date' => $dueDate,
                'returned_at' => null,
                'status' => Loan::STATUS_ACTIVE,
                'notes' => $dto->notes,
            ]);

            return $loan->load(['user', 'book']);
        });
    }

    /**
     * Return a loaned book atomically, restoring inventory stock.
     */
    public function returnLoan(int $loanId, ?string $returnNotes = null): Loan
    {
        return DB::transaction(function () use ($loanId, $returnNotes) {
            // Lock loan row for update
            $loan = $this->loanRepository->lockForUpdate($loanId);
            if (!$loan) {
                $e = new ModelNotFoundException();
                $e->setModel(Loan::class, [$loanId]);
                throw $e;
            }

            // Check if already returned
            if ($loan->isReturned()) {
                throw new LoanAlreadyReturnedException(
                    "El préstamo #{$loanId} ya fue devuelto el " . $loan->returned_at?->format('d/m/Y H:i')
                );
            }

            // Lock book row to restore inventory
            $book = $this->bookRepository->lockForUpdate($loan->book_id);
            if ($book) {
                // Ensure available copies does not exceed total copies
                $book->available_copies = min($book->total_copies, $book->available_copies + 1);
                $book->save();
            }

            // Update loan status
            $notes = $loan->notes;
            if ($returnNotes) {
                $notes = $notes ? "{$notes} | Retorno: {$returnNotes}" : "Retorno: {$returnNotes}";
            }

            $loan->update([
                'returned_at' => Carbon::now(),
                'status' => Loan::STATUS_RETURNED,
                'notes' => $notes,
            ]);

            return $loan->fresh(['user', 'book']);
        });
    }
}
