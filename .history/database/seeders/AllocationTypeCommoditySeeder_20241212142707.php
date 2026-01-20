<?php

namespace Database\Seeders;

use App\Models\AllocationTypeCommodity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AllocationTypeCommoditySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AllocationTypeCommodity::truncate();

        $commodities = include database_path('data/allocation_type_commodity.php');
        foreach ($commodities as $commodity) {
            AllocationTypeCommodity::create($commodity);
        }
    }
}
