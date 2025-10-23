<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Expense;
use App\Services\ExpenseSplitCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function __construct(protected ExpenseSplitCalculator $splitCalculator) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Expense::class);

        $expenses = Expense::with(['group', 'payer', 'shares.user'])
            ->whereHas('group.users', function ($query) {
                $query->where('user_id', auth()->user()->id);
            })
            ->latest('expense_date')
            ->paginate(20);

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
        ]);
    }

    public function edit(Expense $expense): Response
    {
        Gate::authorize('update', $expense);

        $expense->load(['group.users', 'shares.user']);

        return Inertia::render('Expenses/Edit', [
            'expense' => $expense,
        ]);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): RedirectResponse
    {
        Gate::authorize('update', $expense);

        $data = $request->validated();

        return DB::transaction(function () use ($data, $request, $expense) {
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($expense->image) {
                    Storage::disk('public')->delete($expense->image);
                }
                $data['image'] = $request->file('image')->store('receipts', 'public');
            }

            $expense->update([
                'description' => $data['description'],
                'amount' => $data['amount'],
                'expense_date' => $data['expense_date'],
                'category' => $data['category'],
                'split_type' => $data['split_type'],
                'image' => $data['image'] ?? $expense->image,
            ]);

            // Update shares
            $expense->shares()->delete();

            if ($data['split_type'] === 'equal') {
                $shares = $data['participants'];
            } else {
                $shares = $this->splitCalculator->calculate(
                    $data['amount'],
                    $data['split_type'],
                    $data['participants']
                );
            }

            foreach ($shares as $userId => $shareAmount) {
                $expense->shares()->create([
                    'user_id' => (int) $userId,
                    'share_amount' => $shareAmount,
                ]);
            }

            return redirect()->route('expenses.index');
        });
    }

    public function store(StoreExpenseRequest $request): RedirectResponse
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data, $request) {
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('receipts', 'public');
            }

            $expense = Expense::create([
                'group_id' => $data['group_id'],
                'paid_by' => auth()->user()->id,
                'description' => $data['description'],
                'amount' => $data['amount'],
                'expense_date' => $data['expense_date'],
                'category' => $data['category'],
                'split_type' => $data['split_type'],
                'image' => $data['image'] ?? null,
            ]);

            // For equal split, shares are already calculated in frontend
            // For other types, we need to calculate them
            if ($data['split_type'] === 'equal') {
                $shares = $data['participants'];
            } else {
                $shares = $this->splitCalculator->calculate(
                    $data['amount'],
                    $data['split_type'],
                    $data['participants']
                );
            }

            foreach ($shares as $userId => $shareAmount) {
                $expense->shares()->create([
                    'user_id' => (int) $userId,
                    'share_amount' => $shareAmount,
                ]);
            }

            return redirect()->route('groups.show', $data['group_id']);
        });
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        Gate::authorize('delete', $expense);

        $groupId = $expense->group_id;

        if ($expense->image) {
            Storage::disk('public')->delete($expense->image);
        }

        $expense->delete();

        return redirect()->route('groups.show', $groupId);
    }
}
