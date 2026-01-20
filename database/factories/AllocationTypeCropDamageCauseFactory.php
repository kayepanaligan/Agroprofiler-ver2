<?php

namespace Database\Factories;

use App\Models\AllocationType;
use App\Models\AllocationTypeCropDamageCause;
use App\Models\CropDamageCause;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AllocationTypeCropDamageCause>
 */
class AllocationTypeCropDamageCauseFactory extends Factory
{
    protected $model = AllocationTypeCropDamageCause::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'allocation_type_id' => AllocationType::inRandomOrder()->first()->id,
            'crop_damage_cause_id' => CropDamageCause::inRandomOrder()->first()->id,
          ];
    }
}