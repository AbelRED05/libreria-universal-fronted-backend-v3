<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'book_id' => $this->book_id,
            'loan_date' => $this->loan_date ? $this->loan_date->format('Y-m-d') : null,
            'due_date' => $this->due_date ? $this->due_date->format('Y-m-d') : null,
            'returned_at' => $this->returned_at ? $this->returned_at->toISOString() : null,
            'status' => $this->status,
            'is_returned' => $this->isReturned(),
            'is_overdue' => $this->isOverdue(),
            'notes' => $this->notes,
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'role' => $this->user->role,
            ]),
            'book' => $this->whenLoaded('book', fn() => [
                'id' => $this->book->id,
                'title' => $this->book->title,
                'author' => $this->book->author,
                'category' => $this->book->category,
                'isbn' => $this->book->isbn,
                'imageUrl' => $this->book->cover_image,
                'available_copies' => $this->book->available_copies,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
