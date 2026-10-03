<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Loan>
 */
class LoanFactory extends Factory
{
    protected $model = Loan::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'book_id' => Book::factory(),
            'loan_date' => Carbon::today()->toDateString(),
            'due_date' => Carbon::today()->addDays(14)->toDateString(),
            'returned_at' => null,
            'status' => Loan::STATUS_ACTIVE,
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function returned(): static
    {
        return $this->state(fn () => [
            'returned_at' => Carbon::now(),
            'status' => Loan::STATUS_RETURNED,
        ]);
    }
}
