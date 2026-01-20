<?php

namespace Database\Factories;

use App\Models\Elligibility;
use App\Models\Farmer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FarmerElligibility>
 */
class FarmerElligibilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'farmer_id' => Farmer::inRandomOrder()->first()->id,
            'elligibility_id' => Elligibility::inRandomOrder()->first()->id,
          ];
    }
}