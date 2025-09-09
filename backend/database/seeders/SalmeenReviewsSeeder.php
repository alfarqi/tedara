<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Store;
use App\Models\Product;
use App\Models\Customer;
use App\Models\QuestionRating;
use App\Models\Reply;
use Carbon\Carbon;

class SalmeenReviewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Creating reviews for Salmeen Electronics Store...');
        
        // Find Salmeen Ahmed user
        $salmeen = User::where('name', 'LIKE', '%Salmeen%')->orWhere('email', 'LIKE', '%salmeen%')->first();
        
        if (!$salmeen) {
            $this->command->error('❌ Salmeen Ahmed user not found!');
            return;
        }
        
        $this->command->info("👤 Found user: {$salmeen->name} (ID: {$salmeen->id})");
        
        // Find Salmeen's store
        $store = Store::where('owner_id', $salmeen->id)->first();
        
        if (!$store) {
            $this->command->error('❌ Salmeen Electronics Store not found!');
            return;
        }
        
        $this->command->info("🏪 Found store: {$store->name} (ID: {$store->id})");
        
        // Get products from Salmeen's store
        $products = Product::where('store_id', $store->id)->get();
        
        if ($products->isEmpty()) {
            $this->command->error('❌ No products found for Salmeen Electronics Store!');
            return;
        }
        
        $this->command->info("📦 Found {$products->count()} products");
        
        // Get or create customers and users for reviews
        $customers = Customer::where('store_id', $store->id)->get();
        $reviewUsers = collect();
        
        if ($customers->isEmpty()) {
            $this->command->info('👥 Creating sample customers and users for reviews...');
            $customers = collect();
            
            $customerData = [
                ['name' => 'Ahmed Al-Rashid', 'email' => 'ahmed.rashid@email.com', 'phone' => '+966501234567'],
                ['name' => 'Fatima Al-Zahra', 'email' => 'fatima.zahra@email.com', 'phone' => '+966502345678'],
                ['name' => 'Mohammed Al-Sheikh', 'email' => 'mohammed.sheikh@email.com', 'phone' => '+966503456789'],
                ['name' => 'Noura Al-Mansouri', 'email' => 'noura.mansouri@email.com', 'phone' => '+966504567890'],
                ['name' => 'Khalid Al-Otaibi', 'email' => 'khalid.otaibi@email.com', 'phone' => '+966505678901'],
                ['name' => 'Layla Al-Harbi', 'email' => 'layla.harbi@email.com', 'phone' => '+966506789012'],
                ['name' => 'Omar Al-Ghamdi', 'email' => 'omar.ghamdi@email.com', 'phone' => '+966507890123'],
                ['name' => 'Aisha Al-Sulaimani', 'email' => 'aisha.sulaimani@email.com', 'phone' => '+966508901234'],
                ['name' => 'Yousef Al-Mutairi', 'email' => 'yousef.mutairi@email.com', 'phone' => '+966509012345'],
                ['name' => 'Hala Al-Qahtani', 'email' => 'hala.qahtani@email.com', 'phone' => '+966510123456'],
                ['name' => 'Saeed Al-Dosari', 'email' => 'saeed.dosari@email.com', 'phone' => '+966511234567'],
            ];
            
            foreach ($customerData as $customerInfo) {
                // Create user first
                $user = User::create([
                    'name' => $customerInfo['name'],
                    'email' => $customerInfo['email'],
                    'password' => bcrypt('password'),
                    'role' => 'customer',
                    'status' => 'active',
                    'phone' => $customerInfo['phone'],
                ]);
                
                // Create customer
                $customer = Customer::create([
                    'name' => $customerInfo['name'],
                    'email' => $customerInfo['email'],
                    'phone' => $customerInfo['phone'],
                    'store_id' => $store->id,
                    'status' => 'active',
                    'join_date' => now()->subDays(rand(1, 30)),
                ]);
                
                $customers->push($customer);
                $reviewUsers->push($user);
            }
        } else {
            // Create users for existing customers
            $this->command->info('👥 Creating users for existing customers...');
            foreach ($customers as $customer) {
                $existingUser = User::where('email', $customer->email)->first();
                if (!$existingUser) {
                    $user = User::create([
                        'name' => $customer->name,
                        'email' => $customer->email,
                        'password' => bcrypt('password'),
                        'role' => 'customer',
                        'status' => 'active',
                        'phone' => $customer->phone,
                    ]);
                    $reviewUsers->push($user);
                } else {
                    $reviewUsers->push($existingUser);
                }
            }
        }
        
        $this->command->info("👥 Using {$customers->count()} customers");
        
        // Clear existing reviews for this store
        $this->command->info('🧹 Clearing existing reviews...');
        QuestionRating::where('store_id', $store->id)->delete();
        
        // Create 11 diverse reviews
        $reviews = [
            // iPhone 15 Pro Review - 5 stars
            [
                'type' => 'rating',
                'content' => 'Absolutely amazing phone! The camera quality is outstanding and the battery life lasts all day. The titanium build feels premium and the A17 Pro chip is incredibly fast. Salmeen Electronics provided excellent service and fast delivery. Highly recommended!',
                'rating' => 5,
                'user_id' => $reviewUsers[0]->id,
                'product_id' => $products->where('name', 'LIKE', '%iPhone%')->first()?->id ?? $products[0]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(1),
            ],
            
            // Samsung Galaxy S24 Review - 4 stars
            [
                'type' => 'rating',
                'content' => 'Great Android phone with excellent display and camera features. The AI capabilities are impressive and the S Pen functionality is very useful. Battery life is good but could be better. Overall satisfied with the purchase from Salmeen Electronics.',
                'rating' => 4,
                'user_id' => $reviewUsers[1]->id,
                'product_id' => $products->where('name', 'LIKE', '%Samsung%')->first()?->id ?? $products[1]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(3),
            ],
            
            // MacBook Pro Review - 5 stars
            [
                'type' => 'rating',
                'content' => 'Perfect laptop for professional work! The M3 chip is incredibly powerful and the battery life is exceptional. The display quality is stunning and the build quality is top-notch. Salmeen Electronics had the best price and provided excellent customer support.',
                'rating' => 5,
                'user_id' => $reviewUsers[2]->id,
                'product_id' => $products->where('name', 'LIKE', '%MacBook%')->first()?->id ?? $products[2]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(5),
            ],
            
            // Dell XPS 13 Review - 4 stars
            [
                'type' => 'rating',
                'content' => 'Solid Windows laptop with great performance. The design is sleek and the keyboard is comfortable to type on. The only downside is the battery life could be better for the price. Good service from Salmeen Electronics.',
                'rating' => 4,
                'user_id' => $reviewUsers[3]->id,
                'product_id' => $products->where('name', 'LIKE', '%Dell%')->first()?->id ?? $products[3]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(7),
            ],
            
            // Sony Headphones Review - 5 stars
            [
                'type' => 'rating',
                'content' => 'Best noise-canceling headphones I\'ve ever owned! The sound quality is incredible and the noise cancellation works perfectly. Very comfortable for long listening sessions. Fast delivery and great packaging from Salmeen Electronics.',
                'rating' => 5,
                'user_id' => $reviewUsers[4]->id,
                'product_id' => $products->where('name', 'LIKE', '%Sony%')->first()?->id ?? $products[4]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(9),
            ],
            
            // iPad Air Review - 4 stars
            [
                'type' => 'rating',
                'content' => 'Excellent tablet for work and entertainment. The display is crisp and the performance is smooth. The Apple Pencil support is very useful for note-taking. Good value for money and reliable service from Salmeen Electronics.',
                'rating' => 4,
                'user_id' => $reviewUsers[5]->id,
                'product_id' => $products->where('name', 'LIKE', '%iPad%')->first()?->id ?? $products[5]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(11),
            ],
            
            // Samsung TV Review - 5 stars
            [
                'type' => 'rating',
                'content' => 'Outstanding 4K TV with amazing picture quality! The colors are vibrant and the smart features work flawlessly. Perfect for gaming and watching movies. Installation service from Salmeen Electronics was professional and efficient.',
                'rating' => 5,
                'user_id' => $reviewUsers[6]->id,
                'product_id' => $products->where('name', 'LIKE', '%TV%')->first()?->id ?? $products[6]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(13),
            ],
            
            // PlayStation 5 Review - 4 stars
            [
                'type' => 'rating',
                'content' => 'Great gaming console with impressive graphics and fast loading times. The DualSense controller is innovative with haptic feedback. Some games are expensive but the overall gaming experience is excellent. Good service from Salmeen Electronics.',
                'rating' => 4,
                'user_id' => $reviewUsers[7]->id,
                'product_id' => $products->where('name', 'LIKE', '%PlayStation%')->first()?->id ?? $products[7]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(15),
            ],
            
            // Mixed Review - 3 stars
            [
                'type' => 'rating',
                'content' => 'Product is decent but had some issues with delivery. The item arrived with minor scratches on the packaging. However, the product itself works fine and Salmeen Electronics customer service was helpful in resolving the issue.',
                'rating' => 3,
                'user_id' => $reviewUsers[8]->id,
                'product_id' => $products[0]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(17),
            ],
            
            // Excellent Service Review - 5 stars
            [
                'type' => 'rating',
                'content' => 'Outstanding customer service! Had an issue with my order and Salmeen Electronics went above and beyond to resolve it quickly. The staff is knowledgeable and friendly. Will definitely shop here again for all my electronics needs.',
                'rating' => 5,
                'user_id' => $reviewUsers[9]->id,
                'product_id' => $products[1]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(19),
            ],
            
            // Value for Money Review - 4 stars
            [
                'type' => 'rating',
                'content' => 'Good value for money compared to other electronics stores. The product quality is solid and the prices are competitive. Delivery was on time and packaging was secure. Would recommend Salmeen Electronics to friends and family.',
                'rating' => 4,
                'user_id' => $reviewUsers[9]->id,
                'product_id' => $products[2]->id,
                'store_id' => $store->id,
                'status' => 'published',
                'created_at' => now()->subDays(21),
            ],
        ];
        
        // Create the reviews
        $createdReviews = [];
        foreach ($reviews as $reviewData) {
            $createdReviews[] = QuestionRating::create($reviewData);
        }
        
        $this->command->info("✅ Created " . count($createdReviews) . " reviews");
        
        // Create some replies from Salmeen (store owner)
        $replies = [
            [
                'content' => 'Thank you so much for your excellent review! We\'re thrilled that you love your iPhone 15 Pro. We appreciate your business and look forward to serving you again soon!',
                'question_rating_id' => $createdReviews[0]->id,
                'user_id' => $salmeen->id,
                'status' => 'published',
                'created_at' => now()->subHours(12),
            ],
            [
                'content' => 'We\'re glad you\'re satisfied with your Samsung Galaxy S24! Thank you for choosing Salmeen Electronics. If you need any accessories or have questions about your device, feel free to contact us.',
                'question_rating_id' => $createdReviews[1]->id,
                'user_id' => $salmeen->id,
                'status' => 'published',
                'created_at' => now()->subHours(8),
            ],
            [
                'content' => 'Thank you for your kind words about our service! We\'re committed to providing the best customer experience. We\'re delighted that you\'re happy with your MacBook Pro.',
                'question_rating_id' => $createdReviews[2]->id,
                'user_id' => $salmeen->id,
                'status' => 'published',
                'created_at' => now()->subHours(6),
            ],
            [
                'content' => 'We appreciate your feedback about the delivery issue. We\'ve taken steps to improve our packaging process. Thank you for your patience and for choosing Salmeen Electronics!',
                'question_rating_id' => $createdReviews[8]->id,
                'user_id' => $salmeen->id,
                'status' => 'published',
                'created_at' => now()->subHours(4),
            ],
            [
                'content' => 'Thank you for your wonderful review! We\'re proud of our customer service team and we\'re glad they could help resolve your issue quickly. Your satisfaction is our priority!',
                'question_rating_id' => $createdReviews[9]->id,
                'user_id' => $salmeen->id,
                'status' => 'published',
                'created_at' => now()->subHours(2),
            ],
        ];
        
        // Create the replies
        foreach ($replies as $replyData) {
            Reply::create($replyData);
        }
        
        $this->command->info("✅ Created " . count($replies) . " replies from store owner");
        
        // Update product ratings and review counts
        $this->command->info('📊 Updating product ratings...');
        foreach ($products as $product) {
            $productReviews = QuestionRating::where('product_id', $product->id)
                ->where('type', 'rating')
                ->where('status', 'published')
                ->get();
            
            if ($productReviews->count() > 0) {
                $averageRating = $productReviews->avg('rating');
                $product->update([
                    'rating' => round($averageRating, 2),
                    'reviews_count' => $productReviews->count(),
                ]);
            }
        }
        
        $this->command->info('🎉 Salmeen Electronics Store reviews created successfully!');
        $this->command->info("📈 Total reviews created: " . count($createdReviews));
        $this->command->info("💬 Total replies created: " . count($replies));
    }
}
