<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllocationTypeCropDamageCause extends Model
{
    use HasFactory;

    protected $fillable = ['allocation_type_id', 'elligibility_id'];

    public function elligibility()
    {
        return $this->belongsTo(Elligibility::class);
    }

    public function allocation()
    {
        return $this->belongsTo(Allocation::class);
    }
}
