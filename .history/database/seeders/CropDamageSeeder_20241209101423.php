<?php

namespace Database\Seeders;

use App\Models\CropDamage;
use App\Models\CropDamages;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CropDamageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */ 
    public function run(): void
    {
        CropDamage::factory()->count(1500)->create();
    }
}