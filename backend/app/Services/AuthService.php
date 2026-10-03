<?php

namespace App\Services;

use App\DTOs\RegisterDTO;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    /**
     * Register a new client user and issue JWT token.
     */
    public function register(RegisterDTO $dto): array
    {
        $userData = $dto->toArray();
        $userData['password'] = Hash::make($dto->password);
        $userData['role'] = User::ROLE_CLIENT;
        $userData['is_active'] = true;

        $user = $this->userRepository->create($userData);

        $token = auth('api')->login($user);

        return [
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user,
        ];
    }

    /**
     * Authenticate user with credentials and issue JWT.
     */
    public function login(string $email, string $password): array
    {
        $credentials = [
            'email' => strtolower(trim($email)),
            'password' => $password,
        ];

        if (!$token = auth('api')->attempt($credentials)) {
            throw new AuthenticationException('Credenciales inválidas. Verifica tu correo y contraseña.');
        }

        /** @var User $user */
        $user = auth('api')->user();

        if (!$user->is_active) {
            auth('api')->logout();
            throw new AuthenticationException('Esta cuenta está inactiva o ha sido suspendida.');
        }

        return [
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user,
        ];
    }

    /**
     * Invalidate current token (logout).
     */
    public function logout(): void
    {
        if (auth('api')->check()) {
            auth('api')->logout();
        }
    }

    /**
     * Refresh JWT token.
     */
    public function refresh(): array
    {
        $newToken = auth('api')->refresh();
        $user = auth('api')->user();

        return [
            'token' => $newToken,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user,
        ];
    }

    /**
     * Get authenticated user profile.
     */
    public function me(): User
    {
        /** @var User|null $user */
        $user = auth('api')->user();

        if (!$user) {
            throw new AuthenticationException('Usuario no autenticado.');
        }

        return $user;
    }
}
