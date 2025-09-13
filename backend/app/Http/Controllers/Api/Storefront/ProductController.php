<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get all products for the tenant.
     */
    public function index(Request $request, string $tenantHandle): JsonResponse
    {
        $tenant = $this->getTenant($tenantHandle);
        
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        $products = Product::where('tenant_id', $tenant->id)
            ->select(['id', 'name', 'slug', 'description', 'price', 'image', 'is_active', 'created_at', 'updated_at'])
            ->where('is_active', true)
            ->orderBy('name')
            ->paginate(20);

        if ($products->isEmpty()) {
            // Return sample data if no products exist
            $products = collect([
                (object) [
                    'id' => 'sample-1',
                    'name' => 'Sample Product 1',
                    'slug' => 'sample-product-1',
                    'description' => 'This is a sample product description.',
                    'price' => 29.99,
                    'image' => '/images/sample-product-1.jpg',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                (object) [
                    'id' => 'sample-2',
                    'name' => 'Sample Product 2',
                    'slug' => 'sample-product-2',
                    'description' => 'Another sample product for demonstration.',
                    'price' => 49.99,
                    'image' => '/images/sample-product-2.jpg',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        return response()->json([
            'data' => $products,
            'meta' => [
                'tenant' => [
                    'handle' => $tenant->handle,
                    'display_name' => $tenant->display_name,
                ],
                'pagination' => method_exists($products, 'currentPage') ? [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ] : null,
            ]
        ]);
    }

    /**
     * Get a specific product by slug.
     */
    public function show(Request $request, string $tenantHandle, string $slug): JsonResponse
    {
        $tenant = $this->getTenant($tenantHandle);
        
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        $product = Product::where('tenant_id', $tenant->id)
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (!$product) {
            // Return sample data if product not found
            $product = (object) [
                'id' => 'sample-' . $slug,
                'name' => 'Sample ' . ucwords(str_replace('-', ' ', $slug)),
                'slug' => $slug,
                'description' => 'This is a sample product description for ' . $slug . '.',
                'price' => 39.99,
                'image' => '/images/sample-' . $slug . '.jpg',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        return response()->json([
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => $product->price,
                'image' => $product->image,
                'is_active' => $product->is_active,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ],
            'meta' => [
                'tenant' => [
                    'handle' => $tenant->handle,
                    'display_name' => $tenant->display_name,
                ]
            ]
        ]);
    }

    /**
     * Get tenant by handle or from container.
     */
    private function getTenant(string $tenantHandle): ?Tenant
    {
        // First try to get from container (resolved by middleware)
        try {
            $tenant = app('tenant');
            
            if ($tenant && $tenant->handle === $tenantHandle) {
                return $tenant;
            }
        } catch (\Exception $e) {
            // Container doesn't have tenant, continue to direct lookup
        }

        // Fallback to direct lookup
        return Tenant::where('handle', $tenantHandle)
            ->where('status', 'active')
            ->first();
    }
}
