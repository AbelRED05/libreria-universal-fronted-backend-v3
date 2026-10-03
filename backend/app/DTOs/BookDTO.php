<?php

namespace App\DTOs;

class BookDTO
{
    public function __construct(
        public readonly string $title,
        public readonly string $author,
        public readonly ?string $category = 'General',
        public readonly ?int $categoryId = null,
        public readonly ?string $isbn = null,
        public readonly ?string $description = null,
        public readonly ?string $publisher = null,
        public readonly ?int $publicationYear = null,
        public readonly int $pages = 0,
        public readonly float $price = 0.0,
        public readonly ?float $originalPrice = null,
        public readonly ?string $coverImage = null,
        public readonly string $coverTheme = 'navy',
        public readonly float $rating = 5.0,
        public readonly int $reviewsCount = 0,
        public readonly int $totalCopies = 1,
        public readonly ?int $availableCopies = null,
        public readonly bool $isFeatured = false,
        public readonly bool $isBestseller = false,
    ) {}

    public static function fromArray(array $data): self
    {
        $total = isset($data['total_copies']) ? (int) $data['total_copies'] : (isset($data['stock']) ? (int) $data['stock'] : 1);
        $available = isset($data['available_copies']) ? (int) $data['available_copies'] : (isset($data['stock']) ? (int) $data['stock'] : $total);

        return new self(
            title: trim($data['title']),
            author: trim($data['author']),
            category: $data['category'] ?? 'General',
            categoryId: isset($data['category_id']) ? (int) $data['category_id'] : null,
            isbn: isset($data['isbn']) ? trim($data['isbn']) : null,
            description: $data['description'] ?? $data['synopsis'] ?? null,
            publisher: $data['publisher'] ?? null,
            publicationYear: isset($data['publication_year']) ? (int) $data['publication_year'] : (isset($data['year']) ? (int) $data['year'] : null),
            pages: isset($data['pages']) ? (int) $data['pages'] : 0,
            price: isset($data['price']) ? (float) $data['price'] : 0.0,
            originalPrice: isset($data['original_price']) ? (float) $data['original_price'] : (isset($data['originalPrice']) ? (float) $data['originalPrice'] : null),
            coverImage: $data['cover_image'] ?? $data['imageUrl'] ?? null,
            coverTheme: $data['cover_theme'] ?? $data['coverTheme'] ?? 'navy',
            rating: isset($data['rating']) ? (float) $data['rating'] : 5.0,
            reviewsCount: isset($data['reviews_count']) ? (int) $data['reviews_count'] : (isset($data['reviewsCount']) ? (int) $data['reviewsCount'] : 0),
            totalCopies: $total,
            availableCopies: $available,
            isFeatured: !empty($data['is_featured']) || !empty($data['featured']),
            isBestseller: !empty($data['is_bestseller']) || !empty($data['bestSeller']),
        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'author' => $this->author,
            'category' => $this->category,
            'category_id' => $this->categoryId,
            'isbn' => $this->isbn,
            'description' => $this->description,
            'publisher' => $this->publisher,
            'publication_year' => $this->publicationYear,
            'pages' => $this->pages,
            'price' => $this->price,
            'original_price' => $this->originalPrice,
            'cover_image' => $this->coverImage,
            'cover_theme' => $this->coverTheme,
            'rating' => $this->rating,
            'reviews_count' => $this->reviewsCount,
            'total_copies' => $this->totalCopies,
            'available_copies' => $this->availableCopies ?? $this->totalCopies,
            'is_featured' => $this->isFeatured,
            'is_bestseller' => $this->isBestseller,
        ];
    }
}
