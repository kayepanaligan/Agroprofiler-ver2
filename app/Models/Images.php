<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Images extends Model
{
    use HasFactory; 

     
    protected $fillable = [
        'crop_activity_id',
        'title',
        'desc',
        'file_path',
    ];

    

    public function crop_activity()
    {
        return $this->belongsTo(CropActivity::class);
    }

}