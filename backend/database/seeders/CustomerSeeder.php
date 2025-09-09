<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Store;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the main store
        $store = Store::where('domain', 'tedara-store')->first();

        // Create sample customers
        Customer::create([
            'name' => 'Emma Johnson',
            'email' => 'emma.johnson@ecomsite.com',
            'phone' => '+966 50 123 4567',
            'store_id' => $store->id,
            'status' => 'active',
            'total_orders' => 12,
            'total_spent' => 2450.00,
            'join_date' => '2024-03-15',
        ]);

        Customer::create([
            'name' => 'Michael Brown',
            'email' => 'michael.brown@shopzone.com',
            'phone' => '+966 55 987 6543',
            'store_id' => $store->id,
            'status' => 'vip',
            'total_orders' => 8,
            'total_spent' => 1890.50,
            'join_date' => '2024-01-22',
        ]);

        Customer::create([
            'name' => 'Sarah Wilson',
            'email' => 'sarah.wilson@onlineshop.com',
            'phone' => '+966 54 111 2222',
            'store_id' => $store->id,
            'status' => 'active',
            'total_orders' => 5,
            'total_spent' => 890.25,
            'join_date' => '2024-02-08',
        ]);

        Customer::create([
            'name' => 'David Lee',
            'email' => 'david.lee@ecomstore.com',
            'phone' => '+966 56 333 4444',
            'store_id' => $store->id,
            'status' => 'inactive',
            'total_orders' => 3,
            'total_spent' => 450.75,
            'join_date' => '2024-04-03',
        ]);

        Customer::create([
            'name' => 'Lisa Anderson',
            'email' => 'lisa.anderson@shopmail.com',
            'phone' => '+966 57 555 6666',
            'store_id' => $store->id,
            'status' => 'vip',
            'total_orders' => 15,
            'total_spent' => 3200.00,
            'join_date' => '2023-12-19',
        ]);

        Customer::create([
            'name' => 'Mason Carter',
            'email' => 'mason.carter@shopmail.com',
            'phone' => '+966 58 777 8888',
            'store_id' => $store->id,
            'status' => 'active',
            'total_orders' => 7,
            'total_spent' => 129.45,
            'join_date' => '2024-05-09',
        ]);

        Customer::create([
            'name' => 'Ava Martin',
            'email' => 'ava.martin@marketplace.com',
            'phone' => '+966 59 999 0000',
            'store_id' => $store->id,
            'status' => 'active',
            'total_orders' => 4,
            'total_spent' => 87.00,
            'join_date' => '2024-05-07',
        ]);

        Customer::create([
            'name' => 'Noah Wilson',
            'email' => 'noah.wilson@ecomsite.com',
            'phone' => '+966 60 111 2222',
            'store_id' => $store->id,
            'status' => 'active',
            'total_orders' => 2,
            'total_spent' => 59.90,
            'join_date' => '2024-04-26',
        ]);

        // Create additional customers using factory
        Customer::factory(30)->create([
            'store_id' => $store->id,
        ]);
    }
}
