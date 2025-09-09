<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user login.
     */
    public function login(Request $request): JsonResponse
    {
        // Rate limiting
        $throttleKey = 'login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'message' => 'Too many login attempts. Please try again in ' . $seconds . ' seconds.',
            ], 429);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Attempt authentication
        $credentials = $request->only('email', 'password');
        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            RateLimiter::hit($throttleKey, 300); // 5 minutes lockout
            
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Clear rate limiting on successful login
        RateLimiter::clear($throttleKey);

        $user = Auth::user();

        // Check if user is active
        if (!$user->isActive()) {
            Auth::logout();
            return response()->json([
                'message' => 'Account is not active. Please contact support.',
            ], 403);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Check if password change is required
        $forcePasswordChange = $user->force_password_change;

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'phone' => $user->phone,
                'location' => $user->location,
                'avatar' => $user->avatar,
                'force_password_change' => $forcePasswordChange,
                'email_verified_at' => $user->email_verified_at,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Handle user registration.
     */
    public function register(Request $request): JsonResponse
    {
        // Rate limiting
        $throttleKey = 'register:' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'message' => 'Too many registration attempts. Please try again in ' . $seconds . ' seconds.',
            ], 429);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
            'location' => 'nullable|string|max:100',
            'role' => 'nullable|in:customer,store_owner',
            // Store registration fields (optional - will be filled during onboarding)
            'store_name' => 'nullable|string|max:255',
            'store_domain' => 'nullable|string|max:255|unique:stores,domain',
            'store_description' => 'nullable|string|max:1000',
            'store_currency' => 'nullable|string|max:10',
            'store_language' => 'nullable|string|max:10',
            'store_timezone' => 'nullable|string|max:50',
        ], [
            'phone.regex' => 'Please enter a valid phone number (minimum 8 digits, can include country code)',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($throttleKey, 300);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create user
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'location' => $request->location,
                'role' => $request->role ?? 'store_owner',
                'status' => 'active',
                'email_verified_at' => now(), // Auto-verify for now
            ];

            $user = User::create($userData);

            // If registering as store owner with store information, create store
            // Otherwise, store will be created during onboarding process
            if ($request->role === 'store_owner' && $request->store_name && $request->store_domain) {
                $storeData = [
                    'name' => $request->store_name,
                    'domain' => $request->store_domain,
                    'owner_id' => $user->id,
                    'status' => 'active',
                    'description' => $request->store_description,
                    'currency' => $request->store_currency ?? 'SAR',
                    'language' => $request->store_language ?? 'ar',
                    'timezone' => $request->store_timezone ?? 'Asia/Riyadh',
                    'settings' => [
                        'maintenance_mode' => false,
                        'auto_backup' => true,
                        'email_notifications' => true,
                        'sms_notifications' => false,
                    ],
                ];

                $store = Store::create($storeData);
            }

            DB::commit();

            // Clear rate limiting on successful registration
            RateLimiter::clear($throttleKey);

            // Create token for immediate login
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Registration successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'phone' => $user->phone,
                    'location' => $user->location,
                    'force_password_change' => false,
                    'email_verified_at' => $user->email_verified_at,
                ],
                'store' => isset($store) ? [
                    'id' => $store->id,
                    'name' => $store->name,
                    'domain' => $store->domain,
                    'status' => $store->status,
                ] : null,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            RateLimiter::hit($throttleKey, 300);
            
            return response()->json([
                'message' => 'Registration failed. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle store registration for existing users.
     */
    public function registerStore(Request $request): JsonResponse
    {
        $user = $request->user();

        // Only allow store owners to register stores
        if (!$user->isStoreOwner()) {
            return response()->json([
                'message' => 'Only store owners can register stores.',
            ], 403);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:stores,domain',
            'description' => 'nullable|string|max:1000',
            'currency' => 'nullable|string|max:10',
            'language' => 'nullable|string|max:10',
            'timezone' => 'nullable|string|max:50',
            'logo' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $storeData = [
                'name' => $request->name,
                'domain' => $request->domain,
                'owner_id' => $user->id,
                'status' => 'active',
                'description' => $request->description,
                'currency' => $request->currency ?? 'SAR',
                'language' => $request->language ?? 'ar',
                'timezone' => $request->timezone ?? 'Asia/Riyadh',
                'logo' => $request->logo,
                'settings' => [
                    'maintenance_mode' => false,
                    'auto_backup' => true,
                    'email_notifications' => true,
                    'sms_notifications' => false,
                ],
            ];

            $store = Store::create($storeData);

            DB::commit();

            return response()->json([
                'message' => 'Store registered successfully',
                'store' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'domain' => $store->domain,
                    'status' => $store->status,
                    'description' => $store->description,
                    'currency' => $store->currency,
                    'language' => $store->language,
                    'timezone' => $store->timezone,
                    'logo' => $store->logo,
                    'created_at' => $store->created_at,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Store registration failed. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get authenticated user information.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'phone' => $user->phone,
                'location' => $user->location,
                'avatar' => $user->avatar,
                'force_password_change' => $user->force_password_change,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    /**
     * Change password.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
            'new_password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        // Check current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 400);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password),
            'force_password_change' => false,
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
        ]);
    }

    /**
     * Refresh user token.
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Revoke current token
        $request->user()->currentAccessToken()->delete();
        
        // Create new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Token refreshed successfully',
            'token' => $token,
        ]);
    }
}
