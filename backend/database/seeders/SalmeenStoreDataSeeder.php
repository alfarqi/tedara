<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;

class SalmeenStoreDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Creating test data for Salmeen Electronic Store...');
        
        // Find Salmeen user
        $salmeen = User::where('name', 'LIKE', '%Salmeen%')->orWhere('email', 'LIKE', '%salmeen%')->first();
        
        if (!$salmeen) {
            $this->command->error('❌ Salmeen user not found. Creating Salmeen user...');
            $salmeen = User::create([
                'name' => 'Salmeen Ahmed',
                'email' => 'salmeen@example.com',
                'password' => bcrypt('password'),
                'role' => 'store_owner',
                'status' => 'active',
                'phone' => '+966 58 777 8888',
                'location' => 'Riyadh, Saudi Arabia',
            ]);
        }

        $this->command->info("👤 Using user: {$salmeen->name} (ID: {$salmeen->id})");

        // Find or create Salmeen Electronic Store
        $store = Store::where('owner_id', $salmeen->id)->first();
        
        if (!$store) {
            $this->command->info('🏪 Creating Salmeen Electronic Store...');
            $store = Store::create([
                'name' => 'Salmeen Electronic Store',
                'description' => 'Premium electronics and gadgets store',
                'owner_id' => $salmeen->id,
                'status' => 'active',
                'address' => 'King Fahd Road, Riyadh, Saudi Arabia',
                'phone' => '+966 11 123 4567',
                'email' => 'info@salmeenelectronics.com',
            ]);
        }

        $this->command->info("🏪 Using store: {$store->name} (ID: {$store->id})");

        // Get or create products for this store
        $products = Product::where('store_id', $store->id)->get();
        
        if ($products->isEmpty()) {
            $this->command->info('📦 Creating electronic products...');
            $products = collect();
            
            $electronicProducts = [
                ['name' => 'iPhone 15 Pro', 'price' => 4500],
                ['name' => 'Samsung Galaxy S24', 'price' => 3800],
                ['name' => 'MacBook Pro M3', 'price' => 8500],
                ['name' => 'Dell XPS 13', 'price' => 4200],
                ['name' => 'Sony WH-1000XM5', 'price' => 1200],
                ['name' => 'iPad Air', 'price' => 2800],
                ['name' => 'Samsung 4K TV 55"', 'price' => 3200],
                ['name' => 'PlayStation 5', 'price' => 2200],
            ];
            
            foreach ($electronicProducts as $productData) {
                $product = Product::create([
                    'name' => $productData['name'],
                    'description' => "High-quality {$productData['name']} - Premium electronics",
                    'price' => $productData['price'],
                    'store_id' => $store->id,
                    'category_id' => 1, // Use default category
                    'status' => 'active',
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
        $customerNames = [
            'Ahmed Al-Rashid', 'Fatima Al-Zahra', 'Mohammed Al-Sheikh', 'Noura Al-Mansouri',
            'Khalid Al-Otaibi', 'Aisha Al-Harbi', 'Omar Al-Ghamdi', 'Layla Al-Sabah',
            'Yousef Al-Mutairi', 'Hala Al-Dosari', 'Saad Al-Qahtani', 'Reem Al-Shammari',
            'Fahad Al-Anzi', 'Maha Al-Rashid', 'Tariq Al-Subaie'
        ];
        
        for ($i = 0; $i < 15; $i++) {
            $customer = Customer::create([
                'name' => $customerNames[$i] ?? "Customer " . ($i + 1),
                'email' => strtolower(str_replace(' ', '.', $customerNames[$i] ?? "customer" . ($i + 1))) . '@gmail.com',
                'phone' => '+966' . rand(500000000, 599999999),
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
        
        for ($i = 1; $i <= 20; $i++) {
            $customer = $customers->random();
            $product = $products->random();
            $quantity = rand(1, 3);
            $subtotal = $product->price * $quantity;
            $shipping = rand(25, 50);
            $tax = $subtotal * 0.15; // 15% tax
            $total = $subtotal + $shipping + $tax;
            
            $order = Order::create([
                'order_id' => 'SAL-' . date('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT) . '-' . uniqid(),
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'status' => rand(0, 1) ? 'delivered' : 'processing',
                'payment_status' => rand(0, 1) ? 'paid' : 'pending',
                'payment_method' => ['credit_card', 'bank_transfer', 'cash_on_delivery'][rand(0, 2)],
                'shipping_address' => [
                    'street' => "{$i} King Fahd Road",
                    'city' => 'Riyadh',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => $shipping,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => "Electronic order {$i}",
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
        
        for ($i = 1; $i <= 8; $i++) {
            $customer = $customers->random();
            $product = $products->random();
            $quantity = rand(1, 2);
            $subtotal = $product->price * $quantity;
            $shipping = rand(25, 50);
            $tax = $subtotal * 0.15;
            $total = $subtotal + $shipping + $tax;
            
            Order::create([
                'order_id' => 'SAL-' . $previousMonth->format('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT) . '-' . uniqid(),
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => ['credit_card', 'bank_transfer'][rand(0, 1)],
                'shipping_address' => [
                    'street' => "{$i} Previous Month Street",
                    'city' => 'Riyadh',
                    'country' => 'Saudi Arabia'
                ],
                'shipping_cost' => $shipping,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => "Previous month electronic order {$i}",
                'created_at' => $previousMonth->copy()->addDays(rand(1, 20)),
            ]);
        }

        $this->command->info('✅ Salmeen Electronic Store test data created successfully!');
        $this->command->info('📊 Summary:');
        $this->command->info("   - Store: {$store->name} (ID: {$store->id})");
        $this->command->info("   - Owner: {$salmeen->name} (ID: {$salmeen->id})");
        $this->command->info("   - Products: {$products->count()}");
        $this->command->info("   - Customers this month: {$customers->count()}");
        $this->command->info("   - Orders this month: {$totalOrders}");
        $this->command->info("   - Total sales this month: {$totalSales} SAR");
        $this->command->info("   - Orders previous month: 8");
        $this->command->info('');
        $this->command->info('🎯 Dashboard should now show real data for Salmeen Electronic Store!');
    }
}