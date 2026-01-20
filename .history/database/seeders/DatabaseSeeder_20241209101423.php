<?php

namespace Database\Seeders;

use App\Models\Allocation;
use App\Models\AllocationTypeBarangay;
use App\Models\AllocationTypeCommodity;
use App\Models\AllocationTypeCropDamageCause;
use App\Models\AllocationTypeElligibility;
use App\Models\Barangay;
use App\Models\brgy;
use App\Models\Commodity;
use App\Models\CommodityCategory;
use App\Models\CropDamageCause;
use App\Models\Elligibility;
use App\Models\Farm;
use App\Models\User;
use App\Models\Farmer;
use App\Models\FarmerElligibility;
use App\Models\PriorityLevel;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(30)->create();

        User::factory()->create([
            'firstname' => 'superadmin',
            'lastname' => 'superadmin',
            'status' => 'approved',
            'section' => 'rice',
            'role' => 'super admin',
            'email' => 'superadmin@example.com',
            'password'=> 'asdf1234'
        ]);

        User::factory()->create([
            'firstname' => 'admin',
            'lastname' => 'admin',
            'status' => 'approved',
            'section' => 'rice',
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password'=> 'asdf1234'
        ]);

    //     Allocation::truncate(); 
    //     Allocation::factory()->count(5000)->create();
    //     AllocationTypeBarangay::factory()->count(50)->create();
    //     AllocationTypeCommodity::truncate();
        
    //     $commodities = include database_path('data/allocation_type_commodity.php');
    //     foreach ($commodities as $commodity) {
    //         AllocationTypeCommodity::create($commodity);
    //     } 
    
    //     AllocationTypeCropDamageCause::factory()->count(10)->create();

    //     AllocationTypeElligibility::factory()->count(10)->create();

    //     AllocationTypeCommodity::factory()->count(10)->create();

    //     $barangays = include database_path('data/barangay.php');
    //     foreach ($barangays as $barangay) {
    //         Barangay::create($barangay);
    //     }

    //     CommodityCategory::truncate();
        
    //     $commodities = include database_path('data/commodity_category.php');
    //     foreach ($commodities as $commodity) {
    //         CommodityCategory::create($commodity);
    //     } 

    //     Commodity::truncate();
        
    //     $commodities = include database_path('data/commodity.php');
    //     foreach ($commodities as $commodity) {
    //         Commodity::create($commodity);
    //     } 

    //     $cropdamagecauses = include database_path('data/crop_damage_cause.php');
    //     foreach ($cropdamagecauses as $cropdamagecause) {
    //         CropDamageCause::create($cropdamagecause);
    //     }

    //     Elligibility::truncate();
        
    //     $commodities = include database_path('data/eligible.php');
    //     foreach ($commodities as $commodity) {
    //         Elligibility::create($commodity);
    //     }

    //     FarmerElligibility::factory()->count(50)->create();

    //     // Farmer::factory()->count(10000)->create();

    //     Farm::truncate();
        
    //     $geojson = json_decode(file_get_contents(public_path('Digos_City.geojson')), true);

    //     $coordinates = $geojson['features'][0]['geometry']['coordinates'];

    //     $flattenedCoordinates = array_merge(...array_merge(...$coordinates));

    //     $latitudes = [];
    //     $longitudes = [];

    //     foreach ($flattenedCoordinates as $coordinate) {
    //         $longitudes[] = $coordinate[0];
    //         $latitudes[] = $coordinate[1];
    //     }

    //     $minLat = min($latitudes);
    //     $maxLat = max($latitudes);
    //     $minLon = min($longitudes);
    //     $maxLon = max($longitudes);

    //     $faker = Faker::create();

    //     for ($i = 0; $i < 20000; $i++) {
    //         Farm::create([
    //             'farmer_id' => Farmer::inRandomOrder()->first()->id, 
    //             'brgy_id' => Barangay::inRandomOrder()->first()->id,
    //             'commodity_id' => Commodity::inRandomOrder()->first()->id, 
    //             'ha' => $faker->randomFloat(2, 0, 10),
    //             'owner' => $faker->randomElement(['yes', 'no']),
    //             'latitude' => $faker->latitude($minLat, $maxLat),
    //             'longitude' => $faker->longitude($minLon, $maxLon),
    //             'created_at' => $faker->dateTimeBetween('2019-01-01', '2024-12-31'),
    //             'updated_at' => now(),
    //         ]);
    //     }

    //     PriorityLevel::truncate();
        
    //     $commodities = include database_path('data/priority_level.php');
    //     foreach ($commodities as $commodity) {
    //         PriorityLevel::create($commodity);
    //     } 
        
    }
}