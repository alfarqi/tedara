<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\Product;
use App\Models\Order;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ExportController extends BaseController
{
    /**
     * Export products to CSV.
     */
    public function products(Request $request): JsonResponse
    {
        try {
            $query = Product::with(['category', 'store'])
                ->when($request->user()->isStoreOwner(), function ($q) use ($request) {
                    return $q->whereHas('store', function ($storeQuery) use ($request) {
                        $storeQuery->where('owner_id', $request->user()->id);
                    });
                });

            // Apply filters
            $query = $this->applyProductFilters($query, $request);

            $products = $query->get();

            $filename = 'products_' . date('Y-m-d_H-i-s') . '.csv';
            $path = 'exports/' . $filename;

            $csvContent = $this->generateProductsCsv($products);
            
            Storage::disk('public')->put($path, $csvContent);
            
            $url = Storage::disk('public')->url($path);

            return $this->successResponse([
                'url' => $url,
                'filename' => $filename,
                'count' => $products->count(),
            ], 'Products exported successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to export products: ' . $e->getMessage());
        }
    }

    /**
     * Export orders to CSV.
     */
    public function orders(Request $request): JsonResponse
    {
        try {
            $query = Order::with(['customer', 'store', 'orderItems.product'])
                ->when($request->user()->isStoreOwner(), function ($q) use ($request) {
                    return $q->whereHas('store', function ($storeQuery) use ($request) {
                        $storeQuery->where('owner_id', $request->user()->id);
                    });
                });

            // Apply filters
            $query = $this->applyOrderFilters($query, $request);

            $orders = $query->get();

            $filename = 'orders_' . date('Y-m-d_H-i-s') . '.csv';
            $path = 'exports/' . $filename;

            $csvContent = $this->generateOrdersCsv($orders);
            
            Storage::disk('public')->put($path, $csvContent);
            
            $url = Storage::disk('public')->url($path);

            return $this->successResponse([
                'url' => $url,
                'filename' => $filename,
                'count' => $orders->count(),
            ], 'Orders exported successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to export orders: ' . $e->getMessage());
        }
    }

    /**
     * Export customers to CSV.
     */
    public function customers(Request $request): JsonResponse
    {
        try {
            $query = Customer::with(['store'])
                ->when($request->user()->isStoreOwner(), function ($q) use ($request) {
                    return $q->whereHas('store', function ($storeQuery) use ($request) {
                        $storeQuery->where('owner_id', $request->user()->id);
                    });
                });

            // Apply filters
            $query = $this->applyCustomerFilters($query, $request);

            $customers = $query->get();

            $filename = 'customers_' . date('Y-m-d_H-i-s') . '.csv';
            $path = 'exports/' . $filename;

            $csvContent = $this->generateCustomersCsv($customers);
            
            Storage::disk('public')->put($path, $csvContent);
            
            $url = Storage::disk('public')->url($path);

            return $this->successResponse([
                'url' => $url,
                'filename' => $filename,
                'count' => $customers->count(),
            ], 'Customers exported successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to export customers: ' . $e->getMessage());
        }
    }

    /**
     * Generate CSV content for products.
     */
    private function generateProductsCsv($products): string
    {
        $headers = [
            'ID', 'Name', 'SKU', 'Price', 'Original Price', 'Stock', 'Status',
            'Category', 'Brand', 'Weight', 'Dimensions', 'Created At'
        ];

        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, $headers);

        foreach ($products as $product) {
            fputcsv($csv, [
                $product->id,
                $product->name,
                $product->sku,
                $product->price,
                $product->original_price,
                $product->stock,
                $product->status,
                $product->category->name ?? '',
                $product->brand,
                $product->weight,
                $product->dimensions,
                $product->created_at->format('Y-m-d H:i:s'),
            ]);
        }

        rewind($csv);
        $content = stream_get_contents($csv);
        fclose($csv);

        return $content;
    }

    /**
     * Generate CSV content for orders.
     */
    private function generateOrdersCsv($orders): string
    {
        $headers = [
            'Order ID', 'Customer', 'Email', 'Status', 'Payment Status',
            'Subtotal', 'Tax', 'Shipping', 'Total', 'Created At'
        ];

        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, $headers);

        foreach ($orders as $order) {
            fputcsv($csv, [
                $order->order_id,
                $order->customer->name ?? '',
                $order->customer->email ?? '',
                $order->status,
                $order->payment_status,
                $order->subtotal,
                $order->tax,
                $order->shipping_cost,
                $order->total,
                $order->created_at->format('Y-m-d H:i:s'),
            ]);
        }

        rewind($csv);
        $content = stream_get_contents($csv);
        fclose($csv);

        return $content;
    }

    /**
     * Generate CSV content for customers.
     */
    private function generateCustomersCsv($customers): string
    {
        $headers = [
            'ID', 'Name', 'Email', 'Phone', 'Status', 'Total Orders',
            'Total Spent', 'Join Date'
        ];

        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, $headers);

        foreach ($customers as $customer) {
            fputcsv($csv, [
                $customer->id,
                $customer->name,
                $customer->email,
                $customer->phone,
                $customer->status,
                $customer->total_orders,
                $customer->total_spent,
                $customer->join_date->format('Y-m-d'),
            ]);
        }

        rewind($csv);
        $content = stream_get_contents($csv);
        fclose($csv);

        return $content;
    }

    /**
     * Apply filters to products query.
     */
    private function applyProductFilters($query, Request $request)
    {
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->get('category_id'));
        }

        return $query;
    }

    /**
     * Apply filters to orders query.
     */
    private function applyOrderFilters($query, Request $request)
    {
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->get('payment_status'));
        }

        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->get('from'));
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->get('to'));
        }

        return $query;
    }

    /**
     * Apply filters to customers query.
     */
    private function applyCustomerFilters($query, Request $request)
    {
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        return $query;
    }
}
