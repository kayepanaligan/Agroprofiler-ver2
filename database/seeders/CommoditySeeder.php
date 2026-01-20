<?php

namespace Database\Seeders;

use App\Models\Commodity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommoditySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Commodity::truncate();
        
        $commodities = include database_path('data/commodity.php');
        foreach ($commodities as $commodity) {
            Commodity::updateOrCreate(
                ['name' => $commodity['name']],
                $commodity
            );
        } 
    }
}