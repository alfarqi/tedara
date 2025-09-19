<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\Order\StoreOrderRequest;
use App\Http\Requests\Api\Order\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Order::class);

        $query = Order::with(['customer', 'store', 'orderItems.product'])
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
        
        $orders = $query->paginate($perPage);
        
        // Debug: Log the orders being returned to admin
        Log::info('Admin orders retrieved', [
            'count' => $orders->count(),
            'orders' => $orders->map(function($order) {
                return [
                    'id' => $order->id,
                    'order_id' => $order->order_id,
                    'total' => $order->total,
                    'subtotal' => $order->subtotal,
                    'shipping_cost' => $order->shipping_cost,
                    'status' => $order->status
                ];
            })->toArray()
        ]);

        return $this->paginatedResponse($orders, 'Orders retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $this->authorize('create', Order::class);

        try {
            DB::beginTransaction();

            $orderData = $request->validated();
            
            // Generate unique order ID
            $orderData['order_id'] = $this->generateOrderId();
            
            // Set store ID for store owners
            if ($request->user()->isStoreOwner()) {
                $store = $request->user()->ownedStores()->first();
                if (!$store) {
                    return $this->badRequestResponse('No store found for this user');
                }
                $orderData['store_id'] = $store->id;
            }

            $order = Order::create($orderData);

            // Create order items if provided
            if ($request->has('items') && is_array($request->items)) {
                foreach ($request->items as $item) {
                    $order->orderItems()->create($item);
                }
            }

            DB::commit();

            $order->load(['customer', 'store', 'orderItems.product']);

            return $this->successResponse($order, 'Order created successfully', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to create order: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order): JsonResponse
    {
        $this->authorize('view', $order);

        $order->load(['customer', 'store', 'orderItems.product']);

        return $this->successResponse($order, 'Order retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $this->authorize('update', $order);

        try {
            DB::beginTransaction();

            $orderData = $request->validated();
            $order->update($orderData);

            // Update order items if provided
            if ($request->has('items') && is_array($request->items)) {
                // Delete existing items
                $order->orderItems()->delete();
                
                // Create new items
                foreach ($request->items as $item) {
                    $order->orderItems()->create($item);
                }
            }

            DB::commit();

            $order->load(['customer', 'store', 'orderItems.product']);

            return $this->successResponse($order, 'Order updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to update order: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order): JsonResponse
    {
        $this->authorize('delete', $order);

        try {
            $order->delete();
            return $this->successResponse(null, 'Order deleted successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete order: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete orders.
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $this->authorize('delete', Order::class);

        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id'
        ]);

        try {
            $query = Order::whereIn('id', $request->order_ids);
            
            // For store owners, only allow deletion of their store's orders
            if ($request->user()->isStoreOwner()) {
                $query->whereHas('store', function ($storeQuery) use ($request) {
                    $storeQuery->where('owner_id', $request->user()->id);
                });
            }

            $deletedCount = $query->delete();

            return $this->successResponse([
                'deleted_count' => $deletedCount
            ], "Successfully deleted {$deletedCount} orders");

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete orders: ' . $e->getMessage());
        }
    }

    /**
     * Get order statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Order::class);

        try {
            $query = Order::query();
            
            // Filter by store for store owners
            if ($request->user()->isStoreOwner()) {
                $query->whereHas('store', function ($storeQuery) use ($request) {
                    $storeQuery->where('owner_id', $request->user()->id);
                });
            }

            // Apply date range if provided
            if ($request->has('from') && $request->has('to')) {
                $query->whereBetween('created_at', [$request->from, $request->to]);
            }

            $statistics = [
                'total_orders' => $query->count(),
                'completed_orders' => (clone $query)->where('status', 'delivered')->count(),
                'pending_orders' => (clone $query)->where('status', 'pending')->count(),
                'cancelled_orders' => (clone $query)->where('status', 'cancelled')->count(),
                'paid_orders' => (clone $query)->where('payment_status', 'paid')->count(),
                'total_revenue' => (clone $query)->where('payment_status', 'paid')->sum('total'),
                'average_order_value' => (clone $query)->where('payment_status', 'paid')->avg('total'),
            ];

            return $this->successResponse($statistics, 'Order statistics retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve order statistics: ' . $e->getMessage());
        }
    }

    /**
     * Apply filters to the query.
     */
    protected function applyFilters($query, Request $request)
    {
        // Search by order ID or customer name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($request->has('filter.status') && $request->filter['status'] !== 'all') {
            $query->where('status', $request->filter['status']);
        }

        // Filter by payment status
        if ($request->has('filter.payment_status') && $request->filter['payment_status'] !== 'all') {
            $query->where('payment_status', $request->filter['payment_status']);
        }

        // Filter by payment method
        if ($request->has('filter.payment_method') && $request->filter['payment_method'] !== 'all') {
            $query->where('payment_method', $request->filter['payment_method']);
        }

        // Filter by customer
        if ($request->has('filter.customer_id')) {
            $query->where('customer_id', $request->filter['customer_id']);
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

        $allowedSortFields = [
            'order_id', 'status', 'payment_status', 'total', 'created_at', 'updated_at'
        ];

        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query;
    }

    /**
     * Apply date range filter to the query.
     */
    protected function applyDateRange($query, Request $request)
    {
        if ($request->has('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->has('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        return $query;
    }

    /**
     * Generate unique order ID.
     */
    protected function generateOrderId(): string
    {
        do {
            $orderId = 'WB' . date('Y') . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
        } while (Order::where('order_id', $orderId)->exists());

        return $orderId;
    }
}


