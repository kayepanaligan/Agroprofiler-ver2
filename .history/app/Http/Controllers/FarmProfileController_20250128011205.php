<?php

namespace App\Http\Controllers;

use App\Models\Allocation;
use App\Models\CropActivity;
use App\Models\CropDamage;
use App\Models\Farm;
use App\Models\Farmer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FarmProfileController extends Controller
{
    public function index($id)
    {

        $farmer = Farmer::with(['allocations', 'cropDamages.cropDamageCause', 'barangay', 'farms.commodity'])
        ->findOrFail($id);
        $damages = CropDamage::with('farmer_id', '$id');
        $allocations = Allocation::with('farmer_id', '$id');
        $cropActivities = CropActivity::with('farmer_id', '$id');

        return Inertia::render('Super Admin/List/Farmers/FarmProfile/FarmProfile', [
            'farmer' => $farmer,
            'damages' => $damages,
            'allocations' => $allocations
        ]);
    }

   public function show($id)
    {
        $farmer = Farmer::with([
            'allocations.allocationType',
            'cropDamages.cropDamageCause',
            'farms.barangay',
            'farms.commodity'
        ])->findOrFail($id);

        $damages = CropDamage::with('cropDamageCause')
            ->where('farmer_id', $id)
            ->get();

        $allocations = Allocation::with('allocationType')
            ->where('farmer_id', $id)
            ->get();

        return response([
            'farmer' => $farmer,
            'damages' => $damages,
            'allocations' => $allocations
        ]);
    }

}
