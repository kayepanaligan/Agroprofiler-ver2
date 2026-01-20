<?php

namespace App\Imports;

use App\Models\Farm;
use Maatwebsite\Excel\Concerns\ToModel;

class FarmsImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Farm([
            //
        ]);
    }
}
