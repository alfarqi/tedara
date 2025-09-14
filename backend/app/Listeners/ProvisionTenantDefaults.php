<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Models\StorefrontPage;
use App\Models\StorefrontSection;
use App\Models\Tenant;
use App\Models\TenantDomain;
use App\Models\TenantThemeSetting;
use App\Models\Theme;
use Illuminate\Support\Str;

class ProvisionTenantDefaults
{

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserRegistered $event): void
    {
        try {
            $user = $event->user;
            
            // Log the event
            \Log::info('ProvisionTenantDefaults: Starting tenant creation for user', [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'store_handle' => $user->store_handle,
                'store_name' => $user->store_name,
            ]);
            
            // Extract store information from user
            $storeHandle = $user->store_handle ?? Str::slug($user->name);
            $storeName = $user->store_name ?? $user->name . "'s Store";
            
            // Ensure store handle is not empty
            if (empty($storeHandle)) {
                $storeHandle = Str::slug($user->name);
                \Log::warning('ProvisionTenantDefaults: Empty store_handle, using name slug', [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'generated_handle' => $storeHandle,
                ]);
            }
            
            // Final fallback
            if (empty($storeHandle)) {
                $storeHandle = 'store-' . $user->id;
                \Log::warning('ProvisionTenantDefaults: Still empty handle, using user ID', [
                    'user_id' => $user->id,
                    'generated_handle' => $storeHandle,
                ]);
            }
            
            // Update user's store_handle if it was empty
            if (empty($user->store_handle)) {
                $user->store_handle = $storeHandle;
                if (empty($user->store_name)) {
                    $user->store_name = $user->name . "'s Store";
                }
                $user->save();
                
                \Log::info('ProvisionTenantDefaults: Updated user store_handle', [
                    'user_id' => $user->id,
                    'new_store_handle' => $storeHandle,
                    'new_store_name' => $user->store_name,
                ]);
            }
            
            // Check if tenant already exists
            $existingTenant = Tenant::where('handle', $storeHandle)->first();
            if ($existingTenant) {
                \Log::info('ProvisionTenantDefaults: Tenant already exists, skipping', [
                    'tenant_id' => $existingTenant->id,
                    'handle' => $storeHandle,
                ]);
                return;
            }
            
            // Create tenant
            $tenant = Tenant::create([
                'handle' => $storeHandle,
                'display_name' => $storeName,
                'status' => 'active',
            ]);
            
            \Log::info('ProvisionTenantDefaults: Tenant created successfully', [
                'tenant_id' => $tenant->id,
                'handle' => $storeHandle,
            ]);

            // Create primary domain (use localhost for development)
            $primaryDomain = $storeHandle . '.localhost';
            TenantDomain::create([
                'tenant_id' => $tenant->id,
                'domain' => $primaryDomain,
                'is_primary' => true,
            ]);
            
            \Log::info('ProvisionTenantDefaults: Domain created', [
                'domain' => $primaryDomain,
            ]);

            // Assign classic theme with default settings
            $theme = Theme::where('key', 'classic')->first();
            if ($theme) {
                TenantThemeSetting::create([
                    'tenant_id' => $tenant->id,
                    'theme_id' => $theme->id,
                    'settings' => $this->getDefaultThemeSettings($storeName),
                ]);
                
                \Log::info('ProvisionTenantDefaults: Theme settings created', [
                    'theme_id' => $theme->id,
                ]);
            } else {
                \Log::warning('ProvisionTenantDefaults: Classic theme not found');
            }

            // Create default pages
            $this->createDefaultPages($tenant);
            
            \Log::info('ProvisionTenantDefaults: Tenant provisioning completed successfully', [
                'tenant_id' => $tenant->id,
                'handle' => $storeHandle,
            ]);
            
        } catch (\Exception $e) {
            \Log::error('ProvisionTenantDefaults: Failed to create tenant', [
                'user_id' => $user->id ?? null,
                'user_name' => $user->name ?? null,
                'store_handle' => $user->store_handle ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Re-throw the exception so it can be handled by the application
            throw $e;
        }
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
            'contact_email' => 'contact@' . Str::slug($storeName) . '.com',
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
    private function createDefaultPages(Tenant $tenant): void
    {
        try {
            \Log::info('ProvisionTenantDefaults: Creating default pages', [
                'tenant_id' => $tenant->id,
                'handle' => $tenant->handle,
            ]);
            
            // Create home page
            $homePage = StorefrontPage::create([
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
        $catalogPage = StorefrontPage::create([
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
        $aboutPage = StorefrontPage::create([
            'tenant_id' => $tenant->id,
            'slug' => 'about',
            'title' => 'About Us',
            'template' => 'page',
            'seo_json' => [
                'title' => 'About Us - ' . $tenant->display_name,
                'description' => 'Learn more about ' . $tenant->display_name . ' and our mission',
                'keywords' => 'about, company, ' . $tenant->handle,
            ],
            'is_home' => false,
        ]);

        // Create sections for about page
        $this->createAboutPageSections($aboutPage, $tenant);

        // Create contact page
        $contactPage = StorefrontPage::create([
            'tenant_id' => $tenant->id,
            'slug' => 'contact',
            'title' => 'Contact Us',
            'template' => 'page',
            'seo_json' => [
                'title' => 'Contact Us - ' . $tenant->display_name,
                'description' => 'Get in touch with ' . $tenant->display_name . ' for any questions or support',
                'keywords' => 'contact, support, ' . $tenant->handle,
            ],
            'is_home' => false,
        ]);

        // Create sections for contact page
        $this->createContactPageSections($contactPage, $tenant);
        
        \Log::info('ProvisionTenantDefaults: Default pages created successfully', [
            'tenant_id' => $tenant->id,
            'handle' => $tenant->handle,
        ]);
        
        } catch (\Exception $e) {
            \Log::error('ProvisionTenantDefaults: Failed to create default pages', [
                'tenant_id' => $tenant->id,
                'handle' => $tenant->handle,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Re-throw the exception so it can be handled by the application
            throw $e;
        }
    }

    /**
     * Create sections for the home page.
     */
    private function createHomePageSections(StorefrontPage $page, Tenant $tenant): void
    {
        // Hero section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'hero',
            'sort' => 1,
            'props' => [
                'title' => 'Welcome to ' . $tenant->display_name,
                'subtitle' => 'Discover amazing products and great deals',
                'background_image' => '/images/hero-bg.jpg',
                'cta_text' => 'Shop Now',
                'cta_link' => '/catalog',
                'show_search' => true,
            ]
        ]);

        // Featured products section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'featured_products',
            'sort' => 2,
            'props' => [
                'title' => 'Featured Products',
                'subtitle' => 'Check out our most popular items',
                'limit' => 6,
                'show_prices' => true,
                'show_ratings' => true,
                'layout' => 'grid',
            ]
        ]);

        // Categories section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'categories',
            'sort' => 3,
            'props' => [
                'title' => 'Shop by Category',
                'subtitle' => 'Find what you\'re looking for',
                'show_images' => true,
                'layout' => 'grid',
                'columns' => 3,
            ]
        ]);

        // Newsletter signup
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'newsletter',
            'sort' => 4,
            'props' => [
                'title' => 'Stay Updated',
                'subtitle' => 'Subscribe to our newsletter for the latest deals',
                'placeholder' => 'Enter your email address',
                'button_text' => 'Subscribe',
                'background_color' => '#f8f9fa',
            ]
        ]);
    }

    /**
     * Create sections for the catalog page.
     */
    private function createCatalogPageSections(StorefrontPage $page): void
    {
        // Product grid section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'product_grid',
            'sort' => 1,
            'props' => [
                'title' => 'All Products',
                'show_filters' => true,
                'show_sorting' => true,
                'items_per_page' => 12,
                'layout' => 'grid',
                'show_pagination' => true,
            ]
        ]);

        // Category filters
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'category_filters',
            'sort' => 2,
            'props' => [
                'show_categories' => true,
                'show_price_range' => true,
                'show_brands' => true,
                'layout' => 'sidebar',
            ]
        ]);
    }

    /**
     * Create sections for the about page.
     */
    private function createAboutPageSections(StorefrontPage $page, Tenant $tenant): void
    {
        // Hero section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'hero',
            'sort' => 1,
            'props' => [
                'title' => 'About ' . $tenant->display_name,
                'subtitle' => 'Our story and mission',
                'background_image' => '/images/about-hero.jpg',
                'height' => 'medium',
            ]
        ]);

        // Content section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'content',
            'sort' => 2,
            'props' => [
                'title' => 'Our Story',
                'content' => 'We are a leading online store committed to providing high-quality products and exceptional customer service. Our mission is to make shopping convenient and enjoyable for our customers.',
                'image' => '/images/about-story.jpg',
                'image_position' => 'left',
            ]
        ]);

        // Team section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'team',
            'sort' => 3,
            'props' => [
                'title' => 'Meet Our Team',
                'subtitle' => 'The people behind ' . $tenant->display_name,
                'show_photos' => true,
                'layout' => 'grid',
                'columns' => 3,
            ]
        ]);

        // Values section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'values',
            'sort' => 4,
            'props' => [
                'title' => 'Our Values',
                'values' => [
                    [
                        'title' => 'Quality',
                        'description' => 'We provide only the highest quality products',
                        'icon' => 'ti ti-award'
                    ],
                    [
                        'title' => 'Service',
                        'description' => 'Exceptional customer service is our priority',
                        'icon' => 'ti ti-headset'
                    ],
                    [
                        'title' => 'Innovation',
                        'description' => 'We continuously improve our offerings',
                        'icon' => 'ti ti-bulb'
                    ]
                ],
                'layout' => 'grid',
                'columns' => 3,
            ]
        ]);
    }

    /**
     * Create sections for the contact page.
     */
    private function createContactPageSections(StorefrontPage $page, Tenant $tenant): void
    {
        // Contact info section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'contact_info',
            'sort' => 1,
            'props' => [
                'title' => 'Get in Touch',
                'subtitle' => 'We would love to hear from you',
                'email' => 'contact@' . $tenant->handle . '.com',
                'phone' => '+1 (555) 123-4567',
                'address' => '123 Business Street, City, State 12345',
                'hours' => 'Monday - Friday: 9:00 AM - 6:00 PM',
                'show_map' => true,
            ]
        ]);

        // Contact form section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'contact_form',
            'sort' => 2,
            'props' => [
                'title' => 'Send us a Message',
                'subtitle' => 'Fill out the form below and we\'ll get back to you',
                'fields' => [
                    'name' => ['required' => true, 'label' => 'Full Name'],
                    'email' => ['required' => true, 'label' => 'Email Address'],
                    'phone' => ['required' => false, 'label' => 'Phone Number'],
                    'subject' => ['required' => true, 'label' => 'Subject'],
                    'message' => ['required' => true, 'label' => 'Message', 'type' => 'textarea'],
                ],
                'submit_text' => 'Send Message',
                'success_message' => 'Thank you for your message. We\'ll get back to you soon!',
            ]
        ]);

        // FAQ section
        StorefrontSection::create([
            'page_id' => $page->id,
            'type' => 'faq',
            'sort' => 3,
            'props' => [
                'title' => 'Frequently Asked Questions',
                'subtitle' => 'Find answers to common questions',
                'faqs' => [
                    [
                        'question' => 'What is your return policy?',
                        'answer' => 'We offer a 30-day return policy for all items in original condition.'
                    ],
                    [
                        'question' => 'How long does shipping take?',
                        'answer' => 'Standard shipping takes 3-5 business days, express shipping takes 1-2 business days.'
                    ],
                    [
                        'question' => 'Do you offer international shipping?',
                        'answer' => 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
                    ]
                ],
                'layout' => 'accordion',
            ]
        ]);
    }
}



