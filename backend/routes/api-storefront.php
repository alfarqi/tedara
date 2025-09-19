<?php

use App\Http\Controllers\Api\Storefront\PageController;
use App\Http\Controllers\Api\Storefront\ProductController;
use App\Http\Controllers\Api\Storefront\ThemeController;
use App\Http\Controllers\Api\CustomerAuthController;
use App\Http\Controllers\Api\StorefrontOrderController;
use App\Http\Controllers\Api\StorefrontAddressController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Storefront API Routes
|--------------------------------------------------------------------------
|
| These routes handle the public storefront API for multi-tenant stores.
| Each route is prefixed with the tenant handle for tenant resolution.
|
*/

Route::prefix('storefront/{tenantHandle}')->group(function () {
    // Pages
    Route::get('pages', [PageController::class, 'index']);
    Route::get('page/{slug}', [PageController::class, 'show']);
    
    // Theme
    Route::get('theme', [ThemeController::class, 'show']);
    
    // Products
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{slug}', [ProductController::class, 'show']);
    
    // Customer Authentication
    Route::post('auth/login', [CustomerAuthController::class, 'login']);
    Route::post('auth/register', [CustomerAuthController::class, 'register']);
    Route::post('auth/guest', [CustomerAuthController::class, 'createGuest']);
    
    // Orders
    Route::post('orders', [StorefrontOrderController::class, 'store']);
    Route::get('orders/{orderId}', [StorefrontOrderController::class, 'show']);
    
    // Protected customer routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [CustomerAuthController::class, 'logout']);
        Route::get('auth/me', [CustomerAuthController::class, 'me']);
        Route::get('orders', [StorefrontOrderController::class, 'index']);
        
        // Addresses
        Route::get('addresses', [StorefrontAddressController::class, 'index']);
        Route::post('addresses', [StorefrontAddressController::class, 'store']);
        Route::get('addresses/{id}', [StorefrontAddressController::class, 'show']);
        Route::put('addresses/{id}', [StorefrontAddressController::class, 'update']);
        Route::delete('addresses/{id}', [StorefrontAddressController::class, 'destroy']);
        Route::post('addresses/{id}/set-default', [StorefrontAddressController::class, 'setDefault']);
    });
});
