<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farmer extends Model
{
    use HasFactory;

    protected $fillable = [
       'rsbsa_ref_no', 'firstname', 'lastname', 'dob', 'age', 'sex', 'status', 'coop', 'pwd', '4ps', 'brgy_id',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'brgy_id');
    }

    public function cropDamages()
    {
        return $this->hasMany(CropDamage::class, 'farmer_id');
    }

    public function cropActivity(): HasMany
    {
        return $this->hasMany(CropActivity::class, 'farmer_id');
    }


    public function farms()
    {
        return $this->hasMany(Farm::class);
    }

    public function allocations()
    {
        return $this->hasMany(Allocation::class, 'farmer_id');
    }

    public function elligibilities()
    {
        return $this->belongsToMany(Elligibility::class, 'farmer_elligibilities', 'farmer_id', 'elligibility_id');
    }

    public function commodities()
    {
        return $this->hasManyThrough(Commodity::class, Farm::class, 'farmer_id', 'id', 'id', 'commodity_id');
    }


}
