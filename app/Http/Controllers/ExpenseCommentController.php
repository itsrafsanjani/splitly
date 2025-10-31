<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpenseComment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ExpenseCommentController extends Controller
{
    public function store(Request $request, Expense $expense): RedirectResponse
    {
        Gate::authorize('view', $expense);

        $validated = $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        $expense->comments()->create([
            'user_id' => auth()->id(),
            'comment' => $validated['comment'],
        ]);

        return back();
    }

    public function update(Request $request, ExpenseComment $comment): RedirectResponse
    {
        Gate::authorize('update', $comment);

        $validated = $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        $comment->update($validated);

        return back();
    }

    public function destroy(ExpenseComment $comment): RedirectResponse
    {
        Gate::authorize('delete', $comment);

        $comment->delete();

        return back();
    }
}
