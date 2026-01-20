<?php

namespace App\Http\Controllers;

use App\Models\Funding;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FundingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Super Admin/List/Farmers/FarmProfile/FarmProfile', [

    ]);
        return response()->json(Funding::all());
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
        $funding = Funding::create($request->all());
        return response()->json($funding);
    }

    /**
     * Display the specified resource.
     */
    public function show(Funding $funding)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Funding $funding)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $funding = Funding::findOrFail($id);
        $funding->update($request->all());
        return response()->json($funding);
    }

    /**
     * Remove the specified resource from storage.
     */
      public function destroy($id)
    {
        Funding::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
