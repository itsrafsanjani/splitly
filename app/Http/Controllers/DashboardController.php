<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Services\BalanceCalculator;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(protected BalanceCalculator $balanceCalculator) {}

    public function index(): Response
    {
        $user = auth()->user();
        $groups = $user->groups()->with('users')->withCount('expenses')->get();

        // Calculate overall balances across all groups
        $totalOwed = 0;
        $totalOwing = 0;
        $groupBalances = [];

        foreach ($groups as $group) {
            $balances = $this->balanceCalculator->calculateGroupBalances($group);
            $netBalance = $this->calculateUserNetBalance($user->id, $group);

            $groupBalances[] = [
                'group_id' => $group->id,
                'group_name' => $group->name,
                'net_balance' => $netBalance,
            ];

            if ($netBalance > 0) {
                $totalOwed += $netBalance;
            } elseif ($netBalance < 0) {
                $totalOwing += abs($netBalance);
            }
        }

        // Get recent expenses across all user's groups
        $recentExpenses = Expense::with(['group', 'payer', 'shares.user'])
            ->whereHas('group.users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest('expense_date')
            ->limit(10)
            ->get();

        // Quick stats
        $stats = [
            'total_groups' => $groups->count(),
            'total_expenses' => Expense::whereHas('group.users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->count(),
            'total_owed' => round($totalOwed, 2),
            'total_owing' => round($totalOwing, 2),
            'net_balance' => round($totalOwed - $totalOwing, 2),
        ];

        return Inertia::render('Dashboard', [
            'groups' => $groups,
            'groupBalances' => $groupBalances,
            'recentExpenses' => $recentExpenses,
            'stats' => $stats,
        ]);
    }

    protected function calculateUserNetBalance(int $userId, $group): float
    {
        $balance = 0;

        foreach ($group->expenses()->with('shares')->get() as $expense) {
            if ($expense->paid_by === $userId) {
                $balance += $expense->amount;
            }

            foreach ($expense->shares as $share) {
                if ($share->user_id === $userId) {
                    $balance -= $share->share_amount;
                }
            }
        }

        foreach ($group->settlements as $settlement) {
            if ($settlement->paid_by === $userId) {
                $balance -= $settlement->amount;
            }
            if ($settlement->paid_to === $userId) {
                $balance += $settlement->amount;
            }
        }

        return round($balance, 2);
    }
}
