<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\UserDTO;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * @OA\Tag(
 *     name="Usuarios",
 *     description="Administración de cuentas de usuarios, roles y perfiles"
 * )
 */
class UserController extends BaseApiController
{
    public function __construct(
        protected UserService $userService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/v1/users",
     *     tags={"Usuarios"},
     *     summary="Listar usuarios registrados (Requiere rol Admin o Bibliotecario)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="search", in="query", required=false, description="Buscar por nombre o email", @OA\Schema(type="string")),
     *     @OA\Parameter(name="role", in="query", required=false, description="Filtrar por rol: admin, librarian, client", @OA\Schema(type="string")),
     *     @OA\Parameter(name="per_page", in="query", required=false, description="Cantidad por página", @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Colección paginada de usuarios",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/User"))
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min(100, max(1, (int) $request->query('per_page', 15)));
        $filters = [
            'search' => $request->query('search'),
            'role' => $request->query('role'),
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : null,
        ];

        $paginator = $this->userService->getPaginatedUsers($filters, $perPage);
        return $this->paginatedResponse($paginator, UserResource::class, 'Usuarios obtenidos correctamente');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/users/{id}",
     *     tags={"Usuarios"},
     *     summary="Obtener información de un usuario específico",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID del usuario", @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Detalle del usuario",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/User")
     *         )
     *     ),
     *     @OA\Response(response=403, description="No autorizado")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $currentUser = auth('api')->user();

        // Clients can only inspect their own profile
        if ($currentUser->isClient() && (int)$currentUser->id !== $id) {
            throw new AccessDeniedHttpException('Solo tienes acceso a tu propio perfil.');
        }

        $user = $this->userService->getUserById($id);
        return $this->successResponse(new UserResource($user), 'Usuario obtenido correctamente');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/users",
     *     tags={"Usuarios"},
     *     summary="Crear un nuevo usuario con rol específico (Solo Administrador)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password"},
     *             @OA\Property(property="name", type="string", example="Bibliotecario Central"),
     *             @OA\Property(property="email", type="string", format="email", example="biblioteca@universal.com"),
     *             @OA\Property(property="password", type="string", format="password", example="secret123"),
     *             @OA\Property(property="role", type="string", example="librarian", enum={"admin","librarian","client"})
     *         )
     *     ),
     *     @OA\Response(response=201, description="Usuario creado exitosamente")
     * )
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $dto = UserDTO::fromArray($request->validated(), isAdminContext: true);
        $user = $this->userService->createUser($dto);

        return $this->successResponse(new UserResource($user), 'Usuario creado exitosamente', 201);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/users/{id}",
     *     tags={"Usuarios"},
     *     summary="Actualizar información de un usuario",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID del usuario", @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/User")),
     *     @OA\Response(response=200, description="Usuario actualizado exitosamente")
     * )
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $currentUser = auth('api')->user();

        // Check ownership or admin
        if (!$currentUser->isAdmin() && (int)$currentUser->id !== $id) {
            throw new AccessDeniedHttpException('Solo un administrador o el titular de la cuenta puede modificar estos datos.');
        }

        $dto = UserDTO::fromArray($request->validated(), isAdminContext: $currentUser->isAdmin());
        $user = $this->userService->updateUser($id, $dto);

        return $this->successResponse(new UserResource($user), 'Usuario actualizado correctamente');
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/users/{id}",
     *     tags={"Usuarios"},
     *     summary="Eliminar un usuario (Solo Administrador)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID del usuario", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Usuario eliminado"),
     *     @OA\Response(response=409, description="Conflicto: usuario con préstamos pendientes o último administrador")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $this->userService->deleteUser($id);
        return $this->successResponse(null, 'Usuario eliminado correctamente');
    }
}
