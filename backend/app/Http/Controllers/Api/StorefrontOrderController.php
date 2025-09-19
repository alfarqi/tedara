<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class StorefrontOrderController extends Controller
{
    /**
     * Get customer orders for the storefront.
     */
    public function index(Request $request): JsonResponse
    {
        // Get tenant from route
        $tenantHandle = $request->route('tenantHandle');
        
        // Find tenant by handle
        $tenant = Tenant::where('handle', $tenantHandle)
            ->where('status', 'active')
            ->first();
        
        if (!$tenant) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        // Get store associated with tenant
        $store = $tenant->store();
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        // Check if customer is authenticated
        $customer = $request->user();
        if (!$customer) {
            return response()->json([
                'message' => 'Authentication required',
            ], 401);
        }

        // Get orders for the authenticated customer
        $orders = Order::with(['orderItems.product'])
            ->where('store_id', $store->id)
            ->where('customer_id', $customer->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Format orders for frontend
        $formattedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'order_id' => $order->order_id,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'total' => $order->total,
                'delivery_fee' => $order->shipping_cost,
                'subtotal' => $order->subtotal,
                'delivery_address' => $order->shipping_address['street'] ?? '',
                'notes' => $order->notes,
                'items' => $order->orderItems->map(function ($item) {
                    return [
                        'product_name' => $item->product->name ?? 'Unknown Product',
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'total' => $item->total,
                    ];
                }),
                'created_at' => $order->created_at,
            ];
        });

        return response()->json([
            'orders' => $formattedOrders,
        ]);
    }

    /**
     * Create a new order for the storefront.
     */
    public function store(Request $request): JsonResponse
    {
        // Get tenant from route
        $tenantHandle = $request->route('tenantHandle');
        
        // Debug logging
        Log::info('Order creation attempt', [
            'tenantHandle' => $tenantHandle,
            'url' => $request->url(),
            'route_params' => $request->route()->parameters()
        ]);
        
        // Find tenant by handle
        $tenant = Tenant::where('handle', $tenantHandle)
            ->where('status', 'active')
            ->first();
        
        if (!$tenant) {
            Log::error('Tenant not found', ['tenantHandle' => $tenantHandle]);
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        // Get store associated with tenant
        $store = $tenant->store();
        if (!$store) {
            Log::error('Store not found for tenant', [
                'tenantHandle' => $tenantHandle,
                'tenantId' => $tenant->id
            ]);
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }
        
        Log::info('Store found', [
            'tenantHandle' => $tenantHandle,
            'storeId' => $store->id,
            'storeName' => $store->name
        ]);

        // Validate request
        $validator = Validator::make($request->all(), [
            'customer_id' => 'nullable|exists:customers,id',
            'guest_customer' => 'nullable|array',
            'guest_customer.name' => 'required_with:guest_customer|string|max:255',
            'guest_customer.email' => 'required_with:guest_customer|email|max:255',
            'guest_customer.phone' => 'required_with:guest_customer|string|max:20',
            'payment_method' => 'required|string|in:cash,card',
            'delivery_time' => 'required|string',
            'delivery_address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'delivery_fee' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);

        // Additional validation: Check if products belong to the current store
        if ($request->has('items') && is_array($request->items)) {
            foreach ($request->items as $index => $item) {
                if (isset($item['product_id'])) {
                    $product = \App\Models\Product::find($item['product_id']);
                    Log::info('Product validation', [
                        'product_id' => $item['product_id'],
                        'product_found' => $product ? true : false,
                        'product_store_id' => $product ? $product->store_id : null,
                        'current_store_id' => $store->id,
                        'belongs_to_store' => $product && $product->store_id === $store->id
                    ]);
                    
                    if (!$product || $product->store_id !== $store->id) {
                        $validator->errors()->add("items.{$index}.product_id", "Product does not belong to this store.");
                    }
                }
            }
        }

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Generate order ID
            $orderId = 'ORD-' . date('Y') . '-' . str_pad(Order::where('store_id', $store->id)->count() + 1, 5, '0', STR_PAD_LEFT);

            // Prepare order data
            $orderData = [
                'order_id' => $orderId,
                'store_id' => $store->id,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'shipping_address' => [
                    'street' => $request->delivery_address,
                    'city' => 'Bahrain', // Default for now
                    'state' => 'Bahrain',
                    'postal_code' => '00000',
                    'country' => 'Bahrain',
                ],
                'shipping_cost' => $request->delivery_fee,
                'subtotal' => $request->subtotal,
                'tax' => 0, // No tax for now
                'total' => $request->total,
                'notes' => "Delivery time: {$request->delivery_time}",
            ];

            // Handle customer (authenticated or guest)
            if ($request->customer_id) {
                $orderData['customer_id'] = $request->customer_id;
            } else {
                // For guest customers, we'll store the info in notes for now
                $guestInfo = $request->guest_customer;
                $orderData['notes'] = "Guest Customer: {$guestInfo['name']} ({$guestInfo['email']}, {$guestInfo['phone']})\nDelivery time: {$request->delivery_time}";
            }

            // Create order
            $order = Order::create($orderData);
            
            // Debug: Log the created order to verify data is stored
            Log::info('Order created successfully', [
                'order_id' => $order->order_id,
                'total' => $order->total,
                'subtotal' => $order->subtotal,
                'shipping_cost' => $order->shipping_cost,
                'store_id' => $order->store_id
            ]);

            // Create order items
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['price'] * $item['quantity'],
                ]);
            }

            // Update customer stats if authenticated
            if ($request->customer_id) {
                $customer = \App\Models\Customer::find($request->customer_id);
                if ($customer) {
                    $customer->increment('total_orders');
                    $customer->increment('total_spent', $request->total);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'order' => [
                    'id' => $order->id,
                    'order_id' => $order->order_id,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total' => $order->total,
                    'delivery_fee' => $order->shipping_cost,
                    'subtotal' => $order->subtotal,
                    'payment_method' => $order->payment_method,
                    'delivery_time' => $request->delivery_time,
                    'delivery_address' => $request->delivery_address,
                    'created_at' => $order->created_at,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get order details by ID.
     */
    public function show(Request $request, $tenantHandle, $orderId): JsonResponse
    {
        // Find tenant by handle
        $tenant = Tenant::where('handle', $tenantHandle)
            ->where('status', 'active')
            ->first();
        
        if (!$tenant) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        // Get store associated with tenant
        $store = $tenant->store();
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        // Find order
        $order = Order::with(['orderItems.product', 'customer'])
            ->where('store_id', $store->id)
            ->where('id', $orderId)
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found',
            ], 404);
        }

        return response()->json([
            'order' => [
                'id' => $order->id,
                'order_id' => $order->order_id,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'total' => $order->total,
                'delivery_fee' => $order->shipping_cost,
                'subtotal' => $order->subtotal,
                'delivery_address' => $order->shipping_address['street'] ?? '',
                'notes' => $order->notes,
                'items' => $order->orderItems->map(function ($item) {
                    return [
                        'product_name' => $item->product->name ?? 'Unknown Product',
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'total' => $item->total,
                    ];
                }),
                'created_at' => $order->created_at,
            ],
        ]);
    }
}
