<?php

namespace App\Http\Controllers;

use App\Imports\FarmsImport;
use App\Models\Farm;
use App\Models\Farmer;
use App\Models\Barangay;
use App\Models\Commodity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class FarmController extends Controller
{
    public function index()
        {
            $farms = Farm::with(['farmer', 'barangay', 'commodity'])->get();
            return Inertia::render('Super Admin/List/Farmers/Farm', ['farms' => $farms]);
        }

     public function adminIndex()
        {
            $farms = Farm::with(['farmer', 'barangay', 'commodity'])->get();
            return Inertia::render('Super Admin/List/Farmers/Farm', ['farms' => $farms]);
        }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        try {
            Excel::import(new FarmsImport, $request->file('file'));
            return response()->json(['message' => 'Farms imported successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing file: ' . $e->getMessage()], 500);
        }
    }

    public function showData()
    {
        $farms = Farm::with(['farmer', 'barangay', 'commodity'])->get();
        return response()->json($farms);
    }

    public function store(Request $request)
    {
        $request->validate([
            'farmer_id' => 'required|exists:farmers,id',
            'brgy_id' => 'required|exists:barangays,id',
            'commodity_id' => 'required|exists:commodities,id',
            'ha' => 'nullable|numeric',
            'name' => 'required|string',
            'owner' => 'required|in:yes,no',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $farm = Farm::create([
            'farmer_id' => $request->farmer_id,
            'brgy_id' => $request->brgy_id,
            'commodity_id' => $request->commodity_id,
            'ha' => $request->ha,
            'name' => $request->name,
            'owner' => $request->owner,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'message' => 'Farm created successfully',
            'farm' => $farm
        ], 201);
    }


    public function update(Request $request, $id)
    {

        $farm = Farm::findOrFail($id);

        $request->validate([
            'farmer_id' => 'required|exists:farmers,id',
            'brgy_id' => 'required|exists:barangays,id',
            'commodity_id' => 'required|exists:commodities,id',
            'ha' => 'nullable|numeric',
            'owner' => 'required|in:yes,no',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $farm->update([
            'farmer_id' => $request->farmer_id,
            'brgy_id' => $request->brgy_id,
            'commodity_id' => $request->commodity_id,
            'ha' => $request->ha,
            'owner' => $request->owner,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'message' => 'Farm updated successfully',
            'farm' => $farm
        ]);
    }

    // Delete a farm record
    public function destroy($id)
    {
        $farm = Farm::findOrFail($id);

        $farm->delete();

        return response()->json([
            'message' => 'Farm deleted successfully'
        ]);
    }
}
