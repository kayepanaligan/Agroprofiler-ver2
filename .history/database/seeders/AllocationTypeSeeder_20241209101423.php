<?php

namespace Database\Seeders;

use App\Models\AllocationType;
use App\Models\AllocationTypeCommodity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AllocationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // AllocationType::truncate();
        
        $allocationTypes = include database_path('data/allocation_type.php');
        foreach ($allocationTypes as $allocationType) {
            AllocationType::create($allocationType);
        } 

        // AllocationTypeCommodity::factory()->count(50)->create();
    }
}