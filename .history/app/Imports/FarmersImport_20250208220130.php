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
        $barangay = Barangay::where('name', $row['brgy_name'])->first();

          if (!$barangay) {
            return null; 
        }
        
        return new Farmer([
            //
        ]);
    } 
}
