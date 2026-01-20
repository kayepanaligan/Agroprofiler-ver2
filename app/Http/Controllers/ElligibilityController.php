<?php

namespace App\Http\Controllers;

use App\Models\Elligibility;
use Illuminate\Http\Request;

class ElligibilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Elligibility::all());
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
    public function show(Elligibility $elligibility)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Elligibility $elligibility)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Elligibility $elligibility)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Elligibility $elligibility)
    {
        //
    }
}