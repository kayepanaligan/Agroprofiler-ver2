<?php

namespace Database\Seeders;

use App\Models\Barangay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangays = include database_path('data/barangay.php');
        foreach ($barangays as $barangay) {
            Barangay::updateOrCreate(
                ['id' => $barangay['id'] ?? null, 'name' => $barangay['name']],
                $barangay
            );
        }
    }
}