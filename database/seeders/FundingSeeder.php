<?php

namespace Database\Seeders;

use App\Models\Funding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FundingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fundings = [
            ['name' => 'DA Budget', 'desc' => 'Department of Agriculture Budget'],
            ['name' => 'Local Government', 'desc' => 'Local Government Unit Funding'],
            ['name' => 'National Government', 'desc' => 'National Government Allocation'],
            ['name' => 'Private Donation', 'desc' => 'Private Sector Donations'],
        ];

        foreach ($fundings as $funding) {
            Funding::updateOrCreate(
                ['name' => $funding['name']],
                $funding
            );
        }
    }
}



