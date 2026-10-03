<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_as_client_successfully(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Carlos Lector',
            'email' => 'carlos@test.com',
            'password' => 'password123',
            'phone' => '+34 600 111 222',
            'favorite_genre' => 'Novelas',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'carlos@test.com')
            ->assertJsonPath('data.user.role', 'client')
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'token',
                    'token_type',
                    'expires_in',
                    'user' => ['id', 'name', 'email', 'role'],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'carlos@test.com',
            'role' => 'client',
        ]);
    }

    public function test_registration_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'existing@test.com']);

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Nuevo Usuario',
            'email' => 'existing@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['email']]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'login@test.com',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'login@test.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'login@test.com')
            ->assertJsonStructure([
                'data' => ['token', 'token_type', 'user'],
            ]);
    }

    public function test_login_fails_with_invalid_password(): void
    {
        User::factory()->create([
            'email' => 'login@test.com',
            'password' => bcrypt('correct-password'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'login@test.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('success', false);
    }

    public function test_authenticated_user_can_access_me_profile(): void
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_access_to_protected_me_route_without_token_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/auth/me');
        $response->assertStatus(401);
    }

    public function test_user_can_logout_and_invalidate_token(): void
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
