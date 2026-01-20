<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommodityCategory extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'name', 'description']; // Add relevant attributes


    public function commodities()
    {
        return $this->hasMany(Commodity::class, 'commodity_category_id');
    }
}
