<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    use HasFactory;

    protected $guarded = [
        'name',
    ];

    public function farmers()
    {
        return $this->hasMany(Farmer::class, 'brgy_id');
    }

    public function allocations()
    {
        return $this->hasMany(Allocation::class, 'brgy_id');
    }

    public function allocationTypes()
    {
        return $this->belongsToMany(AllocationType::class, 'allocation_type_barangays');
    }

     public function farms()
    {
        return $this->belongsToMany(Farm::class, 'allocation_type_barangays');
    }

}
