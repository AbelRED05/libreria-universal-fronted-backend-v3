<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\LoanDTO;
use App\Http\Requests\Loans\StoreLoanRequest;
use App\Http\Resources\LoanResource;
use App\Services\LoanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * @OA\Tag(
 *     name="Préstamos",
 *     description="Operaciones de solicitud, registro, devolución y consulta de préstamos de libros"
 * )
 */
class LoanController extends BaseApiController
{
    public function __construct(
        protected LoanService $loanService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/v1/loans",
     *     tags={"Préstamos"},
     *     summary="Listar todos los préstamos (Requiere rol Admin o Bibliotecario)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="status", in="query", required=false, description="Filtrar por estado: active, returned, overdue", @OA\Schema(type="string")),
     *     @OA\Parameter(name="user_id", in="query", required=false, description="Filtrar por ID de usuario", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="book_id", in="query", required=false, description="Filtrar por ID de libro", @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Colección paginada de préstamos",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Loan"))
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min(100, max(1, (int) $request->query('per_page', 15)));
        $filters = [
            'status' => $request->query('status'),
            'user_id' => $request->query('user_id'),
            'book_id' => $request->query('book_id'),
        ];

        $paginator = $this->loanService->getAllLoans($filters, $perPage);
        return $this->paginatedResponse($paginator, LoanResource::class, 'Préstamos obtenidos correctamente');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/me/loans",
     *     tags={"Préstamos"},
     *     summary="Consultar el historial y préstamos activos del usuario autenticado",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="status", in="query", required=false, description="Filtrar por estado: active, returned, overdue", @OA\Schema(type="string")),
     *     @OA\Response(
     *         response=200,
     *         description="Préstamos del usuario autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Loan"))
     *         )
     *     )
     * )
     */
    public function myLoans(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        $perPage = min(100, max(1, (int) $request->query('per_page', 15)));
        $filters = [
            'status' => $request->query('status'),
        ];

        $paginator = $this->loanService->getUserLoans($user->id, $filters, $perPage);
        return $this->paginatedResponse($paginator, LoanResource::class, 'Mis préstamos obtenidos correctamente');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/loans/{id}",
     *     tags={"Préstamos"},
     *     summary="Consultar detalle de un préstamo por ID",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID del préstamo", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Detalle del préstamo"),
     *     @OA\Response(response=403, description="No autorizado")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $user = auth('api')->user();
        $loan = $this->loanService->getLoanById($id);

        if (!$user->canManageLibrary() && (int)$loan->user_id !== (int)$user->id) {
            throw new AccessDeniedHttpException('Solo puedes consultar tus propios préstamos.');
        }

        return $this->successResponse(new LoanResource($loan), 'Préstamo obtenido correctamente');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/loans",
     *     tags={"Préstamos"},
     *     summary="Crear un préstamo de libro (disminuye disponibilidad de forma atómica)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"book_id"},
     *             @OA\Property(property="book_id", type="integer", example=1),
     *             @OA\Property(property="user_id", type="integer", example=2, description="Obligatorio solo si el creador es admin/bibliotecario"),
     *             @OA\Property(property="due_date", type="string", format="date", example="2026-10-30"),
     *             @OA\Property(property="notes", type="string", example="Préstamo para lectura en sala/domicilio")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Préstamo registrado exitosamente"),
     *     @OA\Response(response=409, description="No hay ejemplares disponibles")
     * )
     */
    public function store(StoreLoanRequest $request): JsonResponse
    {
        $currentUser = auth('api')->user();
        $validated = $request->validated();

        // If client, force user_id to current user
        if ($currentUser->isClient() || empty($validated['user_id'])) {
            $validated['user_id'] = $currentUser->id;
        }

        $dto = LoanDTO::fromArray($validated, defaultUserId: $currentUser->id);
        $loan = $this->loanService->createLoan($dto);

        return $this->successResponse(new LoanResource($loan), 'Préstamo registrado exitosamente', 201);
    }

    /**
     * @OA\Patch(
     *     path="/api/v1/loans/{id}/return",
     *     tags={"Préstamos"},
     *     summary="Registrar la devolución de un libro prestado (incrementa disponibilidad)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID del préstamo", @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="notes", type="string", example="Libro devuelto en perfecto estado de conservación.")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Devolución registrada correctamente"),
     *     @OA\Response(response=409, description="El préstamo ya fue devuelto con anterioridad")
     * )
     */
    public function returnBook(Request $request, int $id): JsonResponse
    {
        $notes = $request->input('notes');
        $loan = $this->loanService->returnLoan($id, $notes);

        return $this->successResponse(new LoanResource($loan), 'Devolución registrada correctamente. Inventario actualizado.');
    }
}
