<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropDamageCause extends Model
{
    use HasFactory;

    protected $fillable = ["id", "name","desc"]

    public function allocationTypeCropDamageCauses()
    {
        return $this->belongsToMany(AllocationType::class, 'allocation_type_crop_damage_causes', 'crop_damage_cause_id', 'allocation_type_id');
    }



}
