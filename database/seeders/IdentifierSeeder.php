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

