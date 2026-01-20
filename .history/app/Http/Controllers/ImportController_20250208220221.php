<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ImportController extends Controller
{
      public function import(Request $request)
        {
            $request->validate([
                'file' => 'required|mimes:xlsx,csv|max:2048',
            ]);

            Excel::import(new FarmersImport, $request->file('file'));

            return response()->json(['message' => 'Data imported successfully']);
        }
}
