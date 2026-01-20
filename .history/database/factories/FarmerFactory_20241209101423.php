<?php

namespace Database\Factories;

use App\Models\Barangay;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Farmer>
 */
class FarmerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      
        $status = $this->faker->randomElement(['registered', 'unregistered']);
        
        $rsbsaRefNumber = $status === 'registered'
            ? 'RSBSA-' . $this->faker->numerify('##-##-##-###-######')
            : null;

        return [
            'rsbsa_ref_no' => $rsbsaRefNumber,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'dob' => $this->faker->date('Y-m-d', '2000-01-01'), 
            'age' => $this->faker->numberBetween(18, 80),
            'sex' => $this->faker->randomElement(['male', 'female']),
            'status' => $status,
            'coop' => $this->faker->company(),
            'pwd' => $this->faker->randomElement(['yes', 'no']),
            '4ps' => $this->faker->randomElement(['yes', 'no']),
            'brgy_id' => Barangay::inRandomOrder()->first()->id,
            'created_at' => $this->faker->dateTimeBetween('2019-01-01', '2024-12-31'),
            'updated_at' => now(),
        ];
    }
}