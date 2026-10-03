<?php

namespace App\Repositories\Eloquent;

use App\Models\Book;
use App\Repositories\Contracts\BookRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BookRepository implements BookRepositoryInterface
{
    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Book::query();

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['category'])) {
            $query->category($filters['category']);
        }

        if (!empty($filters['available_only'])) {
            $query->available();
        }

        if (!empty($filters['featured'])) {
            $query->featured();
        }

        $sort = $filters['sort'] ?? 'latest';
        match ($sort) {
            'price-asc' => $query->orderBy('price', 'asc'),
            'price-desc' => $query->orderBy('price', 'desc'),
            'rating' => $query->orderBy('rating', 'desc'),
            'title-asc' => $query->orderBy('title', 'asc'),
            'year' => $query->orderBy('publication_year', 'desc'),
            default => $query->orderBy('id', 'desc'),
        };

        return $query->paginate($perPage);
    }

    public function getAll(array $filters = []): Collection
    {
        $query = Book::query();

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['category'])) {
            $query->category($filters['category']);
        }

        return $query->orderBy('id', 'desc')->get();
    }

    public function findById(int $id): ?Book
    {
        return Book::find($id);
    }

    public function findByIsbn(string $isbn): ?Book
    {
        return Book::where('isbn', $isbn)->first();
    }

    public function create(array $data): Book
    {
        return Book::create($data);
    }

    public function update(Book $book, array $data): Book
    {
        $book->update($data);
        return $book->fresh();
    }

    public function delete(Book $book): bool
    {
        return $book->delete();
    }

    public function lockForUpdate(int $id): ?Book
    {
        return Book::where('id', $id)->lockForUpdate()->first();
    }
}
