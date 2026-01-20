<?php

namespace App\Http\Controllers;

use App\Models\Identifier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IdentifierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $identifier = Identifier::all();
        return Inertia::render('Super Admin/List/Allocations/FundingList', [
            'identifer' => $identifier
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function showFunding() {
        $identifier = Identifier::all();
        return response()->json($identifier);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $identifier = Identifier::create($request->all());
        return response()->json($identifier);
    }

    /**
     * Display the specified resource.
     */
    public function show(Identifier $identifier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Identifier $identifier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, $id)
    {
        $identifer = Identifier::findOrFail($id);
        $identifer->update($request->all());
        return response()->json($identifer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Identifier $identifier)
    {
        //
    }
}
