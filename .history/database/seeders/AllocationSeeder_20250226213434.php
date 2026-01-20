<?php

namespace Database\Seeders;

use App\Models\Allocation;
use App\Models\AllocationType;
use App\Models\Farmer;
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
        $minimumAllocation = max((int)($allocationType->amount * 0.02), 1); // 2% of total amount
        $farmers = Farmer::inRandomOrder()->get();

        foreach ($farmers as $farmer) {
            if ($totalAllocated >= $allocationType->amount) {
                break;
            }

            $amount = min($minimumAllocation, $allocationType->amount - $totalAllocated); // Ensure 2% but not exceeding limit

            // Randomly determine if the allocation is received
            $received = (rand(0, 1) === 1) ? 'yes' : 'no';

            Allocation::factory()->create([
                'allocation_type_id' => $allocationType->id,
                'farmer_id' => $farmer->id,
                'amount' => $amount,
                'received' => $received,
                'date_received' => $received === 'yes' ? now() : null, // Ensure date_received is only set if received is "yes"
            ]);

            $totalAllocated += $amount;
        }
    }
}




}
