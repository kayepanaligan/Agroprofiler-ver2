<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Identifier extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'desc'];

    public function allocations()
    {
        return $this->hasMany(Allocation::class, 'allocation_type_id');
    }
}
