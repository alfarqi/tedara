<?php

namespace App\Http\Controllers\Api\Auth;

use App\Events\UserRegistered;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RegisterController extends Controller
{
    /**
     * Register a new user and automatically provision tenant defaults.
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'store_name' => 'required|string|max:255',
            'store_handle' => 'nullable|string|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate store handle if not provided
        $storeHandle = $request->store_handle ?? Str::slug($request->store_name);
        
        // Ensure store handle is unique
        $originalHandle = $storeHandle;
        $counter = 1;
        while (User::where('store_handle', $storeHandle)->exists()) {
            $storeHandle = $originalHandle . '-' . $counter;
            $counter++;
        }

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'store_owner',
            'status' => 'active',
            'phone' => $request->phone,
            'location' => $request->location,
            'store_handle' => $storeHandle,
            'store_name' => $request->store_name,
        ]);

        // Dispatch UserRegistered event to provision tenant defaults
        event(new UserRegistered($user));

        // Create token for immediate login
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'store_handle' => $user->store_handle,
                'store_name' => $user->store_name,
                'role' => $user->role,
            ],
            'token' => $token,
            'tenant_provisioned' => true,
        ], 201);
    }

    /**
     * Check if store handle is available.
     */
    public function checkStoreHandle(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'store_handle' => 'required|string|max:255|alpha_dash',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'available' => false,
                'message' => 'Invalid store handle format'
            ], 422);
        }

        $storeHandle = $request->store_handle;
        $available = !User::where('store_handle', $storeHandle)->exists();

        return response()->json([
            'available' => $available,
            'message' => $available ? 'Store handle is available' : 'Store handle is already taken'
        ]);
    }
}

