<?php

namespace Database\Seeders;

use App\Models\FarmerElligibility;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FarmerElligibilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FarmerElligibility::factory()->count(50)->create();
    }
}