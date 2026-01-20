<?php

namespace App\Http\Controllers;

use App\Models\CropActivity;
use App\Models\Images;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CropActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cropActivities = CropActivity::all()->toArray();

        return Inertia::render('Super Admin/List/Crop_Activity/CropActivityFolder', [
            'initialFolders' => $cropActivities,
        ]);
    }

     public function showIndex(Request $request)
    {
        $cropActivities = CropActivity::all()->toArray();

        return Inertia::render('Admin/List/Crop_Activity/CropActivityFolder', [
            'initialFolders' => $cropActivities,
        ]);
    }

    public function images($id)
    {

        $activityExists = CropActivity::find($id);
        if (!$activityExists) {
            return redirect()->route('dashboard')->with('error', 'Crop activity not found');
        }

        $images = Images::where('crop_activity_id', $id)->get();

        return Inertia::render('Super Admin/List/Crop_Activity/Images', [
            'images' => $images,
            'cropActivityId' => $id,
        ]);
    }

    public function admin($id)
    {

        $activityExists = CropActivity::find($id);
        if (!$activityExists) {
            return redirect()->route('admin.dashboard')->with('error', 'Crop activity not found');
        }

        $images = Images::where('crop_activity_id', $id)->get();

        return Inertia::render('Admin/List/Crop_Activity/Images', [
            'images' => $images,
            'cropActivityId' => $id,
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */


public function store(Request $request)
{
    $request->validate([
        'farmer_id' => 'required|exists:farmers,id',
        'title' => 'required|string|max:255',
        'desc' => 'nullable|string',
        'file_path' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        'date' => 'nullable|date',
    ]);

    $filePath = null;
    if ($request->hasFile('file_path')) {
        // Store the file and generate the relative path
        $filePath = $request->file('file_path')->store('crop_activities', 'public');
        // Generate the full URL for the file path
        $filePath = Storage::url($filePath);
    }

    // Use raw DB query to insert data into the crop_activities table
    DB::table('crop_activities')->insert([
        'farmer_id' => $request->farmer_id,
        'title' => $request->title,
        'desc' => $request->desc,
        'file_path' => $filePath,  // Save the URL path for the file
        'date' => $request->date,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json(['message' => 'Crop activity added successfully'], 201);
}




    /**
     * Update the specified resource in storage.
     */
  public function update(Request $request, $id)
{
    // Validate the incoming request
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'desc' => 'nullable|string',
        'file_path' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        'date' => 'nullable|date',
    ]);

    // Retrieve the existing crop activity using raw SQL
    $cropActivity = DB::table('crop_activities')->where('id', $id)->first();

    if (!$cropActivity) {
        return response()->json(['message' => 'Crop activity not found!'], 404);
    }

    // Handle file upload
    if ($request->hasFile('file_path')) {
        // Delete old file if it exists
        if ($cropActivity->file_path && Storage::exists(str_replace('/storage/', 'public/', $cropActivity->file_path))) {
            Storage::delete(str_replace('/storage/', 'public/', $cropActivity->file_path));
        }

        // Store new file
        $filePath = $request->file('file_path')->store('crop_activities', 'public');
        $validated['file_path'] = '/storage/activity' . $filePath;
    } else {
        $validated['file_path'] = $cropActivity->file_path;
    }

    // Use DB query builder to update the record
    DB::table('crop_activities')
        ->where('id', $id)
        ->update([
            'title' => $validated['title'],
            'desc' => $validated['desc'],
            'file_path' => $validated['file_path'],
            'date' => $validated['date'],
            'updated_at' => now(),
        ]);

    // Fetch updated record to return in response
    $updatedCropActivity = DB::table('crop_activities')->where('id', $id)->first();

    return response()->json([
        'message' => 'Crop activity updated successfully!',
        'data' => $updatedCropActivity
    ], 200);
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cropActivity = CropActivity::find($id);
        if ($cropActivity) {
            $cropActivity->delete();
           return redirect()->back()->with('success', 'Data Deleted successfully');
        }

        return redirect()->back()->with('success', 'Data Deleted successfully');

    }

    public function adminDestroy($id)
    {
        $cropActivity = CropActivity::find($id);
        if ($cropActivity) {
            $cropActivity->delete();
           return redirect()->back()->with('success', 'Data Deleted successfully');
        }

        return redirect()->back()->with('success', 'Data Deleted successfully');

    }
}
