<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ProductController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Product::class);

        try {
            $query = Product::with('category');
            
            // Filter by store for store owners
            if ($request->user()->isStoreOwner()) {
                $query->whereHas('store', function ($storeQuery) use ($request) {
                    $storeQuery->where('owner_id', $request->user()->id);
                });
            }

            // Apply filters
            $query = $this->applyFilters($query, $request);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $products = $query->paginate($perPage);

            return $this->paginatedResponse($products, 'Products retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve products: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Product::class);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive,draft',
        ]);

        try {
            $productData = $request->all();
            
            // Set store_id for store owners
            if ($request->user()->isStoreOwner()) {
                $store = $request->user()->ownedStores()->first();
                if (!$store) {
                    return $this->errorResponse('No store found for this user', 400);
                }
                $productData['store_id'] = $store->id;
            }

            // Generate SKU if not provided
            if (empty($productData['sku'])) {
                $productData['sku'] = $this->generateUniqueSku($productData['name']);
            }

            $product = Product::create($productData);

            return $this->successResponse($product->load('category'), 'Product created successfully', 201);

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create product: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        $this->authorize('view', $product);

        try {
            return $this->successResponse($product->load('category'), 'Product retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve product: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'sometimes|required|string|max:100|unique:products,sku,' . $product->id,
            'price' => 'sometimes|required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive,draft',
        ]);

        try {
            $product->update($request->all());

            return $this->successResponse($product->load('category'), 'Product updated successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update product: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);

        try {
            $product->delete();
            return $this->successResponse(null, 'Product deleted successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete product: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete products.
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $this->authorize('delete', Product::class);

        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id'
        ]);

        try {
            $query = Product::whereIn('id', $request->product_ids);
            
            // For store owners, only allow deletion of their store's products
            if ($request->user()->isStoreOwner()) {
                $query->whereHas('store', function ($storeQuery) use ($request) {
                    $storeQuery->where('owner_id', $request->user()->id);
                });
            }

            $deletedCount = $query->delete();

            return $this->successResponse([
                'deleted_count' => $deletedCount
            ], "Successfully deleted {$deletedCount} products");

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete products: ' . $e->getMessage());
        }
    }

    /**
     * Get product statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Product::class);

        try {
            $query = Product::query();
            
            // Filter by store for store owners
            if ($request->user()->isStoreOwner()) {
                $query->whereHas('store', function ($storeQuery) use ($request) {
                    $storeQuery->where('owner_id', $request->user()->id);
                });
            }

            $statistics = [
                'total_products' => $query->count(),
                'active_products' => (clone $query)->where('status', 'active')->count(),
                'low_stock_products' => (clone $query)->where('stock', '<', 10)->where('stock', '>', 0)->count(),
                'out_of_stock_products' => (clone $query)->where('stock', 0)->count(),
                'total_value' => (clone $query)->sum(DB::raw('price * stock')),
                'average_price' => (clone $query)->avg('price'),
            ];

            return $this->successResponse($statistics, 'Product statistics retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve product statistics: ' . $e->getMessage());
        }
    }

    /**
     * Apply filters to the query.
     */
    protected function applyFilters($query, Request $request)
    {
        // Search by name, description, or SKU
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by price range
        if ($request->has('min_price') && $request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price') && $request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        return $query;
    }

    /**
     * Generate a unique SKU based on product name.
     */
    private function generateUniqueSku(string $productName): string
    {
        // Create base SKU from product name
        $baseSku = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $productName));
        
        // Limit length and add timestamp for uniqueness
        $baseSku = substr($baseSku, 0, 8);
        $timestamp = time();
        
        $sku = $baseSku . '-' . $timestamp;
        
        // Ensure uniqueness by checking database
        $counter = 1;
        while (Product::where('sku', $sku)->exists()) {
            $sku = $baseSku . '-' . $timestamp . '-' . $counter;
            $counter++;
        }
        
        return $sku;
    }
}
