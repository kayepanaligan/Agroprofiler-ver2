<?php

namespace Database\Seeders;

use App\Models\AllocationTypeCropDamageCause;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AllocationTypeCropDamageCauseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AllocationTypeCropDamageCause::factory()->count(20)->create();
    }
}