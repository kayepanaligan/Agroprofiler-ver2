<?php

namespace App\Imports;

use App\Models\Allocation;
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
        return new Allocation([

        ]);
    }
}
