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

        $barangay = Barangay::where('name', $row['barangay'])->first();

        if (!$barangay) {
            return null;
        }

        return new Farmer([
            'rsbsa_ref_no' => $row['rsbsa_ref_no'] ?? null,
            'firstname' => $row['firstname'],
            'lastname' => $row['lastname'],
            'dob' => $row['dob'] ?? null,
            'age' => $row['age'] ?? null,
            'sex' => $row['sex'],
            'status' => $row['status'],
            'coop' => $row['coop'] ?? null,
            'pwd' => $row['pwd'],
            '4ps' => $row['4ps'],
            'brgy_id' => $barangay->name,
        ]);
    }
}
