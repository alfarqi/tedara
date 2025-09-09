<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\Store\StoreStoreRequest;
use App\Http\Requests\Api\Store\UpdateStoreRequest;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoreController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Store::class);

        $query = Store::with(['owner']);

        // Apply user-specific filtering
        if ($request->user()->isStoreOwner()) {
            $query->where('owner_id', $request->user()->id);
        }

        // Apply filters
        $query = $this->applyFilters($query, $request);

        // Apply sorting
        $query = $this->applySorting($query, $request);

        // Apply date range
        $query = $this->applyDateRange($query, $request);

        // Paginate results
        $perPage = $request->get('per_page', 15);
        $perPage = min($perPage, 100); // Limit to 100 per page

        $stores = $query->paginate($perPage);

        return $this->paginatedResponse($stores, 'Stores retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStoreRequest $request): JsonResponse
    {
        $this->authorize('create', Store::class);

        try {
            DB::beginTransaction();

            $data = $request->validated();

            // Add owner_id based on authenticated user
            if ($request->user()->isStoreOwner()) {
                $data['owner_id'] = $request->user()->id;
            }

            $store = Store::create($data);

            DB::commit();

            return $this->createdResponse($store->load(['owner']), 'Store created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to create store: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        return $this->successResponse(
            $store->load(['owner']),
            'Store retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStoreRequest $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        try {
            DB::beginTransaction();

            $data = $request->validated();
            $store->update($data);

            DB::commit();

            return $this->successResponse(
                $store->load(['owner']),
                'Store updated successfully'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to update store: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store): JsonResponse
    {
        $this->authorize('delete', $store);

        try {
            DB::beginTransaction();

            $store->delete();

            DB::commit();

            return $this->noContentResponse('Store deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to delete store: ' . $e->getMessage());
        }
    }

    /**
     * Get store statistics.
     */
    public function statistics(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        $statistics = [
            'total_products' => $store->products()->count(),
            'total_orders' => $store->orders()->count(),
            'total_customers' => $store->customers()->count(),
            'total_revenue' => $store->orders()->where('status', 'completed')->sum('total_amount'),
            'pending_orders' => $store->orders()->where('status', 'pending')->count(),
            'low_stock_products' => $store->products()->where('stock', '<', 10)->count(),
        ];

        return $this->successResponse($statistics, 'Store statistics retrieved successfully');
    }

    /**
     * Get store settings.
     */
    public function settings(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        return $this->successResponse(
            $store->settings,
            'Store settings retrieved successfully'
        );
    }

    /**
     * Update store settings.
     */
    public function updateSettings(Request $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $validator = $request->validate([
            'settings' => 'required|array',
            'settings.maintenance_mode' => 'boolean',
            'settings.auto_backup' => 'boolean',
            'settings.email_notifications' => 'boolean',
            'settings.sms_notifications' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            $store->update(['settings' => $validator['settings']]);

            DB::commit();

            return $this->successResponse(
                $store->settings,
                'Store settings updated successfully'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to update store settings: ' . $e->getMessage());
        }
    }

    /**
     * Apply filters to the query.
     */
    protected function applyFilters($query, Request $request)
    {
        // Search filter
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('domain', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('filter.status')) {
            $query->where('status', $request->get('filter.status'));
        }

        // Currency filter
        if ($request->filled('filter.currency')) {
            $query->where('currency', $request->get('filter.currency'));
        }

        // Language filter
        if ($request->filled('filter.language')) {
            $query->where('language', $request->get('filter.language'));
        }

        // Owner filter (for super admins)
        if ($request->filled('filter.owner_id')) {
            $query->where('owner_id', $request->get('filter.owner_id'));
        }

        return $query;
    }

    /**
     * Apply sorting to the query.
     */
    protected function applySorting($query, Request $request)
    {
        $sortFields = $request->get('sort', 'created_at');
        $sortFields = explode(',', $sortFields);

        foreach ($sortFields as $sortField) {
            $direction = 'asc';
            if (str_starts_with($sortField, '-')) {
                $direction = 'desc';
                $sortField = substr($sortField, 1);
            }

            // Validate sort field
            $allowedFields = [
                'name', 'domain', 'status', 'created_at', 'updated_at',
                'currency', 'language', 'timezone'
            ];

            if (in_array($sortField, $allowedFields)) {
                $query->orderBy($sortField, $direction);
            }
        }

        return $query;
    }

    /**
     * Apply date range filter to the query.
     */
    protected function applyDateRange($query, Request $request)
    {
        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->get('from'));
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->get('to'));
        }

        return $query;
    }

    /**
     * Check if domain is available.
     */
    public function checkDomainAvailability(Request $request): JsonResponse
    {
        $validator = $request->validate([
            'domain' => 'required|string|regex:/^[a-z0-9\-]+$/|min:3|max:255'
        ]);

        $domain = $validator['domain'];
        $isAvailable = !Store::where('domain', $domain)->exists();

        return $this->successResponse([
            'domain' => $domain,
            'available' => $isAvailable,
            'message' => $isAvailable ? 'Domain is available' : 'Domain is already taken'
        ], 'Domain availability checked');
    }
}


