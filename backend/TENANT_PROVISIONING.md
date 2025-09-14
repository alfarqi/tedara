# Tenant Provisioning System

This document describes the automatic tenant provisioning system that creates a complete storefront setup when a user registers.

## Overview

When a user registers with store information, the `ProvisionTenantDefaults` listener automatically:

1. Creates a new tenant with the user's store details
2. Assigns the 'classic' theme with default settings
3. Creates essential pages (home, catalog, about, contact)
4. Seeds each page with relevant sections
5. Sets up the primary domain

## Event-Listener Architecture

### UserRegistered Event
```php
<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserRegistered
{
    use Dispatchable, SerializesModels;

    public User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }
}
```

### ProvisionTenantDefaults Listener
```php
<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Models\Tenant;
use App\Models\TenantDomain;
use App\Models\TenantThemeSetting;
use App\Models\Theme;
use App\Models\StorefrontPage;
use App\Models\StorefrontSection;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ProvisionTenantDefaults implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(UserRegistered $event): void
    {
        $user = $event->user;
        
        // Create tenant, domain, theme settings, pages, and sections
        // ... (see full implementation)
    }
}
```

## Event Registration

### EventServiceProvider
```php
<?php

namespace App\Providers;

use App\Events\UserRegistered;
use App\Listeners\ProvisionTenantDefaults;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        UserRegistered::class => [
            ProvisionTenantDefaults::class,
        ],
    ];
}
```

### Bootstrap Registration
```php
// bootstrap/app.php
->withProviders([
    \App\Providers\EventServiceProvider::class,
])
```

## User Registration Flow

### 1. User Registration Request
```json
POST /api/auth/register
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "store_name": "John's Electronics",
    "store_handle": "johns-electronics",
    "phone": "+1-555-123-4567",
    "location": "New York, NY"
}
```

### 2. User Creation
```php
$user = User::create([
    'name' => $request->name,
    'email' => $request->email,
    'password' => Hash::make($request->password),
    'role' => 'store_owner',
    'status' => 'active',
    'store_handle' => $storeHandle,
    'store_name' => $request->store_name,
    // ... other fields
]);
```

### 3. Event Dispatch
```php
event(new UserRegistered($user));
```

### 4. Automatic Provisioning
The listener automatically creates:

#### Tenant
```php
$tenant = Tenant::create([
    'handle' => 'johns-electronics',
    'display_name' => 'John\'s Electronics',
    'status' => 'active',
]);
```

#### Domain
```php
TenantDomain::create([
    'tenant_id' => $tenant->id,
    'domain' => 'johns-electronics.tedara.com',
    'is_primary' => true,
]);
```

#### Theme Settings
```php
TenantThemeSetting::create([
    'tenant_id' => $tenant->id,
    'theme_id' => $classicTheme->id,
    'settings' => [
        'primary_color' => '#6f42c1',
        'secondary_color' => '#6c757d',
        'font_family' => 'Inter, sans-serif',
        'header_style' => 'classic',
        'footer_style' => 'simple',
        'store_name' => 'John\'s Electronics',
        'contact_email' => 'contact@johns-electronics.com',
        // ... more settings
    ],
]);
```

## Default Pages Created

### 1. Home Page (`/home`)
- **Hero Section**: Welcome message with CTA
- **Featured Products**: Showcase popular items
- **Categories**: Shop by category grid
- **Newsletter**: Email signup form

### 2. Catalog Page (`/catalog`)
- **Product Grid**: All products with pagination
- **Category Filters**: Sidebar with filters

### 3. About Page (`/about`)
- **Hero Section**: About us introduction
- **Content Section**: Company story
- **Team Section**: Meet the team
- **Values Section**: Company values grid

### 4. Contact Page (`/contact`)
- **Contact Info**: Address, phone, email, hours
- **Contact Form**: Full contact form
- **FAQ Section**: Frequently asked questions

## Section Types and Props

### Hero Section
```php
[
    'type' => 'hero',
    'props' => [
        'title' => 'Welcome to John\'s Electronics',
        'subtitle' => 'Discover amazing products and great deals',
        'background_image' => '/images/hero-bg.jpg',
        'cta_text' => 'Shop Now',
        'cta_link' => '/catalog',
        'show_search' => true,
    ]
]
```

### Featured Products Section
```php
[
    'type' => 'featured_products',
    'props' => [
        'title' => 'Featured Products',
        'subtitle' => 'Check out our most popular items',
        'limit' => 6,
        'show_prices' => true,
        'show_ratings' => true,
        'layout' => 'grid',
    ]
]
```

### Product Grid Section
```php
[
    'type' => 'product_grid',
    'props' => [
        'title' => 'All Products',
        'show_filters' => true,
        'show_sorting' => true,
        'items_per_page' => 12,
        'layout' => 'grid',
        'show_pagination' => true,
    ]
]
```

### Contact Form Section
```php
[
    'type' => 'contact_form',
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
]
```

## Manual Provisioning

### For Existing Users
```bash
php artisan tenant:provision {user_id}
```

### Example
```bash
php artisan tenant:provision 1
```

This will provision tenant defaults for user with ID 1, assuming they have `store_handle` and `store_name` set.

## API Endpoints

### Registration
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "Store Owner",
    "email": "owner@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "store_name": "My Awesome Store",
    "store_handle": "my-awesome-store"
}
```

### Check Store Handle Availability
```http
GET /api/auth/check-store-handle?store_handle=my-awesome-store
```

## Queue Processing

The `ProvisionTenantDefaults` listener implements `ShouldQueue`, meaning tenant provisioning happens asynchronously. This prevents registration delays and improves user experience.

### Queue Configuration
Make sure your queue is properly configured in `.env`:
```env
QUEUE_CONNECTION=database
# or
QUEUE_CONNECTION=redis
```

### Processing Queued Jobs
```bash
php artisan queue:work
```

## Error Handling

The listener includes error handling for:
- Duplicate store handles
- Missing theme data
- Database constraints
- Queue failures

## Customization

### Adding New Section Types
1. Add new section types to the listener
2. Update your frontend to handle the new types
3. The `props` JSON field allows flexible configuration

### Modifying Default Settings
Edit the `getDefaultThemeSettings()` method in the listener to customize:
- Colors
- Fonts
- Layout preferences
- Contact information
- Social links

### Adding New Pages
Extend the `createDefaultPages()` method to include additional pages like:
- Privacy Policy
- Terms of Service
- Blog
- FAQ

## Testing

### Unit Tests
```php
public function test_tenant_provisioning_on_user_registration()
{
    $user = User::factory()->create([
        'store_handle' => 'test-store',
        'store_name' => 'Test Store'
    ]);

    event(new UserRegistered($user));

    $this->assertDatabaseHas('tenants', [
        'handle' => 'test-store',
        'display_name' => 'Test Store'
    ]);

    $this->assertDatabaseHas('storefront_pages', [
        'slug' => 'home',
        'is_home' => true
    ]);
}
```

### Integration Tests
```php
public function test_user_registration_creates_tenant()
{
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'store_name' => 'Test Store',
        'store_handle' => 'test-store'
    ]);

    $response->assertStatus(201);
    $response->assertJson(['tenant_provisioned' => true]);
}
```

## Monitoring

### Logging
The listener logs important events:
- Tenant creation
- Page creation
- Section creation
- Errors and failures

### Metrics
Track key metrics:
- Registration success rate
- Provisioning completion time
- Queue processing time
- Error rates

This system provides a complete, automated tenant provisioning solution that creates a fully functional storefront for every new user registration.



