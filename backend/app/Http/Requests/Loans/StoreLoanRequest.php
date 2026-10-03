<?php

namespace App\Http\Requests\Loans;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'book_id' => ['required', 'integer', 'exists:books,id'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'loan_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:loan_date'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'book_id.required' => 'El identificador del libro es obligatorio.',
            'book_id.exists' => 'El libro seleccionado no existe en el catálogo.',
            'user_id.exists' => 'El usuario especificado no existe.',
            'due_date.after_or_equal' => 'La fecha de vencimiento debe ser posterior o igual a la fecha de préstamo.',
        ];
    }
}
