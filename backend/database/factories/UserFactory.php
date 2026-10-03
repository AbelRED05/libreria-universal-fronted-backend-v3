<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password123'),
            'role' => User::ROLE_CLIENT,
            'phone' => fake()->phoneNumber(),
            'favorite_genre' => fake()->randomElement(['Novelas', 'Ciencia', 'Historia', 'Filosofía']),
            'loyalty_points' => fake()->numberBetween(0, 500),
            'is_active' => true,
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => [
            'role' => User::ROLE_ADMIN,
        ]);
    }

    public function librarian(): static
    {
        return $this->state(fn () => [
            'role' => User::ROLE_LIBRARIAN,
        ]);
    }

    public function client(): static
    {
        return $this->state(fn () => [
            'role' => User::ROLE_CLIENT,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }
}
