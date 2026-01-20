<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index(){

        $farm = Farm::all();
        return Inertia::render('Controllers/MapController', [
            'farm' => $farm,
        ]);
    }
}