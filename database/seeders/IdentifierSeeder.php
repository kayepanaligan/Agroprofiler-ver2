<?php

namespace Database\Seeders;

use App\Models\Identifier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IdentifierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $identifiers = [
            // Allocation type identifiers
            ['title' => 'PHP', 'desc' => 'Philippine Peso - for cash assistance allocations'],
            ['title' => 'Peso', 'desc' => 'Peso - for cash assistance allocations'],
            ['title' => 'Unit', 'desc' => 'Unit - for machinery and equipment allocations'],
            ['title' => 'KG', 'desc' => 'Kilogram - for fertilizer and material allocations'],
            ['title' => 'Sack', 'desc' => 'Sack - for fertilizer and material allocations'],
            // Farmer identification identifiers (keeping for backward compatibility)
            ['title' => 'RSBSA', 'desc' => 'Registry System for Basic Sectors in Agriculture'],
            ['title' => 'ID Card', 'desc' => 'Government-issued ID Card'],
            ['title' => 'Certificate', 'desc' => 'Farmer Certificate'],
        ];

        foreach ($identifiers as $identifier) {
            Identifier::updateOrCreate(
                ['title' => $identifier['title']],
                $identifier
            );
        }
    }
}

