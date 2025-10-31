<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        // Get all expenses from user's groups
        $expenses = Expense::with(['group', 'payer'])
            ->whereHas('group.users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();

        // Category breakdown
        $categoryData = $expenses->groupBy('category')
            ->map(function ($group) {
                return [
                    'category' => $group->first()->category,
                    'total' => (float) $group->sum('amount'),
                    'count' => $group->count(),
                ];
            })
            ->values()
            ->sortByDesc('total')
            ->take(10);

        // Spending over time (last 12 months)
        $monthlyData = Expense::whereHas('group.users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->where('expense_date', '>=', now()->subMonths(12))
            ->select(
                DB::raw('DATE_FORMAT(expense_date, "%Y-%m") as month'),
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'total' => (float) $item->total,
                    'count' => $item->count,
                ];
            });

        // Per-member spending (who paid what)
        $memberSpending = Expense::with('payer')
            ->whereHas('group.users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get()
            ->groupBy('paid_by')
            ->map(function ($group) {
                return [
                    'name' => $group->first()->payer->name,
                    'total' => (float) $group->sum('amount'),
                    'count' => $group->count(),
                ];
            })
            ->values()
            ->sortByDesc('total')
            ->take(10);

        // Overall stats
        $stats = [
            'total_spent' => (float) $expenses->sum('amount'),
            'total_expenses' => $expenses->count(),
            'avg_expense' => $expenses->count() > 0 ? (float) ($expenses->sum('amount') / $expenses->count()) : 0,
            'categories_count' => $expenses->pluck('category')->unique()->count(),
        ];

        return Inertia::render('Analytics/Index', [
            'categoryData' => $categoryData,
            'monthlyData' => $monthlyData,
            'memberSpending' => $memberSpending,
            'stats' => $stats,
        ]);
    }
}
