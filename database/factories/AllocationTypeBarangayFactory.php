<?php

namespace Database\Factories;

use App\Models\AllocationType;
use App\Models\AllocationTypeBarangay;
use App\Models\Barangay;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AllocationTypeBarangay>
 */
class AllocationTypeBarangayFactory extends Factory
{
    protected $model = AllocationTypeBarangay::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
          'allocation_type_id' => AllocationType::inRandomOrder()->first()->id,
          'barangay_id' => Barangay::inRandomOrder()->first()->id,
        ];
    }
}