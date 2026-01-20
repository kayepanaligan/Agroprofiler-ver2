<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Farmer;
use App\Models\Farm;
use App\Models\Barangay;
use App\Models\Commodity;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class FarmSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        if (Farmer::count() === 0 || Barangay::count() === 0 || Commodity::count() === 0) {
            $this->command->info("Skipping FarmSeeder because related tables are empty.");
            return;
        }

        for ($i = 0; $i < 1000; $i++) {
            Farm::create([
                'farmer_id'    => Farmer::inRandomOrder()->first()->id ?? Farmer::factory()->create()->id,
                'brgy_id'      => Barangay::inRandomOrder()->first()->id ?? Barangay::factory()->create()->id,
                'commodity_id' => Commodity::inRandomOrder()->first()->id ?? Commodity::factory()->create()->id,
                'ha'           => $faker->randomFloat(2, 0, 10),
                'owner'        => $faker->randomElement(['yes', 'no']),
                'name'         => $faker->company() . ' Farm',
                'latitude'     => $faker->latitude(),
                'longitude'    => $faker->longitude(),
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }
    }
}

