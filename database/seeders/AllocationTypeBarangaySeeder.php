<?php

namespace Database\Seeders;

use App\Models\AllocationTypeBarangay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AllocationTypeBarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AllocationTypeBarangay::factory()->count(50)->create();
    }
} 