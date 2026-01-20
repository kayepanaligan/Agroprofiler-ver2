<?php

namespace App\Http\Controllers;

use App\Models\AllocationType;
use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\CropDamageCause;
use App\Models\Farm;
use App\Models\Farmer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

   public function getFarmers(Request $request)
    {
       $query = Farmer::query();

        if ($request->has('q')) {
            $query->whereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ['%' . $request->q . '%']);
        }

        return response()->json(
            $query->select('id as value', DB::raw("CONCAT(firstname, ' ', lastname) as label"))
                ->distinct() // Prevent duplicate names
                ->limit(50)
                ->get()
        );

    }

  public function getFarms(Request $request)
{
    $query = Farm::query();

    if ($request->has('farmer_id')) {
        $query->where('farmer_id', $request->farmer_id);
    }

    return response()->json(
        $query->select('id as value', 'name', 'ha')->get()
    );
}




    public function getFarmsByFarmer(Request $request)
    {
        $farmerId = $request->query('farmer_id');

        if (!$farmerId) {
            return response()->json(['message' => 'Farmer ID is required'], 400);
        }

        $farms = Farm::where('farmer_id', $farmerId)->get();

        return response()->json($farms);
    }

    public function cropDamageCause()
    {
        $cropDamageCause = CropDamageCause::all();
        return response($cropDamageCause);
    }

}
