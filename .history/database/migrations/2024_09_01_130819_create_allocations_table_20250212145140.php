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
        Schema::create('allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('allocation_type_id')
            ->constrained('allocation_types')
            ->onDelete('cascade');
            $table->foreignId('farmer_id')
                  ->constrained('farmers')
                  ->onDelete('cascade');
            $table->enum('received', ['yes', 'no'])->nullable();
            $table->date('date_received')->nullable();
            $table->foreignId('commodity_id')
                  ->constrained('commodities')
                  ->onDelete('cascade');
            $table->foreignId('brgy_id')
                  ->constrained('barangays')
                  ->onDelete('cascade');
            $table->foreignId('funding_id')
                  ->constrained('barangays')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allocations');
    }
};