<?php

namespace Database\Factories;

use App\Models\AllocationType;
use App\Models\Elligibility;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AllocationTypeElligibility>
 */
class AllocationTypeElligibilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'allocation_type_id' => AllocationType::inRandomOrder()->first()->id,
            'elligibility_id' => Elligibility::inRandomOrder()->first()->id,
        ];
    }
}