<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get store owner
        $storeOwner = User::where('email', 'store@example.com')->first();

        // Create main store
        Store::create([
            'name' => 'Tedara Store',
            'domain' => 'tedara-store',
            'owner_id' => $storeOwner->id,
            'status' => 'active',
            'description' => 'Your one-stop shop for quality products',
            'currency' => 'SAR',
            'language' => 'ar',
            'timezone' => 'Asia/Riyadh',
            'settings' => [
                'maintenance_mode' => false,
                'auto_backup' => true,
                'email_notifications' => true,
                'sms_notifications' => false,
            ],
        ]);

        // Create additional sample stores
        Store::create([
            'name' => 'Electronics Hub',
            'domain' => 'electronics-hub',
            'owner_id' => $storeOwner->id,
            'status' => 'active',
            'description' => 'Premium electronics and gadgets',
            'currency' => 'SAR',
            'language' => 'en',
            'timezone' => 'Asia/Riyadh',
            'settings' => [
                'maintenance_mode' => false,
                'auto_backup' => true,
                'email_notifications' => true,
                'sms_notifications' => true,
            ],
        ]);

        Store::create([
            'name' => 'Fashion Boutique',
            'domain' => 'fashion-boutique',
            'owner_id' => $storeOwner->id,
            'status' => 'active',
            'description' => 'Trendy fashion and accessories',
            'currency' => 'SAR',
            'language' => 'ar',
            'timezone' => 'Asia/Riyadh',
            'settings' => [
                'maintenance_mode' => false,
                'auto_backup' => true,
                'email_notifications' => true,
                'sms_notifications' => false,
            ],
        ]);
    }
}
