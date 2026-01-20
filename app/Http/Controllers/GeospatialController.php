<?php

namespace App\Http\Controllers;

use App\Models\Geospatial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GeospatialController extends Controller
{
    /**
     * Display a listing of the resource.
     */ 
    public function index()
    {
        return Inertia::render('Super Admin/Reports/Geospatial');
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Geospatial $geospatial)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Geospatial $geospatial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Geospatial $geospatial)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Geospatial $geospatial)
    {
        //
    }
}