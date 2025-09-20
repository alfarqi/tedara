<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\QuestionRatingController;
use App\Http\Controllers\PageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) { return $request->user(); });
Route::get('/test', function () { return response()->json(['message' => 'Tedara API is working!', 'timestamp' => now()->toISOString()]); });

// CORS test endpoint
Route::options('/cors-test', function () {
    return response('', 200);
});
Route::get('/cors-test', function (Request $request) {
    return response()->json([
        'message' => 'CORS test successful',
        'origin' => $request->header('Origin'),
        'method' => $request->method(),
        'timestamp' => now()->toISOString()
    ]);
});

// Debug route for questions-ratings
Route::get('/debug-questions-ratings', function () {
    try {
        $count = \App\Models\QuestionRating::count();
        return response()->json(['message' => 'QuestionRating model works!', 'count' => $count]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Debug route for controller
Route::get('/debug-controller', function () {
    try {
        // Test the query without authentication
        $query = \App\Models\QuestionRating::with(['user', 'product', 'store']);
        $results = $query->limit(5)->get();
        return response()->json(['message' => 'Controller query works!', 'count' => $results->count(), 'data' => $results]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
    }
});

// Debug route for authentication
Route::get('/debug-auth', function (Request $request) {
    try {
        $user = $request->user();
        return response()->json([
            'message' => 'Auth debug',
            'authenticated' => $user ? true : false,
            'user' => $user ? $user->toArray() : null,
            'headers' => $request->headers->all()
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
})->middleware('auth:sanctum');

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/auth/refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum');
Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::post('/auth/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard API
    Route::get('/dashboard/statistics', [\App\Http\Controllers\Api\DashboardController::class, 'statistics']);


    // Store registration for existing users
    Route::post('/auth/register-store', [AuthController::class, 'registerStore']);

    // Business Categories API (for onboarding)
    Route::apiResource('business-categories', \App\Http\Controllers\Api\BusinessCategoryController::class);

    // Stores API
    Route::apiResource('stores', StoreController::class);
    Route::get('stores/{store}/statistics', [StoreController::class, 'statistics']);
    Route::get('stores/{store}/settings', [StoreController::class, 'settings']);
    Route::put('stores/{store}/settings', [StoreController::class, 'updateSettings']);
    Route::post('stores/check-domain', [StoreController::class, 'checkDomainAvailability']);

    // Products API
    Route::get('products/statistics', [ProductController::class, 'statistics']);
    Route::post('products/bulk-delete', [ProductController::class, 'bulkDelete']);
    Route::apiResource('products', ProductController::class);

    // Orders API
    Route::get('orders/statistics', [OrderController::class, 'statistics']);
    Route::apiResource('orders', OrderController::class);
    Route::post('orders/bulk-delete', [OrderController::class, 'bulkDelete']);

    // File Uploads
    Route::post('/uploads', [UploadController::class, 'store']);
    Route::post('/uploads/multiple', [UploadController::class, 'storeMultiple']);
    Route::delete('/uploads/{filename}', [UploadController::class, 'destroy']);

    // Export API
    Route::prefix('export')->group(function () {
        Route::get('/products', [ExportController::class, 'products']);
        Route::get('/orders', [ExportController::class, 'orders']);
        Route::get('/customers', [ExportController::class, 'customers']);
    });

    // Notifications API
    Route::prefix('notifications')->group(function () {
        Route::post('/test-email', [NotificationController::class, 'testEmail']);
        Route::get('/settings', [NotificationController::class, 'getSettings']);
        Route::put('/settings', [NotificationController::class, 'updateSettings']);
        Route::post('/send-to-users', [NotificationController::class, 'sendToUsers']);
        Route::get('/history', [NotificationController::class, 'history']);
    });

    // Customers API
    Route::get('customers/statistics', [\App\Http\Controllers\Api\CustomerController::class, 'statistics']);
    Route::get('customers/{customer}/addresses', [\App\Http\Controllers\Api\CustomerController::class, 'addresses']);
    Route::apiResource('customers', \App\Http\Controllers\Api\CustomerController::class);

    // Questions & Ratings API
    Route::get('questions-ratings/statistics', [QuestionRatingController::class, 'statistics']);
    Route::post('questions-ratings/bulk-update-status', [QuestionRatingController::class, 'bulkUpdateStatus']);
    Route::post('questions-ratings/bulk-delete', [QuestionRatingController::class, 'bulkDelete']);
    Route::apiResource('questions-ratings', QuestionRatingController::class);

    // Pages API
    Route::get('pages/statistics', [PageController::class, 'statistics']);
    Route::post('pages/{page}/toggle-status', [PageController::class, 'toggleStatus']);
    Route::apiResource('pages', PageController::class);

    // Replies API
    Route::get('questions-ratings/{questionRatingId}/replies', [\App\Http\Controllers\Api\ReplyController::class, 'index']);
    Route::post('replies', [\App\Http\Controllers\Api\ReplyController::class, 'store']);
    Route::apiResource('replies', \App\Http\Controllers\Api\ReplyController::class)->except(['index']);

    // Reports API
    Route::prefix('reports')->group(function () {
        Route::get('/sales', [\App\Http\Controllers\Api\ReportsController::class, 'sales']);
        Route::get('/products', [\App\Http\Controllers\Api\ReportsController::class, 'products']);
        Route::get('/customers', [\App\Http\Controllers\Api\ReportsController::class, 'customers']);
        Route::get('/visits', [\App\Http\Controllers\Api\ReportsController::class, 'visits']);
        Route::get('/most-requested', [\App\Http\Controllers\Api\ReportsController::class, 'mostRequested']);
    });

    // Store settings (placeholder)
    Route::get('/store-settings', function () {
        return response()->json(['message' => 'Store settings endpoint']);
    });
});

// Admin routes (super admin only)
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('admin')->group(function () {
    Route::get('/users', function () { return response()->json(['message' => 'Admin users endpoint']); });
    Route::get('/stores', function () { return response()->json(['message' => 'Admin stores endpoint']); });
    Route::get('/audit-logs', function () { return response()->json(['message' => 'Audit logs endpoint']); });
    Route::get('/analytics', function () { return response()->json(['message' => 'Analytics endpoint']); });
});

// Store owner/manager routes
Route::middleware(['auth:sanctum', 'role:store_owner,store_manager'])->prefix('store')->group(function () {
    Route::get('/products', function () { return response()->json(['message' => 'Store products endpoint']); });
    Route::get('/orders', function () { return response()->json(['message' => 'Store orders endpoint']); });
    Route::get('/customers', function () { return response()->json(['message' => 'Store customers endpoint']); });
    Route::get('/analytics', function () { return response()->json(['message' => 'Store analytics endpoint']); });
});

// Public routes for pages (no authentication required)
Route::prefix('public')->group(function () {
    Route::get('stores/{storeSlug}/pages', [PageController::class, 'publicPages']);
    Route::get('stores/{storeSlug}/pages/{seoUrl}', [PageController::class, 'publicPage']);
});

// Storefront routes (public access)
Route::prefix('storefront')->group(function () {
    // Theme routes
    Route::get('{tenantHandle}/theme', [\App\Http\Controllers\Api\Storefront\ThemeController::class, 'show']);
    
    // Product routes
    Route::get('{tenantHandle}/products', [\App\Http\Controllers\Api\Storefront\ProductController::class, 'index']);
    Route::get('{tenantHandle}/products/{id}', [\App\Http\Controllers\Api\Storefront\ProductController::class, 'show']);
    Route::get('{tenantHandle}/categories/{categorySlug}/products', [\App\Http\Controllers\Api\Storefront\ProductController::class, 'byCategory']);
});
