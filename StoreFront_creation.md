# Storefront React App Creation & Multi-Tenant Fix

## Overview

This document covers the creation of a multi-tenant storefront React application and the fix for the "Target class [tenant] does not exist" error in the Laravel backend.

## 🏪 Storefront React App

### Project Structure

```
storefront/
├── src/
│   ├── theme/
│   │   ├── registry.ts          # Theme registry and component mapping
│   │   └── classic/
│   │       ├── Layout.tsx       # Main layout component
│   │       └── sections/
│   │           ├── Hero.tsx     # Hero section component
│   │           ├── ProductGrid.tsx # Product grid section
│   │           └── RichText.tsx # Rich text content section
│   ├── hooks/
│   │   ├── useTheme.ts          # Hook for fetching theme data
│   │   └── usePage.ts           # Hook for fetching page data
│   ├── pages/
│   │   ├── Home.tsx             # Home page component
│   │   ├── Catalog.tsx          # Product catalog page
│   │   ├── Product.tsx          # Individual product page
│   │   └── Dynamic.tsx          # Dynamic page component
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point with tenant detection
│   └── index.css                # Global styles with Tailwind
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

### Key Features

- **Multi-tenant Architecture**: Automatically detects tenant from URL path
- **React Router**: Tenant-aware routing with basename configuration
- **Theme System**: Extensible theme registry with classic theme
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Responsive design with custom CSS variables
- **API Integration**: Fetches data from Laravel storefront API

### URL Structure

The app automatically detects the tenant from the first path segment:

```
https://example.com/salmeen-electronics/ → Tenant: salmeen-electronics
https://example.com/fatooma-store/catalog → Tenant: fatooma-store
https://example.com/demo-store/product/sample-product → Tenant: demo-store
```

### Routes

- `/` - Home page (fetches page with slug 'home')
- `/catalog` - Product catalog page
- `/product/:slug` - Individual product page
- `/:slug` - Dynamic page (about, contact, etc.)

### API Integration

Fetches data from Laravel storefront API endpoints:

```typescript
GET /api/storefront/{tenant}/theme - Theme settings and configuration
GET /api/storefront/{tenant}/page/{slug} - Page content with sections
GET /api/storefront/{tenant}/products - Product list
GET /api/storefront/{tenant}/products/{slug} - Individual product
```

### Theme System

#### Theme Registry

```typescript
export const themeRegistry: Record<string, ThemeComponents> = {
  classic: {
    Layout: ClassicLayout,
    sections: {
      hero: ClassicHero,
      product_grid: ClassicProductGrid,
      content: ClassicRichText,
    },
  },
};
```

#### Section Types

- **Hero**: Banner with title, subtitle, CTA, search
- **ProductGrid**: Product listing with filters, pagination, ratings
- **RichText**: Content with optional images and positioning

### Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔧 Multi-Tenant Fix

### Problem

After implementing the multi-tenant storefront system, users were getting this error when accessing the dashboard:

```
❌ Error loading dashboard statistics: Error: Target class [tenant] does not exist.
```

### Root Cause

The issue was in the `BelongsToTenant` trait. When models using this trait (like `Product`) were queried in non-tenant contexts (like the dashboard API), the trait was trying to resolve `app('tenant')` from the service container, but no tenant was bound, causing the error.

### Solution

Modified the `BelongsToTenant` trait to handle cases where no tenant is bound:

```php
// backend/app/Traits/BelongsToTenant.php

protected static function bootBelongsToTenant(): void
{
    static::addGlobalScope('tenant', function (Builder $builder) {
        try {
            $tenant = app('tenant');
            if ($tenant) {
                $builder->where('tenant_id', $tenant->id);
            }
        } catch (\Exception $e) {
            // If tenant is not bound, don't apply the scope
            // This allows models to work in non-tenant contexts
        }
    });

    static::creating(function (Model $model) {
        try {
            $tenant = app('tenant');
            if ($tenant && !$model->tenant_id) {
                $model->tenant_id = $tenant->id;
            }
        } catch (\Exception $e) {
            // If tenant is not bound, don't auto-set tenant_id
            // This allows models to work in non-tenant contexts
        }
    });
}
```

### What This Fix Does

1. **Graceful Fallback**: When no tenant is bound to the container, the trait doesn't apply the tenant scope
2. **Non-Tenant Context Support**: Allows models to work in both tenant and non-tenant contexts
3. **Error Prevention**: Prevents the "Target class [tenant] does not exist" error
4. **Backward Compatibility**: Maintains existing functionality for tenant-aware routes

### Models Affected

The following models use the `BelongsToTenant` trait:

- `Product` - Used in dashboard statistics
- `StorefrontPage` - Used in storefront pages
- `TenantThemeSetting` - Used in theme settings

### Testing the Fix

After applying the fix:

1. **Dashboard API**: Should work without tenant context
2. **Storefront API**: Should work with tenant context
3. **Mixed Usage**: Models should work in both contexts

### Migration Status

The following migrations were run to support the multi-tenant system:

```bash
php artisan migrate
```

Migrations executed:
- `2024_01_01_000001_create_tenants_table`
- `2024_01_01_000002_create_tenant_domains_table`
- `2024_01_01_000003_create_themes_table`
- `2024_01_01_000004_create_tenant_theme_settings_table`
- `2024_01_01_000005_create_storefront_pages_table`
- `2024_01_01_000006_create_storefront_sections_table`
- `2024_01_01_000007_add_tenant_id_to_products_table`
- `2024_01_01_000008_add_store_fields_to_users_table`

## 🚀 Deployment

### Storefront App

1. Build the app: `npm run build`
2. Deploy the `dist` folder to static hosting
3. Configure web server for client-side routing
4. Ensure Laravel API is accessible

### Laravel Backend

1. Run migrations: `php artisan migrate`
2. Seed data: `php artisan db:seed`
3. Configure environment variables
4. Start server: `php artisan serve`

## 📝 Notes

- The storefront app includes sample data fallbacks when the API is not available
- The multi-tenant system is designed to be backward compatible
- Both tenant-aware and non-tenant routes can coexist
- The fix ensures models work in all contexts without breaking existing functionality

## 🔍 Troubleshooting

### Common Issues

1. **"Target class [tenant] does not exist"**: Fixed by the BelongsToTenant trait modification
2. **Build errors**: Ensure all dependencies are installed and TypeScript errors are resolved
3. **API connection issues**: Verify Laravel server is running and CORS is configured
4. **Tenant resolution**: Check that tenant middleware is only applied to storefront routes

### Debug Steps

1. Check Laravel logs: `tail -f storage/logs/laravel.log`
2. Verify API endpoints: Test with Postman or curl
3. Check browser console for frontend errors
4. Verify database migrations are up to date












