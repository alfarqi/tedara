<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Category;
use App\Models\Product;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Str;

class FasoolStoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if ($this->command) {
            $this->command->info('Creating Fasool Store with tenant and products...');
        }

        // Create or find a store owner user
        $storeOwner = User::where('email', 'fasool@tedara.com')->first();
        
        if (!$storeOwner) {
            $storeOwner = User::create([
                'name' => 'Fasool Store Owner',
                'email' => 'fasool@tedara.com',
                'password' => bcrypt('password'),
                'role' => 'store_owner',
                'store_handle' => 'fasool',
                'email_verified_at' => now(),
            ]);
        }

        // Create tenant
        $tenant = Tenant::where('handle', 'fasool')->first();
        
        if (!$tenant) {
            $tenant = Tenant::create([
                'handle' => 'fasool',
                'display_name' => 'Fasool Food Store',
                'status' => 'active',
            ]);
        }

        // Create store
        $store = Store::where('domain', 'fasool')->first();
        
        if (!$store) {
            $store = Store::create([
                'name' => 'Fasool Food Store',
                'domain' => 'fasool',
                'owner_id' => $storeOwner->id,
                'status' => 'active',
                'description' => 'Fresh and delicious food store offering authentic Middle Eastern cuisine, fresh ingredients, and homemade specialties',
                'category' => 'Food & Beverage',
                'currency' => 'SAR',
                'language' => 'ar',
                'timezone' => 'Asia/Riyadh',
                'logo' => 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=200',
                'settings' => [
                    'theme' => 'warm',
                    'colors' => [
                        'primary' => '#d97706',
                        'secondary' => '#f59e0b',
                    ],
                    'contact_email' => 'info@fasool.com',
                    'contact_phone' => '+966501234567',
                    'slogan' => 'طعم الأصالة في كل لقمة - Authentic taste in every bite',
                ],
            ]);
        }

        if ($this->command) {
            $this->command->info('Seeding Fasool store with categories and products...');
        }

        // Create categories
        $categories = $this->createCategories($store->id);
        
        // Create products
        $this->createProducts($store->id, $tenant->id, $categories);

        if ($this->command) {
            $this->command->info('Fasool store seeded successfully!');
        }
    }

    private function createCategories(int $storeId): array
    {
        $categories = [
            [
                'name' => 'Main Dishes',
                'description' => 'Traditional main dishes and hearty meals',
                'image' => 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 1,
            ],
            [
                'name' => 'Appetizers & Salads',
                'description' => 'Fresh appetizers, salads, and starters',
                'image' => 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 2,
            ],
            [
                'name' => 'Beverages',
                'description' => 'Fresh juices, traditional drinks, and beverages',
                'image' => 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 3,
            ],
            [
                'name' => 'Desserts',
                'description' => 'Sweet treats and traditional desserts',
                'image' => 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
                'sort_order' => 4,
            ],
            [
                'name' => 'Fresh Ingredients',
                'description' => 'Fresh vegetables, herbs, and cooking ingredients',
                'image' => 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
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
        $productsData = require __DIR__ . '/fasool_products_data.php';

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
