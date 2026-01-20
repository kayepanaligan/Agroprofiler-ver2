<?php

namespace App\Imports;

use App\Models\Allocation;
use App\Models\AllocationType;
use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\Farmer;
use App\Models\Funding;
use Maatwebsite\Excel\Concerns\ToModel;

class AllocationImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // Look up Allocation Type
        $allocationType = AllocationType::where('name', $row['allocation_type'])->first();
        if (!$allocationType) return null; // Skip row if not found

        // Look up Farmer by first and last name
        $farmer = Farmer::whereRaw("CONCAT(firstname, ' ', lastname) = ?", [$row['farmers_name']])->first();
        if (!$farmer) return null; // Skip if farmer not found

        // Look up Commodity
        $commodity = Commodity::where('name', $row['commodity'])->first();
        if (!$commodity) return null; // Skip if commodity not found

        // Look up Barangay
        $barangay = Barangay::where('name', $row['brgy_name'])->first();
        if (!$barangay) return null;

        // Look up Funding Source
        $funding = Funding::where('name', $row['funding_source'])->first();
        if (!$funding) return null;

        return new Allocation([
            'allocation_type_id' => $allocationType->id,
            'farmer_id' => $farmer->id,
            'received' => $row['received'] ?? 'no',
            'date_received' => $row['date_received'] ?? null,
            'commodity_id' => $commodity->id,
            'brgy_id' => $barangay->id,
            'funding_id' => $funding->id,
        ]);
    }
}
