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
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create users first
        User::updateOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'firstname' => 'superadmin',
                'lastname' => 'superadmin',
                'status' => 'approved',
                'section' => 'rice',
                'sex' => 'male',
                'role' => 'super admin',
                'password' => Hash::make('asdf1234')
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'firstname' => 'admin',
                'lastname' => 'admin',
                'status' => 'approved',
                'section' => 'rice',
                'sex' => 'male',
                'role' => 'admin',
                'password' => Hash::make('asdf1234')
            ]
        );

        // Seed base data (no dependencies)
        $this->call([
            BarangaySeeder::class,
            CommodityCategorySeeder::class,
            EligibleSeeder::class,
            CropDamageCauseSeeder::class,
            PriorityLevelSeeder::class,
            IdentifierSeeder::class,
            FundingSeeder::class,
        ]);

        // Seed data that depends on base data
        $this->call([
            CommoditySeeder::class,
        ]);

        // Seed farmers (depends on Barangay)
        $this->call([
            FarmerSeeder::class,
        ]);

        // Seed farms (depends on Farmer, Barangay, Commodity)
        $this->call([
            FarmSeeder::class,
        ]);

        // Seed allocation types and related data
        $this->call([
            AllocationTypeSeeder::class,
            AllocationTypeBarangaySeeder::class,
            AllocationTypeCommoditySeeder::class,
            AllocationTypeCropDamageCauseSeeder::class,
            AllocationTypeElligibilitySeeder::class,
        ]);

        // Seed farmer eligibilities (depends on Farmer, Elligibility)
        $this->call([
            FarmerElligibilitySeeder::class,
        ]);

        // Seed crop damages (depends on Farmer, Farm, Commodity, Barangay, CropDamageCause)
        $this->call([
            CropDamageSeeder::class,
        ]);

        // Seed allocations (depends on AllocationType, Farmer, Commodity, Barangay)
        $this->call([
            AllocationSeeder::class,
        ]);
    }
}
