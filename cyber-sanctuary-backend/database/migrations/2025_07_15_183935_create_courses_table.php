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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('shortDescription');
            $table->text('description');
            $table->string('icon');
            $table->string('image_url')->nullable();
            $table->string('category')->nullable()->default('Uncategorized');
            $table->string('instructor')->nullable()->default('Anonymous');
            $table->string('duration');
            $table->string('level')->nullable()->default('Beginner');
            $table->json('topics')->nullable();
            $table->json('specifications')->nullable();
            $table->decimal('price', 8, 2);
            $table->timestamp('lastUpdate')->nullable();
            $table->unsignedInteger('purchases_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
