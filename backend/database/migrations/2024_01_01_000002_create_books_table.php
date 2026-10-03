<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('category')->default('General')->index();
            $table->string('title')->index();
            $table->string('author')->index();
            $table->string('isbn')->nullable()->unique()->index();
            $table->text('description')->nullable();
            $table->string('publisher')->nullable();
            $table->unsignedSmallInteger('publication_year')->nullable();
            $table->unsignedInteger('pages')->default(0);
            $table->decimal('price', 10, 2)->default(0.00);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('cover_image', 500)->nullable();
            $table->string('cover_theme', 50)->default('navy');
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedInteger('total_copies')->default(1);
            $table->unsignedInteger('available_copies')->default(1);
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_bestseller')->default(false)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
