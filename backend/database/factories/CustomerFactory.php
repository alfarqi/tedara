<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $store = Store::inRandomOrder()->first();
        $totalOrders = $this->faker->numberBetween(0, 20);
        $totalSpent = $totalOrders > 0 ? $this->faker->randomFloat(2, 50, 5000) : 0;

        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => '+966 ' . $this->faker->numberBetween(50, 59) . ' ' . $this->faker->numberBetween(1000000, 9999999),
            'store_id' => $store->id,
            'status' => $this->faker->randomElement(['active', 'inactive', 'vip']),
            'total_orders' => $totalOrders,
            'total_spent' => $totalSpent,
            'join_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
