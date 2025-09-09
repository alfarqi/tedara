<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = Auth::user();
        Log::info('🔍 Dashboard API called', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_role' => $user->role
        ]);
        
        // Get user's stores if they are a store owner
        $storeIds = [];
        if ($user->role === 'store_owner') {
            $storeIds = Store::where('owner_id', $user->id)->pluck('id')->toArray();
        }

        // Get current month date range
        $currentMonth = Carbon::now();
        $startOfMonth = $currentMonth->copy()->startOfMonth();
        $endOfMonth = $currentMonth->copy()->endOfMonth();

        // Get previous month for comparison
        $previousMonth = $currentMonth->copy()->subMonth();
        $startOfPreviousMonth = $previousMonth->copy()->startOfMonth();
        $endOfPreviousMonth = $previousMonth->copy()->endOfMonth();

        // Build base queries
        $orderQuery = Order::query();
        $customerQuery = Customer::query();
        $productQuery = Product::query();

        // Filter by store if user is store owner
        if (!empty($storeIds)) {
            $orderQuery->whereIn('store_id', $storeIds);
            $customerQuery->whereIn('store_id', $storeIds);
            $productQuery->whereIn('store_id', $storeIds);
            
            Log::info('🔍 Filtering by store IDs', [
                'store_ids' => $storeIds,
                'user_id' => $user->id
            ]);
        } else {
            Log::info('🔍 No store filtering applied', [
                'user_role' => $user->role,
                'user_id' => $user->id
            ]);
        }

        // Current month statistics
        $currentMonthOrders = (clone $orderQuery)->whereBetween('created_at', [$startOfMonth, $endOfMonth]);
        $currentMonthCustomers = (clone $customerQuery)->whereBetween('created_at', [$startOfMonth, $endOfMonth]);
        
        // Previous month statistics for comparison
        $previousMonthOrders = (clone $orderQuery)->whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth]);
        $previousMonthCustomers = (clone $customerQuery)->whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth]);

        // Calculate statistics
        $totalSales = $currentMonthOrders->where('payment_status', 'paid')->sum('total');
        $previousTotalSales = $previousMonthOrders->where('payment_status', 'paid')->sum('total');
        $salesGrowth = $previousTotalSales > 0 ? (($totalSales - $previousTotalSales) / $previousTotalSales) * 100 : 0;

        $totalOrders = $currentMonthOrders->count();
        $previousTotalOrders = $previousMonthOrders->count();
        $ordersGrowth = $previousTotalOrders > 0 ? (($totalOrders - $previousTotalOrders) / $previousTotalOrders) * 100 : 0;

        $newCustomers = $currentMonthCustomers->count();
        $previousNewCustomers = $previousMonthCustomers->count();
        $customersGrowth = $previousNewCustomers > 0 ? (($newCustomers - $previousNewCustomers) / $previousNewCustomers) * 100 : 0;

        // Revenue (same as total sales for now, but could be different calculation)
        $revenue = $totalSales;
        $previousRevenue = $previousTotalSales;
        $revenueGrowth = $previousRevenue > 0 ? (($revenue - $previousRevenue) / $previousRevenue) * 100 : 0;

        // Additional statistics
        $totalProducts = $productQuery->count();
        $activeProducts = $productQuery->where('status', 'active')->count();
        $totalCustomers = $customerQuery->count();
        $totalOrdersAllTime = $orderQuery->count();

        $responseData = [
            'success' => true,
            'data' => [
                'total_sales' => [
                    'current' => round($totalSales, 2),
                    'previous' => round($previousTotalSales, 2),
                    'growth' => round($salesGrowth, 2),
                    'formatted' => '$' . number_format($totalSales / 1000, 1) . 'K'
                ],
                'total_orders' => [
                    'current' => $totalOrders,
                    'previous' => $previousTotalOrders,
                    'growth' => round($ordersGrowth, 2),
                    'formatted' => number_format($totalOrders)
                ],
                'new_customers' => [
                    'current' => $newCustomers,
                    'previous' => $previousNewCustomers,
                    'growth' => round($customersGrowth, 2),
                    'formatted' => number_format($newCustomers)
                ],
                'revenue' => [
                    'current' => round($revenue, 2),
                    'previous' => round($previousRevenue, 2),
                    'growth' => round($revenueGrowth, 2),
                    'formatted' => '$' . number_format($revenue / 1000, 1) . 'K'
                ],
                'additional_stats' => [
                    'total_products' => $totalProducts,
                    'active_products' => $activeProducts,
                    'total_customers' => $totalCustomers,
                    'total_orders_all_time' => $totalOrdersAllTime
                ]
            ]
        ];


        Log::info('📊 Dashboard statistics calculated', [
            'total_sales' => $totalSales,
            'total_orders' => $totalOrders,
            'new_customers' => $newCustomers,
            'revenue' => $revenue,
            'store_ids' => $storeIds,
            'current_month_start' => $startOfMonth->toDateString(),
            'current_month_end' => $endOfMonth->toDateString()
        ]);

        return response()->json($responseData);
    }
}
