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
    $allocationType = AllocationType::where('name', $row['type'])->first();
    $farmer = Farmer::whereRaw("CONCAT(firstname, ' ', lastname) = ?", [$row['receiver']])->first();
    $commodity = Commodity::where('name', $row['commodity'])->first();
    $barangay = Barangay::where('name', $row['barangay'])->first();
    $identifier = Identifier::where('title', $row['identifier'])->first(); // Fixed
    $funding = Funding::where('name', $row['source'])->first();

    if (!$allocationType || !$farmer || !$commodity || !$barangay || !$identifier || !$funding) {
        Log::error('Missing related data for allocation: ', $row);
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
