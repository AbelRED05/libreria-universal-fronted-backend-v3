<?php

namespace App\Repositories\Eloquent;

use App\Models\Loan;
use App\Repositories\Contracts\LoanRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LoanRepository implements LoanRepositoryInterface
{
    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Loan::with(['user', 'book']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['book_id'])) {
            $query->where('book_id', $filters['book_id']);
        }

        return $query->orderBy('id', 'desc')->paginate($perPage);
    }

    public function getByUserId(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Loan::with(['book'])->where('user_id', $userId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('id', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?Loan
    {
        return Loan::with(['user', 'book'])->find($id);
    }

    public function create(array $data): Loan
    {
        return Loan::create($data);
    }

    public function update(Loan $loan, array $data): Loan
    {
        $loan->update($data);
        return $loan->fresh(['user', 'book']);
    }

    public function lockForUpdate(int $id): ?Loan
    {
        return Loan::where('id', $id)->lockForUpdate()->first();
    }
}
