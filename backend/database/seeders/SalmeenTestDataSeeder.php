<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Store;
use App\Models\Category;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class SalmeenTestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Salmeen Ahmed user
        $salmeen = User::where('email', 'salmeen@example.com')->first();
        
        if (!$salmeen) {
            $this->command->warn('Salmeen Ahmed user not found. Please run UserSeeder first.');
            return;
        }

        // Get or create Salmeen's store
        $store = Store::where('domain', 'salmeen-electronics')->first();
        
        if (!$store) {
            $store = Store::create([
                'name' => 'Salmeen Electronics Store',
                'domain' => 'salmeen-electronics',
                'owner_id' => $salmeen->id,
                'status' => 'active',
                'description' => 'Premium electronics and gadgets store by Salmeen Ahmed',
                'currency' => 'SAR',
                'language' => 'ar',
                'timezone' => 'Asia/Riyadh',
                'settings' => [
                    'maintenance_mode' => false,
                    'auto_backup' => true,
                    'email_notifications' => true,
                    'sms_notifications' => true,
                ],
            ]);
        }

        // Create categories for Salmeen's store
        $categories = [
            ['name' => 'Smartphones', 'description' => 'Latest smartphones and mobile devices'],
            ['name' => 'Laptops', 'description' => 'High-performance laptops and computers'],
            ['name' => 'Accessories', 'description' => 'Phone and laptop accessories'],
            ['name' => 'Gaming', 'description' => 'Gaming consoles and accessories'],
        ];

        foreach ($categories as $catData) {
            Category::create([
                'name' => $catData['name'],
                'description' => $catData['description'],
                'store_id' => $store->id,
                'sort_order' => rand(1, 100),
            ]);
        }

        // Create products for Salmeen's store
        $products = [
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Latest iPhone with advanced features',
                'sku' => 'IPH15PRO001',
                'price' => 4999.00,
                'original_price' => 5499.00,
                'stock' => 25,
                'category_id' => Category::where('name', 'Smartphones')->where('store_id', $store->id)->first()->id,
                'brand' => 'Apple',
                'weight' => 0.187,
                'dimensions' => '146.7 x 71.5 x 8.25 mm',
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'description' => 'Premium Android smartphone',
                'sku' => 'SAMS24ULTRA001',
                'price' => 3999.00,
                'original_price' => 4499.00,
                'stock' => 30,
                'category_id' => Category::where('name', 'Smartphones')->where('store_id', $store->id)->first()->id,
                'brand' => 'Samsung',
                'weight' => 0.232,
                'dimensions' => '163.4 x 78.1 x 8.6 mm',
            ],
            [
                'name' => 'MacBook Pro 14"',
                'description' => 'Professional laptop for creators',
                'sku' => 'MBP14M2PRO001',
                'price' => 8999.00,
                'original_price' => 9999.00,
                'stock' => 15,
                'category_id' => Category::where('name', 'Laptops')->where('store_id', $store->id)->first()->id,
                'brand' => 'Apple',
                'weight' => 1.6,
                'dimensions' => '312.6 x 221.2 x 15.5 mm',
            ],
            [
                'name' => 'Dell XPS 13',
                'description' => 'Ultra-thin premium laptop',
                'sku' => 'DELLXPS13001',
                'price' => 5999.00,
                'original_price' => 6499.00,
                'stock' => 20,
                'category_id' => Category::where('name', 'Laptops')->where('store_id', $store->id)->first()->id,
                'brand' => 'Dell',
                'weight' => 1.17,
                'dimensions' => '295.7 x 198.7 x 14.8 mm',
            ],
            [
                'name' => 'AirPods Pro',
                'description' => 'Wireless noise-cancelling earbuds',
                'sku' => 'AIRPODSPRO001',
                'price' => 999.00,
                'original_price' => 1199.00,
                'stock' => 50,
                'category_id' => Category::where('name', 'Accessories')->where('store_id', $store->id)->first()->id,
                'brand' => 'Apple',
                'weight' => 0.005,
                'dimensions' => '30.9 x 21.8 x 24.0 mm',
            ],
            [
                'name' => 'Samsung Wireless Charger',
                'description' => 'Fast wireless charging pad',
                'sku' => 'SAMSCHARGER001',
                'price' => 299.00,
                'original_price' => 399.00,
                'stock' => 40,
                'category_id' => Category::where('name', 'Accessories')->where('store_id', $store->id)->first()->id,
                'brand' => 'Samsung',
                'weight' => 0.12,
                'dimensions' => '100 x 100 x 10 mm',
            ],
            [
                'name' => 'PlayStation 5',
                'description' => 'Next-gen gaming console',
                'sku' => 'PS5CONSOLE001',
                'price' => 2499.00,
                'original_price' => 2799.00,
                'stock' => 10,
                'category_id' => Category::where('name', 'Gaming')->where('store_id', $store->id)->first()->id,
                'brand' => 'Sony',
                'weight' => 4.5,
                'dimensions' => '390 x 260 x 104 mm',
            ],
            [
                'name' => 'Xbox Series X',
                'description' => 'Microsoft gaming console',
                'sku' => 'XBOXSERIESX001',
                'price' => 2299.00,
                'original_price' => 2599.00,
                'stock' => 12,
                'category_id' => Category::where('name', 'Gaming')->where('store_id', $store->id)->first()->id,
                'brand' => 'Microsoft',
                'weight' => 4.45,
                'dimensions' => '151 x 151 x 301 mm',
            ],
        ];

        foreach ($products as $prodData) {
            Product::create([
                'name' => $prodData['name'],
                'description' => $prodData['description'],
                'sku' => $prodData['sku'],
                'price' => $prodData['price'],
                'original_price' => $prodData['original_price'],
                'stock' => $prodData['stock'],
                'category_id' => $prodData['category_id'],
                'store_id' => $store->id,
                'status' => 'active',
                'brand' => $prodData['brand'],
                'weight' => $prodData['weight'],
                'dimensions' => $prodData['dimensions'],
                'rating' => rand(35, 50) / 10, // 3.5 to 5.0
                'reviews_count' => rand(10, 500),
            ]);
        }

        // Create customers for Salmeen's store
        $customers = [
            [
                'name' => 'Ahmed Al-Rashid',
                'email' => 'ahmed.rashid@email.com',
                'phone' => '+966501234567',
                'status' => 'vip',
                'total_orders' => 15,
                'total_spent' => 25000.00,
                'join_date' => '2023-01-15',
            ],
            [
                'name' => 'Fatima Al-Zahra',
                'email' => 'fatima.zahra@email.com',
                'phone' => '+966502345678',
                'status' => 'active',
                'total_orders' => 8,
                'total_spent' => 12000.00,
                'join_date' => '2023-03-20',
            ],
            [
                'name' => 'Omar Al-Sayed',
                'email' => 'omar.sayed@email.com',
                'phone' => '+966503456789',
                'status' => 'active',
                'total_orders' => 12,
                'total_spent' => 18000.00,
                'join_date' => '2023-02-10',
            ],
            [
                'name' => 'Layla Al-Mansour',
                'email' => 'layla.mansour@email.com',
                'phone' => '+966504567890',
                'status' => 'vip',
                'total_orders' => 22,
                'total_spent' => 35000.00,
                'join_date' => '2022-11-05',
            ],
            [
                'name' => 'Khalid Al-Nasser',
                'email' => 'khalid.nasser@email.com',
                'phone' => '+966505678901',
                'status' => 'active',
                'total_orders' => 5,
                'total_spent' => 8000.00,
                'join_date' => '2023-05-12',
            ],
        ];

        foreach ($customers as $custData) {
            Customer::create([
                'name' => $custData['name'],
                'email' => $custData['email'],
                'phone' => $custData['phone'],
                'store_id' => $store->id,
                'status' => $custData['status'],
                'total_orders' => $custData['total_orders'],
                'total_spent' => $custData['total_spent'],
                'join_date' => $custData['join_date'],
            ]);
        }

        // Create orders for Salmeen's store
        $orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        $paymentMethods = ['visa', 'mastercard', 'paypal', 'stripe', 'american_express'];
        
        $storeProducts = Product::where('store_id', $store->id)->get();
        $storeCustomers = Customer::where('store_id', $store->id)->get();

        // Create 30 sample orders for Salmeen's store
        for ($i = 1; $i <= 30; $i++) {
            $customer = $storeCustomers->random();
            
            // Generate order data
            $subtotal = 0;
            $items = [];
            
            // Add 1-4 random products to each order
            $orderProducts = $storeProducts->random(rand(1, 4));
            
            foreach ($orderProducts as $product) {
                $quantity = rand(1, 3);
                $price = $product->price;
                $total = $price * $quantity;
                $subtotal += $total;
                
                $items[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'total' => $total,
                ];
            }
            
            $shippingCost = rand(0, 50);
            $tax = $subtotal * 0.15; // 15% tax
            $total = $subtotal + $shippingCost + $tax;
            
            // Create order with realistic dates
            $orderDate = fake()->dateTimeBetween('-3 months', 'now');
            
            $order = Order::create([
                'order_id' => 'SE' . date('Y') . str_pad($i, 5, '0', STR_PAD_LEFT),
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'status' => $orderStatuses[array_rand($orderStatuses)],
                'payment_status' => $paymentStatuses[array_rand($paymentStatuses)],
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'shipping_address' => [
                    'street' => fake()->streetAddress(),
                    'city' => fake()->city(),
                    'state' => fake()->state(),
                    'postal_code' => fake()->postcode(),
                    'country' => 'Saudi Arabia',
                ],
                'shipping_cost' => $shippingCost,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => rand(0, 1) ? fake()->sentence() : null,
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);
            
            // Create order items
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['total'],
                ]);
            }
        }

        $this->command->info('Salmeen Ahmed test data seeded successfully!');
        $this->command->info('Store: Salmeen Electronics Store');
        $this->command->info('Login: salmeen@example.com / password');
        $this->command->info('Created: 8 products, 5 customers, 30 orders');
    }
}
