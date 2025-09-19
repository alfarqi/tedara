# 🧪 Storefront Testing Guide for User "feras"

## Prerequisites

Make sure both servers are running:

1. **Laravel Backend**: `http://localhost:8000`
2. **Storefront Frontend**: `http://localhost:5173`

## 🚀 Step-by-Step Testing Process

### Step 1: Create a User with Store Handle

First, you need to create a user with a `store_handle` field. You can do this through:

#### Option A: Registration API
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Feras",
    "email": "feras@example.com",
    "phone": "+966501234567",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "store_owner",
    "store_name": "Feras Store",
    "store_handle": "feras-store"
  }'
```

#### Option B: Direct Database Insert
```sql
INSERT INTO users (name, email, phone, password, role, status, store_handle, store_name, created_at, updated_at) 
VALUES ('Feras', 'feras@example.com', '+966501234567', '$2y$10$...', 'store_owner', 'active', 'feras-store', 'Feras Store', NOW(), NOW());
```

### Step 2: Create Tenant Data

After user creation, you need to create tenant data. You can use the console command:

```bash
php artisan tenant:provision {user_id}
```

Or manually create tenant data:

```sql
-- Create tenant
INSERT INTO tenants (id, handle, display_name, status, created_at, updated_at)
VALUES (UUID(), 'feras-store', 'Feras Store', 'active', NOW(), NOW());

-- Create tenant domain
INSERT INTO tenant_domains (id, tenant_id, domain, is_primary, created_at, updated_at)
VALUES (UUID(), (SELECT id FROM tenants WHERE handle = 'feras-store'), 'localhost', true, NOW(), NOW());

-- Create theme settings
INSERT INTO tenant_theme_settings (id, tenant_id, theme_id, settings, created_at, updated_at)
VALUES (UUID(), (SELECT id FROM tenants WHERE handle = 'feras-store'), (SELECT id FROM themes WHERE key = 'classic'), '{}', NOW(), NOW());
```

### Step 3: Test Storefront URLs

Once the tenant is set up, you can test the storefront at these URLs:

#### Main Storefront URLs
```
http://localhost:5173/feras-store/
http://localhost:5173/feras-store/catalog
http://localhost:5173/feras-store/about
http://localhost:5173/feras-store/contact
```

#### Product URLs (if products exist)
```
http://localhost:5173/feras-store/product/sample-product-1
http://localhost:5173/feras-store/product/sample-product-2
```

### Step 4: Test API Endpoints

Test the Laravel API endpoints directly:

#### Theme API
```bash
curl http://localhost:8000/api/storefront/feras-store/theme
```

#### Pages API
```bash
curl http://localhost:8000/api/storefront/feras-store/page/home
curl http://localhost:8000/api/storefront/feras-store/page/catalog
```

#### Products API
```bash
curl http://localhost:8000/api/storefront/feras-store/products
curl http://localhost:8000/api/storefront/feras-store/products/sample-product-1
```

## 🔧 Quick Setup Script

Create a setup script to automate the process:

```php
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
            'store_handle' => 'feras-store',
            'store_name' => 'Feras Store',
            'email_verified_at' => now(),
        ]
    );

    echo "User created/found: {$user->name}\n";

    // Create tenant
    $tenant = Tenant::firstOrCreate(
        ['handle' => 'feras-store'],
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
    echo "http://localhost:5173/feras-store/\n";
    echo "http://localhost:5173/feras-store/catalog\n";
    echo "http://localhost:5173/feras-store/about\n";
    echo "http://localhost:5173/feras-store/contact\n\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
```

### Run the Setup Script

```bash
cd backend
php setup_feras_tenant.php
```

## 🧪 Testing Checklist

### Frontend Testing
- [ ] Home page loads with hero section
- [ ] Catalog page shows product grid
- [ ] About page displays content
- [ ] Contact page displays content
- [ ] Navigation works between pages
- [ ] Responsive design works on mobile
- [ ] Theme colors are applied correctly

### API Testing
- [ ] Theme API returns correct data
- [ ] Page API returns sections
- [ ] Products API returns product list
- [ ] Individual product API works
- [ ] Error handling works for non-existent pages

### Multi-Tenant Testing
- [ ] Different tenants show different content
- [ ] Tenant isolation works correctly
- [ ] URL routing works for different tenants
- [ ] Theme settings are tenant-specific

## 🐛 Troubleshooting

### Common Issues

1. **"Page not found" errors**
   - Check if tenant exists in database
   - Verify tenant handle matches URL
   - Ensure pages are created for the tenant

2. **API errors**
   - Check Laravel server is running on port 8000
   - Verify CORS is configured
   - Check Laravel logs for errors

3. **Theme not loading**
   - Verify theme settings exist
   - Check if theme is enabled
   - Ensure theme components are registered

4. **Products not showing**
   - Check if products exist in database
   - Verify product model has tenant_id
   - Ensure products are active

### Debug Commands

```bash
# Check tenant exists
php artisan tinker
>>> App\Models\Tenant::where('handle', 'feras-store')->first()

# Check pages exist
>>> App\Models\StorefrontPage::where('tenant_id', $tenant->id)->get()

# Check theme settings
>>> App\Models\TenantThemeSetting::where('tenant_id', $tenant->id)->first()
```

## 📱 Mobile Testing

Test the storefront on mobile devices:

1. Open browser developer tools
2. Switch to mobile view
3. Test responsive design
4. Verify touch interactions work
5. Check mobile navigation

## 🔄 Continuous Testing

Set up automated testing:

1. Create test data for different tenants
2. Test API endpoints with different scenarios
3. Verify theme switching works
4. Test error handling
5. Performance testing with multiple tenants

## 📊 Expected Results

After setup, you should see:

- **Home Page**: Hero section with "Welcome to Feras Store" and featured products
- **Catalog Page**: Product grid with filters and sorting
- **About Page**: Content about the store
- **Contact Page**: Contact information
- **Theme**: Purple primary color (#6f42c1) applied throughout
- **Responsive**: Works on desktop and mobile

The storefront should be fully functional and ready for customization!






