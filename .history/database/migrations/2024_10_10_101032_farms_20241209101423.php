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
        Schema::create('farms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id') 
                ->constrained('farmers')
                ->onDelete('cascade');
            $table->foreignId('brgy_id') 
                ->constrained('barangays')
                ->onDelete('cascade');
            $table->foreignId('commodity_id') 
                ->constrained('commodities') 
                ->onDelete('cascade');
            $table->decimal('ha', 8, 2)->nullable(); // Change to decimal or float
            $table->enum('owner', ['yes', 'no'])->default('yes');
            $table->decimal('latitude', 10, 8)->nullable();  // To handle more precision for coordinates
            $table->decimal('longitude', 11, 8)->nullable(); // Same for longitude
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farms');
    }
};