<?php

namespace Database\Factories;

use App\Models\AllocationType;
use App\Models\Commodity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AllocationTypeCommodity>
 */
class AllocationTypeCommodityFactory extends Factory
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
            'commodity_id' => Commodity::inRandomOrder()->first()->id,
        ];
    }
}