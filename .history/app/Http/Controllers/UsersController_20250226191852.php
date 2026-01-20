<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::paginate(10);

    return Inertia::render("Super Admin/List/Users/UsersList", [
        'users' => $users,

        'total' => $users->total(),
    ]);
    }

    public function showUsers()
    {
        $users = User::all();

    // return Inertia::render("Super Admin/List/Users/UsersList", [
    //     'users' => $users,

    //     'total' => $users->total(),
    // ]);
    return response($users);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Super Admin/List/Users/CreateUser");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pfp' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'sex' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // $pfpPath = $request->file('pfp')->store('pfp', 'public');
        // $pfpUrl = asset("storage/{$pfpPath}");

        if ($request->hasFile('pfp')) {
            $file = $request->file('pfp');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('pfp'), $filename);
            $pfpUrl = asset("pfp/{$filename}");
        }

        User::create([
            'pfp' => $pfpUrl,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'role' => $request->role,
            'section' => $request->section,
            'sex' => $request->sex,
            'status' => $request->status,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render("Super Admin/List/Users/UserDetail", [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render("Super Admin/List/Users/EditUser", [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
        public function update(Request $request, $id)
            {
                $user = User::findOrFail($id);

                $request->validate([
                    'pfp' => 'nullable|string',
                    'firstname' => 'required|string|max:255',
                    'lastname' => 'required|string|max:255',
                    'role' => 'required|string|max:255',
                    'status' => 'required|string|max:255',
                    'section' => 'nullable|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                    'password'  => 'nullable|string|min:8'
                ]);

                if ($request->hasFile('pfp')) {
                    $fileName = time() . '.' . $request->pfp->extension();
                    $path = $request->pfp->move(public_path('pfp'), $fileName);

                    $user->pfp = '/storage/pfp/' . $fileName;
                }


                // Update other user fields

                $user->firstname = $request->firstname;
                $user->lastname = $request->lastname;
                $user->role = $request->role;
                $user->status = $request->status;
                $user->section = $request->section;
                $user->email = $request->email;

                // Update password if provided
                if ($request->password) {
                    $user->password = bcrypt($request->password);
                }

                $user->save();

                return redirect()->route('users.index')->with('success', 'User updated successfully.');
        }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $users = User::find($id);
        if ($users) {
            $users->delete();
            return redirect()->route('users.index')->with('success', 'users updated successfully');
        }
        return response()->json(['message' => 'users not found'], 404);
    }
}
