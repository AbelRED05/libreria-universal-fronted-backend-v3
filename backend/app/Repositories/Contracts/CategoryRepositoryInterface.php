<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    public function getAll(): Collection;

    public function findById(int $id): ?Category;

    public function findByName(string $name): ?Category;

    public function create(array $data): Category;

    public function delete(Category $category): bool;
}
