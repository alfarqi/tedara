<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Category;
use App\Models\Product;
use App\Models\Tenant;

class AhlamStoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the Ahlam store and tenant
        $store = Store::where('name', 'ahlam')->first();
        $tenant = Tenant::where('handle', 'ahlam')->first();
        
        if (!$store || !$tenant) {
            $this->command->error('Ahlam store or tenant not found. Please ensure they exist.');
            return;
        }

        $this->command->info('Seeding Ahlam store with fashion products...');

        // Create categories
        $categories = $this->createCategories($store->id);
        
        // Create products
        $this->createProducts($store->id, $tenant->id, $categories);

        $this->command->info('Ahlam store seeded successfully!');
    }

    private function createCategories(int $storeId): array
    {
        $categories = [
            [
                'name' => 'Women\'s Clothing',
                'description' => 'Elegant and trendy women\'s fashion',
                'image' => 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 1,
            ],
            [
                'name' => 'Men\'s Clothing',
                'description' => 'Stylish and comfortable men\'s fashion',
                'image' => 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 2,
            ],
            [
                'name' => 'Accessories',
                'description' => 'Fashion accessories and jewelry',
                'image' => 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 3,
            ],
            [
                'name' => 'Shoes',
                'description' => 'Comfortable and stylish footwear',
                'image' => 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 4,
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'description' => $categoryData['description'],
                'store_id' => $storeId,
                'image' => $categoryData['image'],
                'sort_order' => $categoryData['sort_order'],
            ]);
            $createdCategories[] = $category;
        }

        return $createdCategories;
    }

    private function createProducts(int $storeId, string $tenantId, array $categories): void
    {
        $productsData = require __DIR__ . '/ahlam_products_data.php';

        foreach ($productsData as $productData) {
            Product::create([
                'tenant_id' => $tenantId,
                'store_id' => $storeId,
                'name' => $productData['name'],
                'description' => $productData['description'],
                'sku' => $productData['sku'],
                'price' => $productData['price'],
                'original_price' => $productData['original_price'] ?? null,
                'stock' => $productData['stock'],
                'category_id' => $categories[$productData['category_index']]->id,
                'status' => 'active',
                'images' => $productData['images'],
                'weight' => $productData['weight'],
                'brand' => $productData['brand'],
                'tags' => $productData['tags'],
                'rating' => $productData['rating'],
                'reviews_count' => $productData['reviews_count'],
            ]);
        }
    }
}
