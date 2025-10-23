<?php

use App\Models\Expense;
use App\Models\Group;
use App\Models\User;
use App\Services\BalanceCalculator;

use function Pest\Laravel\actingAs;

test('user can create a group', function () {
    $user = User::factory()->create();
    $member = User::factory()->create();

    actingAs($user)->postJson('/groups', [
        'name' => 'Test Group',
        'description' => 'A test group',
        'members' => [$member->id],
    ])->assertRedirect();

    $this->assertDatabaseHas('groups', [
        'name' => 'Test Group',
        'description' => 'A test group',
    ]);
});

test('user belongs to a group', function () {
    $user = User::factory()->create();
    $group = Group::factory()->create();
    $group->users()->attach($user);

    expect($user->fresh()->groups)->toHaveCount(1);
    expect($user->fresh()->groups->first()->id)->toBe($group->id);
});

test('balance calculator works correctly', function () {
    $calculator = new BalanceCalculator;

    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $user3 = User::factory()->create();

    $group = Group::factory()->create();
    $group->users()->attach([$user1->id, $user2->id, $user3->id]);

    $expense = Expense::factory()->create([
        'group_id' => $group->id,
        'paid_by' => $user1->id,
        'amount' => 90,
    ]);

    $expense->shares()->createMany([
        ['user_id' => $user1->id, 'share_amount' => 30],
        ['user_id' => $user2->id, 'share_amount' => 30],
        ['user_id' => $user3->id, 'share_amount' => 30],
    ]);

    $balances = $calculator->calculateGroupBalances($group);

    expect($balances)->toBeArray();
    expect($balances[$user2->id][$user1->id] ?? 0)->toBe(30.0);
    expect($balances[$user3->id][$user1->id] ?? 0)->toBe(30.0);
});
