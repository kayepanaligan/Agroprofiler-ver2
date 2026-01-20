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
        $funding = \App\Models\Funding::first();

        // Map allocation types to appropriate identifiers
        $identifierMap = [
            'Cash Assistance' => ['PHP', 'Peso'],
            'Machinery Support' => ['Unit'],
            'Fertilizer' => ['KG', 'Sack'],
            'Seeds' => ['KG', 'Sack'],
            'Pesticides' => ['KG', 'Sack'],
        ];

        foreach ($allocationTypes as $allocationType) {
            // Get appropriate identifier for this allocation type
            $identifierTitles = $identifierMap[$allocationType['name']] ?? ['Unit'];
            $identifier = \App\Models\Identifier::whereIn('title', $identifierTitles)->first();
            
            // Fallback to first identifier if none found
            if (!$identifier) {
                $identifier = \App\Models\Identifier::first();
            }

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
