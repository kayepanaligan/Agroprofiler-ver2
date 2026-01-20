<?php

namespace Database\Seeders;

use App\Models\AllocationTypeElligibility;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AllocationTypeElligibilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AllocationTypeElligibility::factory()->count(20)->create();
    }
}