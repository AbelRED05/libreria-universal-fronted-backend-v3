<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Administrator
        User::firstOrCreate(
            ['email' => 'admin.libreria@gmail.com'],
            [
                'name' => 'Administrador Principal',
                'password' => Hash::make('admin123'),
                'role' => User::ROLE_ADMIN,
                'phone' => '+34 912 345 678',
                'favorite_genre' => 'Gestión y Literatura Universal',
                'loyalty_points' => 1450,
                'is_active' => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@universal.com'],
            [
                'name' => 'Admin Sistema',
                'password' => Hash::make('admin123'),
                'role' => User::ROLE_ADMIN,
                'phone' => '+34 912 345 600',
                'favorite_genre' => 'Administración',
                'loyalty_points' => 1000,
                'is_active' => true,
            ]
        );

        // 2. Librarian
        User::firstOrCreate(
            ['email' => 'biblioteca@universal.com'],
            [
                'name' => 'Beatriz Gómez (Bibliotecaria)',
                'password' => Hash::make('biblioteca123'),
                'role' => User::ROLE_LIBRARIAN,
                'phone' => '+34 912 345 679',
                'favorite_genre' => 'Archivística e Historia',
                'loyalty_points' => 600,
                'is_active' => true,
            ]
        );

        // 3. Readers / Clients
        User::firstOrCreate(
            ['email' => 'lector.universal@gmail.com'],
            [
                'name' => 'Alejandro Morales',
                'password' => Hash::make('lector123'),
                'role' => User::ROLE_CLIENT,
                'phone' => '+34 612 984 551',
                'favorite_genre' => 'Novelas, Filosofía',
                'loyalty_points' => 220,
                'is_active' => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'lector@universal.com'],
            [
                'name' => 'Sofía Mendoza',
                'password' => Hash::make('lector123'),
                'role' => User::ROLE_CLIENT,
                'phone' => '+34 654 321 987',
                'favorite_genre' => 'Ciencia, Poesía',
                'loyalty_points' => 150,
                'is_active' => true,
            ]
        );
    }
}
