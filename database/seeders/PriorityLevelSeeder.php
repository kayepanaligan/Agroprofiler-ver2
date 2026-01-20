<?php

namespace Database\Seeders;

use App\Models\PriorityLevel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PriorityLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PriorityLevel::truncate();
        
        $commodities = include database_path('data/priority_level.php');
        foreach ($commodities as $commodity) {
            PriorityLevel::create($commodity);
        } 
    }
}