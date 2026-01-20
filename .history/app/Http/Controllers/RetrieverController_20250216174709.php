<?php

namespace App\Http\Controllers;

use App\Models\AllocationType;
use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\CropDamageCause;
use App\Models\Farmer;
use Illuminate\Http\Request;

class RetrieverController extends Controller
{
    public function farmer(){
        $farmer = Farmer::all();
        return response($farmer);
    }

    public function barangay()
    {
        $barangay = Barangay::all();
        return response($barangay);
    }

    public function commodity(){
        $commodity = Commodity::with("category")->get();
        return response($commodity);
    }

    public function allocationType(){
       $allocationType = AllocationType::with([
        'barangays',
        'commodities',
        'funding',
        'identifier'
    ])->get();

    return response($allocationType);
    }

    public function cropDamageCause()
    {
        $cropDamageCause = CropDamageCause::all();
        return response($cropDamageCause);
    }

}
