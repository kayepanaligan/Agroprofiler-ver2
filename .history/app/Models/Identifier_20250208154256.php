<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Identifier extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'desc'];

    public function allocationType()
    {
        return $this->hasMany(AllocationType::class, 'allocation_type_id');
    }
}
