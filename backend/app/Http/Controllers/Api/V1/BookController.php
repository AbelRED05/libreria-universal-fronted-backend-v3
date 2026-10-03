<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\BookDTO;
use App\Http\Requests\Books\StoreBookRequest;
use App\Http\Requests\Books\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Services\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Libros",
 *     description="Gestión del catálogo, inventario, detalles, búsqueda y filtros de libros"
 * )
 */
class BookController extends BaseApiController
{
    public function __construct(
        protected BookService $bookService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/v1/books",
     *     tags={"Libros"},
     *     summary="Listar catálogo de libros con paginación, filtros y búsqueda",
     *     @OA\Parameter(name="search", in="query", required=false, description="Buscar por título, autor o ISBN", @OA\Schema(type="string")),
     *     @OA\Parameter(name="category", in="query", required=false, description="Filtrar por nombre de categoría", @OA\Schema(type="string")),
     *     @OA\Parameter(name="available_only", in="query", required=false, description="Solo libros con copias disponibles (1/true)", @OA\Schema(type="boolean")),
     *     @OA\Parameter(name="sort", in="query", required=false, description="Ordenación: latest, price-asc, price-desc, rating, title-asc", @OA\Schema(type="string")),
     *     @OA\Parameter(name="per_page", in="query", required=false, description="Cantidad por página (default 15, max 100)", @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Colección paginada de libros",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Libros obtenidos correctamente"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Book")),
     *             @OA\Property(property="pagination", type="object")
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min(100, max(1, (int) $request->query('per_page', 15)));
        $filters = [
            'search' => $request->query('search'),
            'category' => $request->query('category'),
            'available_only' => $request->boolean('available_only') || $request->boolean('inStockOnly'),
            'featured' => $request->boolean('featured'),
            'sort' => $request->query('sort', 'latest'),
        ];

        // Support 'all' param for unpaginated full fetch if needed by frontend
        if ($request->boolean('all')) {
            $books = $this->bookService->getAllBooks($filters);
            return $this->successResponse(BookResource::collection($books), 'Catálogo completo obtenido');
        }

        $paginator = $this->bookService->getPaginatedBooks($filters, $perPage);
        return $this->paginatedResponse($paginator, BookResource::class, 'Libros obtenidos correctamente');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/books/{id}",
     *     tags={"Libros"},
     *     summary="Obtener detalles de un libro por su ID",
     *     @OA\Parameter(name="id", in="path", required=true, description="ID del libro", @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Detalle del libro",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/Book")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Libro no encontrado")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $book = $this->bookService->getBookById($id);
        return $this->successResponse(new BookResource($book), 'Libro obtenido correctamente');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/books",
     *     tags={"Libros"},
     *     summary="Crear un nuevo libro en el catálogo (Requiere rol Admin o Bibliotecario)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","author"},
     *             @OA\Property(property="title", type="string", example="El Quijote de la Mancha"),
     *             @OA\Property(property="author", type="string", example="Miguel de Cervantes"),
     *             @OA\Property(property="category", type="string", example="Novelas"),
     *             @OA\Property(property="price", type="number", format="float", example=25.00),
     *             @OA\Property(property="total_copies", type="integer", example=10),
     *             @OA\Property(property="isbn", type="string", example="978-8424116033"),
     *             @OA\Property(property="description", type="string", example="Novela cumbre de la literatura en español.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Libro creado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/Book")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=403, description="No autorizado (requiere rol admin o librarian)")
     * )
     */
    public function store(StoreBookRequest $request): JsonResponse
    {
        $dto = BookDTO::fromArray($request->validated());
        $book = $this->bookService->createBook($dto);

        return $this->successResponse(new BookResource($book), 'Libro agregado al catálogo correctamente', 201);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/books/{id}",
     *     tags={"Libros"},
     *     summary="Actualizar un libro existente (Requiere rol Admin o Bibliotecario)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID del libro", @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Book")),
     *     @OA\Response(response=200, description="Libro actualizado exitosamente"),
     *     @OA\Response(response=404, description="Libro no encontrado")
     * )
     */
    public function update(UpdateBookRequest $request, int $id): JsonResponse
    {
        $dto = BookDTO::fromArray($request->validated());
        $book = $this->bookService->updateBook($id, $dto);

        return $this->successResponse(new BookResource($book), 'Libro actualizado correctamente');
    }

    /**
     * @OA\Patch(
     *     path="/api/v1/books/{id}",
     *     tags={"Libros"},
     *     summary="Actualizar parcialmente un libro (Requiere rol Admin o Bibliotecario)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID del libro", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Libro actualizado parcialmente"),
     *     @OA\Response(response=404, description="Libro no encontrado")
     * )
     */
    public function patch(UpdateBookRequest $request, int $id): JsonResponse
    {
        return $this->update($request, $id);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/books/{id}",
     *     tags={"Libros"},
     *     summary="Eliminar un libro del catálogo (Requiere rol Administrador)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID del libro", @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Libro eliminado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Libro eliminado del catálogo")
     *         )
     *     ),
     *     @OA\Response(response=409, description="Conflicto: libro con préstamos activos")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $this->bookService->deleteBook($id);
        return $this->successResponse(null, 'Libro eliminado del catálogo correctamente');
    }
}
