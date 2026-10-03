<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\CategoryResource;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Categorías",
 *     description="Gestión y consulta de categorías literarias"
 * )
 */
class CategoryController extends BaseApiController
{
    public function __construct(
        protected CategoryRepositoryInterface $categoryRepository
    ) {}

    /**
     * @OA\Get(
     *     path="/api/v1/categories",
     *     tags={"Categorías"},
     *     summary="Listar todas las categorías con conteo de obras",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de categorías",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Category"))
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        $categories = $this->categoryRepository->getAll();
        return $this->successResponse(CategoryResource::collection($categories), 'Categorías obtenidas correctamente');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/categories",
     *     tags={"Categorías"},
     *     summary="Crear una nueva categoría (Admin o Bibliotecario)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="Ensayo"),
     *             @OA\Property(property="description", type="string", example="Obras de análisis y reflexión crítica")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Categoría creada exitosamente")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $category = $this->categoryRepository->create($data);
        return $this->successResponse(new CategoryResource($category), 'Categoría creada exitosamente', 201);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/categories/{id}",
     *     tags={"Categorías"},
     *     summary="Eliminar una categoría (Admin o Bibliotecario)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID de la categoría", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Categoría eliminada exitosamente")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $category = $this->categoryRepository->findById($id);
        if (!$category) {
            return $this->errorResponse('Categoría no encontrada', null, 404);
        }

        $this->categoryRepository->delete($category);
        return $this->successResponse(null, 'Categoría eliminada exitosamente');
    }
}
