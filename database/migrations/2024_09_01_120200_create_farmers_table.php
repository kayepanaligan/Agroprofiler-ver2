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
        Schema::create('farmers', function (Blueprint $table) {
            $table->id();
            $table->string('rsbsa_ref_no')->nullable();
            $table->string("firstname")->nullable();
            $table->string("lastname")->nullable();
            $table->date("dob"); 
            $table->integer('age')->nullable();
            $table->string("sex")->nullable();
            $table->enum('status', ['registered', 'unregistered'])->default('unregistered');
            $table->string('coop')->nullable();
            $table->enum('pwd', ['yes', 'no'])->default('no');
            $table->enum('4ps', ['yes', 'no'])->default('no');
            $table->foreignId('brgy_id')
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
        Schema::dropIfExists('farmers');
    }
};