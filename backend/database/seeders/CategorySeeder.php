<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the main store
        $store = Store::where('domain', 'tedara-store')->first();

        // Create main categories
        $furniture = Category::create([
            'name' => 'Furniture',
            'description' => 'Home and office furniture',
            'store_id' => $store->id,
            'sort_order' => 1,
        ]);

        $electronics = Category::create([
            'name' => 'Electronics',
            'description' => 'Electronic devices and gadgets',
            'store_id' => $store->id,
            'sort_order' => 2,
        ]);

        $fashion = Category::create([
            'name' => 'Fashion',
            'description' => 'Clothing and accessories',
            'store_id' => $store->id,
            'sort_order' => 3,
        ]);

        $homeGarden = Category::create([
            'name' => 'Home & Garden',
            'description' => 'Home improvement and garden supplies',
            'store_id' => $store->id,
            'sort_order' => 4,
        ]);

        $sports = Category::create([
            'name' => 'Sports',
            'description' => 'Sports equipment and accessories',
            'store_id' => $store->id,
            'sort_order' => 5,
        ]);

        $books = Category::create([
            'name' => 'Books',
            'description' => 'Books and educational materials',
            'store_id' => $store->id,
            'sort_order' => 6,
        ]);

        // Create sub-categories for Furniture
        Category::create([
            'name' => 'Living Room',
            'description' => 'Living room furniture',
            'parent_id' => $furniture->id,
            'store_id' => $store->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Bedroom',
            'description' => 'Bedroom furniture',
            'parent_id' => $furniture->id,
            'store_id' => $store->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Kitchen',
            'description' => 'Kitchen furniture and accessories',
            'parent_id' => $furniture->id,
            'store_id' => $store->id,
            'sort_order' => 3,
        ]);

        // Create sub-categories for Electronics
        Category::create([
            'name' => 'Smartphones',
            'description' => 'Mobile phones and accessories',
            'parent_id' => $electronics->id,
            'store_id' => $store->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Laptops',
            'description' => 'Laptops and computers',
            'parent_id' => $electronics->id,
            'store_id' => $store->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Audio',
            'description' => 'Audio equipment and headphones',
            'parent_id' => $electronics->id,
            'store_id' => $store->id,
            'sort_order' => 3,
        ]);

        // Create sub-categories for Fashion
        Category::create([
            'name' => 'Men\'s Clothing',
            'description' => 'Clothing for men',
            'parent_id' => $fashion->id,
            'store_id' => $store->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Women\'s Clothing',
            'description' => 'Clothing for women',
            'parent_id' => $fashion->id,
            'store_id' => $store->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Accessories',
            'description' => 'Fashion accessories',
            'parent_id' => $fashion->id,
            'store_id' => $store->id,
            'sort_order' => 3,
        ]);
    }
}
