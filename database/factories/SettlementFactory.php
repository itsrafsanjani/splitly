<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Settlement>
 */
class SettlementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group_id' => Group::factory(),
            'paid_by' => User::factory(),
            'paid_to' => User::factory(),
            'amount' => fake()->randomFloat(2, 10, 300),
            'settled_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
