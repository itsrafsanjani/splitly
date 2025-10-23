<?php

use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SettlementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return to_route('groups.index');
    })->name('dashboard');

    Route::resource('groups', GroupController::class)->except(['create', 'edit']);
    Route::post('groups/{group}/members', [MemberController::class, 'store'])->name('groups.members.store');
    Route::resource('expenses', ExpenseController::class)->only(['store', 'destroy']);
    Route::resource('settlements', SettlementController::class)->only(['store']);
});

require __DIR__.'/settings.php';
