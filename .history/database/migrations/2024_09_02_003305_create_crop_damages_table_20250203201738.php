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
        Schema::create('crop_damages', function (Blueprint $table) {
            $table->id();
            $table->string('proof')->nullable();

            $table->foreignId('farmer_id')
                ->constrained('farmers')
                ->onDelete('cascade');
                $table->foreignId('farm_id')
                ->constrained('farms')
                ->onDelete('cascade');
            $table->foreignId('commodity_id')
                ->constrained('commodities')
                ->onDelete('cascade');
            $table->foreignId('brgy_id')
                ->constrained('barangays')
                ->onDelete('cascade');
            $table->foreignId('crop_damage_cause_id')
                ->constrained('crop_damage_causes')
                ->onDelete('cascade');
            $table->decimal('total_damaged_area', 8, 2)->comment('Total area affected by damage');
            $table->decimal('partially_damaged_area', 8, 2)->comment('Area partially damaged');
            $table->decimal('area_affected', 8, 2)->comment('Total area affected by the crop damage');
            $table->text('remarks')->nullable()->comment('Additional remarks about the crop damage');
            $table->string('severity');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crop_damages');
    }
};
