<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\Store\StoreStoreRequest;
use App\Http\Requests\Api\Store\UpdateStoreRequest;
use App\Models\Store;
use App\Helpers\UrlHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoreController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Store::class);

        $query = Store::with(['owner']);

        // Apply user-specific filtering
        if ($request->user()->isStoreOwner()) {
            $query->where('owner_id', $request->user()->id);
        }

        // Apply filters
        $query = $this->applyFilters($query, $request);

        // Apply sorting
        $query = $this->applySorting($query, $request);

        // Apply date range
        $query = $this->applyDateRange($query, $request);

        // Paginate results
        $perPage = $request->get('per_page', 15);
        $perPage = min($perPage, 100); // Limit to 100 per page

        $stores = $query->paginate($perPage);

        // Build full logo and banner URLs for all stores
        $stores->getCollection()->transform(function ($store) {
            if ($store->logo) {
                $store->logo = UrlHelper::buildLogoUrl($store->logo);
            }
            
            // Build full banner URL if banner exists - handle settings properly
            $settings = $store->settings ?? [];
            if (isset($settings['banner_image']) && $settings['banner_image']) {
                $settings['banner_image'] = UrlHelper::buildFileUrl($settings['banner_image']);
                $store->settings = $settings;
            }
            
            return $store;
        });

        return $this->paginatedResponse($stores, 'Stores retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStoreRequest $request): JsonResponse
    {
        $this->authorize('create', Store::class);

        try {
            DB::beginTransaction();

            $data = $request->validated();
            $user = $request->user();

            // Add owner_id based on authenticated user
            if ($user->isStoreOwner()) {
                $data['owner_id'] = $user->id;
            }

            $store = Store::create($data);

            // Update user's store_handle and store_name with the actual store information
            if ($user->isStoreOwner()) {
                $storeHandle = \Illuminate\Support\Str::slug($data['name']);
                
                // Ensure store handle is unique
                $originalHandle = $storeHandle;
                $counter = 1;
                while (\App\Models\User::where('store_handle', $storeHandle)->where('id', '!=', $user->id)->exists()) {
                    $storeHandle = $originalHandle . '-' . $counter;
                    $counter++;
                }
                
                $user->update([
                    'store_handle' => $storeHandle,
                    'store_name' => $data['name'],
                ]);
                
                \Log::info('StoreController: Updated user store information', [
                    'user_id' => $user->id,
                    'store_handle' => $storeHandle,
                    'store_name' => $data['name'],
                ]);
                
                // Create or update tenant with the store information
                $tenant = \App\Models\Tenant::where('handle', $user->store_handle)->first();
                
                if (!$tenant) {
                    // Create new tenant
                    $tenant = \App\Models\Tenant::create([
                        'handle' => $storeHandle,
                        'display_name' => $data['name'],
                        'status' => 'active',
                    ]);
                    
                    // Create primary domain
                    $primaryDomain = $storeHandle . '.localhost';
                    \App\Models\TenantDomain::create([
                        'tenant_id' => $tenant->id,
                        'domain' => $primaryDomain,
                        'is_primary' => true,
                    ]);
                    
                    // Assign classic theme with default settings
                    $theme = \App\Models\Theme::where('key', 'classic')->first();
                    if ($theme) {
                        \App\Models\TenantThemeSetting::create([
                            'tenant_id' => $tenant->id,
                            'theme_id' => $theme->id,
                            'settings' => $this->getDefaultThemeSettings($data['name']),
                        ]);
                    }
                    
                    // Create default pages
                    $this->createDefaultPages($tenant);
                    
                    \Log::info('StoreController: Created tenant for store', [
                        'tenant_id' => $tenant->id,
                        'handle' => $storeHandle,
                        'display_name' => $data['name'],
                    ]);
                } else {
                    // Update existing tenant
                    $tenant->update([
                        'display_name' => $data['name'],
                    ]);
                    
                    \Log::info('StoreController: Updated existing tenant', [
                        'tenant_id' => $tenant->id,
                        'handle' => $storeHandle,
                        'display_name' => $data['name'],
                    ]);
                }
            }

            DB::commit();

            return $this->createdResponse($store->load(['owner']), 'Store created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('StoreController: Failed to create store', [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return $this->serverErrorResponse('Failed to create store: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        $storeData = $store->load(['owner']);
        
        // Build full logo URL if logo exists
        if ($storeData->logo) {
            $storeData->logo = UrlHelper::buildLogoUrl($storeData->logo);
        }
        
        // Build full banner URL if banner exists - handle settings properly
        $settings = $storeData->settings ?? [];
        if (isset($settings['banner_image']) && $settings['banner_image']) {
            $settings['banner_image'] = UrlHelper::buildFileUrl($settings['banner_image']);
            $storeData->settings = $settings;
        }

        return $this->successResponse(
            $storeData,
            'Store retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStoreRequest $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        try {
            DB::beginTransaction();

            $data = $request->validated();
            
            // Handle settings merging
            if (isset($data['settings'])) {
                $currentSettings = $store->settings ?? [];
                $data['settings'] = array_merge($currentSettings, $data['settings']);
            }
            
            $store->update($data);

            DB::commit();

            $storeData = $store->load(['owner']);
            
            // Build full logo URL if logo exists
            if ($storeData->logo) {
                $storeData->logo = UrlHelper::buildLogoUrl($storeData->logo);
            }
            
            // Build full banner URL if banner exists - handle settings properly
            $settings = $storeData->settings ?? [];
            if (isset($settings['banner_image']) && $settings['banner_image']) {
                $settings['banner_image'] = UrlHelper::buildFileUrl($settings['banner_image']);
                $storeData->settings = $settings;
            }

            return $this->successResponse(
                $storeData,
                'Store updated successfully'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to update store: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store): JsonResponse
    {
        $this->authorize('delete', $store);

        try {
            DB::beginTransaction();

            $store->delete();

            DB::commit();

            return $this->noContentResponse('Store deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to delete store: ' . $e->getMessage());
        }
    }

    /**
     * Get store statistics.
     */
    public function statistics(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        $statistics = [
            'total_products' => $store->products()->count(),
            'total_orders' => $store->orders()->count(),
            'total_customers' => $store->customers()->count(),
            'total_revenue' => $store->orders()->where('status', 'completed')->sum('total_amount'),
            'pending_orders' => $store->orders()->where('status', 'pending')->count(),
            'low_stock_products' => $store->products()->where('stock', '<', 10)->count(),
        ];

        return $this->successResponse($statistics, 'Store statistics retrieved successfully');
    }

    /**
     * Get store settings.
     */
    public function settings(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        return $this->successResponse(
            $store->settings,
            'Store settings retrieved successfully'
        );
    }

    /**
     * Update store settings.
     */
    public function updateSettings(Request $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $validator = $request->validate([
            'settings' => 'required|array',
            'settings.maintenance_mode' => 'boolean',
            'settings.auto_backup' => 'boolean',
            'settings.email_notifications' => 'boolean',
            'settings.sms_notifications' => 'boolean',
            // Store information fields
            'settings.contact_email' => 'nullable|email|max:255',
            'settings.contact_phone' => 'nullable|string|max:50',
            'settings.banner_image' => 'nullable|string|max:500',
            // Social media fields
            'settings.instagram' => 'nullable|url|max:255',
            'settings.whatsapp' => 'nullable|string|max:255',
            'settings.facebook' => 'nullable|url|max:255',
            'settings.twitter' => 'nullable|url|max:255',
            'settings.linkedin' => 'nullable|url|max:255',
            // Social links object
            'settings.social_links' => 'nullable|array',
            'settings.social_links.instagram' => 'nullable|url|max:255',
            'settings.social_links.whatsapp' => 'nullable|string|max:255',
            'settings.social_links.facebook' => 'nullable|url|max:255',
            'settings.social_links.twitter' => 'nullable|url|max:255',
            'settings.social_links.linkedin' => 'nullable|url|max:255',
        ]);

        try {
            DB::beginTransaction();

            $store->update(['settings' => $validator['settings']]);

            DB::commit();

            // Build full banner URL if banner exists - handle settings properly
            $settings = $store->settings ?? [];
            if (isset($settings['banner_image']) && $settings['banner_image']) {
                $settings['banner_image'] = UrlHelper::buildFileUrl($settings['banner_image']);
            }

            return $this->successResponse(
                $settings,
                'Store settings updated successfully'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to update store settings: ' . $e->getMessage());
        }
    }

    /**
     * Apply filters to the query.
     */
    protected function applyFilters($query, Request $request)
    {
        // Search filter
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('domain', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('filter.status')) {
            $query->where('status', $request->get('filter.status'));
        }

        // Currency filter
        if ($request->filled('filter.currency')) {
            $query->where('currency', $request->get('filter.currency'));
        }

        // Language filter
        if ($request->filled('filter.language')) {
            $query->where('language', $request->get('filter.language'));
        }

        // Owner filter (for super admins)
        if ($request->filled('filter.owner_id')) {
            $query->where('owner_id', $request->get('filter.owner_id'));
        }

        return $query;
    }

    /**
     * Apply sorting to the query.
     */
    protected function applySorting($query, Request $request)
    {
        $sortFields = $request->get('sort', 'created_at');
        $sortFields = explode(',', $sortFields);

        foreach ($sortFields as $sortField) {
            $direction = 'asc';
            if (str_starts_with($sortField, '-')) {
                $direction = 'desc';
                $sortField = substr($sortField, 1);
            }

            // Validate sort field
            $allowedFields = [
                'name', 'domain', 'status', 'created_at', 'updated_at',
                'currency', 'language', 'timezone'
            ];

            if (in_array($sortField, $allowedFields)) {
                $query->orderBy($sortField, $direction);
            }
        }

        return $query;
    }

    /**
     * Apply date range filter to the query.
     */
    protected function applyDateRange($query, Request $request)
    {
        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->get('from'));
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->get('to'));
        }

        return $query;
    }

    /**
     * Check if domain is available.
     */
    public function checkDomainAvailability(Request $request): JsonResponse
    {
        $validator = $request->validate([
            'domain' => 'required|string|regex:/^[a-z0-9\-]+$/|min:3|max:255'
        ]);

        $domain = $validator['domain'];
        $isAvailable = !Store::where('domain', $domain)->exists();

        return $this->successResponse([
            'domain' => $domain,
            'available' => $isAvailable,
            'message' => $isAvailable ? 'Domain is available' : 'Domain is already taken'
        ], 'Domain availability checked');
    }


    /**
     * Get default theme settings for the tenant.
     */
    private function getDefaultThemeSettings(string $storeName): array
    {
        return [
            'primary_color' => '#6f42c1',
            'secondary_color' => '#6c757d',
            'font_family' => 'Inter, sans-serif',
            'header_style' => 'classic',
            'footer_style' => 'simple',
            'logo_url' => '/images/logo.png',
            'favicon_url' => '/images/favicon.ico',
            'store_name' => $storeName,
            'contact_email' => 'contact@' . \Illuminate\Support\Str::slug($storeName) . '.com',
            'contact_phone' => '+1 (555) 123-4567',
            'social_links' => [
                'facebook' => '',
                'twitter' => '',
                'instagram' => '',
                'linkedin' => '',
            ],
        ];
    }

    /**
     * Create default pages for the tenant.
     */
    private function createDefaultPages(\App\Models\Tenant $tenant): void
    {
        try {
            \Log::info('StoreController: Creating default pages', [
                'tenant_id' => $tenant->id,
                'handle' => $tenant->handle,
            ]);
            
            // Create home page
            $homePage = \App\Models\StorefrontPage::create([
                'tenant_id' => $tenant->id,
                'slug' => 'home',
                'title' => 'Welcome to ' . $tenant->display_name,
                'template' => 'home',
                'seo_json' => [
                    'title' => 'Welcome to ' . $tenant->display_name,
                    'description' => 'Discover amazing products at ' . $tenant->display_name,
                    'keywords' => 'store, shopping, products, ' . $tenant->handle,
                ],
                'is_home' => true,
            ]);

            // Create sections for home page
            $this->createHomePageSections($homePage, $tenant);

            // Create catalog page
            $catalogPage = \App\Models\StorefrontPage::create([
                'tenant_id' => $tenant->id,
                'slug' => 'catalog',
                'title' => 'Product Catalog',
                'template' => 'catalog',
                'seo_json' => [
                    'title' => 'Product Catalog - ' . $tenant->display_name,
                    'description' => 'Browse our complete product catalog',
                    'keywords' => 'catalog, products, shop, ' . $tenant->handle,
                ],
                'is_home' => false,
            ]);

            // Create sections for catalog page
            $this->createCatalogPageSections($catalogPage);

            // Create about page
            $aboutPage = \App\Models\StorefrontPage::create([
                'tenant_id' => $tenant->id,
                'slug' => 'about',
                'title' => 'About Us',
                'template' => 'about',
                'seo_json' => [
                    'title' => 'About Us - ' . $tenant->display_name,
                    'description' => 'Learn more about ' . $tenant->display_name,
                    'keywords' => 'about, company, ' . $tenant->handle,
                ],
                'is_home' => false,
            ]);

            // Create sections for about page
            $this->createAboutPageSections($aboutPage);

            // Create contact page
            $contactPage = \App\Models\StorefrontPage::create([
                'tenant_id' => $tenant->id,
                'slug' => 'contact',
                'title' => 'Contact Us',
                'template' => 'contact',
                'seo_json' => [
                    'title' => 'Contact Us - ' . $tenant->display_name,
                    'description' => 'Get in touch with ' . $tenant->display_name,
                    'keywords' => 'contact, support, ' . $tenant->handle,
                ],
                'is_home' => false,
            ]);

            // Create sections for contact page
            $this->createContactPageSections($contactPage);
            
            \Log::info('StoreController: Default pages created successfully', [
                'tenant_id' => $tenant->id,
                'handle' => $tenant->handle,
            ]);
        } catch (\Exception $e) {
            \Log::error('StoreController: Failed to create default pages', [
                'tenant_id' => $tenant->id,
                'handle' => $tenant->handle,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Create sections for home page.
     */
    private function createHomePageSections(\App\Models\StorefrontPage $page, \App\Models\Tenant $tenant): void
    {
        // Hero section
        \App\Models\StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'hero',
            'props' => json_encode([
                'title' => 'Welcome to ' . $tenant->display_name,
                'subtitle' => 'Discover amazing products and great deals',
                'button_text' => 'Shop Now',
                'button_link' => '/catalog',
                'background_image' => '/images/hero-bg.jpg',
            ]),
            'sort' => 1,
        ]);

        // Product grid section
        \App\Models\StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'product_grid',
            'props' => json_encode([
                'title' => 'Featured Products',
                'limit' => 8,
                'show_prices' => true,
                'show_add_to_cart' => true,
            ]),
            'sort' => 2,
        ]);

        // Content section
        \App\Models\StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'content',
            'props' => json_encode([
                'title' => 'About Our Store',
                'text' => 'We are committed to providing high-quality products and excellent customer service. Shop with confidence knowing that your satisfaction is our priority.',
            ]),
            'sort' => 3,
        ]);
    }

    /**
     * Create sections for catalog page.
     */
    private function createCatalogPageSections(\App\Models\StorefrontPage $page): void
    {
        \App\Models\StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'product_grid',
            'props' => json_encode([
                'title' => 'All Products',
                'limit' => 20,
                'show_prices' => true,
                'show_add_to_cart' => true,
                'show_filters' => true,
            ]),
            'sort' => 1,
        ]);
    }

    /**
     * Create sections for about page.
     */
    private function createAboutPageSections(\App\Models\StorefrontPage $page): void
    {
        \App\Models\StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'content',
            'props' => json_encode([
                'title' => 'Our Story',
                'text' => 'We are passionate about providing quality products and exceptional service to our customers.',
            ]),
            'sort' => 1,
        ]);
    }

    /**
     * Create sections for contact page.
     */
    private function createContactPageSections(\App\Models\StorefrontPage $page): void
    {
        \App\Models\StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'contact_form',
            'props' => json_encode([
                'title' => 'Get In Touch',
                'email' => 'contact@example.com',
                'phone' => '+1 (555) 123-4567',
                'address' => '123 Main Street, City, State 12345',
            ]),
            'sort' => 1,
        ]);
    }
}


