<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CustomerAuthController extends Controller
{
    /**
     * Handle customer login for storefront.
     */
    public function login(Request $request): JsonResponse
    {
        // Rate limiting
        $throttleKey = 'customer-login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'message' => 'Too many login attempts. Please try again in ' . $seconds . ' seconds.',
            ], 429);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'store_id' => 'required|integer|exists:stores,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Find customer by email and store
        $customer = Customer::where('email', $request->email)
            ->where('store_id', $request->store_id)
            ->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {
            RateLimiter::hit($throttleKey, 300); // 5 minutes lockout
            
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Check if customer is active
        if (!$customer->isActive()) {
            return response()->json([
                'message' => 'Account is not active. Please contact support.',
            ], 403);
        }

        // Clear rate limiting on successful login
        RateLimiter::clear($throttleKey);

        // Create token (using Sanctum for customers)
        $token = $customer->createToken('customer-auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'store_id' => $customer->store_id,
                'status' => $customer->status,
                'total_orders' => $customer->total_orders,
                'total_spent' => $customer->total_spent,
                'join_date' => $customer->join_date,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Handle customer registration for storefront.
     */
    public function register(Request $request): JsonResponse
    {
        // Rate limiting
        $throttleKey = 'customer-register:' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'message' => 'Too many registration attempts. Please try again in ' . $seconds . ' seconds.',
            ], 429);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:customers,email,NULL,id,store_id,' . $request->store_id,
            'phone' => 'nullable|string|max:20|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'password' => 'required|string|min:6',
            'password_confirmation' => 'nullable|string',
            'store_id' => 'required|integer|exists:stores,id',
        ], [
            'phone.regex' => 'Please enter a valid phone number (minimum 8 digits, can include country code)',
            'email.unique' => 'This email is already registered for this store.',
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

            // Create customer
            $customerData = [
                'name' => $request->name ?: explode('@', $request->email)[0], // Use email prefix as default name
                'email' => $request->email,
                'phone' => $request->phone ?: '', // Empty phone if not provided
                'password' => Hash::make($request->password),
                'store_id' => $request->store_id,
                'status' => 'active',
                'total_orders' => 0,
                'total_spent' => 0.00,
                'join_date' => now(),
            ];

            $customer = Customer::create($customerData);

            DB::commit();

            // Clear rate limiting on successful registration
            RateLimiter::clear($throttleKey);

            // Create token for immediate login
            $token = $customer->createToken('customer-auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Registration successful',
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'store_id' => $customer->store_id,
                    'status' => $customer->status,
                    'total_orders' => $customer->total_orders,
                    'total_spent' => $customer->total_spent,
                    'join_date' => $customer->join_date,
                ],
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
     * Handle customer logout.
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
     * Get authenticated customer information.
     */
    public function me(Request $request): JsonResponse
    {
        $customer = $request->user();

        return response()->json([
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'store_id' => $customer->store_id,
                'status' => $customer->status,
                'total_orders' => $customer->total_orders,
                'total_spent' => $customer->total_spent,
                'join_date' => $customer->join_date,
                'created_at' => $customer->created_at,
                'updated_at' => $customer->updated_at,
            ],
        ]);
    }

    /**
     * Create guest customer for checkout.
     */
    public function createGuest(Request $request): JsonResponse
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'store_id' => 'required|integer|exists:stores,id',
        ], [
            'phone.regex' => 'Please enter a valid phone number (minimum 8 digits, can include country code)',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Check if customer already exists for this store
            $existingCustomer = Customer::where('email', $request->email)
                ->where('store_id', $request->store_id)
                ->first();

            if ($existingCustomer) {
                // Return existing customer info (don't create duplicate)
                return response()->json([
                    'message' => 'Customer found',
                    'customer' => [
                        'id' => $existingCustomer->id,
                        'name' => $existingCustomer->name,
                        'email' => $existingCustomer->email,
                        'phone' => $existingCustomer->phone,
                        'store_id' => $existingCustomer->store_id,
                        'status' => $existingCustomer->status,
                        'total_orders' => $existingCustomer->total_orders,
                        'total_spent' => $existingCustomer->total_spent,
                        'join_date' => $existingCustomer->join_date,
                    ],
                    'is_existing' => true,
                ]);
            }

            // Create guest customer (no password)
            $customerData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'store_id' => $request->store_id,
                'status' => 'active',
                'total_orders' => 0,
                'total_spent' => 0.00,
                'join_date' => now(),
            ];

            $customer = Customer::create($customerData);

            return response()->json([
                'message' => 'Guest customer created successfully',
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'store_id' => $customer->store_id,
                    'status' => $customer->status,
                    'total_orders' => $customer->total_orders,
                    'total_spent' => $customer->total_spent,
                    'join_date' => $customer->join_date,
                ],
                'is_existing' => false,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create guest customer. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
