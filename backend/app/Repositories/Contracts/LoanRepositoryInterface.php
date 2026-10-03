<?php

namespace App\Repositories\Contracts;

use App\Models\Loan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LoanRepositoryInterface
{
    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getByUserId(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Loan;

    public function create(array $data): Loan;

    public function update(Loan $loan, array $data): Loan;

    public function lockForUpdate(int $id): ?Loan;
}
