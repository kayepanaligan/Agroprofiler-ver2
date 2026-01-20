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


        $geojson = json_decode(file_get_contents(public_path('Digos_City.geojson')), true);
        $coordinates = $geojson['features'][0]['geometry']['coordinates'];
        $flattenedCoordinates = array_merge(...array_merge(...$coordinates));
        $latitudes = [];
        $longitudes = [];

        foreach ($flattenedCoordinates as $coordinate) {
            $longitudes[] = $coordinate[0];
            $latitudes[] = $coordinate[1];
        }

        $minLat = min($latitudes);
        $maxLat = max($latitudes);
        $minLon = min($longitudes);
        $maxLon = max($longitudes);

        $faker = Faker::create();

        // Get all farmers
        $farmers = Farmer::all();

        foreach ($farmers as $farmer) {
            // Assign each farmer 2 to 3 farms
            $farmCount = rand(2, 3);

            for ($j = 0; $j < $farmCount; $j++) {
                Farm::create([
                    'farmer_id' => $farmer->id,
                    'brgy_id' => Barangay::inRandomOrder()->first()->id,
                    'commodity_id' => Commodity::inRandomOrder()->first()->id,
                    'ha' => $faker->randomFloat(2, 0.5, 10),
                    'owner' => $faker->randomElement(['yes', 'no']),
                    'name' => $faker->company() . ' Farm',
                    'latitude' => $faker->latitude($minLat, $maxLat),
                    'longitude' => $faker->longitude($minLon, $maxLon),
                    'created_at' => $faker->dateTimeBetween('2019-01-01', '2024-12-31'),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}

