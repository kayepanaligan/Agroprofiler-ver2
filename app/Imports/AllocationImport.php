<?php

namespace App\Imports;

use App\Models\Allocation;
use App\Models\AllocationType;
use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\Farmer;
use App\Models\Funding;
use App\Models\Identifier;
use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AllocationImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
   public function model(array $row)
    {
        Log::info("Processing row: ", $row); // Debugging

        $allocationType = AllocationType::where('name', $row['type'])->first();
        if (!$allocationType) {
            Log::error("Allocation Type not found: " . $row['type']);
            return null;
        }

        $farmer = Farmer::whereRaw("LOWER(CONCAT(firstname, ' ', lastname)) = LOWER(?)", [$row['receiver']])->first();
        if (!$farmer) {
            Log::error("Farmer not found: " . $row['receiver']);
            return null;
        }

        $commodity = Commodity::where('name', $row['commodity'])->first();
        if (!$commodity) {
            Log::error("Commodity not found: " . $row['commodity']);
            return null;
        }

        $barangay = Barangay::where('name', $row['barangay'])->first();
        if (!$barangay) {
            Log::error("Barangay not found: " . $row['barangay']);
            return null;
        }

        $identifier = Identifier::where('title', $row['identifier'])->first();
        if (!$identifier) {
            Log::error("Identifier not found: " . $row['identifier']);
            return null;
        }

        $funding = Funding::where('name', $row['source'])->first();
        if (!$funding) {
            Log::error("Funding not found: " . $row['source']);
            return null;
        }

        return new Allocation([
            'allocation_type_id' => $allocationType->id,
            'farmer_id' => $farmer->id,
            'received' => $row['received'] ?? 'no',
            'amount' => $row['amount'],
            'identifier_id' => $identifier->id,
            'date_received' => $row['date_received'] ?? null,
            'commodity_id' => $commodity->id,
            'brgy_id' => $barangay->id,
            'funding_id' => $funding->id,
        ]);
    }



}
