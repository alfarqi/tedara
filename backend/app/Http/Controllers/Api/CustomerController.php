<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\Customer;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CustomerController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Customer::class);

        try {
            $query = Customer::with(['store', 'orders'])
                ->when($request->user()->isStoreOwner(), function ($q) use ($request) {
                    return $q->whereHas('store', function ($storeQuery) use ($request) {
                        $storeQuery->where('owner_id', $request->user()->id);
                    });
                });

            // Apply filters
            $query = $this->applyFilters($query, $request);

            // Apply sorting
            $query = $this->applySorting($query, $request);

            // Apply date range
            $query = $this->applyDateRange($query, $request);

            // Paginate results
            $perPage = $request->get('per_page', 15);
            $perPage = min($perPage, 100); // Limit to 100 per page
            
            $customers = $query->paginate($perPage);

            return $this->paginatedResponse($customers, 'Customers retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve customers: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Customer::class);

        try {
            $validator = validator($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:customers,email',
                'phone' => 'required|string|max:20',
                'store_id' => [
                    'required',
                    'integer',
                    Rule::exists('stores', 'id')->where(function ($query) use ($request) {
                        if ($request->user()->isStoreOwner()) {
                            $query->where('owner_id', $request->user()->id);
                        }
                    })
                ],
                'status' => 'sometimes|string|in:active,inactive,vip',
                'join_date' => 'sometimes|date',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            DB::beginTransaction();

            $customerData = $validator->validated();
            $customerData['status'] = $customerData['status'] ?? 'active';
            $customerData['join_date'] = $customerData['join_date'] ?? now();
            $customerData['total_orders'] = 0;
            $customerData['total_spent'] = 0.00;

            $customer = Customer::create($customerData);

            DB::commit();

            return $this->successResponse(
                $customer->load('store'),
                'Customer created successfully'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to create customer: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('view', $customer);

        try {
            $customer->load(['store', 'orders.orderItems.product']);

            return $this->successResponse($customer, 'Customer retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve customer: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('update', $customer);

        try {
            $validator = validator($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => [
                    'sometimes',
                    'email',
                    'max:255',
                    Rule::unique('customers', 'email')->ignore($customer->id)
                ],
                'phone' => 'sometimes|string|max:20',
                'status' => 'sometimes|string|in:active,inactive,vip',
                'join_date' => 'sometimes|date',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            DB::beginTransaction();

            $customer->update($validator->validated());

            DB::commit();

            return $this->successResponse(
                $customer->load('store'),
                'Customer updated successfully'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to update customer: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('delete', $customer);

        try {
            DB::beginTransaction();

            // Check if customer has orders
            if ($customer->orders()->count() > 0) {
                return $this->badRequestResponse('Cannot delete customer with existing orders');
            }

            $customer->delete();

            DB::commit();

            return $this->successResponse(null, 'Customer deleted successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to delete customer: ' . $e->getMessage());
        }
    }

    /**
     * Get customer statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Customer::class);

        try {
            $query = Customer::query()
                ->when($request->user()->isStoreOwner(), function ($q) use ($request) {
                    return $q->whereHas('store', function ($storeQuery) use ($request) {
                        $storeQuery->where('owner_id', $request->user()->id);
                    });
                });

            $totalCustomers = $query->count();
            $activeCustomers = $query->where('status', 'active')->count();
            $vipCustomers = $query->where('status', 'vip')->count();
            $inactiveCustomers = $query->where('status', 'inactive')->count();
            $newThisMonth = $query->whereMonth('join_date', now()->month)
                ->whereYear('join_date', now()->year)
                ->count();

            $topSpenders = $query->orderBy('total_spent', 'desc')
                ->limit(5)
                ->get(['id', 'name', 'total_spent']);

            $topOrderers = $query->orderBy('total_orders', 'desc')
                ->limit(5)
                ->get(['id', 'name', 'total_orders']);

            return $this->successResponse([
                'total_customers' => $totalCustomers,
                'active_customers' => $activeCustomers,
                'vip_customers' => $vipCustomers,
                'inactive_customers' => $inactiveCustomers,
                'new_this_month' => $newThisMonth,
                'top_spenders' => $topSpenders,
                'top_orderers' => $topOrderers,
            ], 'Customer statistics retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve customer statistics: ' . $e->getMessage());
        }
    }

    /**
     * Apply filters to the query.
     */
    protected function applyFilters($query, Request $request)
    {
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->get('status') !== 'all') {
            $query->where('status', $request->get('status'));
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->get('store_id'));
        }

        return $query;
    }

    /**
     * Apply sorting to the query.
     */
    protected function applySorting($query, Request $request)
    {
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSortFields = ['name', 'email', 'total_orders', 'total_spent', 'join_date', 'created_at'];
        
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        return $query;
    }

    /**
     * Apply date range to the query.
     */
    protected function applyDateRange($query, Request $request)
    {
        if ($request->filled('from')) {
            $query->where('join_date', '>=', $request->get('from'));
        }

        if ($request->filled('to')) {
            $query->where('join_date', '<=', $request->get('to'));
        }

        return $query;
    }
}
