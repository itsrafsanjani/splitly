<?php

use App\Http\Controllers\ExpenseCommentController;
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
    Route::resource('expenses', ExpenseController::class)->only(['index', 'store', 'edit', 'update', 'destroy']);
    Route::post('expenses/{expense}/comments', [ExpenseCommentController::class, 'store'])->name('expenses.comments.store');
    Route::patch('expense-comments/{comment}', [ExpenseCommentController::class, 'update'])->name('expense-comments.update');
    Route::delete('expense-comments/{comment}', [ExpenseCommentController::class, 'destroy'])->name('expense-comments.destroy');
    Route::resource('settlements', SettlementController::class)->only(['store']);
});

require __DIR__.'/settings.php';
