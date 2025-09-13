<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Models\StorefrontPage;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Get all pages for the tenant.
     */
    public function index(Request $request, string $tenantHandle): JsonResponse
    {
        $tenant = $this->getTenant($tenantHandle);
        
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        $pages = StorefrontPage::where('tenant_id', $tenant->id)
            ->select(['id', 'slug', 'title', 'template', 'is_home', 'created_at', 'updated_at'])
            ->orderBy('is_home', 'desc')
            ->orderBy('title')
            ->get();

        return response()->json([
            'data' => $pages,
            'meta' => [
                'tenant' => [
                    'handle' => $tenant->handle,
                    'display_name' => $tenant->display_name,
                ]
            ]
        ]);
    }

    /**
     * Get a specific page by slug.
     */
    public function show(Request $request, string $tenantHandle, string $slug): JsonResponse
    {
        $tenant = $this->getTenant($tenantHandle);
        
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        $page = StorefrontPage::where('tenant_id', $tenant->id)
            ->where('slug', $slug)
            ->with(['sections' => function ($query) {
                $query->orderBy('sort');
            }])
            ->first();

        if (!$page) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        return response()->json([
            'data' => [
                'id' => $page->id,
                'slug' => $page->slug,
                'title' => $page->title,
                'template' => $page->template,
                'seo' => $page->seo_json,
                'is_home' => $page->is_home,
                'sections' => $page->sections->map(function ($section) {
                    return [
                        'id' => $section->id,
                        'type' => $section->type,
                        'sort' => $section->sort,
                        'props' => $section->props,
                    ];
                }),
                'created_at' => $page->created_at,
                'updated_at' => $page->updated_at,
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
