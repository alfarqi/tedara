<?php

namespace Database\Seeders;

use App\Models\BusinessCategory;
use Illuminate\Database\Seeder;

class BusinessCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Consumer electronics, gadgets, and technology products',
                'sort_order' => 1,
            ],
            [
                'name' => 'Fashion',
                'description' => 'Clothing, shoes, accessories, and fashion items',
                'sort_order' => 2,
            ],
            [
                'name' => 'Beauty',
                'description' => 'Cosmetics, skincare, and beauty products',
                'sort_order' => 3,
            ],
            [
                'name' => 'Home & Garden',
                'description' => 'Home decor, furniture, garden supplies, and household items',
                'sort_order' => 4,
            ],
            [
                'name' => 'Sports & Fitness',
                'description' => 'Sports equipment, fitness gear, and outdoor activities',
                'sort_order' => 5,
            ],
            [
                'name' => 'Books & Media',
                'description' => 'Books, magazines, movies, music, and digital media',
                'sort_order' => 6,
            ],
            [
                'name' => 'Automotive',
                'description' => 'Car parts, accessories, and automotive services',
                'sort_order' => 7,
            ],
            [
                'name' => 'Food & Beverages',
                'description' => 'Food products, beverages, and culinary items',
                'sort_order' => 8,
            ],
            [
                'name' => 'Health & Wellness',
                'description' => 'Health products, supplements, and wellness items',
                'sort_order' => 9,
            ],
            [
                'name' => 'Toys & Games',
                'description' => 'Toys, games, and entertainment products for all ages',
                'sort_order' => 10,
            ],
            [
                'name' => 'Services',
                'description' => 'Professional services, consulting, and digital services',
                'sort_order' => 11,
            ],
            [
                'name' => 'Other',
                'description' => 'Other business categories not listed above',
                'sort_order' => 12,
            ],
        ];

        foreach ($categories as $category) {
            BusinessCategory::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($category['name'])],
                $category
            );
        }

        $this->command->info('Business categories seeded successfully.');
    }
}













