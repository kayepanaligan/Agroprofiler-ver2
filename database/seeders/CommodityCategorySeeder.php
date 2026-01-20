<?php

namespace Database\Seeders;

use App\Models\CommodityCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommodityCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // CommodityCategory::truncate();
        
        $commodities = include database_path('data/commodity_category.php');
        foreach ($commodities as $commodity) {
            CommodityCategory::updateOrCreate(
                ['name' => $commodity['name']],
                $commodity
            );
        } 
    }
}