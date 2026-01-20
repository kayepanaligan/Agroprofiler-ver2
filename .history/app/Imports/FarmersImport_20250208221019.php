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
        $barangay = Barangay::where('name', $row['Barangay'])->first();

          if (!$barangay) {
            return null;
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
