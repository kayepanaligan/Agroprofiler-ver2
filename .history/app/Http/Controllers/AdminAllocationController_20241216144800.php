<?php

namespace App\Http\Controllers;

use App\Models\Allocation;
use App\Models\AllocationType;
use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\Farmer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAllocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allocations = Allocation::with(['farmer', 'commodity', 'barangay', 'allocationType'])->paginate(20);
            $commodity = Commodity::all();
            $barangay = Barangay::all();
            $farmer = Farmer::all();
            $allocationType = AllocationType::all();

        return Inertia::render('Admin/List/Allocations/AllocationList', [
            'allocation' => $allocations,
            'commodities' => $commodity,
            'barangays' => $barangay,
            'farmers' => $farmer,
            'allocationType' => $allocationType
        ]);
    }

    public function admin()
    {
        $allocations = Allocation::with(['farmer', 'commodity', 'barangay', 'allocationType'])->paginate(20);
            $commodity = Commodity::all();
            $barangay = Barangay::all();
            $farmer = Farmer::all();
            $allocationType = AllocationType::all();

        return Inertia::render('Admin/List/Allocations/AllocationList', [
            'allocation' => $allocations,
            'commodities' => $commodity,
            'barangays' => $barangay,
            'farmers' => $farmer,
            'allocationType' => $allocationType
        ]);
    }

    public function showAllocations(){
        $allocations = Allocation::with(['farmer', 'commodity', 'barangay', 'allocationType'])->get();
        $commodity = Commodity::all();
        $barangay = Barangay::all();
        $farmer = Farmer::all();

        return response($allocations);
    }

    public function showBarangays(){
        $barangays = Barangay::all();
        return response($barangays);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
        'allocation_type_id' => 'required|exists:allocation_types,id',
        'farmer_id' => 'required|exists:farmers,id',
        'received' => 'required|in:yes,no',
        'brgy_id' => 'required|exists:barangays,id',
        'commodity_id' => 'required|exists:commodities,id',
        'date_received' => 'nullable|date',
    ]);

    $allocation = new Allocation();
    $allocation->allocation_type_id = $request->allocation_type_id;  // updated field
    $allocation->farmer_id = $request->farmer_id;
    $allocation->received = $request->received;
    $allocation->brgy_id = $request->brgy_id;
    $allocation->commodity_id = $request->commodity_id;
    $allocation->date_received = $request->date_received;

    $allocation->save();



      return redirect()->back()->with('success', 'Allocation added successfully');

    }

    /**
     * Display the specified resource.
     */
    public function show(Allocation $allocation)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Allocation $allocation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $allocation = Allocation::findOrFail($id);

        $request->validate([
            'allocation_type_id' => 'required|exists:allocation_types,id',
            'farmer_id' => 'required|exists:farmers,id',
            'received' => 'required|in:yes,no',
            'brgy_id' => 'required|exists:barangays,id',
            'commodity_id' => 'required|exists:commodities,id',
            'date_received' => 'nullable|date',
        ]);

        $allocation->allocation_type_id = $request->allocation_type_id;
        $allocation->farmer_id = $request->farmer_id;
        $allocation->received = $request->received;
        $allocation->brgy_id = $request->brgy_id;
        $allocation->commodity_id = $request->commodity_id;
        $allocation->date_received = $request->date_received;

        // Save the changes to the database
        $allocation->save();

        // Redirect with success message
       return redirect()->back()->with('success', 'Allocation updated successfully');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $allocation = Allocation::find($id);
        if ($allocation) {
            $allocation->delete();
            return redirect()->route('allocations.index')->with('success', 'Allocation deleted successfully');
        }
        return response()->json(['message' => 'allocation not found'], 404);
    }
}
