<?php

namespace App\Http\Controllers;

use App\Models\Commodity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCommodityController extends Controller
{
    /**
     * Display a listing of the commodities.
     */
    public function index(Request $request)
    {
        $commodity = Commodity::with('category')->get();

        return Inertia::render("Super Admin/List/Commodities/Subcategory/Commodity_Sub", [
            'commodity' => $commodity,
        ]);
    }

    public function admin(Request $request)
    {
        $commodity = Commodity::with('category')->get();

        return Inertia::render("Admin/List/Commodities/Subcategory/Commodity_Sub", [
            'commodity' => $commodity,
        ]);
    }

    public function show()
    {
         return response()->json(Commodity::with('category')->get());
    }

    /**
     * Store a newly created commodity in storage.
     */
   public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'required|string',
            'commodity_category_id' => 'required|exists:commodity_categories,id',
        ]);

        $commodity = new Commodity();
        $commodity->name = $request->input('name');
        $commodity->desc = $request->input('desc');
        $commodity->commodity_category_id = $request->input('commodity_category_id');

        $commodity->save();

        return response()->json(['message' => 'Commodity saved successfully', 'commodity' => $commodity], 200);
    }

    /**
     * Update the specified commodity in storage.
     */
    public function update(Request $request, Commodity $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'commodity_category_id' => 'required|exists:commodity_categories,id',
        ]);

        $id->update($validatedData);

        return redirect()->back()->with('message', 'Commodity updated successfully');
    }

    /**
     * Remove the specified commodity from storage.
     */
    public function destroy(Commodity $id)
    {
        $id->delete();

        return redirect()->back()->with('message', 'Commodity deleted successfully');
    }
}
