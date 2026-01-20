<?php

namespace Database\Factories;

use App\Models\Barangay;
use App\Models\brgy;
use App\Models\Commodity;
use App\Models\Farm;
use App\Models\Farmer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Farm>
 */
class FarmFactory extends Factory
{
    protected $model = Farm::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           'farmer_id' => Farmer::inRandomOrder()->first()->id ?? Farmer::factory()->create()->id,
            'brgy_id' => Barangay::inRandomOrder()->first()->id ?? Barangay::factory()->create()->id,
            'commodity_id' => Commodity::inRandomOrder()->first()->id ?? Commodity::factory()->create()->id,
            'ha' => $this->faker->numberBetween(1, 100),
            'name' => $this->faker->('name');
            'owner' => $this->faker->randomElement(['yes', 'no']),
        ];
    } 
}