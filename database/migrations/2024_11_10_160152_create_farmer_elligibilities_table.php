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
        Schema::create('farmer_elligibilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')
            ->constrained('farmers') 
            ->onDelete('cascade');
            $table->foreignId('elligibility_id')
            ->constrained('elligibilities')
            ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farmer_elligibilities');
    }
};