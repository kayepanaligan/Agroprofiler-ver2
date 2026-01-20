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
        $identifier = \App\Models\Identifier::first();
        $funding = \App\Models\Funding::first();

        foreach ($allocationTypes as $allocationType) {
            AllocationType::updateOrCreate(
                ['name' => $allocationType['name']],
                [
                    'name' => $allocationType['name'],
                    'desc' => $allocationType['desc'],
                    'amount' => rand(100000, 1000000), // Random amount between 100k and 1M
                    'identifier_id' => $identifier ? $identifier->id : 1,
                    'funding_id' => $funding ? $funding->id : 1,
                ]
            );
        }

        // AllocationTypeCommodity::factory()->count(50)->create();
    }
}
