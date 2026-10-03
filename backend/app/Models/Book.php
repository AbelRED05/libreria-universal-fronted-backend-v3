<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'category',
        'title',
        'author',
        'isbn',
        'description',
        'publisher',
        'publication_year',
        'pages',
        'price',
        'original_price',
        'cover_image',
        'cover_theme',
        'rating',
        'reviews_count',
        'total_copies',
        'available_copies',
        'is_featured',
        'is_bestseller',
    ];

    protected $casts = [
        'price' => 'float',
        'original_price' => 'float',
        'rating' => 'float',
        'publication_year' => 'integer',
        'pages' => 'integer',
        'reviews_count' => 'integer',
        'total_copies' => 'integer',
        'available_copies' => 'integer',
        'is_featured' => 'boolean',
        'is_bestseller' => 'boolean',
    ];

    /**
     * Category relationship.
     */
    public function categoryRelation(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Loans history.
     */
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    /**
     * Active loans.
     */
    public function activeLoans(): HasMany
    {
        return $this->hasMany(Loan::class)->where('status', 'active');
    }

    /**
     * Check if copies are available for borrowing or purchase.
     */
    public function isAvailable(): bool
    {
        return $this->available_copies > 0;
    }

    /**
     * Scope to search by title, author, or ISBN.
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (empty($term)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
              ->orWhere('author', 'like', "%{$term}%")
              ->orWhere('isbn', 'like', "%{$term}%");
        });
    }

    /**
     * Scope to filter by category name.
     */
    public function scopeCategory(Builder $query, ?string $category): Builder
    {
        if (empty($category) || strtolower($category) === 'all' || strtolower($category) === 'todos') {
            return $query;
        }

        return $query->where('category', 'like', "%{$category}%");
    }

    /**
     * Scope to filter by available stock only.
     */
    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('available_copies', '>', 0);
    }

    /**
     * Scope to filter featured books.
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }
}
