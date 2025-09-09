<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Store;
use App\Models\Order;

echo "=== Database Check ===\n";

// Check Salmeen user
$salmeen = User::where('email', 'salmeen@example.com')->first();
echo "Salmeen user: " . ($salmeen ? "Found (ID: {$salmeen->id})" : "Not found") . "\n";

// Check stores
echo "\n=== Stores ===\n";
$stores = Store::all();
foreach ($stores as $store) {
    $orderCount = Order::where('store_id', $store->id)->count();
    echo "Store ID {$store->id}: {$store->name} (Owner: {$store->owner_id}) - {$orderCount} orders\n";
}

// Check Salmeen's store specifically
if ($salmeen) {
    $salmeenStore = Store::where('owner_id', $salmeen->id)->first();
    if ($salmeenStore) {
        echo "\n=== Salmeen's Store ===\n";
        echo "Store: {$salmeenStore->name} (ID: {$salmeenStore->id})\n";
        
        $orders = Order::where('store_id', $salmeenStore->id)->get();
        echo "Orders count: " . $orders->count() . "\n";
        
        if ($orders->count() > 0) {
            echo "First 5 orders:\n";
            foreach ($orders->take(5) as $order) {
                echo "- Order ID: {$order->order_id}, Status: {$order->status}, Total: {$order->total}\n";
            }
        }
    } else {
        echo "\nSalmeen has no store!\n";
    }
}

echo "\n=== Total Orders ===\n";
echo "Total orders in database: " . Order::count() . "\n";













