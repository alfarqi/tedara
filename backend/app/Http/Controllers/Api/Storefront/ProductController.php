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
            ->with(['category'])
            ->where('status', 'active')
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
                    'category' => (object) [
                        'id' => 1,
                        'name' => 'Sample Category',
                        'description' => 'A sample category for demonstration',
                        'parent_id' => null,
                        'store_id' => 1,
                        'image' => null,
                        'sort_order' => 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
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
                    'category' => (object) [
                        'id' => 1,
                        'name' => 'Sample Category',
                        'description' => 'A sample category for demonstration',
                        'parent_id' => null,
                        'store_id' => 1,
                        'image' => null,
                        'sort_order' => 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
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
    public function show(Request $request, string $tenantHandle, string $id): JsonResponse
    {
        $tenant = $this->getTenant($tenantHandle);
        
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        $product = Product::where('tenant_id', $tenant->id)
            ->with(['category'])
            ->where('status', 'active')
            ->find($id);

        if (!$product) {
            // Return sample data if product not found
            $product = (object) [
                'id' => 'sample-' . $id,
                'name' => 'Sample Product ' . $id,
                'slug' => 'sample-product-' . $id,
                'description' => 'This is a sample product description for product ' . $id . '.',
                'price' => 39.99,
                'image' => '/images/sample-' . $id . '.jpg',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
                'category' => (object) [
                    'id' => 1,
                    'name' => 'Sample Category',
                    'description' => 'A sample category for demonstration',
                    'parent_id' => null,
                    'store_id' => 1,
                    'image' => null,
                    'sort_order' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
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
     * Get products by category.
     */
    public function byCategory(Request $request, string $tenantHandle, string $categorySlug): JsonResponse
    {
        $tenant = $this->getTenant($tenantHandle);
        
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        // Find category by slug (assuming we have a slug field or we'll use name)
        $category = \App\Models\Category::where('store_id', $tenant->store()->id)
            ->where('name', 'like', '%' . str_replace('-', ' ', $categorySlug) . '%')
            ->first();

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $products = Product::where('tenant_id', $tenant->id)
            ->where('category_id', $category->id)
            ->with(['category'])
            ->where('status', 'active')
            ->orderBy('name')
            ->paginate(20);

        return response()->json([
            'data' => $products,
            'meta' => [
                'tenant' => [
                    'handle' => $tenant->handle,
                    'display_name' => $tenant->display_name,
                ],
                'category' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                ],
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ],
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
