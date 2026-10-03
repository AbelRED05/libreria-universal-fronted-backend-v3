<?php

namespace App\Http\Requests\Books;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'isbn' => ['nullable', 'string', 'max:50', 'unique:books,isbn'],
            'description' => ['nullable', 'string'],
            'synopsis' => ['nullable', 'string'],
            'publisher' => ['nullable', 'string', 'max:255'],
            'publication_year' => ['nullable', 'integer', 'min:1000', 'max:2100'],
            'year' => ['nullable', 'integer', 'min:1000', 'max:2100'],
            'pages' => ['nullable', 'integer', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'imageUrl' => ['nullable', 'string', 'max:500'],
            'cover_theme' => ['nullable', 'string', 'max:50'],
            'coverTheme' => ['nullable', 'string', 'max:50'],
            'total_copies' => ['nullable', 'integer', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'available_copies' => ['nullable', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'reviews_count' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
            'featured' => ['nullable', 'boolean'],
            'is_bestseller' => ['nullable', 'boolean'],
            'bestSeller' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título de la obra es obligatorio.',
            'author.required' => 'El nombre del autor es obligatorio.',
            'isbn.unique' => 'Ya existe un libro registrado con este código ISBN.',
            'price.numeric' => 'El precio debe ser un número válido.',
            'total_copies.min' => 'El número total de ejemplares no puede ser negativo.',
        ];
    }
}
