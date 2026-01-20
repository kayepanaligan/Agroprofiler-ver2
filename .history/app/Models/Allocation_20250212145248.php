<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Allocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'allocation_type_id',
        'farmer_id',
        'received',
        'date_received',
        'commodity_id',
        'brgy_id',
        'funding_id'
    ];
     public function allocationType()
    {
        return $this->belongsTo(AllocationType::class, 'allocation_type_id');
    }

    public function farmer()
    {
        return $this->belongsTo(Farmer::class);
    }

    public function commodity()
    {
        return $this->belongsTo(Commodity::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'brgy_id');
    }

    public function allocations()
    {
        return $this->hasManyThrough(
            Allocation::class,
            Farmer::class,
            'brgy_id',
            'farmer_id',
            'id',
            'id'
        );
    }


}
