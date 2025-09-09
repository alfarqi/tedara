<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create super admin user
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'status' => 'active',
            'phone' => '+966 50 123 4567',
            'location' => 'Riyadh, Saudi Arabia',
            'force_password_change' => true,
            'email_verified_at' => now(),
        ]);

        // Create sample store owner
        User::create([
            'name' => 'Store Owner',
            'email' => 'store@example.com',
            'password' => Hash::make('password'),
            'role' => 'store_owner',
            'status' => 'active',
            'phone' => '+966 55 987 6543',
            'location' => 'Jeddah, Saudi Arabia',
            'email_verified_at' => now(),
        ]);

        // Create sample store manager
        User::create([
            'name' => 'Store Manager',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => 'store_manager',
            'status' => 'active',
            'phone' => '+966 54 111 2222',
            'location' => 'Dammam, Saudi Arabia',
            'email_verified_at' => now(),
        ]);

        // Create sample customer
        User::create([
            'name' => 'Sample Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'status' => 'active',
            'phone' => '+966 56 333 4444',
            'location' => 'Mecca, Saudi Arabia',
            'email_verified_at' => now(),
        ]);

        // Create sample support user
        User::create([
            'name' => 'Support Team',
            'email' => 'support@example.com',
            'password' => Hash::make('password'),
            'role' => 'support',
            'status' => 'active',
            'phone' => '+966 57 555 6666',
            'location' => 'Medina, Saudi Arabia',
            'email_verified_at' => now(),
        ]);

        // Create Salmeen Ahmed user for testing
        User::create([
            'name' => 'Salmeen Ahmed',
            'email' => 'salmeen@example.com',
            'password' => Hash::make('password'),
            'role' => 'store_owner',
            'status' => 'active',
            'phone' => '+966 58 777 8888',
            'location' => 'Riyadh, Saudi Arabia',
            'email_verified_at' => now(),
        ]);

        // Create additional sample users
        User::factory(20)->create();
    }
}
