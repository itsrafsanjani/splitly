<?php

use App\Models\Group;
use App\Models\User;

use function Pest\Laravel\actingAs;

test('authenticated user can add existing member to their group', function () {
    $user = User::factory()->create();
    $newMember = User::factory()->create(['email' => 'newmember@example.com', 'name' => 'New Member']);

    $group = Group::factory()->create();
    $group->users()->attach($user->id);

    actingAs($user)->postJson("/groups/{$group->id}/members", [
        'name' => 'New Member',
        'email' => 'newmember@example.com',
    ])->assertRedirect();

    expect($group->fresh()->users)->toHaveCount(2);
    expect($group->fresh()->users->pluck('id')->toArray())->toContain($newMember->id);
});

test('authenticated user can add new user by creating account automatically', function () {
    $user = User::factory()->create();

    $group = Group::factory()->create();
    $group->users()->attach($user->id);

    expect(User::where('email', 'newuser@example.com')->exists())->toBeFalse();

    actingAs($user)->postJson("/groups/{$group->id}/members", [
        'name' => 'New User',
        'email' => 'newuser@example.com',
    ])->assertRedirect();

    expect(User::where('email', 'newuser@example.com')->exists())->toBeTrue();

    $newUser = User::where('email', 'newuser@example.com')->first();
    expect($newUser->name)->toBe('New User');
    expect($newUser->password)->toBeNull();

    expect($group->fresh()->users)->toHaveCount(2);
    expect($group->fresh()->users->pluck('id')->toArray())->toContain($newUser->id);
});

test('cannot add member to group user does not belong to', function () {
    $user = User::factory()->create();

    $group = Group::factory()->create();

    actingAs($user)->postJson("/groups/{$group->id}/members", [
        'name' => 'New Member',
        'email' => 'newmember@example.com',
    ])->assertForbidden();

    expect($group->fresh()->users)->toHaveCount(0);
});

test('cannot add member with invalid email', function () {
    $user = User::factory()->create();

    $group = Group::factory()->create();
    $group->users()->attach($user->id);

    actingAs($user)->postJson("/groups/{$group->id}/members", [
        'name' => 'Test User',
        'email' => 'invalid-email',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

test('cannot add duplicate member to group', function () {
    $user = User::factory()->create();
    $existingMember = User::factory()->create(['email' => 'existing@example.com', 'name' => 'Existing Member']);

    $group = Group::factory()->create();
    $group->users()->attach([$user->id, $existingMember->id]);

    actingAs($user)->postJson("/groups/{$group->id}/members", [
        'name' => 'Existing Member',
        'email' => 'existing@example.com',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);

    expect($group->fresh()->users)->toHaveCount(2);
});

test('name field is required when adding member', function () {
    $user = User::factory()->create();

    $group = Group::factory()->create();
    $group->users()->attach($user->id);

    actingAs($user)->postJson("/groups/{$group->id}/members", [
        'name' => '',
        'email' => 'test@example.com',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

test('email field is required when adding member', function () {
    $user = User::factory()->create();

    $group = Group::factory()->create();
    $group->users()->attach($user->id);

    actingAs($user)->postJson("/groups/{$group->id}/members", [
        'name' => 'Test User',
        'email' => '',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

test('guest cannot add member to group', function () {
    $group = Group::factory()->create();

    $this->postJson("/groups/{$group->id}/members", [
        'name' => 'New Member',
        'email' => 'newmember@example.com',
    ])->assertUnauthorized();
});
