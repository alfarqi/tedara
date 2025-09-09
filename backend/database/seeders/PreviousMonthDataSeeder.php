<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Store;
use Carbon\Carbon;

class PreviousMonthDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first store owner user
        $storeOwner = \App\Models\User::where('role', 'store_owner')->first();
        
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
        
        // Get existing customers
        $customers = Customer::where('store_id', $store->id)->take(5)->get();
        
        if ($customers->isEmpty()) {
            $this->command->error('No customers found. Please run the dashboard test data seeder first.');
            return;
        }

        // Create orders for previous month
        $this->command->info('Creating orders for previous month...');
        
        $previousMonth = Carbon::now()->subMonth();
        $previousMonthOrders = [
            [
                'order_id' => 'ORD-' . $previousMonth->format('Ymd') . '-001',
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
                'subtotal' => 200.00,
                'tax' => 30.00,
                'total' => 255.00,
                'notes' => 'Previous month order 1',
                'created_at' => $previousMonth->copy()->addDays(5),
            ],
            [
                'order_id' => 'ORD-' . $previousMonth->format('Ymd') . '-002',
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
                'subtotal' => 150.00,
                'tax' => 22.50,
                'total' => 202.50,
                'notes' => 'Previous month order 2',
                'created_at' => $previousMonth->copy()->addDays(10),
            ],
            [
                'order_id' => 'ORD-' . $previousMonth->format('Ymd') . '-003',
                'customer_id' => $customers[2]->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'credit_card',
                'shipping_address' => [
                    'street' => '789 Prince St',
                    'city' => 'Dammam',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => 20.00,
                'subtotal' => 100.00,
                'tax' => 15.00,
                'total' => 135.00,
                'notes' => 'Previous month order 3',
                'created_at' => $previousMonth->copy()->addDays(15),
            ],
        ];

        foreach ($previousMonthOrders as $orderData) {
            $order = Order::create($orderData);
            $this->command->info("Created previous month order: {$order->order_id} - {$order->total} SAR");
        }

        // Create some customers from previous month
        $previousMonthCustomers = [];
        for ($i = 1; $i <= 3; $i++) {
            $previousMonthCustomers[] = Customer::create([
                'name' => "Previous Month Customer {$i}",
                'email' => "prev_customer{$i}@test.com",
                'phone' => "+96650123456{$i}",
                'store_id' => $store->id,
                'status' => 'active',
                'total_orders' => 0,
                'total_spent' => 0,
                'join_date' => $previousMonth->copy()->addDays(rand(1, 20)),
            ]);
        }

        $this->command->info('✅ Previous month test data created successfully!');
        $this->command->info('📊 Created:');
        $this->command->info('   - 3 new customers for previous month');
        $this->command->info('   - 3 new orders for previous month');
        $this->command->info('   - Total sales: ' . collect($previousMonthOrders)->where('payment_status', 'paid')->sum('total') . ' SAR');
    }
}