<?php

namespace App\Imports;

use App\Models\Barangay;
use App\Models\Farmer;
use Maatwebsite\Excel\Concerns\ToModel;

class FarmersImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
      public function model(array $row)
    {
        // Debugging: Check if 'brgy_name' is actually present
        if (!isset($row['brgy_name'])) {
            throw new \Exception("Column 'brgy_name' is missing in CSV. Available keys: " . implode(", ", array_keys($row)));
        }

        // Find barangay ID using barangay name
        $barangay = Barangay::where('name', $row['brgy_name'])->first();

        if (!$barangay) {
            return null; // Skip row if barangay not found
        }

        return new Farmer([
            'rsbsa_ref_no' => $row['rsbsa_ref_no'] ?? null,
            'firstname' => $row['firstname'],
            'lastname' => $row['lastname'],
            'dob' => $row['dob'],
            'age' => $row['age'] ?? null,
            'sex' => $row['sex'],
            'status' => $row['status'],
            'coop' => $row['coop'] ?? null,
            'pwd' => $row['pwd'],
            '4ps' => $row['4ps'],
            'brgy_id' => $barangay->id,
        ]);
    }
}
