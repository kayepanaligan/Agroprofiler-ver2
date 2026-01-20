<?php

namespace App\Http\Controllers;

use App\Models\CropDamageCause;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CropDamageCauseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function show()
    {
        $cropDamageCause = CropDamageCause::all();
       return Inertia::render("Super Admin/List/Crop_Damages/CropDamageCauses",
    ['cropDamageCause' => $cropDamageCause]
    );
    }

    public function admin()
    {
       $cropDamageCause = CropDamageCause::all();
       return Inertia::render("Admin/List/Crop_Damages/CropDamageCauses",
    ['cropDamageCause' => $cropDamageCause]
    );
    }

    public function index()
    {
        return response()->json(CropDamageCause::all());
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
            'name' => 'required|string|max:255',
            'desc' => 'required|string|max:255',
        ]);

        CropDamageCause::create($request->all());

        return response()->json(['message' => 'Cause added successfully']);
    }

    /**
     * Display the specified resource.
     */


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CropDamageCause $cropDamageCause)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CropDamageCause $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'required|string|max:255',
        ]);

        $id->update($request->all());

        return response()->json(['message' => 'Cause updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CropDamageCause $id)
    {
        $id->delete();

        return response()->json(['message' => 'Cause deleted successfully']);
    }
}
