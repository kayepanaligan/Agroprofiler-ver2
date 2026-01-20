<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date'
    ];

    public function images()
    {
        return $this->hasMany(Images::class);
    }

}