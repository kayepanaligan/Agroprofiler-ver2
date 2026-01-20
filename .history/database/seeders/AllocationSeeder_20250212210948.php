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

       $allocationTypes = AllocationType::all();

foreach ($allocationTypes as $allocationType) {
    $totalAllocated = 0;

    while ($totalAllocated < $allocationType->amount) {
        $allocation = Allocation::factory()->create([
            'allocation_type_id' => $allocationType->id,
            'amount' => min(1000, $allocationType->amount - $totalAllocated) // Prevent exceeding limit
        ]);

        $totalAllocated += $allocation->amount;
    }
}

    }
}
