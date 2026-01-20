<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Elligibility extends Model
{
    use HasFactory;

    public function farmers()
    {
        return $this->belongsToMany(Farmer::class, 'farmer_elligibilities', 'elligibility_id', 'farmer_id');
    }

    public function allocationTypeEligibilities()
    {
        return $this->belongsToMany(AllocationType::class, 'allocation_type_elligibilities', 'elligibility_id', 'allocation_type_id');
    }

    public function allocationType()
    {
        return $this->belongsToMany(AllocationType::class, 'allocation_type_elligibilities');
    }

    public function allocationTypes()
    {
        return $this->belongsTo(AllocationType::class);  
    }

}