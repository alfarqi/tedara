<?php
// backend/setup_ahlam_test_data.php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\Tenant;
use App\Models\TenantDomain;
use App\Models\Store;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Theme;
use App\Models\TenantThemeSetting;
use Illuminate\Support\Str;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Setting up Ahlam tenant and test data...\n";

try {
    // Create or find user
    $user = User::firstOrCreate(
        ['email' => 'ahlam@example.com'],
        [
            'name' => 'Ahlam',
            'phone' => '+966501234569',
            'password' => bcrypt('password123'),
            'role' => 'store_owner',
            'status' => 'active',
            'store_handle' => 'ahlam',
            'store_name' => 'Ahlam Store',
            'email_verified_at' => now(),
        ]
    );

    echo "User created/found: {$user->name}\n";

    // Create tenant
    $tenant = Tenant::firstOrCreate(
        ['handle' => 'ahlam'],
        [
            'display_name' => 'Ahlam Store',
            'status' => 'active',
        ]
    );

    echo "Tenant created/found: {$tenant->display_name}\n";

    // Create tenant domain
    TenantDomain::firstOrCreate(
        ['domain' => 'ahlam.localhost', 'tenant_id' => $tenant->id],
        ['is_primary' => true]
    );

    echo "Tenant domain created/found\n";

    // Create store
    $store = Store::firstOrCreate(
        ['domain' => 'ahlam'],
        [
            'owner_id' => $user->id,
            'name' => 'Ahlam Store',
            'description' => 'A beautiful fashion store',
            'currency' => 'USD',
            'language' => 'en',
            'timezone' => 'UTC',
            'status' => 'active',
        ]
    );

    echo "Store created/found: {$store->name}\n";

    // Get classic theme
    $theme = Theme::firstOrCreate(
        ['key' => 'classic'],
        [
            'name' => 'Classic Theme',
            'version' => '1.0.0',
            'is_enabled' => true,
        ]
    );

    // Create theme settings
    TenantThemeSetting::firstOrCreate(
        ['tenant_id' => $tenant->id, 'theme_id' => $theme->id],
        [
            'settings' => [
                'primary_color' => '#6f42c1',
                'secondary_color' => '#6c757d',
                'font_family' => 'Inter, sans-serif',
                'header_style' => 'classic',
                'footer_style' => 'simple',
                'logo_url' => '/images/logo.png',
                'favicon_url' => '/images/favicon.ico',
                'store_name' => 'Ahlam Store',
                'contact_email' => 'contact@ahlam.com',
                'contact_phone' => '+966501234569',
            ],
        ]
    );

    echo "Theme settings created/found\n";

    // Create test customer
    $customer = Customer::firstOrCreate(
        ['email' => 'customer@example.com'],
        [
            'name' => 'Test Customer',
            'phone' => '+966501234570',
            'store_id' => $store->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]
    );

    echo "Customer created/found: {$customer->name}\n";

    // Create test products
    $products = [];
    $productNames = ['Fashion Dress', 'Elegant Shoes', 'Stylish Bag', 'Beautiful Scarf'];
    
    foreach ($productNames as $index => $name) {
        $product = Product::firstOrCreate(
            ['name' => $name, 'store_id' => $store->id],
            [
                'description' => "A beautiful " . strtolower($name),
                'sku' => 'AH-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'price' => rand(20, 100),
                'stock' => rand(10, 50),
                'status' => 'active',
                'images' => ['/images/product-' . ($index + 1) . '.jpg'],
                'weight' => rand(100, 1000),
                'brand' => 'Ahlam Fashion',
                'tags' => ['fashion', 'elegant', 'stylish'],
                'rating' => rand(35, 50) / 10,
                'reviews_count' => rand(5, 50),
            ]
        );
        $products[] = $product;
    }

    echo "Products created/found: " . count($products) . " products\n";

    // Create test orders
    $orderStatuses = ['pending', 'processing', 'shipped', 'delivered'];
    $paymentMethods = ['cash', 'card'];
    
    for ($i = 1; $i <= 3; $i++) {
        $order = Order::firstOrCreate(
            ['order_id' => 'ORD-2024-' . str_pad($i, 5, '0', STR_PAD_LEFT), 'store_id' => $store->id],
            [
                'customer_id' => $customer->id,
                'status' => $orderStatuses[array_rand($orderStatuses)],
                'payment_status' => 'paid',
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'shipping_address' => [
                    'street' => '123 Test Street, Test City',
                    'city' => 'Test City',
                    'state' => 'Test State',
                    'postal_code' => '12345',
                    'country' => 'Test Country',
                ],
                'shipping_cost' => 5.00,
                'subtotal' => 0, // Will be calculated
                'tax' => 0,
                'total' => 0, // Will be calculated
                'notes' => "Test order #{$i}",
            ]
        );

        // Create order items
        $subtotal = 0;
        $selectedProducts = array_slice($products, 0, rand(1, 3));
        
        foreach ($selectedProducts as $product) {
            $quantity = rand(1, 2);
            $price = $product->price;
            $total = $price * $quantity;
            $subtotal += $total;

            OrderItem::firstOrCreate(
                ['order_id' => $order->id, 'product_id' => $product->id],
                [
                    'quantity' => $quantity,
                    'price' => $price,
                    'total' => $total,
                ]
            );
        }

        // Update order totals
        $order->update([
            'subtotal' => $subtotal,
            'total' => $subtotal + $order->shipping_cost,
        ]);

        echo "Order created: {$order->order_id}\n";
    }

    echo "\n✅ Ahlam tenant setup completed successfully!\n";
    echo "Store URL: http://localhost:5173/ahlam\n";
    echo "Customer email: customer@example.com\n";
    echo "Customer password: password123\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
