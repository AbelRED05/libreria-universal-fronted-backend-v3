<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'numeric_id' => $this->id,
            'title' => $this->title,
            'author' => $this->author,
            'category' => $this->category,
            'category_id' => $this->category_id,
            'isbn' => $this->isbn ?? '',
            'description' => $this->description ?? '',
            'synopsis' => $this->description ?? '',
            'publisher' => $this->publisher ?? '',
            'year' => (int) ($this->publication_year ?? 0),
            'publication_year' => (int) ($this->publication_year ?? 0),
            'pages' => (int) $this->pages,
            'price' => (float) $this->price,
            'originalPrice' => $this->original_price ? (float) $this->original_price : null,
            'original_price' => $this->original_price ? (float) $this->original_price : null,
            'imageUrl' => $this->cover_image ?? '',
            'cover_image' => $this->cover_image ?? '',
            'coverTheme' => $this->cover_theme ?? 'navy',
            'cover_theme' => $this->cover_theme ?? 'navy',
            'stock' => (int) $this->available_copies,
            'available_copies' => (int) $this->available_copies,
            'total_copies' => (int) $this->total_copies,
            'rating' => (float) $this->rating,
            'reviewsCount' => (int) $this->reviews_count,
            'reviews_count' => (int) $this->reviews_count,
            'featured' => (bool) $this->is_featured,
            'is_featured' => (bool) $this->is_featured,
            'bestSeller' => (bool) $this->is_bestseller,
            'is_bestseller' => (bool) $this->is_bestseller,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
