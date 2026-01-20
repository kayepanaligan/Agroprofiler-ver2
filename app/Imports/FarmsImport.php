<?php

namespace App\Imports;

use App\Models\Farm;
use Maatwebsite\Excel\Concerns\ToModel;
use App\Models\Farmer;
use App\Models\Barangay;
use App\Models\Commodity;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class FarmsImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // Find the farmer by RSBSA reference number
        $farmer = Farmer::where('rsbsa_ref_no', $row['rsbsa_ref_no'])->first();
        if (!$farmer) {
            return null; // Skip row if farmer does not exist
        }

        // Find barangay and commodity
        $barangay = Barangay::where('name', $row['barangay'])->first();
        $commodity = Commodity::where('name', $row['commodity'])->first();

        return new Farm([
            'farmer_id'   => $farmer->id,
            'name'        => $row['farm_name'],
            'brgy_id'     => $barangay ? $barangay->id : null,
            'commodity_id'=> $commodity ? $commodity->id : null,
            'ha'          => $row['hectares'],
            'owner'       => strtolower($row['owner']) === 'yes' ? 'yes' : 'no',
            'latitude'    => $row['latitude'],
            'longitude'   => $row['longitude'],
        ]);
    }

    public function rules(): array
    {
        return [
            'rsbsa_ref_no' => 'required|exists:farmers,rsbsa_ref_no',
            'farm_name'    => 'required|string',
            'barangay'     => 'required|string',
            'commodity'    => 'required|string',
            'hectares'     => 'nullable|numeric|min:0',
            'owner'        => 'required|in:yes,no',
            'latitude'     => 'nullable|numeric',
            'longitude'    => 'nullable|numeric',
        ];
    }
}
