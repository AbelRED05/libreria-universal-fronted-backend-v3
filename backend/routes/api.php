<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\LoanController;
use App\Http\Controllers\Api\V1\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes - Librería Universal (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // --- Authentication Endpoints ---
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);

        Route::middleware('auth:api')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::post('refresh', [AuthController::class, 'refresh']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });

    // --- Books / Catálogo Endpoints ---
    Route::get('books', [BookController::class, 'index']);
    Route::get('books/{id}', [BookController::class, 'show']);

    Route::middleware(['auth:api'])->group(function () {
        Route::middleware(['role:admin,librarian'])->group(function () {
            Route::post('books', [BookController::class, 'store']);
            Route::put('books/{id}', [BookController::class, 'update']);
            Route::patch('books/{id}', [BookController::class, 'patch']);
        });

        Route::middleware(['role:admin'])->group(function () {
            Route::delete('books/{id}', [BookController::class, 'destroy']);
        });
    });

    // --- Categories Endpoints ---
    Route::get('categories', [CategoryController::class, 'index']);

    Route::middleware(['auth:api', 'role:admin,librarian'])->group(function () {
        Route::post('categories', [CategoryController::class, 'store']);
        Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
    });

    // --- Loans / Préstamos Endpoints ---
    Route::middleware('auth:api')->group(function () {
        Route::get('me/loans', [LoanController::class, 'myLoans']);
        Route::get('loans/{id}', [LoanController::class, 'show']);
        Route::post('loans', [LoanController::class, 'store']);

        Route::middleware(['role:admin,librarian'])->group(function () {
            Route::get('loans', [LoanController::class, 'index']);
            Route::patch('loans/{id}/return', [LoanController::class, 'returnBook']);
        });
    });

    // --- Users Administration Endpoints ---
    Route::middleware('auth:api')->group(function () {
        Route::get('users/{id}', [UserController::class, 'show']);
        Route::put('users/{id}', [UserController::class, 'update']);

        Route::middleware(['role:admin,librarian'])->group(function () {
            Route::get('users', [UserController::class, 'index']);
        });

        Route::middleware(['role:admin'])->group(function () {
            Route::post('users', [UserController::class, 'store']);
            Route::delete('users/{id}', [UserController::class, 'destroy']);
        });
    });
});
