<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateStoreCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample categories for existing stores
        $categories = [
            'electronics',
            'fashion',
            'beauty',
            'home',
            'sports',
            'books',
            'automotive',
            'food',
            'health',
            'toys'
        ];

        // Get all stores without categories
        $stores = DB::table('stores')->whereNull('category')->get();

        foreach ($stores as $store) {
            // Assign a random category to each store
            $randomCategory = $categories[array_rand($categories)];
            
            DB::table('stores')
                ->where('id', $store->id)
                ->update([
                    'category' => $randomCategory,
                    'updated_at' => now()
                ]);
        }

        $this->command->info('Updated ' . count($stores) . ' stores with categories.');
    }
}

















