<?php

use App\Models\Expense;
use App\Models\ExpenseShare;
use App\Models\Group;
use App\Models\User;

it('can view all expenses page', function () {
    $user = User::factory()->create();
    $group = Group::factory()->create();
    $group->users()->attach($user);

    $expense = Expense::factory()->create([
        'group_id' => $group->id,
        'paid_by' => $user->id,
    ]);

    ExpenseShare::factory()->create([
        'expense_id' => $expense->id,
        'user_id' => $user->id,
        'share_amount' => $expense->amount,
    ]);

    $this->actingAs($user)
        ->get('/expenses')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Expenses/Index')
            ->has('expenses.data', 1)
        );
});

it('can view edit expense page', function () {
    $user = User::factory()->create();
    $group = Group::factory()->create();
    $group->users()->attach($user);

    $expense = Expense::factory()->create([
        'group_id' => $group->id,
        'paid_by' => $user->id,
    ]);

    ExpenseShare::factory()->create([
        'expense_id' => $expense->id,
        'user_id' => $user->id,
        'share_amount' => $expense->amount,
    ]);

    $this->actingAs($user)
        ->get("/expenses/{$expense->id}/edit")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Expenses/Edit')
            ->has('expense')
        );
});

it('can update an expense', function () {
    $user = User::factory()->create();
    $group = Group::factory()->create();
    $group->users()->attach($user);

    $expense = Expense::factory()->create([
        'group_id' => $group->id,
        'paid_by' => $user->id,
        'description' => 'Old description',
        'amount' => '100.00',
    ]);

    ExpenseShare::factory()->create([
        'expense_id' => $expense->id,
        'user_id' => $user->id,
        'share_amount' => '100.00',
    ]);

    $this->actingAs($user)
        ->put("/expenses/{$expense->id}", [
            'description' => 'Updated description',
            'amount' => '150.00',
            'expense_date' => '2024-01-01',
            'category' => 'Food',
            'split_type' => 'equal',
            'participants' => [$user->id => 150.00],
        ])
        ->assertRedirect('/expenses');

    $expense->refresh();
    expect($expense->description)->toBe('Updated description');
    expect($expense->amount)->toBe('150.00');
});

it('prevents non-payers from editing expenses', function () {
    $payer = User::factory()->create();
    $otherUser = User::factory()->create();
    $group = Group::factory()->create();
    $group->users()->attach([$payer->id, $otherUser->id]);

    $expense = Expense::factory()->create([
        'group_id' => $group->id,
        'paid_by' => $payer->id,
    ]);

    $this->actingAs($otherUser)
        ->get("/expenses/{$expense->id}/edit")
        ->assertForbidden();
});
