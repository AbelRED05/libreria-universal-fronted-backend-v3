<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_books_paginated(): void
    {
        Book::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/books');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data',
                'pagination' => ['total', 'per_page', 'current_page'],
            ]);
    }

    public function test_can_search_books_by_title_or_author(): void
    {
        Book::factory()->create(['title' => 'Rayuela', 'author' => 'Julio Cortázar']);
        Book::factory()->create(['title' => 'Ficciones', 'author' => 'Jorge Luis Borges']);

        $response = $this->getJson('/api/v1/books?search=Cortazar');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_can_filter_books_by_category(): void
    {
        Book::factory()->create(['title' => 'Cosmos', 'category' => 'Ciencia']);
        Book::factory()->create(['title' => 'Meditaciones', 'category' => 'Filosofía']);

        $response = $this->getJson('/api/v1/books?category=Ciencia');

        $response->assertStatus(200);
    }

    public function test_can_view_single_book_detail(): void
    {
        $book = Book::factory()->create(['title' => 'Libro Único']);

        $response = $this->getJson("/api/v1/books/{$book->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Libro Único');
    }

    public function test_client_cannot_create_book(): void
    {
        $client = User::factory()->client()->create();
        $token = auth('api')->login($client);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/books', [
                'title' => 'Nuevo Libro',
                'author' => 'Autor Test',
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_book(): void
    {
        $admin = User::factory()->admin()->create();
        $token = auth('api')->login($admin);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/books', [
                'title' => 'La Odisea',
                'author' => 'Homero',
                'category' => 'Novelas',
                'price' => 20.00,
                'total_copies' => 5,
                'isbn' => '978-0140268866',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'La Odisea')
            ->assertJsonPath('data.stock', 5);

        $this->assertDatabaseHas('books', ['title' => 'La Odisea']);
    }

    public function test_admin_can_update_book(): void
    {
        $admin = User::factory()->admin()->create();
        $token = auth('api')->login($admin);
        $book = Book::factory()->create(['price' => 15.00]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/v1/books/{$book->id}", [
                'price' => 25.50,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.price', 25.50);
    }

    public function test_admin_can_delete_book_without_active_loans(): void
    {
        $admin = User::factory()->admin()->create();
        $token = auth('api')->login($admin);
        $book = Book::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/v1/books/{$book->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('books', ['id' => $book->id]);
    }

    public function test_cannot_delete_book_with_active_loans(): void
    {
        $admin = User::factory()->admin()->create();
        $token = auth('api')->login($admin);
        $book = Book::factory()->create();

        Loan::factory()->create([
            'book_id' => $book->id,
            'status' => Loan::STATUS_ACTIVE,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/v1/books/{$book->id}");

        $response->assertStatus(409);
        $this->assertDatabaseHas('books', ['id' => $book->id]);
    }
}
