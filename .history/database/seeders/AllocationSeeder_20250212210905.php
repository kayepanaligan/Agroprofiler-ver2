<?php

namespace Database\Seeders;

use App\Models\Allocation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AllocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       
        Allocation::factory()->count(5000)->create();
    }
}
