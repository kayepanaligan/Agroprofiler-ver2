<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */

     protected $model = User::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    { 
        return [
            'pfp' => $this->faker->imageUrl(100, 100, 'people'), 
            'firstname' => $this->faker->firstName(), 
            'lastname' => $this->faker->lastName(), 
            'email' => $this->faker->unique()->safeEmail(), 
            'status' => $this->faker->randomElement(['pending', 'rejected', 'approved']), 
            'section' => $this->faker->randomElement(['rice', 'corn', 'high value', 'fishery']), 
            'sex' => $this->faker->randomElement(['male', 'female']),
            'role' => $this->faker->randomElement(['admin', 'super admin']),
            'email_verified_at' => now(), 
            'password' => bcrypt('password'), 
            'remember_token' => Str::random(10), 
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}