<?php

namespace App\Imports;

use App\Models\Barangay;
use App\Models\Farmer;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class FarmersImport implements ToModel, WithHeadingRow

{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
      public function model(array $row)
    {
        if (!isset($row['barangay'])) {
            throw new \Exception("Column 'barangay' is missing in CSV. Available keys: " . implode(", ", array_keys($row)));
        }

        $barangay = Barangay::where('name', trim($row['barangay']))->first();

        if (!$barangay) {
            throw new \Exception("Barangay '{$row['barangay']}' not found in database.");
        }

        return new Farmer([
            'rsbsa_ref_no' => $row['rsbsa_ref_no'] ?? null,
            'firstname' => $row['firstname'] ?? null,
            'lastname' => $row['lastname'] ?? null,
            'dob' => $row['dob'] ?? null,
            'age' => $row['age'] ?? null,
            'sex' => $row['gender'] ?? null,
            'status' => $row['status'] ?? 'unregistered',
            'coop' => $row['coop'] ?? null,
            'pwd' => $row['pwd'] ?? 'no',
            '4ps' => $row['4ps'] ?? 'no',
            'brgy_id' => $barangay->id,
        ]);
    }
}
