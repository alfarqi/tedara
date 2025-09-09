<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the main store
        $store = Store::where('domain', 'tedara-store')->first();

        // Get categories
        $furniture = Category::where('name', 'Furniture')->where('store_id', $store->id)->first();
        $electronics = Category::where('name', 'Electronics')->where('store_id', $store->id)->first();
        $fashion = Category::where('name', 'Fashion')->where('store_id', $store->id)->first();

        // Create sample products
        Product::create([
            'name' => 'Modern Minimalist Fabric Sofa Single Seater',
            'description' => 'Comfortable and stylish single seater sofa perfect for modern homes.',
            'sku' => 'SOFA-001',
            'price' => 764.15,
            'original_price' => 899.00,
            'stock' => 12,
            'category_id' => $furniture->id,
            'store_id' => $store->id,
            'status' => 'active',
            'images' => ['/assets/images/products/1.png'],
            'weight' => 25.5,
            'dimensions' => '80x85x75 cm',
            'brand' => 'ModernHome',
            'tags' => ['furniture', 'sofa', 'modern', 'comfortable'],
            'rating' => 4.5,
            'reviews_count' => 45,
        ]);

        Product::create([
            'name' => 'Funky Streetwear Sneakers - Neon Splash',
            'description' => 'Trendy sneakers with neon splash design for street fashion.',
            'sku' => 'SNEAK-001',
            'price' => 44.99,
            'original_price' => 59.99,
            'stock' => 8,
            'category_id' => $fashion->id,
            'store_id' => $store->id,
            'status' => 'active',
            'images' => ['/assets/images/products/2.png'],
            'weight' => 0.8,
            'dimensions' => 'Size 42',
            'brand' => 'StreetStyle',
            'tags' => ['shoes', 'sneakers', 'streetwear', 'neon'],
            'rating' => 3.0,
            'reviews_count' => 32,
        ]);

        Product::create([
            'name' => 'Wireless Bluetooth Headphones',
            'description' => 'High-quality wireless headphones with noise cancellation.',
            'sku' => 'HEAD-001',
            'price' => 199.99,
            'original_price' => 249.99,
            'stock' => 15,
            'category_id' => $electronics->id,
            'store_id' => $store->id,
            'status' => 'active',
            'images' => ['/assets/images/products/3.png'],
            'weight' => 0.3,
            'dimensions' => '18x16x8 cm',
            'brand' => 'AudioTech',
            'tags' => ['headphones', 'bluetooth', 'wireless', 'audio'],
            'rating' => 4.8,
            'reviews_count' => 67,
        ]);

        Product::create([
            'name' => 'Ergonomic Office Chair',
            'description' => 'Comfortable ergonomic office chair with adjustable features.',
            'sku' => 'CHAIR-001',
            'price' => 299.99,
            'original_price' => 399.99,
            'stock' => 5,
            'category_id' => $furniture->id,
            'store_id' => $store->id,
            'status' => 'active',
            'images' => ['/assets/images/products/4.png'],
            'weight' => 12.5,
            'dimensions' => '65x65x120 cm',
            'brand' => 'OfficePro',
            'tags' => ['chair', 'office', 'ergonomic', 'adjustable'],
            'rating' => 4.2,
            'reviews_count' => 23,
        ]);

        Product::create([
            'name' => 'Smart LED Desk Lamp',
            'description' => 'Smart LED desk lamp with touch control and adjustable brightness.',
            'sku' => 'LAMP-001',
            'price' => 89.99,
            'original_price' => 119.99,
            'stock' => 20,
            'category_id' => $electronics->id,
            'store_id' => $store->id,
            'status' => 'active',
            'images' => ['/assets/images/products/5.png'],
            'weight' => 1.2,
            'dimensions' => '25x15x45 cm',
            'brand' => 'LightTech',
            'tags' => ['lamp', 'led', 'smart', 'desk'],
            'rating' => 4.6,
            'reviews_count' => 38,
        ]);

        Product::create([
            'name' => 'Casual Denim Jacket',
            'description' => 'Classic denim jacket perfect for casual wear.',
            'sku' => 'JACKET-001',
            'price' => 79.99,
            'original_price' => 99.99,
            'stock' => 10,
            'category_id' => $fashion->id,
            'store_id' => $store->id,
            'status' => 'active',
            'images' => ['/assets/images/products/6.png'],
            'weight' => 0.6,
            'dimensions' => 'M Size',
            'brand' => 'DenimStyle',
            'tags' => ['jacket', 'denim', 'casual', 'classic'],
            'rating' => 4.3,
            'reviews_count' => 29,
        ]);

        // Create additional products using factory
        // Product::factory(50)->create([
        //     'store_id' => $store->id,
        // ]);
    }
}
