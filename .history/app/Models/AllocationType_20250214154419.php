<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllocationType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'desc', 'amount', 'identifier_id', 'funding_id', ];

    public function allocations()
    {
        return $this->hasMany(Allocation::class, 'allocation_type_id');
    }

    public function identifier()
    {
        return $this->belongsTo(Identifier::class, 'identifier_id');
    }

    public function funding()
    {
        return $this->belongsTo(Funding::class, 'funding_id');
    }

    public function elligibilities()
    {
        return $this->belongsToMany(Elligibility::class, 'allocation_type_elligibilities');
    }
    public function commodities()
    {
        return $this->belongsToMany(Commodity::class, 'allocation_type_commodities');
    }

    public function barangays()
    {
        return $this->belongsToMany(Barangay::class, 'allocation_type_barangays', 'allocation_type_id', 'barangay_id');
    }

    public function cropDamageCauses()
    {
        return $this->belongsToMany(CropDamageCause::class, 'allocation_type_crop_damage_causes', 'allocation_type_id', 'crop_damage_cause_id');
    }





}
