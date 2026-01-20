<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllocationTypeCropDamageCause extends Model
{
    use HasFactory;

    protected $fillable = ['allocation_type_id', 'crop_damage_cause_id'];

    public function cropDamageCause()
    {
        return $this->belongsTo(CropDamageCause::class);
    }
    public function allocation()
    {
        return $this->belongsTo(Allocation::class);
    }


}
