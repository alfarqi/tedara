<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;

class SalmeenCurrentMonthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Creating current month data for Salmeen Ahmed...');
        
        // Find Salmeen user (ID: 30)
        $salmeen = User::find(30);
        if (!$salmeen) {
            $this->command->error('❌ Salmeen user (ID: 30) not found!');
            return;
        }

        $this->command->info("👤 Using user: {$salmeen->name} (ID: {$salmeen->id})");

        // Find Salmeen's store (ID: 5)
        $store = Store::find(5);
        if (!$store || $store->owner_id !== 30) {
            $this->command->error('❌ Salmeen\'s store (ID: 5) not found!');
            return;
        }

        $this->command->info("🏪 Using store: {$store->name} (ID: {$store->id})");

        // Get current month date range
        $currentMonth = Carbon::now();
        $startOfMonth = $currentMonth->copy()->startOfMonth();
        $endOfMonth = $currentMonth->copy()->endOfMonth();

        $this->command->info("📅 Current month: {$startOfMonth->toDateString()} to {$endOfMonth->toDateString()}");

        // Clear existing current month data
        $this->command->info('🧹 Clearing existing current month data...');
        Order::where('store_id', $store->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->delete();
        
        Customer::where('store_id', $store->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->delete();

        // Get products for this store
        $products = Product::where('store_id', $store->id)->take(8)->get();
        if ($products->isEmpty()) {
            $this->command->error('❌ No products found for this store!');
            return;
        }

        $this->command->info("📦 Found {$products->count()} products");

        // Create customers for current month
        $customers = [];
        $customerNames = [
            'Ahmed Al-Rashid', 'Fatima Al-Zahra', 'Mohammed Al-Sayed', 
            'Aisha Al-Mansouri', 'Omar Al-Hassan', 'Khadija Al-Farouk',
            'Yusuf Al-Mahmoud', 'Zainab Al-Nasser', 'Hassan Al-Qurashi',
            'Mariam Al-Baghdadi'
        ];

        for ($i = 0; $i < 10; $i++) {
            $joinDate = $currentMonth->copy()->addDays(rand(1, 25));
            $timestamp = time() + $i; // Make emails unique
            $customer = Customer::create([
                'name' => $customerNames[$i],
                'email' => strtolower(str_replace(' ', '.', $customerNames[$i])) . $timestamp . '@example.com',
                'phone' => '+96650123456' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'store_id' => $store->id,
                'status' => 'active',
                'total_orders' => 0,
                'total_spent' => 0,
                'join_date' => $joinDate,
                'created_at' => $joinDate,
            ]);
            $customers[] = $customer;
        }

        $this->command->info("👥 Created " . count($customers) . " customers");

        // Create orders for current month
        $totalSales = 0;
        $orderStatuses = ['pending', 'processing', 'shipped', 'delivered'];
        $paymentStatuses = ['paid', 'paid', 'paid', 'pending']; // Mostly paid orders

        for ($i = 1; $i <= 15; $i++) {
            $product = $products->random();
            $quantity = rand(1, 4);
            $unitPrice = $product->price;
            $subtotal = $unitPrice * $quantity;
            
            // Add some variation to prices
            $subtotal = $subtotal * (0.8 + (rand(0, 40) / 100)); // 80% to 120% of base price
            
            // Calculate tax (15% VAT)
            $tax = $subtotal * 0.15;
            $shippingCost = rand(20, 50); // Random shipping cost
            $total = $subtotal + $tax + $shippingCost;
            
            $order = Order::create([
                'order_id' => 'SE202509' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'customer_id' => $customers[array_rand($customers)]->id,
                'store_id' => $store->id,
                'status' => $orderStatuses[array_rand($orderStatuses)],
                'payment_status' => $paymentStatuses[array_rand($paymentStatuses)],
                'payment_method' => ['credit_card', 'cash', 'bank_transfer'][array_rand([0, 1, 2])],
                'shipping_address' => [
                    'street' => 'King Fahd Road',
                    'city' => 'Riyadh',
                    'postal_code' => '12345',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => $shippingCost,
                'subtotal' => round($subtotal, 2),
                'tax' => round($tax, 2),
                'total' => round($total, 2),
                'notes' => 'Test order for dashboard',
                'created_at' => $currentMonth->copy()->addDays(rand(1, 25)),
            ]);
            
            $totalSales += $total;
        }

        $this->command->info("📋 Created 15 orders");
        $this->command->info("💰 Total sales this month: " . number_format($totalSales, 2) . " SAR");
        
        // Calculate some statistics
        $paidOrders = Order::where('store_id', $store->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('payment_status', 'paid')
            ->sum('total');
            
        $orderCount = Order::where('store_id', $store->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();
            
        $customerCount = Customer::where('store_id', $store->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();

        $this->command->info("📊 Current Month Statistics:");
        $this->command->info("   💰 Paid Sales: " . number_format($paidOrders, 2) . " SAR");
        $this->command->info("   📦 Total Orders: {$orderCount}");
        $this->command->info("   👥 New Customers: {$customerCount}");
        
        $this->command->info("✅ Current month data created successfully!");
        $this->command->info("🎯 Dashboard should now show positive data for Salmeen Ahmed!");
    }
}
