<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeocodeController extends Controller
{
    public function geocode(Request $request)
    {
        $address = $request->input('address') . ', Digos City, Philippines';
        $apiKey = env('GOOGLE_GEOCODING_API_KEY');
        
        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $address,
            'key' => $apiKey
        ]);

        if ($response->ok() && isset($response['results'][0]['geometry']['location'])) {
            return response()->json($response['results'][0]['geometry']['location']);
        }

        return response()->json(['error' => 'Address not found'], 404);
    }
}