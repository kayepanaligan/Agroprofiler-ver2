<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'pfp' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'sex' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'section' => 'nullable|string|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $pfpUrl = null;

       if ($request->hasFile('pfp')) {
            $file = $request->file('pfp');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/pfp', $filename);
            $pfpUrl = asset("/storage/pfp/{$filename}");
        }

        $user = User::create([
            'pfp' => $pfpUrl,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'section' => $request->section,
            'sex' => $request->sex,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if (!$user) {
            Log::error('User creation failed', [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'email' => $request->email,
            ]);
            return redirect()->back()->withErrors(['register' => 'User registration failed.']);
        }

        Auth::login($user);

        return redirect()->route('dashboard')->with('success', 'Registered successfully.');
    }
}
