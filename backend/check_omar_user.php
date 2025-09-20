<?php
// backend/check_omar_user.php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\Tenant;
use App\Models\TenantDomain;
use App\Models\TenantThemeSetting;
use App\Models\StorefrontPage;
use App\Models\StorefrontSection;
use App\Models\Theme;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Checking Omar user and tenant...\n";

// Find Omar user
$omarUser = User::where('name', 'Omar')->orWhere('store_name', 'Omran')->first();
if (!$omarUser) {
    echo "❌ Omar user not found\n";
    exit(1);
}

echo "Found Omar user: {$omarUser->name} - {$omarUser->store_name}\n";
echo "Store handle: {$omarUser->store_handle}\n";

// Check if tenant exists
$tenant = Tenant::where('handle', $omarUser->store_handle)->first();
if (!$tenant) {
    echo "❌ Tenant not found for handle: {$omarUser->store_handle}\n";
    echo "Creating tenant...\n";
    
    // Create tenant
    $tenant = Tenant::create([
        'handle' => $omarUser->store_handle,
        'display_name' => $omarUser->store_name,
        'status' => 'active',
    ]);
    
    echo "✅ Tenant created: {$tenant->handle} - {$tenant->display_name}\n";
} else {
    echo "✅ Tenant found: {$tenant->handle} - {$tenant->display_name}\n";
}

// Check domains
$domains = TenantDomain::where('tenant_id', $tenant->id)->get();
if ($domains->isEmpty()) {
    echo "Creating domains...\n";
    
    // Create localhost domain
    TenantDomain::create([
        'tenant_id' => $tenant->id,
        'domain' => 'localhost',
        'is_primary' => true,
    ]);
    
    // Create path domain
    TenantDomain::create([
        'tenant_id' => $tenant->id,
        'domain' => $tenant->handle,
        'is_primary' => false,
    ]);
    
    echo "✅ Domains created\n";
} else {
    echo "✅ Domains exist\n";
}

// Check theme settings
$themeSettings = TenantThemeSetting::where('tenant_id', $tenant->id)->first();
if (!$themeSettings) {
    echo "Creating theme settings...\n";
    
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
    TenantThemeSetting::create([
        'tenant_id' => $tenant->id,
        'theme_id' => $theme->id,
        'settings' => [
            'primary_color' => '#6f42c1',
            'secondary_color' => '#6c757d',
            'font_family' => 'Inter, sans-serif',
            'store_name' => $tenant->display_name,
            'contact_email' => $omarUser->email,
            'contact_phone' => $omarUser->phone ?? '+1 (555) 123-4567',
        ]
    ]);
    
    echo "✅ Theme settings created\n";
} else {
    echo "✅ Theme settings exist\n";
}

// Check pages
$pages = StorefrontPage::where('tenant_id', $tenant->id)->get();
if ($pages->isEmpty()) {
    echo "Creating pages...\n";
    
    // Create home page
    $homePage = StorefrontPage::create([
        'tenant_id' => $tenant->id,
        'slug' => 'home',
        'title' => 'Welcome to ' . $tenant->display_name,
        'template' => 'default',
        'seo' => [
            'title' => 'Welcome to ' . $tenant->display_name,
            'description' => 'Discover amazing products at ' . $tenant->display_name,
        ],
        'is_home' => true,
    ]);
    
    // Create hero section for home page
    StorefrontSection::create([
        'page_id' => $homePage->id,
        'type' => 'hero',
        'sort' => 1,
        'props' => [
            'title' => 'Welcome to ' . $tenant->display_name,
            'subtitle' => 'Your trusted partner for quality products',
            'cta_text' => 'Shop Now',
            'cta_link' => '/catalog',
            'show_search' => true,
        ]
    ]);
    
    // Create featured products section
    StorefrontSection::create([
        'page_id' => $homePage->id,
        'type' => 'featured_products',
        'sort' => 2,
        'props' => [
            'title' => 'Featured Products',
            'subtitle' => 'Check out our best sellers',
            'limit' => 6,
        ]
    ]);
    
    echo "✅ Home page created\n";
    
    // Create catalog page
    $catalogPage = StorefrontPage::create([
        'tenant_id' => $tenant->id,
        'slug' => 'catalog',
        'title' => 'Product Catalog',
        'template' => 'default',
        'seo' => [
            'title' => 'Product Catalog - ' . $tenant->display_name,
            'description' => 'Browse our complete product catalog',
        ],
        'is_home' => false,
    ]);
    
    // Create product grid section for catalog page
    StorefrontSection::create([
        'page_id' => $catalogPage->id,
        'type' => 'product_grid',
        'sort' => 1,
        'props' => [
            'title' => 'All Products',
            'show_filters' => true,
            'show_sorting' => true,
            'show_pagination' => true,
        ]
    ]);
    
    echo "✅ Catalog page created\n";
    
    // Create about page
    $aboutPage = StorefrontPage::create([
        'tenant_id' => $tenant->id,
        'slug' => 'about',
        'title' => 'About Us',
        'template' => 'default',
        'seo' => [
            'title' => 'About Us - ' . $tenant->display_name,
            'description' => 'Learn more about ' . $tenant->display_name,
        ],
        'is_home' => false,
    ]);
    
    // Create content section for about page
    StorefrontSection::create([
        'page_id' => $aboutPage->id,
        'type' => 'content',
        'sort' => 1,
        'props' => [
            'title' => 'About ' . $tenant->display_name,
            'content' => 'We are a trusted retailer providing quality products and exceptional service to our customers.',
        ]
    ]);
    
    echo "✅ About page created\n";
    
    // Create contact page
    $contactPage = StorefrontPage::create([
        'tenant_id' => $tenant->id,
        'slug' => 'contact',
        'title' => 'Contact Us',
        'template' => 'default',
        'seo' => [
            'title' => 'Contact Us - ' . $tenant->display_name,
            'description' => 'Get in touch with ' . $tenant->display_name,
        ],
        'is_home' => false,
    ]);
    
    // Create content section for contact page
    StorefrontSection::create([
        'page_id' => $contactPage->id,
        'type' => 'content',
        'sort' => 1,
        'props' => [
            'title' => 'Get in Touch',
            'content' => 'Contact us for any questions or support. We are here to help!',
        ]
    ]);
    
    echo "✅ Contact page created\n";
    
    echo "\n✅ All pages created successfully!\n";
} else {
    echo "✅ Pages already exist\n";
}

echo "\n✅ Setup complete! You can now test the storefront at:\n";
echo "http://localhost:5174/{$tenant->handle}/\n";
echo "http://localhost:5174/{$tenant->handle}/catalog\n";
echo "http://localhost:5174/{$tenant->handle}/about\n";
echo "http://localhost:5174/{$tenant->handle}/contact\n\n";








