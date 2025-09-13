<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            StoreSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            CustomerSeeder::class,
            OrderSeeder::class,
            SystemSettingSeeder::class,
            SalmeenTestDataSeeder::class,
            SalmeenProductsSeeder::class,
            FatoomaStoreSeeder::class,
            // Multi-tenant storefront seeders
            TenantSeeder::class,
            ThemeSeeder::class,
            StorefrontSeeder::class,
        ]);
    }
}
