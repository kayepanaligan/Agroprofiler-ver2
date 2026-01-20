<?php

namespace App\Http\Controllers;

use App\Models\CommodityCategory;
use App\Models\rc;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommodityCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $commodity = CommodityCategory::all();

        return Inertia::render("Super Admin/List/Commodities/Commodities", [
            'commodity' => $commodity,
        ]);
    }

     public function admin()
    {
         $commodity = CommodityCategory::all();

        return Inertia::render("Admin/List/Commodities/Commodities", [
            'commodity' => $commodity,
        ]);
    }

    public function show()
    {

        return response()->json(CommodityCategory::all());
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

        CommodityCategory::create($request->all());

        return response()->json(['message' => 'Commodity added successfully']);
    }


    public function update(Request $request, CommodityCategory $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'required|string|max:255',
        ]);

        $id->update($request->all());

        return response()->json(['message' => 'Commodity updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CommodityCategory $id)
    {
        $id->delete();

        return response()->json(['message' => 'Commodity deleted successfully']);
    }
}
