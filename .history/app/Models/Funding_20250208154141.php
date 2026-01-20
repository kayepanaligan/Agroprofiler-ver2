<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Funding extends Model
{
    use HasFactory;
     protected $fillable = ['name', 'desc'];

     public function allocationType()
    {
        return $this->hasMany(AllocationType::class, 'allocation_type_id');
    }
}
