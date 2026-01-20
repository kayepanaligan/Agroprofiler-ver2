<?php

namespace Database\Seeders;

use App\Models\Commodity;
use App\Models\CropDamage;
use App\Models\CropDamageCause;
use App\Models\CropDamages;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CropDamageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        // Get all farms to generate crop damage entries
        $farms = Farm::all();

        foreach ($farms as $farm) {
            $farmSize = $farm->ha; // Get the farm size

            // Ensure total damaged area is within farm size
            $totalDamagedArea = $faker->randomFloat(2, 0, $farmSize);

            // Ensure partially damaged area is less than or equal to total damaged area
            $partiallyDamagedArea = $faker->randomFloat(2, 0, $totalDamagedArea);

            // Area affected should not exceed farm size
            $areaAffected = min($faker->randomFloat(2, $totalDamagedArea, $farmSize), $farmSize);

            // Determine severity based on damage percentage
            $damagePercentage = ($totalDamagedArea / $farmSize) * 100;
            if ($damagePercentage < 20) {
                $severity = "low";
            } elseif ($damagePercentage >= 20 && $damagePercentage <= 50) {
                $severity = "medium";
            } else {
                $severity = "high";
            }

            CropDamage::create([
                'proof' => $faker->imageUrl(), // Random image URL as proof
                'farmer_id' => $farm->farmer_id,
                'farm_id' => $farm->id,
                'commodity_id' => Commodity::inRandomOrder()->first()->id,
                'brgy_id' => $farm->brgy_id,
                'crop_damage_cause_id' => CropDamageCause::inRandomOrder()->first()->id,
                'total_damaged_area' => $totalDamagedArea,
                'partially_damaged_area' => $partiallyDamagedArea,
                'area_affected' => $areaAffected,
                'remarks' => $faker->sentence(),
                'severity' => $severity,
            ]);
        }
    }
}