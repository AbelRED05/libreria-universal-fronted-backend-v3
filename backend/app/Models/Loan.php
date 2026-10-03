<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Loan extends Model
{
    use HasFactory;

    public const STATUS_ACTIVE = 'active';
    public const STATUS_RETURNED = 'returned';
    public const STATUS_OVERDUE = 'overdue';

    public const STATUSES = [
        self::STATUS_ACTIVE,
        self::STATUS_RETURNED,
        self::STATUS_OVERDUE,
    ];

    protected $fillable = [
        'user_id',
        'book_id',
        'loan_date',
        'due_date',
        'returned_at',
        'status',
        'notes',
    ];

    protected $casts = [
        'loan_date' => 'date',
        'due_date' => 'date',
        'returned_at' => 'datetime',
    ];

    /**
     * User who borrowed the book.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Book borrowed.
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Check if loan is currently active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE && is_null($this->returned_at);
    }

    /**
     * Check if loan is returned.
     */
    public function isReturned(): bool
    {
        return $this->status === self::STATUS_RETURNED || !is_null($this->returned_at);
    }

    /**
     * Check if loan is past due date.
     */
    public function isOverdue(): bool
    {
        if ($this->isReturned()) {
            return false;
        }

        return Carbon::parse($this->due_date)->isPast();
    }

    /**
     * Scope for active loans.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE)->whereNull('returned_at');
    }

    /**
     * Scope for returned loans.
     */
    public function scopeReturned(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_RETURNED)->orWhereNotNull('returned_at');
    }

    /**
     * Scope for overdue loans.
     */
    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE)
                     ->whereNull('returned_at')
                     ->where('due_date', '<', Carbon::today()->toDateString());
    }
}
