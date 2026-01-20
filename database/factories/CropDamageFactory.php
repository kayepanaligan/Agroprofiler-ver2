<?php

namespace Database\Factories;

use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\CropDamage;
use App\Models\CropDamageCause;
use App\Models\CropDamages;
use App\Models\Farmer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CropDamage>
 */
class CropDamageFactory extends Factory
{
    protected $model = CropDamage::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */


     public function definition(): array
     {
         $totalDamagedArea = $this->faker->randomFloat(2, 0, 100);

         if ($totalDamagedArea >= 60) {
             $severity = 'high';
         } elseif ($totalDamagedArea >= 30) {
             $severity = 'medium';
         } else {
             $severity = 'low';
         }

         return [
             'proof' => $this->faker->imageUrl(100, 100, 'nature'),
             'farmer_id' => Farmer::factory(),
             'commodity_id' => Commodity::inRandomOrder()->first()->id,
             'crop_damage_cause_id' => CropDamageCause::inRandomOrder()->first()->id,
             'brgy_id' => Barangay::inRandomOrder()->first()->id,
             'total_damaged_area' => $totalDamagedArea,
             'partially_damaged_area' => $this->faker->randomFloat(2, 0, 50),
             'area_affected' => $this->faker->randomFloat(2, 0, 100),
             'remarks' => $this->faker->sentence(),
             'severity' => $severity,
         ];
     }
}
