<?php

namespace Database\Factories;

use App\Models\Allocation;
use App\Models\AllocationType;
use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\Farmer;
use App\Models\Identifier;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Allocation>
 */
class AllocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
   public function definition(): array
{
    $farmer = Farmer::inRandomOrder()->first() ?? Farmer::factory()->create();
    $allocationType = AllocationType::inRandomOrder()->first() ?? AllocationType::factory()->create();

    // Calculate the total allocated amount for this allocation type
    $totalAllocated = Allocation::where('allocation_type_id', $allocationType->id)->sum('amount');

    // Calculate remaining amount available
    $remainingAmount = max($allocationType->amount - $totalAllocated, 0);

    // Calculate 2% of the total allocation type amount
    $minimumAllocation = max((int)($allocationType->amount * 0.02), 1);

    // Ensure the allocated amount is at least 2% but does not exceed the remaining balance
    $amount = ($remainingAmount > 0) ? min($this->faker->numberBetween($minimumAllocation, $remainingAmount), $remainingAmount) : 0;

    return [
        'allocation_type_id' => $allocationType->id,
        'farmer_id' => $farmer->id,
        'received' => $this->faker->randomElement(['yes', 'no']),
        'amount' => $amount, // Ensure at least 2% and does not exceed the limit
        'date_received' => $amount > 0 ? $this->faker->date() : null,
        'commodity_id' => Commodity::inRandomOrder()->first()->id ?? Commodity::factory()->create()->id,
        'brgy_id' => $farmer->brgy_id,
        'funding_id' => $allocationType->funding_id,
        'identifier_id' => $allocationType->identifier_id,
        'created_at' => $this->faker->dateTimeBetween('2019-01-01', '2024-12-31'),
        'updated_at' => Carbon::now(),
    ];
}


}
