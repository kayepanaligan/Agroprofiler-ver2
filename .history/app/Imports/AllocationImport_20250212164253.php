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
        $allocationType = AllocationType::where('name', $row['Type'])->first();
        if (!$allocationType) return null;

        $farmer = Farmer::whereRaw("CONCAT(firstname, ' ', lastname) = ?", [$row['Receiver']])->first();
        if (!$farmer) return null;

        $commodity = Commodity::where('name', $row['commodity'])->first();
        if (!$commodity) return null;

        $barangay = Barangay::where('name', $row['barangay'])->first();
        if (!$barangay) return null;

         $identifier = Barangay::where('name', $row['identifier'])->first();
        if (!$identifier) return null;

        $funding = Funding::where('name', $row['source'])->first();
        if (!$funding) return null;

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
