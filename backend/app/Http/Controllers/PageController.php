<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PageController extends Controller
{
    /**
     * Display a listing of pages for the authenticated user's store.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $store = $user->ownedStores()->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'No store found for this user. Please create a store first.',
                    'error_code' => 'NO_STORE_FOUND'
                ], 404);
            }

            $query = Page::forStore($store->id);

            // Apply filters
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('language') && $request->language !== 'all') {
                $query->where('language', $request->language);
            }

            if ($request->has('show_in_footer')) {
                $query->where('show_in_footer', $request->boolean('show_in_footer'));
            }

            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%")
                      ->orWhere('seo_title', 'like', "%{$search}%")
                      ->orWhere('seo_url', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $pages = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $pages->items(),
                'meta' => [
                    'current_page' => $pages->currentPage(),
                    'last_page' => $pages->lastPage(),
                    'per_page' => $pages->perPage(),
                    'total' => $pages->total(),
                    'from' => $pages->firstItem(),
                    'to' => $pages->lastItem(),
                ],
                'links' => [
                    'first' => $pages->url(1),
                    'last' => $pages->url($pages->lastPage()),
                    'prev' => $pages->previousPageUrl(),
                    'next' => $pages->nextPageUrl(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created page.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $store = $user->ownedStores()->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'No store found for this user. Please create a store first.',
                    'error_code' => 'NO_STORE_FOUND'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'status' => 'in:active,inactive',
                'seo_title' => 'nullable|string|max:255',
                'seo_url' => [
                    'required',
                    'string',
                    'max:255',
                    'regex:/^[a-z0-9\-]+$/',
                    Rule::unique('pages')->where(function ($query) use ($store) {
                        return $query->where('store_id', $store->id);
                    })
                ],
                'seo_description' => 'nullable|string|max:500',
                'show_in_footer' => 'boolean',
                'language' => 'in:EN,AR',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $page = Page::create([
                'store_id' => $store->id,
                'title' => $request->title,
                'content' => $request->content,
                'status' => $request->status ?? 'active',
                'seo_title' => $request->seo_title ?? $request->title,
                'seo_url' => $request->seo_url,
                'seo_description' => $request->seo_description,
                'show_in_footer' => $request->boolean('show_in_footer', false),
                'language' => $request->language ?? 'EN',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Page created successfully',
                'data' => $page
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create page',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified page.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $store = $user->ownedStores()->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'No store found for this user. Please create a store first.',
                    'error_code' => 'NO_STORE_FOUND'
                ], 404);
            }

            $page = Page::forStore($store->id)->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $page
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified page.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $store = $user->ownedStores()->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'No store found for this user. Please create a store first.',
                    'error_code' => 'NO_STORE_FOUND'
                ], 404);
            }

            $page = Page::forStore($store->id)->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'status' => 'in:active,inactive',
                'seo_title' => 'nullable|string|max:255',
                'seo_url' => [
                    'required',
                    'string',
                    'max:255',
                    'regex:/^[a-z0-9\-]+$/',
                    Rule::unique('pages')->where(function ($query) use ($store, $id) {
                        return $query->where('store_id', $store->id)->where('id', '!=', $id);
                    })
                ],
                'seo_description' => 'nullable|string|max:500',
                'show_in_footer' => 'boolean',
                'language' => 'in:EN,AR',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $page->update([
                'title' => $request->title,
                'content' => $request->content,
                'status' => $request->status ?? $page->status,
                'seo_title' => $request->seo_title ?? $request->title,
                'seo_url' => $request->seo_url,
                'seo_description' => $request->seo_description,
                'show_in_footer' => $request->boolean('show_in_footer', $page->show_in_footer),
                'language' => $request->language ?? $page->language,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Page updated successfully',
                'data' => $page->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update page',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified page.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $store = $user->ownedStores()->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'No store found for this user. Please create a store first.',
                    'error_code' => 'NO_STORE_FOUND'
                ], 404);
            }

            $page = Page::forStore($store->id)->findOrFail($id);
            $page->delete();

            return response()->json([
                'success' => true,
                'message' => 'Page deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete page',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle page status.
     */
    public function toggleStatus(string $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $store = $user->ownedStores()->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'No store found for this user. Please create a store first.',
                    'error_code' => 'NO_STORE_FOUND'
                ], 404);
            }

            $page = Page::forStore($store->id)->findOrFail($id);
            $page->update([
                'status' => $page->status === 'active' ? 'inactive' : 'active'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Page status updated successfully',
                'data' => $page->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update page status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get public pages for a store (for frontend display).
     */
    public function publicPages(Request $request, string $storeSlug): JsonResponse
    {
        try {
            $store = Store::where('slug', $storeSlug)->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'No store found for this user. Please create a store first.',
                    'error_code' => 'NO_STORE_FOUND'
                ], 404);
            }

            $query = Page::forStore($store->id)->active();

            if ($request->has('show_in_footer') && $request->boolean('show_in_footer')) {
                $query->showInFooter();
            }

            if ($request->has('language')) {
                $query->language($request->language);
            }

            $pages = $query->orderBy('title')->get();

            return response()->json([
                'success' => true,
                'data' => $pages
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch public pages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific public page by SEO URL.
     */
    public function publicPage(Request $request, string $storeSlug, string $seoUrl): JsonResponse
    {
        try {
            $store = Store::where('slug', $storeSlug)->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'No store found for this user. Please create a store first.',
                    'error_code' => 'NO_STORE_FOUND'
                ], 404);
            }

            $page = Page::forStore($store->id)
                ->active()
                ->where('seo_url', $seoUrl)
                ->first();

            if (!$page) {
                return response()->json([
                    'success' => false,
                    'message' => 'Page not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $page
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch page',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
