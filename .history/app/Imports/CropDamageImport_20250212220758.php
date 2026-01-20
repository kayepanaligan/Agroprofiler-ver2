<?php

namespace App\Imports;

use App\Models\CropDamage;
use Maatwebsite\Excel\Concerns\ToModel;

class CropDamageImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new CropDamage([
            //
        ]);
    }
}
