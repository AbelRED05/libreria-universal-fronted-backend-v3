<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * @OA\Info(
 *     title="Librería Universal - API RESTful",
 *     version="1.0.0",
 *     description="API Backend profesional para el sistema de gestión de biblioteca y catálogo de Librería Universal. Desarrollado con Laravel, arquitectura en capas, JWT Authentication y control de acceso basado en roles.",
 *     @OA\Contact(
 *         email="soporte@libreriauniversal.com",
 *         name="Equipo de Arquitectura Librería Universal"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 *
 * @OA\Server(
 *     url="/",
 *     description="Servidor API Local / AI Studio"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Autenticación mediante JWT Bearer token. Ejemplo: Bearer {token}"
 * )
 */
class BaseApiController extends Controller
{
    /**
     * Send standard successful JSON response.
     */
    protected function successResponse(mixed $data = null, string $message = 'Operación exitosa', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Send standard error JSON response.
     */
    protected function errorResponse(string $message = 'Error en la solicitud', mixed $errors = null, int $code = 400): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if (!is_null($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Send standard paginated JSON response.
     */
    protected function paginatedResponse(LengthAwarePaginator $paginator, string $resourceClass, string $message = 'Datos obtenidos exitosamente'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $resourceClass::collection($paginator->items()),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
                'has_more_pages' => $paginator->hasMorePages(),
            ],
        ]);
    }
}
