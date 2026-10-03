<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoanTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_borrow_available_book_and_inventory_decrements(): void
    {
        $client = User::factory()->client()->create();
        $token = auth('api')->login($client);

        $book = Book::factory()->create([
            'total_copies' => 3,
            'available_copies' => 3,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/loans', [
                'book_id' => $book->id,
                'due_date' => now()->addDays(14)->toDateString(),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'active');

        $this->assertEquals(2, $book->fresh()->available_copies);
        $this->assertDatabaseHas('loans', [
            'user_id' => $client->id,
            'book_id' => $book->id,
            'status' => 'active',
        ]);
    }

    public function test_borrowing_fails_when_book_has_no_available_copies(): void
    {
        $client = User::factory()->client()->create();
        $token = auth('api')->login($client);

        $book = Book::factory()->create([
            'total_copies' => 2,
            'available_copies' => 0,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/loans', [
                'book_id' => $book->id,
            ]);

        $response->assertStatus(409)
            ->assertJsonPath('success', false);

        $this->assertEquals(0, $book->fresh()->available_copies);
    }

    public function test_admin_can_mark_loan_returned_and_stock_is_restored(): void
    {
        $admin = User::factory()->admin()->create();
        $token = auth('api')->login($admin);

        $book = Book::factory()->create([
            'total_copies' => 5,
            'available_copies' => 4,
        ]);

        $loan = Loan::factory()->create([
            'book_id' => $book->id,
            'status' => Loan::STATUS_ACTIVE,
            'returned_at' => null,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/v1/loans/{$loan->id}/return", [
                'notes' => 'Devuelto en buen estado',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'returned');

        $this->assertEquals(5, $book->fresh()->available_copies);
        $this->assertNotNull($loan->fresh()->returned_at);
    }

    public function test_cannot_return_an_already_returned_loan(): void
    {
        $admin = User::factory()->admin()->create();
        $token = auth('api')->login($admin);

        $loan = Loan::factory()->returned()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/v1/loans/{$loan->id}/return");

        $response->assertStatus(409)
            ->assertJsonPath('success', false);
    }

    public function test_client_only_sees_their_own_loans(): void
    {
        $client1 = User::factory()->client()->create();
        $client2 = User::factory()->client()->create();

        Loan::factory()->create(['user_id' => $client1->id]);
        Loan::factory()->create(['user_id' => $client2->id]);

        $token1 = auth('api')->login($client1);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token1)
            ->getJson('/api/v1/me/loans');

        $response->assertStatus(200)
            ->assertJsonPath('pagination.total', 1);
    }

    public function test_client_cannot_access_other_users_loan_detail(): void
    {
        $client1 = User::factory()->client()->create();
        $client2 = User::factory()->client()->create();

        $loan2 = Loan::factory()->create(['user_id' => $client2->id]);

        $token1 = auth('api')->login($client1);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token1)
            ->getJson("/api/v1/loans/{$loan2->id}");

        $response->assertStatus(403);
    }

    public function test_client_cannot_access_admin_all_loans_route(): void
    {
        $client = User::factory()->client()->create();
        $token = auth('api')->login($client);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/loans');

        $response->assertStatus(403);
    }
}
