<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Store;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Order;
use Carbon\Carbon;

class CurrentMonthDataSeeder extends Seeder
{
    public function run(): void
    {
        echo "🔍 Finding Salmeen Ahmed user...\n";
        
        // Find Salmeen Ahmed user
        $user = User::where('name', 'LIKE', '%Salmeen%')->first();
        if (!$user) {
            echo "❌ Salmeen Ahmed user not found!\n";
            return;
        }
        
        echo "✅ Found user: {$user->name} (ID: {$user->id})\n";
        
        // Find Salmeen's store
        $store = Store::where('owner_id', $user->id)->first();
        if (!$store) {
            echo "❌ Salmeen's store not found!\n";
            return;
        }
        
        echo "✅ Found store: {$store->name} (ID: {$store->id})\n";
        
        // Clear existing orders and customers for this store
        echo "🧹 Clearing existing test data for current month...\n";
        Order::where('store_id', $store->id)->delete();
        Customer::where('store_id', $store->id)->delete();
        
        // Get current month date range
        $currentMonth = Carbon::now();
        $startOfMonth = $currentMonth->copy()->startOfMonth();
        $endOfMonth = $currentMonth->copy()->endOfMonth();
        
        echo "📅 Current month range: {$startOfMonth->toDateString()} to {$endOfMonth->toDateString()}\n";
        
        // Get or create products
        $products = Product::where('store_id', $store->id)->take(5)->get();
        if ($products->isEmpty()) {
            echo "📦 Creating products...\n";
            $productNames = ['iPhone 15', 'Samsung Galaxy S24', 'MacBook Pro', 'iPad Air', 'AirPods Pro'];
            foreach ($productNames as $index => $name) {
                $products->push(Product::create([
                    'name' => $name,
                    'description' => "High-quality {$name}",
                    'price' => rand(500, 2000),
                    'store_id' => $store->id,
                    'category_id' => 1,
                    'status' => 'active',
                ]));
            }
        }
        
        echo "📦 Using {$products->count()} products\n";
        
        // Create customers for current month
        echo "👥 Creating customers for current month...\n";
        $customers = [];
        for ($i = 1; $i <= 10; $i++) {
            $joinDate = $startOfMonth->copy()->addDays(rand(0, 5));
            $customers[] = Customer::create([
                'name' => "Customer {$i}",
                'email' => "customer{$i}@example.com",
                'phone' => "+966501234{$i}",
                'store_id' => $store->id,
                'join_date' => $joinDate,
                'created_at' => $joinDate,
                'updated_at' => $joinDate,
            ]);
        }
        
        // Create orders for current month
        echo "📋 Creating orders for current month...\n";
        $totalSales = 0;
        for ($i = 1; $i <= 15; $i++) {
            $product = $products->random();
            $customer = collect($customers)->random();
            $orderDate = $startOfMonth->copy()->addDays(rand(0, 5)); // Random day in first week
            
            $quantity = rand(1, 3);
            $subtotal = $product->price * $quantity;
            $tax = $subtotal * 0.15; // 15% tax
            $total = $subtotal + $tax;
            
            $order = Order::create([
                'order_id' => 'ORD-' . $orderDate->format('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT) . '-' . uniqid(),
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid', // Make sure all orders are paid
                'payment_method' => 'credit_card',
                'shipping_address' => json_encode([
                    'street' => '123 Main St',
                    'city' => 'Riyadh',
                    'country' => 'Saudi Arabia'
                ]),
                'shipping_cost' => rand(10, 50),
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => "Order for {$product->name}",
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);
            
            $totalSales += $order->total;
        }
        
        echo "✅ Created 15 orders for current month\n";
        echo "💰 Total sales this month: {$totalSales} SAR\n";
        echo "📊 Dashboard should now show real data for {$store->name}!\n";
    }
}
