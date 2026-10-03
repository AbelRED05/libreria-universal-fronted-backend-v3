<?php

namespace App\DTOs;

use Carbon\Carbon;

class LoanDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly int $bookId,
        public readonly ?string $loanDate = null,
        public readonly ?string $dueDate = null,
        public readonly ?string $notes = null,
    ) {}

    public static function fromArray(array $data, ?int $defaultUserId = null): self
    {
        $userId = isset($data['user_id']) ? (int) $data['user_id'] : ($defaultUserId ?? 0);
        $bookId = (int) ($data['book_id'] ?? $data['bookId']);
        $loanDate = $data['loan_date'] ?? Carbon::today()->toDateString();
        $dueDate = $data['due_date'] ?? Carbon::today()->addDays(14)->toDateString();

        return new self(
            userId: $userId,
            bookId: $bookId,
            loanDate: $loanDate,
            dueDate: $dueDate,
            notes: $data['notes'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'book_id' => $this->bookId,
            'loan_date' => $this->loanDate,
            'due_date' => $this->dueDate,
            'status' => 'active',
            'notes' => $this->notes,
        ];
    }
}
