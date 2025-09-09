<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;

class DashboardTestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first store owner user
        $storeOwner = User::where('role', 'store_owner')->first();
        
        if (!$storeOwner) {
            $this->command->error('No store owner found. Please run the main seeder first.');
            return;
        }

        // Get stores owned by this user
        $stores = Store::where('owner_id', $storeOwner->id)->get();
        
        if ($stores->isEmpty()) {
            $this->command->error('No stores found for the store owner. Please run the main seeder first.');
            return;
        }

        $store = $stores->first();
        
        // Get some products from this store
        $products = Product::where('store_id', $store->id)->take(5)->get();
        
        if ($products->isEmpty()) {
            $this->command->error('No products found for the store. Please run the main seeder first.');
            return;
        }

        // Create some customers for this month
        $customers = [];
        for ($i = 1; $i <= 8; $i++) {
            $customers[] = Customer::create([
                'name' => "Test Customer {$i}",
                'email' => "customer{$i}@test.com",
                'phone' => "+96650123456{$i}",
                'store_id' => $store->id,
                'status' => 'active',
                'total_orders' => 0,
                'total_spent' => 0,
                'join_date' => Carbon::now()->subDays(rand(1, 20)),
            ]);
        }

        // Create orders for this month (current month)
        $this->command->info('Creating orders for current month...');
        
        $currentMonthOrders = [
            [
                'order_id' => 'ORD-' . date('Ymd') . '-001',
                'customer_id' => $customers[0]->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'credit_card',
                'shipping_address' => [
                    'street' => '123 Main St',
                    'city' => 'Riyadh',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => 25.00,
                'subtotal' => 150.00,
                'tax' => 22.50,
                'total' => 197.50,
                'notes' => 'Test order 1',
                'created_at' => Carbon::now()->subDays(2),
            ],
            [
                'order_id' => 'ORD-' . date('Ymd') . '-002',
                'customer_id' => $customers[1]->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'shipping_address' => [
                    'street' => '456 King St',
                    'city' => 'Jeddah',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => 30.00,
                'subtotal' => 200.00,
                'tax' => 30.00,
                'total' => 260.00,
                'notes' => 'Test order 2',
                'created_at' => Carbon::now()->subDays(5),
            ],
            [
                'order_id' => 'ORD-' . date('Ymd') . '-003',
                'customer_id' => $customers[2]->id,
                'store_id' => $store->id,
                'status' => 'processing',
                'payment_status' => 'paid',
                'payment_method' => 'credit_card',
                'shipping_address' => [
                    'street' => '789 Prince St',
                    'city' => 'Dammam',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => 20.00,
                'subtotal' => 75.00,
                'tax' => 11.25,
                'total' => 106.25,
                'notes' => 'Test order 3',
                'created_at' => Carbon::now()->subDays(1),
            ],
            [
                'order_id' => 'ORD-' . date('Ymd') . '-004',
                'customer_id' => $customers[3]->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'cash_on_delivery',
                'shipping_address' => [
                    'street' => '321 Queen St',
                    'city' => 'Riyadh',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => 15.00,
                'subtotal' => 300.00,
                'tax' => 45.00,
                'total' => 360.00,
                'notes' => 'Test order 4',
                'created_at' => Carbon::now()->subDays(3),
            ],
            [
                'order_id' => 'ORD-' . date('Ymd') . '-005',
                'customer_id' => $customers[4]->id,
                'store_id' => $store->id,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => 'credit_card',
                'shipping_address' => [
                    'street' => '654 Duke St',
                    'city' => 'Mecca',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => 35.00,
                'subtotal' => 120.00,
                'tax' => 18.00,
                'total' => 173.00,
                'notes' => 'Test order 5',
                'created_at' => Carbon::now()->subHours(6),
            ],
            [
                'order_id' => 'ORD-' . date('Ymd') . '-006',
                'customer_id' => $customers[5]->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'shipping_address' => [
                    'street' => '987 Crown St',
                    'city' => 'Medina',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => 25.00,
                'subtotal' => 180.00,
                'tax' => 27.00,
                'total' => 232.00,
                'notes' => 'Test order 6',
                'created_at' => Carbon::now()->subDays(4),
            ],
            [
                'order_id' => 'ORD-' . date('Ymd') . '-007',
                'customer_id' => $customers[6]->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'credit_card',
                'shipping_address' => [
                    'street' => '147 Royal St',
                    'city' => 'Riyadh',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => 20.00,
                'subtotal' => 250.00,
                'tax' => 37.50,
                'total' => 307.50,
                'notes' => 'Test order 7',
                'created_at' => Carbon::now()->subDays(7),
            ],
            [
                'order_id' => 'ORD-' . date('Ymd') . '-008',
                'customer_id' => $customers[7]->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'cash_on_delivery',
                'shipping_address' => [
                    'street' => '258 Palace St',
                    'city' => 'Jeddah',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => 30.00,
                'subtotal' => 400.00,
                'tax' => 60.00,
                'total' => 490.00,
                'notes' => 'Test order 8',
                'created_at' => Carbon::now()->subDays(6),
            ],
        ];

        foreach ($currentMonthOrders as $orderData) {
            $order = Order::create($orderData);
            $this->command->info("Created order: {$order->order_id} - {$order->total} SAR");
        }

        // Update customer statistics
        foreach ($customers as $customer) {
            $customerOrders = Order::where('customer_id', $customer->id)->get();
            $customer->update([
                'total_orders' => $customerOrders->count(),
                'total_spent' => $customerOrders->where('payment_status', 'paid')->sum('total'),
            ]);
        }

        $this->command->info('✅ Dashboard test data created successfully!');
        $this->command->info('📊 Created:');
        $this->command->info('   - 8 new customers for this month');
        $this->command->info('   - 8 new orders for this month');
        $this->command->info('   - Total sales: ' . collect($currentMonthOrders)->where('payment_status', 'paid')->sum('total') . ' SAR');
        $this->command->info('   - Total orders: ' . count($currentMonthOrders));
        $this->command->info('   - New customers: ' . count($customers));
    }
}