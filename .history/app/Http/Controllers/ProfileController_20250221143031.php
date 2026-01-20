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

    // Get validated data
    $validatedData = $request->validated();

    // Handle profile picture upload
    if ($request->hasFile('pfp')) {
        $file = $request->file('pfp');

        // Store in 'public/pfp' and get the path
        $path = $file->store('pfp', 'public');

        // Delete old profile picture if it exists
        if ($user->pfp) {
            Storage::disk('public')->delete($user->pfp);
        }

        // Update the validated data with new profile picture path
        $validatedData['pfp'] = $path;
    }

    // Update user with validated data
    $user->fill($validatedData);

    // Reset email verification if email is changed
    if ($user->isDirty('email')) {
        $user->email_verified_at = null;
    }

    $user->save();

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
