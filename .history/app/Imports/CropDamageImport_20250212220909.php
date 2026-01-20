<?php

namespace App\Imports;

use App\Models\CropDamage;
use App\Models\Farmer;
use App\Models\Farm;
use App\Models\Commodity;
use App\Models\Barangay;
use App\Models\CropDamageCause;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CropDamageImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new CropDamage([
            'proof' => $row['proof'] ?? null,
            'farmer_id' => Farmer::where('name', $row['farmer'])->value('id') ?? null,
            'farm_id' => Farm::where('name', $row['farm'])->value('id') ?? null,
            'commodity_id' => Commodity::where('name', $row['commodity'])->value('id') ?? null,
            'brgy_id' => Barangay::where('name', $row['barangay'])->value('id') ?? null,
            'crop_damage_cause_id' => CropDamageCause::where('cause', $row['damage_cause'])->value('id') ?? null,
            'total_damaged_area' => $row['total_damaged_area'],
            'partially_damaged_area' => $row['partially_damaged_area'],
            'area_affected' => $row['area_affected'],
            'remarks' => $row['remarks'] ?? null,
            'severity' => $row['severity'],
        ]);
    }
}
