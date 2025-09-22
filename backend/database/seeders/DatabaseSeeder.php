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
            // Add your seeders here
            FashionStoreSeeder::class,
            FasoolStoreSeeder::class,
        ]);
    }
}