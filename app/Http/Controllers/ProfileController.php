<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */


public function update(ProfileUpdateRequest $request): RedirectResponse
{
    $user = $request->user();

    $validatedData = $request->validated();

    if ($request->hasFile('pfp')) {
        $file = $request->file('pfp');

        $path = $file->store('pfp', 'public');

        if ($user->pfp) {
            // Delete old file - handle both full URL and path formats
            $oldPath = str_replace('/storage/', '', $user->pfp);
            $oldPath = str_replace('storage/', '', $oldPath);
            Storage::disk('public')->delete($oldPath);
        }

        // Store as full URL path for easy display
        $validatedData['pfp'] = '/storage/' . $path;
    }

    $user->fill($validatedData);

    if ($user->isDirty('email')) {
        $user->email_verified_at = null;
    }

    $user->save();
    
    // Refresh the user to get the updated data
    $user->refresh();

    return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
}



    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
