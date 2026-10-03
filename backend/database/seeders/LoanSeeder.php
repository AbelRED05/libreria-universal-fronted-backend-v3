<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class LoanSeeder extends Seeder
{
    public function run(): void
    {
        $reader = User::where('role', User::ROLE_CLIENT)->first();
        $admin = User::where('role', User::ROLE_ADMIN)->first();
        $book1 = Book::first();
        $book2 = Book::skip(1)->first();

        if ($reader && $book1) {
            // Sample active loan
            Loan::firstOrCreate(
                [
                    'user_id' => $reader->id,
                    'book_id' => $book1->id,
                    'status' => Loan::STATUS_ACTIVE,
                ],
                [
                    'loan_date' => Carbon::now()->subDays(3)->toDateString(),
                    'due_date' => Carbon::now()->addDays(11)->toDateString(),
                    'returned_at' => null,
                    'status' => Loan::STATUS_ACTIVE,
                    'notes' => 'Préstamo estándar para lectura en domicilio',
                ]
            );

            // Deduct 1 copy from book1 availability
            $book1->available_copies = max(0, $book1->available_copies - 1);
            $book1->save();
        }

        if ($reader && $book2) {
            // Sample returned loan
            Loan::firstOrCreate(
                [
                    'user_id' => $reader->id,
                    'book_id' => $book2->id,
                    'status' => Loan::STATUS_RETURNED,
                ],
                [
                    'loan_date' => Carbon::now()->subDays(20)->toDateString(),
                    'due_date' => Carbon::now()->subDays(6)->toDateString(),
                    'returned_at' => Carbon::now()->subDays(7),
                    'status' => Loan::STATUS_RETURNED,
                    'notes' => 'Devuelto en excelente estado de conservación',
                ]
            );
        }
    }
}
