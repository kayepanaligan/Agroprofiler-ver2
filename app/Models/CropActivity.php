<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
         'desc',
         'file_path',
        'date'
    ];

    public function images()
    {
        return $this->hasMany(Images::class);
    }

     public function farmers()
    {
        return $this->belongsTo(Farmer::class);
    }

}
