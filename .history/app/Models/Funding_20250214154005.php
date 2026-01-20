<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Funding extends Model
{
    use HasFactory;

     protected $table = 'fundings';
     protected $fillable = ['name', 'desc'];

     public function allocationType()
    {
        return $this->belongsToMany(AllocationType::class, 'allocation_type_id');
    }
}
