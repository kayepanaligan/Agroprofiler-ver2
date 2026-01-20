<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commodity extends Model
{
    use HasFactory;

    protected $guarded = [
       'name',
    ];

    public function farms()
    {
        return $this->hasMany(Farm::class);
    }

    public function category()
    {
        return $this->belongsTo(CommodityCategory::class, 'commodity_category_id');
    }

    public function farmers()
    {
        return $this->hasManyThrough(Farmer::class, Farm::class);
    }

    public function allocationTypes()
    {
        return $this->belongsToMany(AllocationType::class, 'allocation_type_commodities');
    }

    public function commodity()
    {
        return $this->belongsTo(Commodity::class);
    }

    public function cropDamages()
    {
        return $this->hasMany(CropDamage::class);
    }

    public function allocations()
    {
        return $this->hasMany(Allocation::class);
    }
}
