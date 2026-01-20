<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommodityCategory extends Model
{
    use HasFactory;

    public function commodities()
    {
        return $this->hasMany(Commodity::class, 'commodity_category_id');
    }
}