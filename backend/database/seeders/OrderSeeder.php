<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Store;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing stores, customers, and products
        $stores = Store::all();
        $customers = Customer::all();
        $products = Product::all();

        if ($stores->isEmpty() || $customers->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Skipping OrderSeeder: No stores, customers, or products found.');
            return;
        }

        $orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        $paymentMethods = ['visa', 'mastercard', 'paypal', 'stripe', 'american_express'];

        // Create 50 sample orders
        for ($i = 1; $i <= 50; $i++) {
            $store = $stores->random();
            $customer = $customers->random();
            
            // Generate order data
            $subtotal = 0;
            $items = [];
            
            // Add 1-5 random products to each order
            $orderProducts = $products->random(rand(1, 5));
            
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
            
            $shippingCost = rand(0, 20);
            $tax = $subtotal * 0.15; // 15% tax
            $total = $subtotal + $shippingCost + $tax;
            
            // Create order
            $order = Order::create([
                'order_id' => 'WB' . date('Y') . str_pad($i, 5, '0', STR_PAD_LEFT),
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
                    'country' => fake()->country(),
                ],
                'shipping_cost' => $shippingCost,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => rand(0, 1) ? fake()->sentence() : null,
                'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
                'updated_at' => fake()->dateTimeBetween('-6 months', 'now'),
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

        $this->command->info('Orders seeded successfully!');
    }
}


















