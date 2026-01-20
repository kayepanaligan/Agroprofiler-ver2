<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DSSController extends Controller
{

    public function index(){
        return Inertia::render('Super Admin/Reports/Recommendations');
    }

//     public function getBarangayPriorities()
// {
//     // Fetch barangays with aggregated scores based on your criteria
//     return Barangay::with(['farmerProfiles' => function ($query) {
//         $query->select('barangay_id')
//             ->selectRaw('SUM(pwd_count) as total_pwd')
//             ->selectRaw('SUM(4ps_beneficiaries) as total_4ps')
//             ->selectRaw('SUM(low_income_households) as total_low_income')
//             ->selectRaw('SUM(crop_damage_affected) as total_crop_damage')
//             ->groupBy('barangay_id');
//     }])
//     ->get()
//     ->map(function ($barangay) {
//         $scores = [
//             'pwd_weight' => $barangay->farmerProfiles->total_pwd * 0.25,  // Adjust weight
//             '4ps_weight' => $barangay->farmerProfiles->total_4ps * 0.25,
//             'low_income_weight' => $barangay->farmerProfiles->total_low_income * 0.25,
//             'crop_damage_weight' => $barangay->farmerProfiles->total_crop_damage * 0.25,
//         ];
//         $barangay->priority_score = array_sum($scores);
//         return $barangay;
//     })
//     ->sortByDesc('priority_score');
// }

}