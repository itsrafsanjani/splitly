<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Shopping', 'Other'];

        return [
            'group_id' => Group::factory(),
            'paid_by' => User::factory(),
            'description' => fake()->sentence(3),
            'amount' => fake()->randomFloat(2, 10, 500),
            'expense_date' => fake()->dateTimeBetween('-30 days', 'now'),
            'category' => fake()->randomElement($categories),
            'split_type' => fake()->randomElement(['equal', 'exact', 'percentage', 'shares']),
            'image' => null,
        ];
    }
}
