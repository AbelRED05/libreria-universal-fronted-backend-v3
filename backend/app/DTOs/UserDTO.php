<?php

namespace App\DTOs;

class UserDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $password = null,
        public readonly string $role = 'client',
        public readonly ?string $phone = null,
        public readonly ?string $favoriteGenre = null,
        public readonly ?int $loyaltyPoints = 0,
        public readonly bool $isActive = true,
    ) {}

    public static function fromArray(array $data, bool $isAdminContext = false): self
    {
        $role = $isAdminContext ? ($data['role'] ?? 'client') : 'client';

        return new self(
            name: trim($data['name']),
            email: strtolower(trim($data['email'])),
            password: $data['password'] ?? null,
            role: $role,
            phone: $data['phone'] ?? null,
            favoriteGenre: $data['favorite_genre'] ?? $data['favoriteGenre'] ?? null,
            loyaltyPoints: isset($data['loyalty_points']) ? (int) $data['loyalty_points'] : (isset($data['loyaltyPoints']) ? (int) $data['loyaltyPoints'] : 0),
            isActive: isset($data['is_active']) ? (bool) $data['is_active'] : true,
        );
    }

    public function toArray(): array
    {
        $data = [
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'favorite_genre' => $this->favoriteGenre,
            'loyalty_points' => $this->loyaltyPoints,
            'is_active' => $this->isActive,
        ];

        if ($this->password) {
            $data['password'] = $this->password;
        }

        return $data;
    }
}
