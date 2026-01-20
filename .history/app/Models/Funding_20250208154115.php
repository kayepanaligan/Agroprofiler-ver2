<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Funding extends Model
{
    use HasFactory;
     protected $fillable = ['name', 'desc'];

     public function allocations()
    {
        return $this->hasMany(Allocation::class, 'allocation_type_id');
    }
}
