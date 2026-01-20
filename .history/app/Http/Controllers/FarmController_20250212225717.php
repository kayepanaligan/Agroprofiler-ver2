<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Farmer;
use App\Models\Barangay;
use App\Models\Commodity;
use Illuminate\Http\Request;

class FarmController extends Controller
{
    // Store a new farm record
    public function store(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'farmer_id' => 'required|exists:farmers,id',
            'brgy_id' => 'required|exists:barangays,id',
            'commodity_id' => 'required|exists:commodities,id',
            'ha' => 'nullable|numeric',
            'name' => 'numeric',
            'owner' => 'required|in:yes,no',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $farm = Farm::create([
            'farmer_id' => $request->farmer_id,
            'brgy_id' => $request->brgy_id,
            'commodity_id' => $request->commodity_id,
            'ha' => $request->ha,
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
        // Find the farm by ID
        $farm = Farm::findOrFail($id);

        // Delete the farm
        $farm->delete();

        return response()->json([
            'message' => 'Farm deleted successfully'
        ]);
    }
}
