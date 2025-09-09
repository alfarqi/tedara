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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->longText('content');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('seo_title')->nullable();
            $table->string('seo_url')->unique();
            $table->text('seo_description')->nullable();
            $table->boolean('show_in_footer')->default(false);
            $table->string('language', 2)->default('EN'); // EN, AR
            $table->timestamps();

            // Indexes
            $table->index(['store_id', 'status']);
            $table->index(['seo_url']);
            $table->index(['show_in_footer']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};



