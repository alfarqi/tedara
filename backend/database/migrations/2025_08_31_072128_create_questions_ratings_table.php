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
        Schema::create('questions_ratings', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['question', 'rating']);
            $table->text('content');
            $table->integer('rating')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('cascade');
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->enum('status', ['published', 'unpublished'])->default('published');
            $table->timestamps();
            
            $table->index(['store_id', 'type']);
            $table->index(['product_id', 'type']);
            $table->index(['user_id', 'type']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions_ratings');
    }
};
