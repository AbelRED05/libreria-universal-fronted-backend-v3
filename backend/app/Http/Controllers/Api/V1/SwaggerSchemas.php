<?php

namespace App\Http\Controllers\Api\V1;

/**
 * @OA\Schema(
 *     schema="User",
 *     title="Usuario",
 *     description="Entidad de usuario del sistema Librería Universal",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Alejandro Morales"),
 *     @OA\Property(property="email", type="string", format="email", example="lector@universal.com"),
 *     @OA\Property(property="role", type="string", example="client", enum={"admin","librarian","client"}),
 *     @OA\Property(property="phone", type="string", example="+34 612 984 551"),
 *     @OA\Property(property="favorite_genre", type="string", example="Novelas, Ensayo"),
 *     @OA\Property(property="loyalty_points", type="integer", example=220),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="created_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="Book",
 *     title="Libro",
 *     description="Entidad de libro en catálogo e inventario",
 *     @OA\Property(property="id", type="string", example="1"),
 *     @OA\Property(property="numeric_id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Cien Años de Soledad"),
 *     @OA\Property(property="author", type="string", example="Gabriel García Márquez"),
 *     @OA\Property(property="category", type="string", example="Novelas"),
 *     @OA\Property(property="isbn", type="string", example="978-0307474728"),
 *     @OA\Property(property="description", type="string", example="Obra cumbre del realismo mágico"),
 *     @OA\Property(property="publisher", type="string", example="Editorial Sudamericana"),
 *     @OA\Property(property="year", type="integer", example=1967),
 *     @OA\Property(property="pages", type="integer", example=471),
 *     @OA\Property(property="price", type="number", format="float", example=24.50),
 *     @OA\Property(property="originalPrice", type="number", format="float", example=28.00),
 *     @OA\Property(property="imageUrl", type="string", example="https://images.unsplash.com/..."),
 *     @OA\Property(property="coverTheme", type="string", example="emerald"),
 *     @OA\Property(property="stock", type="integer", example=18),
 *     @OA\Property(property="available_copies", type="integer", example=18),
 *     @OA\Property(property="total_copies", type="integer", example=20),
 *     @OA\Property(property="rating", type="number", format="float", example=4.9),
 *     @OA\Property(property="reviewsCount", type="integer", example=384),
 *     @OA\Property(property="featured", type="boolean", example=true),
 *     @OA\Property(property="bestSeller", type="boolean", example=true)
 * )
 *
 * @OA\Schema(
 *     schema="Category",
 *     title="Categoría",
 *     description="Clasificación temática de libros",
 *     @OA\Property(property="id", type="string", example="1"),
 *     @OA\Property(property="name", type="string", example="Novelas"),
 *     @OA\Property(property="description", type="string", example="Narrativa de ficción y literatura universal"),
 *     @OA\Property(property="count", type="integer", example=15)
 * )
 */
class SwaggerSchemas {}
