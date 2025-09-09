<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;

class ComprehensiveTestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Creating comprehensive test data for dashboard...');
        
        // Get the first store owner user
        $storeOwner = User::where('role', 'store_owner')->first();
        
        if (!$storeOwner) {
            $this->command->error('❌ No store owner found. Please run the main seeder first.');
            return;
        }

        $this->command->info("👤 Using store owner: {$storeOwner->name} (ID: {$storeOwner->id})");

        // Get or create stores owned by this user
        $stores = Store::where('owner_id', $storeOwner->id)->get();
        
        if ($stores->isEmpty()) {
            $this->command->info('🏪 No stores found, creating a new store...');
            $store = Store::create([
                'name' => 'Test Store',
                'description' => 'Test store for dashboard data',
                'owner_id' => $storeOwner->id,
                'status' => 'active',
                'address' => '123 Test Street, Test City',
                'phone' => '+966501234567',
                'email' => 'test@store.com',
            ]);
            $stores = collect([$store]);
        }

        $store = $stores->first();
        $this->command->info("🏪 Using store: {$store->name} (ID: {$store->id})");

        // Get or create products for this store
        $products = Product::where('store_id', $store->id)->get();
        
        if ($products->isEmpty()) {
            $this->command->info('📦 No products found, creating test products...');
            $products = collect();
            for ($i = 1; $i <= 5; $i++) {
                $product = Product::create([
                    'name' => "Test Product {$i}",
                    'description' => "Test product {$i} description",
                    'price' => rand(50, 500),
                    'store_id' => $store->id,
                    'category_id' => 1, // Assuming category 1 exists
                    'status' => 'active',
                    'stock_quantity' => rand(10, 100),
                ]);
                $products->push($product);
            }
        }

        $this->command->info("📦 Using {$products->count()} products");

        // Clear existing test data for this month
        $this->command->info('🧹 Clearing existing test data for current month...');
        $currentMonth = Carbon::now();
        $startOfMonth = $currentMonth->copy()->startOfMonth();
        $endOfMonth = $currentMonth->copy()->endOfMonth();
        
        // Delete existing orders and customers for this month
        Order::where('store_id', $store->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->delete();
            
        Customer::where('store_id', $store->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->delete();

        // Create customers for this month
        $this->command->info('👥 Creating customers for current month...');
        $customers = collect();
        for ($i = 1; $i <= 10; $i++) {
            $customer = Customer::create([
                'name' => "Customer {$i}",
                'email' => "customer{$i}@test.com",
                'phone' => "+96650123456{$i}",
                'store_id' => $store->id,
                'status' => 'active',
                'total_orders' => 0,
                'total_spent' => 0,
                'join_date' => Carbon::now()->subDays(rand(1, 25)),
            ]);
            $customers->push($customer);
        }

        // Create orders for this month
        $this->command->info('📋 Creating orders for current month...');
        $totalSales = 0;
        $totalOrders = 0;
        
        for ($i = 1; $i <= 15; $i++) {
            $customer = $customers->random();
            $product = $products->random();
            $quantity = rand(1, 3);
            $subtotal = $product->price * $quantity;
            $shipping = rand(15, 35);
            $tax = $subtotal * 0.15; // 15% tax
            $total = $subtotal + $shipping + $tax;
            
            $order = Order::create([
                'order_id' => 'ORD-' . date('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT) . '-' . uniqid(),
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'status' => rand(0, 1) ? 'delivered' : 'processing',
                'payment_status' => rand(0, 1) ? 'paid' : 'pending',
                'payment_method' => ['credit_card', 'bank_transfer', 'cash_on_delivery'][rand(0, 2)],
                'shipping_address' => [
                    'street' => "{$i} Test Street",
                    'city' => 'Test City',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => $shipping,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => "Test order {$i}",
                'created_at' => Carbon::now()->subDays(rand(1, 25)),
            ]);
            
            $totalOrders++;
            if ($order->payment_status === 'paid') {
                $totalSales += $total;
            }
        }

        // Update customer statistics
        $this->command->info('📊 Updating customer statistics...');
        foreach ($customers as $customer) {
            $customerOrders = Order::where('customer_id', $customer->id)->get();
            $customer->update([
                'total_orders' => $customerOrders->count(),
                'total_spent' => $customerOrders->where('payment_status', 'paid')->sum('total'),
            ]);
        }

        // Create some orders for previous month for comparison
        $this->command->info('📋 Creating orders for previous month...');
        $previousMonth = Carbon::now()->subMonth();
        $previousMonthStart = $previousMonth->copy()->startOfMonth();
        $previousMonthEnd = $previousMonth->copy()->endOfMonth();
        
        for ($i = 1; $i <= 5; $i++) {
            $customer = $customers->random();
            $product = $products->random();
            $quantity = rand(1, 2);
            $subtotal = $product->price * $quantity;
            $shipping = rand(15, 35);
            $tax = $subtotal * 0.15;
            $total = $subtotal + $shipping + $tax;
            
            Order::create([
                'order_id' => 'ORD-' . $previousMonth->format('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT) . '-' . uniqid(),
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => ['credit_card', 'bank_transfer'][rand(0, 1)],
                'shipping_address' => [
                    'street' => "{$i} Previous Street",
                    'city' => 'Test City',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => $shipping,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => "Previous month order {$i}",
                'created_at' => $previousMonth->copy()->addDays(rand(1, 20)),
            ]);
        }

        $this->command->info('✅ Comprehensive test data created successfully!');
        $this->command->info('📊 Summary:');
        $this->command->info("   - Store: {$store->name} (ID: {$store->id})");
        $this->command->info("   - Products: {$products->count()}");
        $this->command->info("   - Customers this month: {$customers->count()}");
        $this->command->info("   - Orders this month: {$totalOrders}");
        $this->command->info("   - Total sales this month: {$totalSales} SAR");
        $this->command->info("   - Orders previous month: 5");
        $this->command->info('');
        $this->command->info('🎯 Dashboard should now show real data!');
    }
}