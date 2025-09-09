<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\QuestionRating;
use App\Models\Reply;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class FatoomaStoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Fatooma store owner
        $fatoomaOwner = User::create([
            'name' => 'Fatooma Al-Rashid',
            'email' => 'fatooma@example.com',
            'password' => Hash::make('password'),
            'role' => 'store_owner',
            'status' => 'active',
            'phone' => '+966 50 123 4567',
            'location' => 'Riyadh, Saudi Arabia',
            'email_verified_at' => now(),
        ]);

        // Create Fatooma store
        $fatoomaStore = Store::create([
            'name' => 'Fatooma',
            'domain' => 'fatooma',
            'owner_id' => $fatoomaOwner->id,
            'status' => 'active',
            'description' => 'Fatooma - Your trusted partner for quality products and exceptional service',
            'currency' => 'SAR',
            'language' => 'ar',
            'timezone' => 'Asia/Riyadh',
            'settings' => [
                'maintenance_mode' => false,
                'auto_backup' => true,
                'email_notifications' => true,
                'sms_notifications' => true,
            ],
        ]);

        // Update the owner's store_id
        $fatoomaOwner->update(['store_id' => $fatoomaStore->id]);

        // Create categories for Fatooma store
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Latest electronics and gadgets',
                'store_id' => $fatoomaStore->id,
            ],
            [
                'name' => 'Fashion',
                'description' => 'Trendy fashion and accessories',
                'store_id' => $fatoomaStore->id,
            ],
            [
                'name' => 'Home & Garden',
                'description' => 'Home improvement and garden supplies',
                'store_id' => $fatoomaStore->id,
            ],
            [
                'name' => 'Beauty & Health',
                'description' => 'Beauty products and health supplements',
                'store_id' => $fatoomaStore->id,
            ],
            [
                'name' => 'Sports & Fitness',
                'description' => 'Sports equipment and fitness gear',
                'store_id' => $fatoomaStore->id,
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $categoryData) {
            $createdCategories[] = Category::create($categoryData);
        }

        // Create sample customers for reviews
        $customers = [
            [
                'name' => 'Ahmed Al-Mansouri',
                'email' => 'ahmed.mansouri@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'status' => 'active',
                'phone' => '+966 55 111 2222',
                'location' => 'Jeddah, Saudi Arabia',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Fatima Al-Zahra',
                'email' => 'fatima.zahra@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'status' => 'active',
                'phone' => '+966 56 333 4444',
                'location' => 'Riyadh, Saudi Arabia',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Mohammed Al-Sheikh',
                'email' => 'mohammed.sheikh@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'status' => 'active',
                'phone' => '+966 57 555 6666',
                'location' => 'Dammam, Saudi Arabia',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Noura Al-Rashid',
                'email' => 'noura.rashid@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'status' => 'active',
                'phone' => '+966 58 777 8888',
                'location' => 'Mecca, Saudi Arabia',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Khalid Al-Mutairi',
                'email' => 'khalid.mutairi@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'status' => 'active',
                'phone' => '+966 59 999 0000',
                'location' => 'Medina, Saudi Arabia',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Aisha Al-Ghamdi',
                'email' => 'aisha.ghamdi@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'status' => 'active',
                'phone' => '+966 50 123 7890',
                'location' => 'Taif, Saudi Arabia',
                'email_verified_at' => now(),
            ],
        ];

        $createdCustomers = [];
        foreach ($customers as $customerData) {
            $createdCustomers[] = User::create($customerData);
        }

        // Create sample products for Fatooma store
        $products = [
            [
                'name' => 'iPhone 15 Pro Max - 256GB',
                'description' => 'Latest iPhone with advanced camera system and A17 Pro chip',
                'sku' => 'FATOOMA-IPHONE-001',
                'price' => 4999.00,
                'original_price' => 5299.00,
                'stock' => 25,
                'category_id' => $createdCategories[0]->id, // Electronics
                'store_id' => $fatoomaStore->id,
                'status' => 'active',
                'images' => ['/assets/images/products/iphone15.jpg'],
                'weight' => 0.221,
                'dimensions' => '15.9 x 7.7 x 0.8 cm',
                'brand' => 'Apple',
                'tags' => ['smartphone', 'iphone', 'apple', 'premium'],
                'rating' => 4.8,
                'reviews_count' => 0,
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra - 512GB',
                'description' => 'Premium Android smartphone with S Pen and advanced AI features',
                'sku' => 'FATOOMA-SAMSUNG-001',
                'price' => 4299.00,
                'original_price' => 4599.00,
                'stock' => 18,
                'category_id' => $createdCategories[0]->id, // Electronics
                'store_id' => $fatoomaStore->id,
                'status' => 'active',
                'images' => ['/assets/images/products/galaxy-s24.jpg'],
                'weight' => 0.232,
                'dimensions' => '16.2 x 7.9 x 0.9 cm',
                'brand' => 'Samsung',
                'tags' => ['smartphone', 'android', 'samsung', 'premium'],
                'rating' => 4.6,
                'reviews_count' => 0,
            ],
            [
                'name' => 'Designer Handbag - Luxury Collection',
                'description' => 'Elegant designer handbag made from premium leather',
                'sku' => 'FATOOMA-BAG-001',
                'price' => 899.00,
                'original_price' => 1199.00,
                'stock' => 12,
                'category_id' => $createdCategories[1]->id, // Fashion
                'store_id' => $fatoomaStore->id,
                'status' => 'active',
                'images' => ['/assets/images/products/designer-bag.jpg'],
                'weight' => 0.8,
                'dimensions' => '30 x 20 x 15 cm',
                'brand' => 'LuxuryBrand',
                'tags' => ['handbag', 'designer', 'leather', 'luxury'],
                'rating' => 4.7,
                'reviews_count' => 0,
            ],
            [
                'name' => 'Smart Home Security System',
                'description' => 'Complete smart home security system with cameras and sensors',
                'sku' => 'FATOOMA-SECURITY-001',
                'price' => 1299.00,
                'original_price' => 1599.00,
                'stock' => 8,
                'category_id' => $createdCategories[2]->id, // Home & Garden
                'store_id' => $fatoomaStore->id,
                'status' => 'active',
                'images' => ['/assets/images/products/security-system.jpg'],
                'weight' => 2.5,
                'dimensions' => '25 x 20 x 10 cm',
                'brand' => 'SmartHome',
                'tags' => ['security', 'smart home', 'cameras', 'sensors'],
                'rating' => 4.5,
                'reviews_count' => 0,
            ],
            [
                'name' => 'Premium Skincare Set - Anti-Aging',
                'description' => 'Complete anti-aging skincare set with vitamin C and retinol',
                'sku' => 'FATOOMA-SKINCARE-001',
                'price' => 299.00,
                'original_price' => 399.00,
                'stock' => 35,
                'category_id' => $createdCategories[3]->id, // Beauty & Health
                'store_id' => $fatoomaStore->id,
                'status' => 'active',
                'images' => ['/assets/images/products/skincare-set.jpg'],
                'weight' => 0.5,
                'dimensions' => '20 x 15 x 8 cm',
                'brand' => 'BeautyPro',
                'tags' => ['skincare', 'anti-aging', 'vitamin c', 'retinol'],
                'rating' => 4.4,
                'reviews_count' => 0,
            ],
            [
                'name' => 'Professional Yoga Mat - Premium',
                'description' => 'High-quality yoga mat with excellent grip and cushioning',
                'sku' => 'FATOOMA-YOGA-001',
                'price' => 149.00,
                'original_price' => 199.00,
                'stock' => 22,
                'category_id' => $createdCategories[4]->id, // Sports & Fitness
                'store_id' => $fatoomaStore->id,
                'status' => 'active',
                'images' => ['/assets/images/products/yoga-mat.jpg'],
                'weight' => 1.2,
                'dimensions' => '183 x 61 x 0.6 cm',
                'brand' => 'FitLife',
                'tags' => ['yoga', 'fitness', 'mat', 'exercise'],
                'rating' => 4.6,
                'reviews_count' => 0,
            ],
        ];

        $createdProducts = [];
        foreach ($products as $productData) {
            $createdProducts[] = Product::create($productData);
        }

        // Create sample questions and ratings
        $questionsRatings = [
            // iPhone 15 Pro Max Reviews
            [
                'type' => 'rating',
                'content' => 'Amazing phone! The camera quality is outstanding and the battery life is excellent. Highly recommended!',
                'rating' => 5,
                'user_id' => $createdCustomers[0]->id,
                'product_id' => $createdProducts[0]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(2),
            ],
            [
                'type' => 'rating',
                'content' => 'Great phone but the price is quite high. The performance is smooth and the display is beautiful.',
                'rating' => 4,
                'user_id' => $createdCustomers[1]->id,
                'product_id' => $createdProducts[0]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(5),
            ],
            [
                'type' => 'question',
                'content' => 'Does this phone support wireless charging?',
                'user_id' => $createdCustomers[2]->id,
                'product_id' => $createdProducts[0]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(1),
            ],
            [
                'type' => 'rating',
                'content' => 'Perfect phone for photography enthusiasts. The ProRAW feature is incredible!',
                'rating' => 5,
                'user_id' => $createdCustomers[3]->id,
                'product_id' => $createdProducts[0]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(3),
            ],

            // Samsung Galaxy S24 Ultra Reviews
            [
                'type' => 'rating',
                'content' => 'Excellent Android phone with great features. The S Pen is very useful for note-taking.',
                'rating' => 5,
                'user_id' => $createdCustomers[1]->id,
                'product_id' => $createdProducts[1]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(4),
            ],
            [
                'type' => 'rating',
                'content' => 'Good phone but the battery could be better. The camera quality is impressive.',
                'rating' => 4,
                'user_id' => $createdCustomers[4]->id,
                'product_id' => $createdProducts[1]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(6),
            ],
            [
                'type' => 'question',
                'content' => 'What is the warranty period for this phone?',
                'user_id' => $createdCustomers[5]->id,
                'product_id' => $createdProducts[1]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(2),
            ],

            // Designer Handbag Reviews
            [
                'type' => 'rating',
                'content' => 'Beautiful handbag! The quality is excellent and it looks very elegant. Worth every penny!',
                'rating' => 5,
                'user_id' => $createdCustomers[1]->id,
                'product_id' => $createdProducts[2]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(7),
            ],
            [
                'type' => 'rating',
                'content' => 'Nice design but the price is a bit high for the size. Good quality leather though.',
                'rating' => 3,
                'user_id' => $createdCustomers[3]->id,
                'product_id' => $createdProducts[2]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(8),
            ],
            [
                'type' => 'question',
                'content' => 'Is this handbag suitable for daily use?',
                'user_id' => $createdCustomers[5]->id,
                'product_id' => $createdProducts[2]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(3),
            ],

            // Smart Home Security System Reviews
            [
                'type' => 'rating',
                'content' => 'Excellent security system! Easy to install and the app is very user-friendly. Highly recommended!',
                'rating' => 5,
                'user_id' => $createdCustomers[0]->id,
                'product_id' => $createdProducts[3]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(9),
            ],
            [
                'type' => 'rating',
                'content' => 'Good system but the installation was a bit complicated. The cameras work well though.',
                'rating' => 4,
                'user_id' => $createdCustomers[2]->id,
                'product_id' => $createdProducts[3]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(10),
            ],
            [
                'type' => 'question',
                'content' => 'Does this system work with Alexa or Google Home?',
                'user_id' => $createdCustomers[4]->id,
                'product_id' => $createdProducts[3]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(5),
            ],

            // Premium Skincare Set Reviews
            [
                'type' => 'rating',
                'content' => 'Amazing skincare set! My skin looks much better after using it for a month. The vitamin C serum is fantastic!',
                'rating' => 5,
                'user_id' => $createdCustomers[1]->id,
                'product_id' => $createdProducts[4]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(12),
            ],
            [
                'type' => 'rating',
                'content' => 'Good products but quite expensive. The results are noticeable though.',
                'rating' => 4,
                'user_id' => $createdCustomers[3]->id,
                'product_id' => $createdProducts[4]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(14),
            ],
            [
                'type' => 'question',
                'content' => 'Is this suitable for sensitive skin?',
                'user_id' => $createdCustomers[5]->id,
                'product_id' => $createdProducts[4]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(6),
            ],

            // Professional Yoga Mat Reviews
            [
                'type' => 'rating',
                'content' => 'Perfect yoga mat! Great grip and cushioning. Very comfortable for long yoga sessions.',
                'rating' => 5,
                'user_id' => $createdCustomers[2]->id,
                'product_id' => $createdProducts[5]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(15),
            ],
            [
                'type' => 'rating',
                'content' => 'Good quality mat but it could be thicker. The grip is excellent though.',
                'rating' => 4,
                'user_id' => $createdCustomers[4]->id,
                'product_id' => $createdProducts[5]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(16),
            ],
            [
                'type' => 'question',
                'content' => 'Is this mat machine washable?',
                'user_id' => $createdCustomers[0]->id,
                'product_id' => $createdProducts[5]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(7),
            ],

            // General store questions
            [
                'type' => 'question',
                'content' => 'What is your return policy?',
                'user_id' => $createdCustomers[1]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(4),
            ],
            [
                'type' => 'question',
                'content' => 'Do you offer international shipping?',
                'user_id' => $createdCustomers[3]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(6),
            ],
            [
                'type' => 'question',
                'content' => 'What payment methods do you accept?',
                'user_id' => $createdCustomers[5]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'published',
                'created_at' => now()->subDays(8),
            ],

            // Some unpublished reviews for testing
            [
                'type' => 'rating',
                'content' => 'This is a test review that should be unpublished.',
                'rating' => 2,
                'user_id' => $createdCustomers[0]->id,
                'product_id' => $createdProducts[0]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'unpublished',
                'created_at' => now()->subDays(1),
            ],
            [
                'type' => 'question',
                'content' => 'This is a test question that should be unpublished.',
                'user_id' => $createdCustomers[2]->id,
                'product_id' => $createdProducts[1]->id,
                'store_id' => $fatoomaStore->id,
                'status' => 'unpublished',
                'created_at' => now()->subDays(2),
            ],
        ];

        $createdQuestionsRatings = [];
        foreach ($questionsRatings as $qrData) {
            $createdQuestionsRatings[] = QuestionRating::create($qrData);
        }

        // Create sample replies from store owner
        $sampleReplies = [
            [
                'content' => 'Thank you for your excellent review! We\'re thrilled that you love the product. We appreciate your feedback and look forward to serving you again.',
                'question_rating_id' => $createdQuestionsRatings[0]->id, // First rating
                'user_id' => $fatoomaUser->id, // Store owner
                'status' => 'published',
                'created_at' => now()->subHours(2),
            ],
            [
                'content' => 'Great question! Yes, this product comes with a 2-year warranty. Please keep your receipt for warranty claims. If you have any issues, feel free to contact our customer service.',
                'question_rating_id' => $createdQuestionsRatings[2]->id, // First question
                'user_id' => $fatoomaUser->id, // Store owner
                'status' => 'published',
                'created_at' => now()->subHours(1),
            ],
            [
                'content' => 'We appreciate your feedback! We\'re constantly working to improve our products and services. Thank you for choosing Fatooma!',
                'question_rating_id' => $createdQuestionsRatings[1]->id, // Second rating
                'user_id' => $fatoomaUser->id, // Store owner
                'status' => 'published',
                'created_at' => now()->subMinutes(30),
            ],
            [
                'content' => 'Yes, we offer international shipping to most countries. Shipping costs and delivery times vary by location. Please check our shipping policy for more details.',
                'question_rating_id' => $createdQuestionsRatings[6]->id, // International shipping question
                'user_id' => $fatoomaUser->id, // Store owner
                'status' => 'published',
                'created_at' => now()->subMinutes(15),
            ],
        ];

        foreach ($sampleReplies as $replyData) {
            Reply::create($replyData);
        }

        // Update product review counts
        foreach ($createdProducts as $product) {
            $publishedRatings = QuestionRating::where('product_id', $product->id)
                ->where('type', 'rating')
                ->where('status', 'published')
                ->count();
            
            $averageRating = QuestionRating::where('product_id', $product->id)
                ->where('type', 'rating')
                ->where('status', 'published')
                ->avg('rating');

            $product->update([
                'reviews_count' => $publishedRatings,
                'rating' => round($averageRating, 1),
            ]);
        }

        $this->command->info('Fatooma store with reviews and comments created successfully!');
        $this->command->info('Store: ' . $fatoomaStore->name);
        $this->command->info('Owner: ' . $fatoomaOwner->name);
        $this->command->info('Products: ' . count($createdProducts));
        $this->command->info('Customers: ' . count($createdCustomers));
        $this->command->info('Reviews & Questions: ' . count($questionsRatings));
    }
}
