<?php

namespace App\DTOs;

class RegisterDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $phone = null,
        public readonly ?string $favoriteGenre = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: strtolower(trim($data['email'])),
            password: $data['password'],
            phone: $data['phone'] ?? null,
            favoriteGenre: $data['favorite_genre'] ?? $data['favoriteGenre'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'role' => 'client', // Clients cannot self-assign roles
            'phone' => $this->phone,
            'favorite_genre' => $this->favoriteGenre,
            'is_active' => true,
        ], fn($v) => !is_null($v));
    }
}
