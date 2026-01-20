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
        // Don't truncate to avoid foreign key issues
        // AllocationTypeCommodity::truncate();

        $allocationTypes = \App\Models\AllocationType::all();
        $commodities = \App\Models\Commodity::all();

        // Create some random associations if we have data
        if ($allocationTypes->count() > 0 && $commodities->count() > 0) {
            foreach ($allocationTypes as $allocationType) {
                // Assign 2-4 random commodities to each allocation type
                $randomCommodities = $commodities->random(rand(2, min(4, $commodities->count())));
                foreach ($randomCommodities as $commodity) {
                    \App\Models\AllocationTypeCommodity::updateOrCreate(
                        [
                            'allocation_type_id' => $allocationType->id,
                            'commodity_id' => $commodity->id,
                        ]
                    );
                }
            }
        }
    }
}
