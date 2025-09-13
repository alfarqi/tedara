<?php
// backend/setup_feras_tenant.php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\Tenant;
use App\Models\TenantDomain;
use App\Models\Theme;
use App\Models\TenantThemeSetting;
use App\Models\StorefrontPage;
use App\Models\StorefrontSection;
use Illuminate\Support\Str;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Setting up Feras tenant...\n";

try {
    // Create or find user
    $user = User::firstOrCreate(
        ['email' => 'feras@example.com'],
        [
            'name' => 'Feras',
            'phone' => '+966501234567',
            'password' => bcrypt('password123'),
            'role' => 'store_owner',
            'status' => 'active',
            'store_handle' => 'feras',
            'store_name' => 'Feras Store',
            'email_verified_at' => now(),
        ]
    );

    echo "User created/found: {$user->name}\n";

    // Create tenant
    $tenant = Tenant::firstOrCreate(
        ['handle' => 'feras'],
        [
            'display_name' => 'Feras Store',
            'status' => 'active',
        ]
    );

    echo "Tenant created/found: {$tenant->display_name}\n";

    // Create tenant domain
    TenantDomain::firstOrCreate(
        ['domain' => 'localhost', 'tenant_id' => $tenant->id],
        ['is_primary' => true]
    );

    echo "Tenant domain created/found\n";

    // Get classic theme
    $theme = Theme::where('key', 'classic')->first();
    if (!$theme) {
        $theme = Theme::create([
            'key' => 'classic',
            'name' => 'Classic Theme',
            'version' => '1.0.0',
            'is_enabled' => true,
        ]);
    }

    // Create theme settings
    TenantThemeSetting::firstOrCreate(
        ['tenant_id' => $tenant->id, 'theme_id' => $theme->id],
        [
            'settings' => [
                'primary_color' => '#6f42c1',
                'secondary_color' => '#6c757d',
                'font_family' => 'Inter, sans-serif',
                'store_name' => 'Feras Store',
                'contact_email' => 'feras@example.com',
                'contact_phone' => '+966501234567',
            ]
        ]
    );

    echo "Theme settings created/found\n";

    // Create sample pages
    $pages = [
        [
            'slug' => 'home',
            'title' => 'Welcome to Feras Store',
            'template' => 'default',
            'is_home' => true,
            'sections' => [
                [
                    'type' => 'hero',
                    'sort' => 1,
                    'props' => [
                        'title' => 'Welcome to Feras Store',
                        'subtitle' => 'Your trusted partner for quality products',
                        'cta_text' => 'Shop Now',
                        'cta_link' => '/catalog',
                        'show_search' => true,
                    ]
                ],
                [
                    'type' => 'featured_products',
                    'sort' => 2,
                    'props' => [
                        'title' => 'Featured Products',
                        'subtitle' => 'Check out our best sellers',
                        'limit' => 6,
                    ]
                ]
            ]
        ],
        [
            'slug' => 'catalog',
            'title' => 'Product Catalog',
            'template' => 'default',
            'is_home' => false,
            'sections' => [
                [
                    'type' => 'product_grid',
                    'sort' => 1,
                    'props' => [
                        'title' => 'All Products',
                        'show_filters' => true,
                        'show_sorting' => true,
                        'show_pagination' => true,
                    ]
                ]
            ]
        ],
        [
            'slug' => 'about',
            'title' => 'About Us',
            'template' => 'default',
            'is_home' => false,
            'sections' => [
                [
                    'type' => 'content',
                    'sort' => 1,
                    'props' => [
                        'title' => 'About Feras Store',
                        'content' => 'We are a trusted retailer providing quality products and exceptional service to our customers.',
                    ]
                ]
            ]
        ],
        [
            'slug' => 'contact',
            'title' => 'Contact Us',
            'template' => 'default',
            'is_home' => false,
            'sections' => [
                [
                    'type' => 'content',
                    'sort' => 1,
                    'props' => [
                        'title' => 'Get in Touch',
                        'content' => 'Contact us for any questions or support. We are here to help!',
                    ]
                ]
            ]
        ]
    ];

    foreach ($pages as $pageData) {
        $page = StorefrontPage::firstOrCreate(
            ['tenant_id' => $tenant->id, 'slug' => $pageData['slug']],
            [
                'title' => $pageData['title'],
                'template' => $pageData['template'],
                'is_home' => $pageData['is_home'],
                'seo' => [
                    'title' => $pageData['title'],
                    'description' => "{$pageData['title']} - Feras Store",
                ]
            ]
        );

        // Create sections for the page
        foreach ($pageData['sections'] as $sectionData) {
            StorefrontSection::firstOrCreate(
                ['page_id' => $page->id, 'type' => $sectionData['type'], 'sort' => $sectionData['sort']],
                ['props' => $sectionData['props']]
            );
        }

        echo "Page created/found: {$page->title}\n";
    }

    echo "\n✅ Setup complete! You can now test the storefront at:\n";
    echo "http://localhost:5174/feras/\n";
    echo "http://localhost:5174/feras/catalog\n";
    echo "http://localhost:5174/feras/about\n";
    echo "http://localhost:5174/feras/contact\n\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
