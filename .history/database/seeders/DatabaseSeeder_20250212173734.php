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


    }
}