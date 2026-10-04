<?php

namespace App\Services;

use App\DTOs\BookDTO;
use App\Models\Book;
use App\Repositories\Contracts\BookRepositoryInterface;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class BookService
{
    public function __construct(
        protected BookRepositoryInterface $bookRepository,
        protected CategoryRepositoryInterface $categoryRepository
    ) {}

    public function getPaginatedBooks(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->bookRepository->getAllPaginated($filters, $perPage);
    }

    public function getAllBooks(array $filters = []): Collection
    {
        return $this->bookRepository->getAll($filters);
    }

    public function getBookById(int $id): Book
    {
        $book = $this->bookRepository->findById($id);
        if (!$book) {
            $e = new ModelNotFoundException();
            $e->setModel(Book::class, [$id]);
            throw $e;
        }

        return $book;
    }

    public function createBook(BookDTO $dto): Book
    {
        $data = $dto->toArray();

        // If category is provided by name but category_id is missing, link or create category
        if (!empty($dto->category) && empty($dto->categoryId)) {
            $cat = $this->categoryRepository->findByName($dto->category);
            if (!$cat) {
                $cat = $this->categoryRepository->create([
                    'name' => $dto->category,
                    'description' => "Categoría {$dto->category}",
                ]);
            }
            $data['category_id'] = $cat->id;
        }

        return $this->bookRepository->create($data);
    }

    public function updateBook(int $id, array $data): Book
    {
        $book = $this->getBookById($id);

        // Ensure available_copies does not exceed total_copies
        if (isset($data['total_copies'])) {
            $diff = $data['total_copies'] - $book->total_copies;
            $newAvailable = max(0, $book->available_copies + $diff);
            $data['available_copies'] = min($data['total_copies'], $newAvailable);
        }

        return $this->bookRepository->update($book, $data);
    }

    public function deleteBook(int $id): bool
    {
        $book = $this->getBookById($id);

        // Check if there are active loans for this book
        if ($book->activeLoans()->exists()) {
            throw new ConflictHttpException('No se puede eliminar el libro porque existen préstamos activos asociados.');
        }

        return $this->bookRepository->delete($book);
    }
}
