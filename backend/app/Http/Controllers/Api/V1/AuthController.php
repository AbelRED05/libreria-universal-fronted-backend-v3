<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\RegisterDTO;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Tag(
 *     name="Autenticación",
 *     description="Operaciones de registro, inicio de sesión, renovación de token y perfil con JWT"
 * )
 */
class AuthController extends BaseApiController
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * @OA\Post(
     *     path="/api/v1/auth/register",
     *     tags={"Autenticación"},
     *     summary="Registrar un nuevo usuario lector/cliente",
     *     description="Crea una nueva cuenta de lector y devuelve el token JWT correspondiente. No permite autoasignarse rol de administrador.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password"},
     *             @OA\Property(property="name", type="string", example="Alejandro Morales"),
     *             @OA\Property(property="email", type="string", format="email", example="lector@universal.com"),
     *             @OA\Property(property="password", type="string", format="password", example="secret123"),
     *             @OA\Property(property="phone", type="string", example="+34 612 984 551"),
     *             @OA\Property(property="favorite_genre", type="string", example="Novelas, Historia")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuario registrado exitosamente con token JWT",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Usuario registrado correctamente"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLC..."),
     *                 @OA\Property(property="token_type", type="string", example="bearer"),
     *                 @OA\Property(property="expires_in", type="integer", example=3600),
     *                 @OA\Property(property="user", ref="#/components/schemas/User")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=422, description="Error de validación de campos")
     * )
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $dto = RegisterDTO::fromArray($request->validated());
        $authData = $this->authService->register($dto);

        return $this->successResponse([
            'token' => $authData['token'],
            'token_type' => $authData['token_type'],
            'expires_in' => $authData['expires_in'],
            'user' => new UserResource($authData['user']),
        ], 'Usuario registrado correctamente en Librería Universal', 201);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/auth/login",
     *     tags={"Autenticación"},
     *     summary="Iniciar sesión y obtener token JWT",
     *     description="Valida las credenciales del usuario y emite un token JWT.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="admin.libreria@gmail.com"),
     *             @OA\Property(property="password", type="string", format="password", example="admin123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Sesión iniciada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Inicio de sesión exitoso"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLC..."),
     *                 @OA\Property(property="token_type", type="string", example="bearer"),
     *                 @OA\Property(property="expires_in", type="integer", example=3600),
     *                 @OA\Property(property="user", ref="#/components/schemas/User")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Credenciales inválidas o cuenta inactiva")
     * )
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        $authData = $this->authService->login($credentials['email'], $credentials['password']);

        return $this->successResponse([
            'token' => $authData['token'],
            'token_type' => $authData['token_type'],
            'expires_in' => $authData['expires_in'],
            'user' => new UserResource($authData['user']),
        ], 'Inicio de sesión exitoso');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/auth/logout",
     *     tags={"Autenticación"},
     *     summary="Cerrar sesión e invalidar token JWT",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Sesión cerrada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Sesión cerrada exitosamente")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function logout(): JsonResponse
    {
        $this->authService->logout();
        return $this->successResponse(null, 'Sesión cerrada exitosamente. Token invalidado.');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/auth/refresh",
     *     tags={"Autenticación"},
     *     summary="Renovar token JWT expirado o próximo a expirar",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Token renovado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Token renovado exitosamente")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Token no válido o expirado más allá de la ventana de refresco")
     * )
     */
    public function refresh(): JsonResponse
    {
        $authData = $this->authService->refresh();

        return $this->successResponse([
            'token' => $authData['token'],
            'token_type' => $authData['token_type'],
            'expires_in' => $authData['expires_in'],
            'user' => new UserResource($authData['user']),
        ], 'Token renovado exitosamente');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/auth/me",
     *     tags={"Autenticación"},
     *     summary="Obtener perfil del usuario autenticado",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Perfil obtenido exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/User")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function me(): JsonResponse
    {
        $user = $this->authService->me();
        return $this->successResponse(new UserResource($user), 'Perfil de usuario obtenido');
    }
}
