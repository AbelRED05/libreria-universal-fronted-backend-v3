<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function getAll(): Collection
    {
        return Category::withCount('books')->orderBy('name', 'asc')->get();
    }

    public function findById(int $id): ?Category
    {
        return Category::find($id);
    }

    public function findByName(string $name): ?Category
    {
        return Category::where('name', $name)->first();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function delete(Category $category): bool
    {
        return $category->delete();
    }
}
