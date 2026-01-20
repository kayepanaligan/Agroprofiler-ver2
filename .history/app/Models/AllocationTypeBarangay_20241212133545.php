<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllocationTypeBarangay extends Model
{
    use HasFactory;

    protected $fillable = ['allocation_type_id', 'barangay_id']

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

}
