<?php

namespace App\Http\Controllers;

use App\Models\CropActivity;
use App\Models\Images;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // Import Storage for local file handling
use Inertia\Inertia;

class ImagesController extends Controller
{
    /**
     * Display a listing of images for a specific crop activity.
     */
    public function index($id)
    {
        $activityExists = CropActivity::find($id);
        if (!$activityExists) {
            return Inertia::render('Error', [
                'error' => 'Crop activity not found'
            ]);
        }

        $images = Images::where('crop_activity_id', $id)->get();

        return Inertia::render('Images', [
            'images' => $images,
            'cropActivityId' => $id,

        ]);
    }

    public function admin($id)
    {
        $activityExists = CropActivity::find($id);
        if (!$activityExists) {
            return Inertia::render('Error', [
                'error' => 'Crop activity not found'
            ]);
        }

        $images = Images::where('crop_activity_id', $id)->get();

        return Inertia::render('Images', [
            'images' => $images,
            'cropActivityId' => $id,

        ]);
    }


    public function images($id)
    {

        $activity = CropActivity::find($id);


        if (!$activity) {
            return redirect()->route('cropactivities.index')->with('error', 'Crop activity not found.');
        }

        $images = Images::where('crop_activity_id', $id)->get();

        return Inertia::render('Super Admin/List/Crop_Activity/Images', [
            'images' => $images,
            'cropActivityId' => $id
        ]);
    }

     public function adminImages($id)
    {

        $activity = CropActivity::find($id);


        if (!$activity) {
            return redirect()->route('cropactivities.index')->with('error', 'Crop activity not found.');
        }

        $images = Images::where('crop_activity_id', $id)->get();

        return Inertia::render('Super Admin/List/Crop_Activity/Images', [
            'images' => $images,
            'cropActivityId' => $id
        ]);
    }



    /**
     * Store a newly created image in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'crop_activity_id' => 'required|integer',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('activity', 'public');

            $newImage = Images::create([
                'title' => $request->title,
                'desc' => $request->desc,
                'file_path' => '/storage/' . $path,
                'crop_activity_id' => $request->crop_activity_id,
            ]);

            return response()->json(['image' => $newImage], 201);
        }

        // Ensure a consistent JSON error response if upload fails
        return response()->json(['error' => 'Image upload failed'], 500);
    }

    /**
     * Display a specific image.
     */
    public function show($id)
    {
        $image = Images::findOrFail($id);
        return response()->json($image);
    }

    /**
     * Update an existing image.
     */
    public function update(Request $request, $id)
    {
        $image = Images::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'desc' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Check if there's a new file to upload
        if ($request->hasFile('image')) {
            $oldFilePath = $image->file_path; // Get the old file path
            Storage::disk('public')->delete($oldFilePath); // Delete the old file

            $file = $request->file('image');
            $filePath = 'activity/' . uniqid() . '.' . $file->getClientOriginalExtension();
            // Store the new image
            Storage::disk('public')->put($filePath, file_get_contents($file->getPathname()));

            $image->file_path = Storage::url($filePath); // Use the full URL for the file
        }

        // Update other fields like title and description
        $image->title = $request->title ?? $image->title;
        $image->desc = $request->desc ?? $image->desc;
        $image->save();

        return response()->json(['success' => 'Image updated successfully', 'image' => $image], 200);
    }

    /**
     * Remove the specified image from storage.
     */
    public function destroy($id)
    {
        $image = Images::findOrFail($id);

        // Ensure to use the file_path to delete the correct file
        $oldFilePath = $image->file_path; // Update this line
        Storage::disk('public')->delete($oldFilePath);

        $image->delete();

        return response()->json(['success' => 'Image deleted successfully'], 200);
    }

}
