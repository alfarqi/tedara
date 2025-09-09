<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\OrderItem;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportsController extends BaseController
{
    /**
     * Get sales reports with date filtering
     */
    public function sales(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Order::class);

        try {
            $query = Order::with(['customer', 'store', 'orderItems.product']);
            
            // Filter by store if user is store owner
            if ($request->user()->isStoreOwner()) {
                $storeIds = Store::where('owner_id', $request->user()->id)->pluck('id');
                $query->whereIn('store_id', $storeIds);
            }

            // Apply date range if provided
            $fromDate = $request->get('from_date', Carbon::now()->subDays(30)->startOfDay());
            $toDate = $request->get('to_date', Carbon::now()->endOfDay());
            
            $query->whereBetween('created_at', [$fromDate, $toDate]);

            // Group by date and get daily statistics
            $dailyStats = (clone $query)->selectRaw('
                DATE(created_at) as date,
                COUNT(*) as orders,
                SUM(CASE WHEN status = "cancelled" THEN 1 ELSE 0 END) as refunds,
                AVG(total) as avg_revenue_per_order,
                SUM(tax) as tax,
                SUM(total) as revenue,
                SUM(total) as balance
            ')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->date,
                    'date' => Carbon::parse($item->date)->format('d M, Y'),
                    'orders' => (int) $item->orders,
                    'refunds' => (int) $item->refunds,
                    'avgRevenuePerOrder' => '$' . number_format($item->avg_revenue_per_order, 2),
                    'tax' => '$' . number_format($item->tax, 2),
                    'revenue' => '$' . number_format($item->revenue, 2),
                    'balance' => '$' . number_format($item->balance, 2)
                ];
            });

            // Get summary statistics
            $summary = [
                'total_orders' => $query->count(),
                'total_revenue' => $query->sum('total'),
                'total_tax' => $query->sum('tax'),
                'avg_order_value' => $query->avg('total'),
                'completed_orders' => (clone $query)->where('status', 'delivered')->count(),
                'pending_orders' => (clone $query)->where('status', 'pending')->count(),
                'cancelled_orders' => (clone $query)->where('status', 'cancelled')->count(),
            ];

            return $this->successResponse([
                'daily_stats' => $dailyStats,
                'summary' => $summary,
                'date_range' => [
                    'from' => $fromDate,
                    'to' => $toDate
                ]
            ], 'Sales reports retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve sales reports: ' . $e->getMessage());
        }
    }

    /**
     * Get product performance reports
     */
    public function products(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Product::class);

        try {
            $query = Product::with(['category', 'store', 'orderItems']);
            
            // Filter by store if user is store owner
            if ($request->user()->isStoreOwner()) {
                $storeIds = Store::where('owner_id', $request->user()->id)->pluck('id');
                $query->whereIn('store_id', $storeIds);
            }

            // Apply performance filter
            $performanceFilter = $request->get('performance_filter', 'All');
            if ($performanceFilter !== 'All') {
                switch ($performanceFilter) {
                    case '1000+':
                        $query->whereHas('orderItems', function ($q) {
                            $q->selectRaw('product_id, SUM(quantity) as total_quantity')
                              ->groupBy('product_id')
                              ->havingRaw('SUM(quantity) >= 1000');
                        });
                        break;
                    case '1-1000':
                        $query->whereHas('orderItems', function ($q) {
                            $q->selectRaw('product_id, SUM(quantity) as total_quantity')
                              ->groupBy('product_id')
                              ->havingRaw('SUM(quantity) BETWEEN 1 AND 999');
                        });
                        break;
                    case '0':
                        $query->whereDoesntHave('orderItems');
                        break;
                }
            }

            // Get products with performance metrics
            $products = $query->get()->map(function ($product) {
                $totalOrders = $product->orderItems->sum('quantity');
                $totalViews = $product->views ?? rand(1000, 100000); // Mock views for now
                $conversionRate = $totalViews > 0 ? ($totalOrders / $totalViews) * 100 : 0;

                return [
                    'id' => $product->id,
                    'productName' => $product->name,
                    'sku' => $product->sku,
                    'price' => '$' . number_format($product->price, 2),
                    'rating' => (int) $product->rating,
                    'reviews' => (int) $product->reviews_count,
                    'views' => $this->formatViews($totalViews),
                    'orders' => $totalOrders,
                    'conversion' => number_format($conversionRate, 1) . '%',
                    'image' => $product->images[0] ?? '/assets/images/products/default.png'
                ];
            });

            // Sort by orders (best selling first)
            $products = $products->sortByDesc('orders')->values();

            return $this->successResponse([
                'products' => $products,
                'total_count' => $products->count(),
                'performance_filter' => $performanceFilter
            ], 'Product performance reports retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve product reports: ' . $e->getMessage());
        }
    }

    /**
     * Get customer analytics reports
     */
    public function customers(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Customer::class);

        try {
            $query = Customer::with(['store', 'orders']);
            
            // Filter by store if user is store owner
            if ($request->user()->isStoreOwner()) {
                $storeIds = Store::where('owner_id', $request->user()->id)->pluck('id');
                $query->whereIn('store_id', $storeIds);
            }

            // Get customer analytics
            $customers = $query->get()->map(function ($customer) {
                $totalOrders = $customer->orders->count();
                $totalSpent = $customer->orders->sum('total');
                $lastOrderDate = $customer->orders->max('created_at');
                $avgOrderValue = $totalOrders > 0 ? $totalSpent / $totalOrders : 0;

                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'total_orders' => $totalOrders,
                    'total_spent' => $totalSpent,
                    'avg_order_value' => $avgOrderValue,
                    'last_order_date' => $lastOrderDate ? Carbon::parse($lastOrderDate)->format('d M, Y') : 'Never',
                    'status' => $customer->status,
                    'join_date' => Carbon::parse($customer->created_at)->format('d M, Y')
                ];
            });

            // Get summary statistics
            $summary = [
                'total_customers' => $customers->count(),
                'active_customers' => $customers->where('status', 'active')->count(),
                'vip_customers' => $customers->where('status', 'vip')->count(),
                'total_revenue' => $customers->sum('total_spent'),
                'avg_customer_value' => $customers->avg('total_spent'),
                'new_customers_this_month' => $customers->where('join_date', '>=', Carbon::now()->startOfMonth())->count()
            ];

            return $this->successResponse([
                'customers' => $customers,
                'summary' => $summary
            ], 'Customer analytics retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve customer reports: ' . $e->getMessage());
        }
    }

    /**
     * Get visit/views analytics (mock data for now)
     */
    public function visits(Request $request): JsonResponse
    {
        try {
            // Mock visit data - in real implementation, this would come from analytics service
            $visits = collect(range(1, 30))->map(function ($day) {
                $date = Carbon::now()->subDays($day);
                $baseVisits = rand(100, 1000);
                $weekendMultiplier = in_array($date->dayOfWeek, [0, 6]) ? 1.5 : 1.0;
                
                return [
                    'id' => $day,
                    'date' => $date->format('d M, Y'),
                    'visits' => (int) ($baseVisits * $weekendMultiplier),
                    'unique_visitors' => (int) ($baseVisits * $weekendMultiplier * 0.7),
                    'page_views' => (int) ($baseVisits * $weekendMultiplier * 2.5),
                    'bounce_rate' => rand(30, 70),
                    'avg_session_duration' => rand(2, 8)
                ];
            })->reverse()->values();

            $summary = [
                'total_visits' => $visits->sum('visits'),
                'total_unique_visitors' => $visits->sum('unique_visitors'),
                'avg_bounce_rate' => $visits->avg('bounce_rate'),
                'avg_session_duration' => $visits->avg('avg_session_duration'),
                'trend' => $visits->last()['visits'] > $visits->first()['visits'] ? 'up' : 'down'
            ];

            return $this->successResponse([
                'visits' => $visits,
                'summary' => $summary
            ], 'Visit analytics retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve visit reports: ' . $e->getMessage());
        }
    }

    /**
     * Get most requested/trending products
     */
    public function mostRequested(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Product::class);

        try {
            $query = Product::with(['category', 'store', 'orderItems']);
            
            // Filter by store if user is store owner
            if ($request->user()->isStoreOwner()) {
                $storeIds = Store::where('owner_id', $request->user()->id)->pluck('id');
                $query->whereIn('store_id', $storeIds);
            }

            // Get trending products based on orders and views
            $trendingProducts = $query->get()->map(function ($product) {
                $totalOrders = $product->orderItems->sum('quantity');
                $totalViews = $product->views ?? rand(1000, 100000);
                $trendingScore = ($totalOrders * 0.7) + ($totalViews * 0.3);

                return [
                    'id' => $product->id,
                    'productName' => $product->name,
                    'sku' => $product->sku,
                    'price' => '$' . number_format($product->price, 2),
                    'trending_score' => $trendingScore,
                    'orders' => $totalOrders,
                    'views' => $this->formatViews($totalViews),
                    'category' => $product->category->name ?? 'Uncategorized',
                    'image' => $product->images[0] ?? '/assets/images/products/default.png'
                ];
            })
            ->sortByDesc('trending_score')
            ->take(10)
            ->values();

            return $this->successResponse([
                'trending_products' => $trendingProducts,
                'total_count' => $trendingProducts->count()
            ], 'Most requested products retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve trending products: ' . $e->getMessage());
        }
    }

    /**
     * Format views count with K/M suffix
     */
    private function formatViews(int $views): string
    {
        if ($views >= 1000000) {
            return number_format($views / 1000000, 1) . 'M';
        } elseif ($views >= 1000) {
            return number_format($views / 1000, 1) . 'k';
        }
        return (string) $views;
    }
}
