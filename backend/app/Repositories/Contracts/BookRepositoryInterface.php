<?php

namespace App\Repositories\Contracts;

use App\Models\Book;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BookRepositoryInterface
{
    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getAll(array $filters = []): Collection;

    public function findById(int $id): ?Book;

    public function findByIsbn(string $isbn): ?Book;

    public function create(array $data): Book;

    public function update(Book $book, array $data): Book;

    public function delete(Book $book): bool;

    public function lockForUpdate(int $id): ?Book;
}
