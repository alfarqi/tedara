<?php

use App\Http\Controllers\Api\Storefront\PageController;
use App\Http\Controllers\Api\Storefront\ProductController;
use App\Http\Controllers\Api\Storefront\ThemeController;
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
});
