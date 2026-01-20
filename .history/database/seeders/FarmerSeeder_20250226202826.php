<?php

namespace Database\Seeders;

use App\Models\Farmer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FarmerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Farmer::truncate();
        Farmer::factory()->count(5000)->create();
    }
}
