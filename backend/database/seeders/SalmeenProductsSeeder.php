<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class SalmeenProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Salmeen's store
        $store = Store::where('domain', 'salmeen-electronics')->first();
        
        if (!$store) {
            $this->command->error('Salmeen Electronics store not found. Please run SalmeenTestDataSeeder first.');
            return;
        }

        // Create categories for electronics store
        $categories = $this->createCategories($store);

        // Create products
        $this->createProducts($store, $categories);

        $this->command->info('Salmeen Products seeded successfully!');
    }

    private function createCategories(Store $store): array
    {
        $categories = [
            [
                'name' => 'Smartphones',
                'description' => 'Latest smartphones and mobile devices',
                'sort_order' => 1
            ],
            [
                'name' => 'Laptops & Computers',
                'description' => 'Desktop computers, laptops, and accessories',
                'sort_order' => 2
            ],
            [
                'name' => 'Audio & Headphones',
                'description' => 'Speakers, headphones, and audio equipment',
                'sort_order' => 3
            ],
            [
                'name' => 'Gaming',
                'description' => 'Gaming consoles, accessories, and games',
                'sort_order' => 4
            ],
            [
                'name' => 'Smart Home',
                'description' => 'Smart home devices and automation',
                'sort_order' => 5
            ],
            [
                'name' => 'Accessories',
                'description' => 'Phone cases, chargers, cables, and more',
                'sort_order' => 6
            ]
        ];

        $createdCategories = [];
        foreach ($categories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'description' => $categoryData['description'],
                'store_id' => $store->id,
                'sort_order' => $categoryData['sort_order']
            ]);
            $createdCategories[$categoryData['name']] = $category;
        }

        return $createdCategories;
    }

    private function createProducts(Store $store, array $categories): void
    {
        $products = [
            // Smartphones
            [
                'name' => 'iPhone 15 Pro Max',
                'description' => 'The most advanced iPhone ever with A17 Pro chip, titanium design, and pro camera system.',
                'sku' => 'IPH15PM-256GB',
                'price' => 1199.00,
                'original_price' => 1299.00,
                'stock' => 25,
                'category_id' => $categories['Smartphones']->id,
                'brand' => 'Apple',
                'weight' => 221.0,
                'dimensions' => '159.9 x 76.7 x 8.25 mm',
                'rating' => 4.8,
                'reviews_count' => 156,
                'tags' => ['smartphone', 'iphone', '5g', 'camera'],
                'images' => ['/assets/images/products/iphone15-pro-max.jpg']
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Revolutionary AI features with S Pen, 200MP camera, and titanium frame.',
                'sku' => 'SGS24U-512GB',
                'price' => 1299.00,
                'original_price' => 1399.00,
                'stock' => 18,
                'category_id' => $categories['Smartphones']->id,
                'brand' => 'Samsung',
                'weight' => 232.0,
                'dimensions' => '163.4 x 79.0 x 8.6 mm',
                'rating' => 4.7,
                'reviews_count' => 89,
                'tags' => ['smartphone', 'android', '5g', 's-pen'],
                'images' => ['/assets/images/products/samsung-s24-ultra.jpg']
            ],
            [
                'name' => 'Google Pixel 8 Pro',
                'description' => 'AI-powered camera system with Magic Eraser and advanced photo editing.',
                'sku' => 'GP8P-256GB',
                'price' => 999.00,
                'original_price' => 1099.00,
                'stock' => 12,
                'category_id' => $categories['Smartphones']->id,
                'brand' => 'Google',
                'weight' => 213.0,
                'dimensions' => '162.6 x 76.5 x 8.8 mm',
                'rating' => 4.6,
                'reviews_count' => 67,
                'tags' => ['smartphone', 'android', 'camera', 'ai'],
                'images' => ['/assets/images/products/google-pixel-8-pro.jpg']
            ],

            // Laptops & Computers
            [
                'name' => 'MacBook Pro 16" M3 Max',
                'description' => 'The most powerful MacBook Pro with M3 Max chip, up to 128GB unified memory.',
                'sku' => 'MBP16-M3MAX-1TB',
                'price' => 3499.00,
                'original_price' => 3699.00,
                'stock' => 8,
                'category_id' => $categories['Laptops & Computers']->id,
                'brand' => 'Apple',
                'weight' => 2200.0,
                'dimensions' => '355.7 x 248.1 x 16.8 mm',
                'rating' => 4.9,
                'reviews_count' => 45,
                'tags' => ['laptop', 'macbook', 'm3', 'pro'],
                'images' => ['/assets/images/products/macbook-pro-16.jpg']
            ],
            [
                'name' => 'Dell XPS 15 9530',
                'description' => 'Premium Windows laptop with 13th Gen Intel Core i9, RTX 4070, and 4K OLED display.',
                'sku' => 'DXP15-9530-1TB',
                'price' => 2499.00,
                'original_price' => 2699.00,
                'stock' => 15,
                'category_id' => $categories['Laptops & Computers']->id,
                'brand' => 'Dell',
                'weight' => 1800.0,
                'dimensions' => '344.4 x 230.1 x 18.0 mm',
                'rating' => 4.7,
                'reviews_count' => 78,
                'tags' => ['laptop', 'windows', 'intel', 'rtx'],
                'images' => ['/assets/images/products/dell-xps-15.jpg']
            ],
            [
                'name' => 'ASUS ROG Strix G16',
                'description' => 'Gaming laptop with Intel Core i9-14900H, RTX 4080, and 16" QHD+ 240Hz display.',
                'sku' => 'ASRG16-1TB',
                'price' => 1899.00,
                'original_price' => 2099.00,
                'stock' => 22,
                'category_id' => $categories['Laptops & Computers']->id,
                'brand' => 'ASUS',
                'weight' => 2500.0,
                'dimensions' => '354.0 x 264.0 x 22.6 mm',
                'rating' => 4.5,
                'reviews_count' => 34,
                'tags' => ['laptop', 'gaming', 'rog', 'rtx'],
                'images' => ['/assets/images/products/asus-rog-strix.jpg']
            ],

            // Audio & Headphones
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Industry-leading noise canceling headphones with 30-hour battery life.',
                'sku' => 'SWH1000XM5',
                'price' => 399.00,
                'original_price' => 449.00,
                'stock' => 35,
                'category_id' => $categories['Audio & Headphones']->id,
                'brand' => 'Sony',
                'weight' => 250.0,
                'dimensions' => '248 x 167 x 72 mm',
                'rating' => 4.8,
                'reviews_count' => 234,
                'tags' => ['headphones', 'noise-canceling', 'wireless', 'bluetooth'],
                'images' => ['/assets/images/products/sony-wh1000xm5.jpg']
            ],
            [
                'name' => 'Apple AirPods Pro 2',
                'description' => 'Active noise cancellation, spatial audio, and sweat and water resistance.',
                'sku' => 'AAP2-USB-C',
                'price' => 249.00,
                'original_price' => 279.00,
                'stock' => 50,
                'category_id' => $categories['Audio & Headphones']->id,
                'brand' => 'Apple',
                'weight' => 5.3,
                'dimensions' => '30.9 x 18.0 x 19.2 mm',
                'rating' => 4.7,
                'reviews_count' => 189,
                'tags' => ['earbuds', 'wireless', 'noise-canceling', 'spatial-audio'],
                'images' => ['/assets/images/products/airpods-pro-2.jpg']
            ],
            [
                'name' => 'Bose QuietComfort Ultra',
                'description' => 'Immersive audio with QuietComfort and Aware modes for ultimate listening experience.',
                'sku' => 'BQCU-BLK',
                'price' => 429.00,
                'original_price' => 479.00,
                'stock' => 28,
                'category_id' => $categories['Audio & Headphones']->id,
                'brand' => 'Bose',
                'weight' => 245.0,
                'dimensions' => '190 x 170 x 80 mm',
                'rating' => 4.6,
                'reviews_count' => 67,
                'tags' => ['headphones', 'noise-canceling', 'immersive-audio'],
                'images' => ['/assets/images/products/bose-qc-ultra.jpg']
            ],

            // Gaming
            [
                'name' => 'PlayStation 5 Console',
                'description' => 'Next-gen gaming with lightning-fast loading, haptic feedback, and 3D audio.',
                'sku' => 'PS5-DISC',
                'price' => 499.00,
                'original_price' => 549.00,
                'stock' => 15,
                'category_id' => $categories['Gaming']->id,
                'brand' => 'Sony',
                'weight' => 4500.0,
                'dimensions' => '390 x 260 x 104 mm',
                'rating' => 4.9,
                'reviews_count' => 456,
                'tags' => ['gaming', 'console', 'playstation', '4k'],
                'images' => ['/assets/images/products/ps5-console.jpg']
            ],
            [
                'name' => 'Xbox Series X',
                'description' => 'Most powerful Xbox ever with 4K gaming, ray tracing, and 120 FPS support.',
                'sku' => 'XBX-1TB',
                'price' => 499.00,
                'original_price' => 549.00,
                'stock' => 12,
                'category_id' => $categories['Gaming']->id,
                'brand' => 'Microsoft',
                'weight' => 4450.0,
                'dimensions' => '151 x 151 x 301 mm',
                'rating' => 4.8,
                'reviews_count' => 234,
                'tags' => ['gaming', 'console', 'xbox', '4k'],
                'images' => ['/assets/images/products/xbox-series-x.jpg']
            ],
            [
                'name' => 'Nintendo Switch OLED',
                'description' => '7-inch OLED screen, enhanced audio, and 64GB internal storage.',
                'sku' => 'NSW-OLED-WHT',
                'price' => 349.00,
                'original_price' => 379.00,
                'stock' => 30,
                'category_id' => $categories['Gaming']->id,
                'brand' => 'Nintendo',
                'weight' => 420.0,
                'dimensions' => '242 x 102 x 13.9 mm',
                'rating' => 4.7,
                'reviews_count' => 178,
                'tags' => ['gaming', 'console', 'nintendo', 'portable'],
                'images' => ['/assets/images/products/nintendo-switch-oled.jpg']
            ],

            // Smart Home
            [
                'name' => 'Amazon Echo Dot (5th Gen)',
                'description' => 'Smart speaker with Alexa, improved audio, and temperature sensor.',
                'sku' => 'AED5-BLK',
                'price' => 49.99,
                'original_price' => 59.99,
                'stock' => 45,
                'category_id' => $categories['Smart Home']->id,
                'brand' => 'Amazon',
                'weight' => 300.0,
                'dimensions' => '99 x 99 x 43 mm',
                'rating' => 4.5,
                'reviews_count' => 567,
                'tags' => ['smart-speaker', 'alexa', 'voice-assistant'],
                'images' => ['/assets/images/products/echo-dot-5.jpg']
            ],
            [
                'name' => 'Google Nest Hub (2nd Gen)',
                'description' => 'Smart display with Google Assistant, sleep sensing, and ambient EQ.',
                'sku' => 'GNH2-CHALK',
                'price' => 99.99,
                'original_price' => 119.99,
                'stock' => 25,
                'category_id' => $categories['Smart Home']->id,
                'brand' => 'Google',
                'weight' => 558.0,
                'dimensions' => '177.8 x 117.5 x 69.9 mm',
                'rating' => 4.4,
                'reviews_count' => 234,
                'tags' => ['smart-display', 'google-assistant', 'sleep-sensing'],
                'images' => ['/assets/images/products/nest-hub-2.jpg']
            ],
            [
                'name' => 'Philips Hue White & Color Ambiance Starter Kit',
                'description' => 'Smart LED bulbs with 16 million colors, voice control, and scheduling.',
                'sku' => 'PHH-WCA-3PK',
                'price' => 199.99,
                'original_price' => 249.99,
                'stock' => 18,
                'category_id' => $categories['Smart Home']->id,
                'brand' => 'Philips',
                'weight' => 500.0,
                'dimensions' => '120 x 80 x 40 mm',
                'rating' => 4.6,
                'reviews_count' => 189,
                'tags' => ['smart-lights', 'hue', 'color-changing', 'voice-control'],
                'images' => ['/assets/images/products/philips-hue-starter.jpg']
            ],

            // Accessories
            [
                'name' => 'Anker PowerCore 26800mAh',
                'description' => 'High-capacity portable charger with PowerIQ technology and USB-C.',
                'sku' => 'APC26800-BLK',
                'price' => 59.99,
                'original_price' => 79.99,
                'stock' => 40,
                'category_id' => $categories['Accessories']->id,
                'brand' => 'Anker',
                'weight' => 570.0,
                'dimensions' => '162 x 78 x 22 mm',
                'rating' => 4.7,
                'reviews_count' => 345,
                'tags' => ['power-bank', 'portable-charger', 'usb-c'],
                'images' => ['/assets/images/products/anker-powercore.jpg']
            ],
            [
                'name' => 'OtterBox Defender Series iPhone 15 Pro',
                'description' => 'Triple-layer protection with built-in screen protector and belt clip.',
                'sku' => 'OBD-IP15P-BLK',
                'price' => 49.95,
                'original_price' => 59.95,
                'stock' => 60,
                'category_id' => $categories['Accessories']->id,
                'brand' => 'OtterBox',
                'weight' => 45.0,
                'dimensions' => '160 x 78 x 15 mm',
                'rating' => 4.5,
                'reviews_count' => 234,
                'tags' => ['phone-case', 'protective', 'defender'],
                'images' => ['/assets/images/products/otterbox-defender.jpg']
            ],
            [
                'name' => 'Belkin Boost Charge Pro 3-in-1',
                'description' => 'Wireless charging pad for iPhone, Apple Watch, and AirPods.',
                'sku' => 'BBCP3-1-WHT',
                'price' => 149.99,
                'original_price' => 179.99,
                'stock' => 20,
                'category_id' => $categories['Accessories']->id,
                'brand' => 'Belkin',
                'weight' => 400.0,
                'dimensions' => '150 x 150 x 25 mm',
                'rating' => 4.6,
                'reviews_count' => 123,
                'tags' => ['wireless-charger', '3-in-1', 'magsafe'],
                'images' => ['/assets/images/products/belkin-boost-charge.jpg']
            ]
        ];

        foreach ($products as $productData) {
            Product::create([
                'name' => $productData['name'],
                'description' => $productData['description'],
                'sku' => $productData['sku'],
                'price' => $productData['price'],
                'original_price' => $productData['original_price'],
                'stock' => $productData['stock'],
                'category_id' => $productData['category_id'],
                'store_id' => $store->id,
                'status' => 'active',
                'brand' => $productData['brand'],
                'weight' => $productData['weight'],
                'dimensions' => $productData['dimensions'],
                'rating' => $productData['rating'],
                'reviews_count' => $productData['reviews_count'],
                'tags' => $productData['tags'],
                'images' => $productData['images']
            ]);
        }
    }
}















