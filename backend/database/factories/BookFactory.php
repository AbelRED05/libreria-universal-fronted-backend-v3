<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition(): array
    {
        $total = fake()->numberBetween(1, 20);

        return [
            'title' => fake()->sentence(3),
            'author' => fake()->name(),
            'category' => fake()->randomElement(['Novelas', 'Ciencia', 'Historia', 'Filosofía', 'Arte']),
            'isbn' => fake()->unique()->isbn13(),
            'description' => fake()->paragraph(),
            'publisher' => fake()->company(),
            'publication_year' => fake()->numberBetween(1900, 2026),
            'pages' => fake()->numberBetween(100, 800),
            'price' => fake()->randomFloat(2, 10, 50),
            'original_price' => fake()->optional()->randomFloat(2, 50, 70),
            'cover_image' => '',
            'cover_theme' => fake()->randomElement(['navy', 'emerald', 'terracotta', 'amber', 'crimson', 'slate']),
            'rating' => fake()->randomFloat(1, 4.0, 5.0),
            'reviews_count' => fake()->numberBetween(5, 500),
            'total_copies' => $total,
            'available_copies' => $total,
            'is_featured' => fake()->boolean(20),
            'is_bestseller' => fake()->boolean(20),
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => [
            'available_copies' => 0,
        ]);
    }
}
