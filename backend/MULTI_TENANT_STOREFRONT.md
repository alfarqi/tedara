# Multi-Tenant Storefront System

This Laravel 10 application implements a comprehensive multi-tenant storefront system that allows multiple stores to operate independently with their own domains, themes, and content.

## Features

- **Multi-tenant Architecture**: Each store operates as an independent tenant
- **Domain Resolution**: Automatic tenant resolution by domain or path segment
- **Theme System**: Customizable themes with tenant-specific settings
- **Page Builder**: Dynamic pages with sections and customizable content
- **Product Management**: Tenant-scoped product catalog
- **API-First**: RESTful API designed for React frontend consumption

## Database Schema

### Core Tables

#### `tenants`
- `id` (UUID, Primary Key)
- `handle` (Unique identifier for the tenant)
- `display_name` (Human-readable store name)
- `status` (Enum: active, suspended)
- `timestamps`

#### `tenant_domains`
- `id` (UUID, Primary Key)
- `tenant_id` (Foreign Key to tenants)
- `domain` (Unique domain name)
- `is_primary` (Boolean flag for primary domain)
- `timestamps`

#### `themes`
- `id` (UUID, Primary Key)
- `key` (Unique theme identifier)
- `name` (Theme display name)
- `version` (Theme version)
- `is_enabled` (Boolean flag)
- `timestamps`

#### `tenant_theme_settings`
- `id` (UUID, Primary Key)
- `tenant_id` (Foreign Key to tenants)
- `theme_id` (Foreign Key to themes)
- `settings` (JSON configuration)
- `timestamps`

#### `storefront_pages`
- `id` (UUID, Primary Key)
- `tenant_id` (Foreign Key to tenants)
- `slug` (URL-friendly identifier)
- `title` (Page title)
- `template` (Template type)
- `seo_json` (SEO metadata)
- `is_home` (Boolean flag for home page)
- `timestamps`

#### `storefront_sections`
- `id` (UUID, Primary Key)
- `page_id` (Foreign Key to storefront_pages)
- `type` (Section type identifier)
- `sort` (Display order)
- `props` (JSON configuration)
- `timestamps`

## Models and Relationships

### Tenant Model
```php
// Relationships
$tenant->domains() // HasMany TenantDomain
$tenant->primaryDomain() // HasOne TenantDomain (where is_primary = true)
$tenant->themeSettings() // HasMany TenantThemeSetting
$tenant->storefrontPages() // HasMany StorefrontPage
$tenant->homePage() // HasOne StorefrontPage (where is_home = true)
$tenant->products() // HasMany Product
```

### BelongsToTenant Trait
This trait provides automatic tenant scoping for models:

```php
use App\Traits\BelongsToTenant;

class Product extends Model
{
    use BelongsToTenant;
    // Automatically scopes queries to current tenant
    // Auto-sets tenant_id on model creation
}
```

## Middleware

### ResolveTenant Middleware
Automatically resolves the current tenant based on:

1. **Domain Resolution**: Checks `tenant_domains` table for matching host
2. **Path Resolution**: Uses first path segment (excluding 'api', 'admin') as tenant handle
3. **Container Binding**: Binds resolved tenant to `app('tenant')`

## API Endpoints

All storefront API endpoints are prefixed with `/api/storefront/{tenantHandle}`:

### Pages
- `GET /api/storefront/{tenantHandle}/pages` - List all pages
- `GET /api/storefront/{tenantHandle}/page/{slug}` - Get specific page with sections

### Theme
- `GET /api/storefront/{tenantHandle}/theme` - Get theme settings

### Products
- `GET /api/storefront/{tenantHandle}/products` - List products (paginated)
- `GET /api/storefront/{tenantHandle}/products/{slug}` - Get specific product

## Sample API Responses

### Page with Sections
```json
{
  "data": {
    "id": "uuid",
    "slug": "home",
    "title": "Welcome to Salmeen Electronics",
    "template": "home",
    "seo": {
      "title": "Welcome to Salmeen Electronics",
      "description": "Discover amazing products at Salmeen Electronics",
      "keywords": "store, shopping, products, salmeen-electronics"
    },
    "is_home": true,
    "sections": [
      {
        "id": "uuid",
        "type": "hero",
        "sort": 1,
        "props": {
          "title": "Welcome to Salmeen Electronics",
          "subtitle": "Discover amazing products and great deals",
          "background_image": "/images/hero-bg.jpg",
          "cta_text": "Shop Now",
          "cta_link": "/products"
        }
      }
    ]
  },
  "meta": {
    "tenant": {
      "handle": "salmeen-electronics",
      "display_name": "Salmeen Electronics Store"
    }
  }
}
```

### Theme Settings
```json
{
  "data": {
    "theme": {
      "key": "modern",
      "name": "Modern Theme",
      "version": "1.0.0"
    },
    "settings": {
      "primary_color": "#6f42c1",
      "secondary_color": "#6c757d",
      "font_family": "Inter, sans-serif",
      "header_style": "modern",
      "footer_style": "simple",
      "logo_url": "/images/logo.png",
      "favicon_url": "/images/favicon.ico"
    }
  }
}
```

## Installation and Setup

1. **Run Migrations**:
```bash
php artisan migrate
```

2. **Seed Sample Data**:
```bash
php artisan db:seed --class=TenantSeeder
php artisan db:seed --class=ThemeSeeder
php artisan db:seed --class=StorefrontSeeder
```

3. **Configure Domains** (for local development):
Add to your `/etc/hosts` file:
```
127.0.0.1 salmeen-electronics.local
127.0.0.1 fatooma-store.local
127.0.0.1 demo-store.local
```

## Usage Examples

### Creating a New Tenant
```php
$tenant = Tenant::create([
    'handle' => 'my-store',
    'display_name' => 'My Awesome Store',
    'status' => 'active'
]);

// Add domain
TenantDomain::create([
    'tenant_id' => $tenant->id,
    'domain' => 'my-store.local',
    'is_primary' => true
]);
```

### Creating a Page with Sections
```php
$page = StorefrontPage::create([
    'tenant_id' => $tenant->id,
    'slug' => 'about',
    'title' => 'About Us',
    'template' => 'page',
    'seo_json' => [
        'title' => 'About Us - My Store',
        'description' => 'Learn more about our company'
    ]
]);

StorefrontSection::create([
    'page_id' => $page->id,
    'type' => 'content',
    'sort' => 1,
    'props' => [
        'title' => 'Our Story',
        'content' => 'We started this business with a vision...'
    ]
]);
```

### Using Tenant Scoping
```php
// When tenant is resolved by middleware
$products = Product::all(); // Automatically scoped to current tenant

// Manual tenant scoping
$tenant = Tenant::where('handle', 'my-store')->first();
app()->instance('tenant', $tenant);
$products = Product::all(); // Now scoped to 'my-store'
```

## Frontend Integration

The API is designed to work seamlessly with React applications. Each endpoint returns data in a consistent format with:

- `data`: The main content
- `meta`: Metadata including tenant information
- `pagination`: Pagination info (where applicable)

The system automatically handles tenant resolution, so your React app can make requests to:
- `https://salmeen-electronics.local/api/storefront/salmeen-electronics/pages`
- `https://myapp.com/api/storefront/my-store/products`

Both will work correctly with the tenant middleware resolving the appropriate store context.

## Security Considerations

- All tenant-scoped models automatically filter by tenant_id
- The BelongsToTenant trait prevents cross-tenant data access
- Middleware validates tenant status (only active tenants are accessible)
- API endpoints validate tenant access before returning data

## Extending the System

### Adding New Section Types
1. Create new section types in the `storefront_sections` table
2. Update your frontend to handle the new section types
3. The `props` JSON field allows for flexible configuration

### Custom Themes
1. Add new themes to the `themes` table
2. Create tenant-specific settings in `tenant_theme_settings`
3. The `settings` JSON field supports any theme configuration

### Additional Models
1. Add the `BelongsToTenant` trait to new models
2. Include `tenant_id` in migrations
3. Models will automatically be scoped to the current tenant










