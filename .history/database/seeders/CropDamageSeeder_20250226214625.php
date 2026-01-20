<?php

namespace Database\Seeders;

use App\Models\Commodity;
use App\Models\CropDamage;
use App\Models\CropDamageCause;
use App\Models\CropDamages;
use App\Models\Farm;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
 use Carbon\Carbon;


class CropDamageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */


public function run()
{
    $faker = Faker::create();
    $farms = Farm::all();

    foreach ($farms as $farm) {
        $farmSize = $farm->ha; // Get the total farm size

        // Ensure total damaged area does not exceed farm size
        $totalDamagedArea = $faker->randomFloat(2, 0, $farmSize);

        // Generate a valid partially damaged area (should be at most totalDamagedArea)
        $partiallyDamagedArea = $faker->randomFloat(2, 0, $totalDamagedArea);

        // Ensure area_affected + partially_damaged_area = total_damaged_area
        $areaAffected = $totalDamagedArea - $partiallyDamagedArea;

        // Determine severity based on damage percentage
        $damagePercentage = ($totalDamagedArea / $farmSize) * 100;
        if ($damagePercentage < 20) {
            $severity = "low";
        } elseif ($damagePercentage >= 20 && $damagePercentage <= 50) {
            $severity = "medium";
        } else {
            $severity = "high";
        }

        // Generate a random created_at date between 2020 and 2025
        $createdAt = Carbon::createFromTimestamp(
            rand(strtotime('2020-01-01'), strtotime('2025-12-31'))
        );

        CropDamage::create([
            'proof' => $faker->imageUrl(), // Random image URL as proof
            'farmer_id' => $farm->farmer_id,
            'farm_id' => $farm->id,
            'commodity_id' => Commodity::inRandomOrder()->first()->id,
            'brgy_id' => $farm->brgy_id,
            'crop_damage_cause_id' => CropDamageCause::inRandomOrder()->first()->id,
            'total_damaged_area' => $totalDamagedArea,
            'partially_damaged_area' => $partiallyDamagedArea,
            'area_affected' => $areaAffected, // Ensures sum matches total_damaged_area
            'remarks' => $faker->sentence(),
            'severity' => $severity,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);
    }
}

}
