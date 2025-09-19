<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Store;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StorefrontAddressController extends Controller
{
    /**
     * Display a listing of customer addresses.
     */
    public function index(Request $request): JsonResponse
    {
        $tenantHandle = $request->route('tenantHandle');
        $tenant = Tenant::where('handle', $tenantHandle)->where('status', 'active')->first();
        
        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $store = $tenant->store();
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $customer = $request->user();
        if (!$customer) {
            return response()->json(['message' => 'Authentication required'], 401);
        }

        $addresses = Address::where('customer_id', $customer->id)
            ->where('store_id', $store->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $formattedAddresses = $addresses->map(function ($address) {
            return [
                'id' => $address->id,
                'type' => $address->type,
                'name' => $address->name,
                'address' => $address->address,
                'city' => $address->city,
                'area' => $address->area,
                'building' => $address->building,
                'floor' => $address->floor,
                'apartment' => $address->apartment,
                'latitude' => $address->latitude,
                'longitude' => $address->longitude,
                'is_default' => $address->is_default,
                'full_address' => $address->full_address,
                'coordinates' => $address->coordinates,
                'created_at' => $address->created_at,
            ];
        });

        return response()->json(['addresses' => $formattedAddresses]);
    }

    /**
     * Store a newly created address.
     */
    public function store(Request $request): JsonResponse
    {
        $tenantHandle = $request->route('tenantHandle');
        $tenant = Tenant::where('handle', $tenantHandle)->where('status', 'active')->first();
        
        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $store = $tenant->store();
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $customer = $request->user();
        if (!$customer) {
            return response()->json(['message' => 'Authentication required'], 401);
        }

        $request->validate([
            'type' => ['required', Rule::in(['home', 'work', 'other'])],
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'building' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:255',
            'apartment' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_default' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            // If this is being set as default, unset other default addresses
            if ($request->is_default) {
                Address::where('customer_id', $customer->id)
                    ->where('store_id', $store->id)
                    ->update(['is_default' => false]);
            }

            $address = Address::create([
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'type' => $request->type,
                'name' => $request->name,
                'address' => $request->address,
                'city' => $request->city,
                'area' => $request->area,
                'building' => $request->building,
                'floor' => $request->floor,
                'apartment' => $request->apartment,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'is_default' => $request->is_default ?? false,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Address created successfully',
                'address' => [
                    'id' => $address->id,
                    'type' => $address->type,
                    'name' => $address->name,
                    'address' => $address->address,
                    'city' => $address->city,
                    'area' => $address->area,
                    'building' => $address->building,
                    'floor' => $address->floor,
                    'apartment' => $address->apartment,
                    'latitude' => $address->latitude,
                    'longitude' => $address->longitude,
                    'is_default' => $address->is_default,
                    'full_address' => $address->full_address,
                    'coordinates' => $address->coordinates,
                    'created_at' => $address->created_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create address'], 500);
        }
    }

    /**
     * Display the specified address.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $tenantHandle = $request->route('tenantHandle');
        $tenant = Tenant::where('handle', $tenantHandle)->where('status', 'active')->first();
        
        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $store = $tenant->store();
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $customer = $request->user();
        if (!$customer) {
            return response()->json(['message' => 'Authentication required'], 401);
        }

        $address = Address::where('id', $id)
            ->where('customer_id', $customer->id)
            ->where('store_id', $store->id)
            ->first();

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        return response()->json([
            'address' => [
                'id' => $address->id,
                'type' => $address->type,
                'name' => $address->name,
                'address' => $address->address,
                'city' => $address->city,
                'area' => $address->area,
                'building' => $address->building,
                'floor' => $address->floor,
                'apartment' => $address->apartment,
                'latitude' => $address->latitude,
                'longitude' => $address->longitude,
                'is_default' => $address->is_default,
                'full_address' => $address->full_address,
                'coordinates' => $address->coordinates,
                'created_at' => $address->created_at,
            ]
        ]);
    }

    /**
     * Update the specified address.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $tenantHandle = $request->route('tenantHandle');
        $tenant = Tenant::where('handle', $tenantHandle)->where('status', 'active')->first();
        
        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $store = $tenant->store();
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $customer = $request->user();
        if (!$customer) {
            return response()->json(['message' => 'Authentication required'], 401);
        }

        $address = Address::where('id', $id)
            ->where('customer_id', $customer->id)
            ->where('store_id', $store->id)
            ->first();

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $request->validate([
            'type' => ['sometimes', Rule::in(['home', 'work', 'other'])],
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string|max:255',
            'area' => 'sometimes|string|max:255',
            'building' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:255',
            'apartment' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_default' => 'sometimes|boolean',
        ]);

        try {
            DB::beginTransaction();

            // If this is being set as default, unset other default addresses
            if ($request->has('is_default') && $request->is_default) {
                Address::where('customer_id', $customer->id)
                    ->where('store_id', $store->id)
                    ->where('id', '!=', $id)
                    ->update(['is_default' => false]);
            }

            $address->update($request->only([
                'type', 'name', 'address', 'city', 'area', 
                'building', 'floor', 'apartment', 'latitude', 
                'longitude', 'is_default'
            ]));

            DB::commit();

            return response()->json([
                'message' => 'Address updated successfully',
                'address' => [
                    'id' => $address->id,
                    'type' => $address->type,
                    'name' => $address->name,
                    'address' => $address->address,
                    'city' => $address->city,
                    'area' => $address->area,
                    'building' => $address->building,
                    'floor' => $address->floor,
                    'apartment' => $address->apartment,
                    'latitude' => $address->latitude,
                    'longitude' => $address->longitude,
                    'is_default' => $address->is_default,
                    'full_address' => $address->full_address,
                    'coordinates' => $address->coordinates,
                    'created_at' => $address->created_at,
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update address'], 500);
        }
    }

    /**
     * Remove the specified address.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $tenantHandle = $request->route('tenantHandle');
        $tenant = Tenant::where('handle', $tenantHandle)->where('status', 'active')->first();
        
        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $store = $tenant->store();
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $customer = $request->user();
        if (!$customer) {
            return response()->json(['message' => 'Authentication required'], 401);
        }

        $address = Address::where('id', $id)
            ->where('customer_id', $customer->id)
            ->where('store_id', $store->id)
            ->first();

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        try {
            $address->delete();
            return response()->json(['message' => 'Address deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete address'], 500);
        }
    }

    /**
     * Set an address as default.
     */
    public function setDefault(Request $request, string $id): JsonResponse
    {
        $tenantHandle = $request->route('tenantHandle');
        $tenant = Tenant::where('handle', $tenantHandle)->where('status', 'active')->first();
        
        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $store = $tenant->store();
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $customer = $request->user();
        if (!$customer) {
            return response()->json(['message' => 'Authentication required'], 401);
        }

        $address = Address::where('id', $id)
            ->where('customer_id', $customer->id)
            ->where('store_id', $store->id)
            ->first();

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        try {
            DB::beginTransaction();

            // Unset all other default addresses
            Address::where('customer_id', $customer->id)
                ->where('store_id', $store->id)
                ->update(['is_default' => false]);

            // Set this address as default
            $address->update(['is_default' => true]);

            DB::commit();

            return response()->json(['message' => 'Default address updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update default address'], 500);
        }
    }
}