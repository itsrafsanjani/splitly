<?php

namespace Database\Seeders;

use App\Models\Expense;
use App\Models\Group;
use App\Models\Settlement;
use App\Models\User;
use App\Services\ExpenseSplitCalculator;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $calculator = new ExpenseSplitCalculator;

        // Create users
        $john = User::firstOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $sarah = User::firstOrCreate(
            ['email' => 'sarah@example.com'],
            [
                'name' => 'Sarah Smith',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $mike = User::firstOrCreate(
            ['email' => 'mike@example.com'],
            [
                'name' => 'Mike Johnson',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $emma = User::firstOrCreate(
            ['email' => 'emma@example.com'],
            [
                'name' => 'Emma Wilson',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $alex = User::firstOrCreate(
            ['email' => 'alex@example.com'],
            [
                'name' => 'Alex Brown',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Group 1: Roommates (4 people)
        $roommates = Group::create([
            'name' => 'Apartment 4B Roommates',
            'description' => 'Shared expenses for our apartment',
        ]);
        $roommates->users()->attach([$john->id, $sarah->id, $mike->id, $emma->id]);

        // Rent - Equal split
        $rent = Expense::create([
            'group_id' => $roommates->id,
            'paid_by' => $john->id,
            'description' => 'Monthly Rent - March',
            'amount' => 2400.00,
            'expense_date' => now()->subDays(5),
            'category' => 'Rent',
            'split_type' => 'equal',
        ]);
        $shares = $calculator->calculate(2400, 'equal', [$john->id, $sarah->id, $mike->id, $emma->id]);
        foreach ($shares as $userId => $amount) {
            $rent->shares()->create(['user_id' => $userId, 'share_amount' => $amount]);
        }

        // Groceries - Equal split
        $groceries = Expense::create([
            'group_id' => $roommates->id,
            'paid_by' => $sarah->id,
            'description' => 'Costco grocery run',
            'amount' => 156.80,
            'expense_date' => now()->subDays(3),
            'category' => 'Food',
            'split_type' => 'equal',
        ]);
        $shares = $calculator->calculate(156.80, 'equal', [$john->id, $sarah->id, $mike->id, $emma->id]);
        foreach ($shares as $userId => $amount) {
            $groceries->shares()->create(['user_id' => $userId, 'share_amount' => $amount]);
        }

        // Utilities - Percentage split (different room sizes)
        $utilities = Expense::create([
            'group_id' => $roommates->id,
            'paid_by' => $mike->id,
            'description' => 'Electric & Gas - March',
            'amount' => 180.00,
            'expense_date' => now()->subDays(2),
            'category' => 'Utilities',
            'split_type' => 'percentage',
        ]);
        $shares = $calculator->calculate(180, 'percentage', [
            $john->id => 30,
            $sarah->id => 30,
            $mike->id => 25,
            $emma->id => 15,
        ]);
        foreach ($shares as $userId => $amount) {
            $utilities->shares()->create(['user_id' => $userId, 'share_amount' => $amount]);
        }

        // Group 2: Trip to Vegas (3 people)
        $vegas = Group::create([
            'name' => 'Vegas Trip 2025',
            'description' => 'Bachelor party weekend in Las Vegas',
        ]);
        $vegas->users()->attach([$john->id, $mike->id, $alex->id]);

        // Hotel - Equal split
        $hotel = Expense::create([
            'group_id' => $vegas->id,
            'paid_by' => $alex->id,
            'description' => 'Hotel room (3 nights)',
            'amount' => 450.00,
            'expense_date' => now()->subDays(10),
            'category' => 'Entertainment',
            'split_type' => 'equal',
        ]);
        $shares = $calculator->calculate(450, 'equal', [$john->id, $mike->id, $alex->id]);
        foreach ($shares as $userId => $amount) {
            $hotel->shares()->create(['user_id' => $userId, 'share_amount' => $amount]);
        }

        // Dinner - Exact amounts
        $dinner = Expense::create([
            'group_id' => $vegas->id,
            'paid_by' => $john->id,
            'description' => 'Steakhouse dinner',
            'amount' => 287.50,
            'expense_date' => now()->subDays(9),
            'category' => 'Food',
            'split_type' => 'exact',
        ]);
        $shares = $calculator->calculate(0, 'exact', [
            $john->id => 95.50,
            $mike->id => 102.00,
            $alex->id => 90.00,
        ]);
        foreach ($shares as $userId => $amount) {
            $dinner->shares()->create(['user_id' => $userId, 'share_amount' => $amount]);
        }

        // Uber rides - Shares split (different number of rides)
        $uber = Expense::create([
            'group_id' => $vegas->id,
            'paid_by' => $mike->id,
            'description' => 'Uber rides throughout weekend',
            'amount' => 120.00,
            'expense_date' => now()->subDays(8),
            'category' => 'Transportation',
            'split_type' => 'shares',
        ]);
        $shares = $calculator->calculate(120, 'shares', [
            $john->id => 2,
            $mike->id => 3,
            $alex->id => 2,
        ]);
        foreach ($shares as $userId => $amount) {
            $uber->shares()->create(['user_id' => $userId, 'share_amount' => $amount]);
        }

        // Group 3: Lunch Club (2 people)
        $lunch = Group::create([
            'name' => 'Lunch Buddies',
            'description' => 'Regular lunch expenses',
        ]);
        $lunch->users()->attach([$sarah->id, $emma->id]);

        // Lunch 1 - Equal split
        $lunch1 = Expense::create([
            'group_id' => $lunch->id,
            'paid_by' => $sarah->id,
            'description' => 'Chipotle lunch',
            'amount' => 24.50,
            'expense_date' => now()->subDays(1),
            'category' => 'Food',
            'split_type' => 'equal',
        ]);
        $shares = $calculator->calculate(24.50, 'equal', [$sarah->id, $emma->id]);
        foreach ($shares as $userId => $amount) {
            $lunch1->shares()->create(['user_id' => $userId, 'share_amount' => $amount]);
        }

        // Lunch 2 - Exact amounts
        $lunch2 = Expense::create([
            'group_id' => $lunch->id,
            'paid_by' => $emma->id,
            'description' => 'Thai food delivery',
            'amount' => 42.00,
            'expense_date' => now(),
            'category' => 'Food',
            'split_type' => 'exact',
        ]);
        $shares = $calculator->calculate(0, 'exact', [
            $sarah->id => 18.00,
            $emma->id => 24.00,
        ]);
        foreach ($shares as $userId => $amount) {
            $lunch2->shares()->create(['user_id' => $userId, 'share_amount' => $amount]);
        }

        // Add some settlements
        Settlement::create([
            'group_id' => $roommates->id,
            'paid_by' => $sarah->id,
            'paid_to' => $john->id,
            'amount' => 600.00,
            'settled_at' => now()->subDays(1),
        ]);

        Settlement::create([
            'group_id' => $vegas->id,
            'paid_by' => $john->id,
            'paid_to' => $alex->id,
            'amount' => 150.00,
            'settled_at' => now()->subDays(7),
        ]);
    }
}
