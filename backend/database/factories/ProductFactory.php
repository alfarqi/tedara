<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $store = Store::inRandomOrder()->first();
        $category = Category::where('store_id', $store->id)->inRandomOrder()->first();

        $price = $this->faker->randomFloat(2, 10, 1000);
        $originalPrice = $price + $this->faker->randomFloat(2, 10, 200);

        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'sku' => strtoupper($this->faker->bothify('??-####')),
            'price' => $price,
            'original_price' => $originalPrice,
            'stock' => $this->faker->numberBetween(0, 100),
            'category_id' => $category->id,
            'store_id' => $store->id,
            'status' => $this->faker->randomElement(['active', 'inactive', 'draft']),
            'images' => ['/assets/images/products/' . $this->faker->numberBetween(1, 10) . '.png'],
            'weight' => $this->faker->randomFloat(2, 0.1, 50),
            'dimensions' => $this->faker->randomElement(['S', 'M', 'L', 'XL']) . ' Size',
            'brand' => $this->faker->company(),
            'tags' => $this->faker->words(3),
            'rating' => $this->faker->randomFloat(1, 1, 5),
            'reviews_count' => $this->faker->numberBetween(0, 100),
        ];
    }
}
