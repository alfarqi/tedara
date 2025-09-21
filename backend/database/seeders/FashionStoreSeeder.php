<?php

namespace Database\Seeders;

//test 

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Category;
use App\Models\Product;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Str;

class FashionStoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if ($this->command) {
            $this->command->info('Creating Fashion Store with tenant and products...');
        }

        // Create or find a store owner user
        $storeOwner = User::where('email', 'fashion@tedara.com')->first();
        
        if (!$storeOwner) {
            $storeOwner = User::create([
                'name' => 'Fashion Store Owner',
                'email' => 'fashion@tedara.com',
                'password' => bcrypt('password'),
                'role' => 'store_owner',
                'store_handle' => 'fashion-store',
                'email_verified_at' => now(),
            ]);
        }

        // Create tenant
        $tenant = Tenant::where('handle', 'fashion-store')->first();
        
        if (!$tenant) {
            $tenant = Tenant::create([
                'handle' => 'fashion-store',
                'display_name' => 'Fashion Store',
                'status' => 'active',
            ]);
        }

        // Create store
        $store = Store::where('domain', 'fashion-store')->first();
        
        if (!$store) {
            $store = Store::create([
                'name' => 'Fashion Store',
                'domain' => 'fashion-store',
                'owner_id' => $storeOwner->id,
                'status' => 'active',
                'description' => 'Trendy fashion store offering the latest in clothing, accessories, and footwear',
                'category' => 'Fashion',
                'currency' => 'SAR',
                'language' => 'en',
                'timezone' => 'Asia/Riyadh',
                'logo' => 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200',
                'settings' => [
                    'theme' => 'modern',
                    'colors' => [
                        'primary' => '#6366f1',
                        'secondary' => '#8b5cf6',
                    ],
                ],
            ]);
        }

        if ($this->command) {
            $this->command->info('Seeding Fashion store with categories and products...');
        }

        // Create categories
        $categories = $this->createCategories($store->id);
        
        // Create products
        $this->createProducts($store->id, $tenant->id, $categories);

        if ($this->command) {
            $this->command->info('Fashion store seeded successfully!');
        }
    }

    private function createCategories(int $storeId): array
    {
        $categories = [
            [
                'name' => 'Women\'s Clothing',
                'description' => 'Elegant and trendy women\'s fashion for every occasion',
                'image' => 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 1,
            ],
            [
                'name' => 'Men\'s Clothing',
                'description' => 'Stylish and comfortable men\'s fashion essentials',
                'image' => 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 2,
            ],
            [
                'name' => 'Accessories',
                'description' => 'Fashion accessories, jewelry, and style essentials',
                'image' => 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 3,
            ],
            [
                'name' => 'Shoes & Footwear',
                'description' => 'Comfortable and stylish footwear for all occasions',
                'image' => 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 4,
            ],
            [
                'name' => 'Bags & Handbags',
                'description' => 'Trendy bags and handbags to complete your look',
                'image' => 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 5,
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $categoryData) {
            // Check if category already exists
            $existingCategory = Category::where('name', $categoryData['name'])
                ->where('store_id', $storeId)
                ->first();
            
            if ($existingCategory) {
                $createdCategories[] = $existingCategory;
                if ($this->command) {
                    $this->command->warn("Category '{$categoryData['name']}' already exists, using existing...");
                }
                continue;
            }

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
        $productsData = require __DIR__ . '/fashion_products_data.php';

        foreach ($productsData as $productData) {
            // Check if product already exists
            $existingProduct = Product::where('sku', $productData['sku'])->first();
            
            if ($existingProduct) {
                if ($this->command) {
                    $this->command->warn("Product with SKU {$productData['sku']} already exists, skipping...");
                }
                continue;
            }

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
