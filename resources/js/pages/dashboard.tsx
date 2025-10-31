import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    DollarSign,
    TrendingDown,
    TrendingUp,
    Users as UsersIcon,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Group {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    expenses_count: number;
    users: User[];
}

interface GroupBalance {
    group_id: number;
    group_name: string;
    net_balance: number;
}

interface ExpenseShare {
    id: number;
    user_id: number;
    share_amount: string;
    user: User;
}

interface Expense {
    id: number;
    description: string;
    amount: string;
    expense_date: string;
    category: string;
    split_type: string;
    payer: User;
    group: {
        id: number;
        name: string;
    };
    shares: ExpenseShare[];
}

interface Stats {
    total_groups: number;
    total_expenses: number;
    total_owed: number;
    total_owing: number;
    net_balance: number;
}

interface Props {
    groups: Group[];
    groupBalances: GroupBalance[];
    recentExpenses: Expense[];
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ groups, groupBalances, recentExpenses, stats }: Props) {
    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                            Overview of your expenses and balances
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">You are owed</CardTitle>
                            <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(stats.total_owed)}
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                From {stats.total_groups} group{stats.total_groups !== 1 ? 's' : ''}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">You owe</CardTitle>
                            <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatCurrency(stats.total_owing)}
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Across {stats.total_groups} group{stats.total_groups !== 1 ? 's' : ''}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                            {stats.net_balance >= 0 ? (
                                <ArrowUpRight className="size-4 text-green-600 dark:text-green-400" />
                            ) : (
                                <ArrowDownRight className="size-4 text-red-600 dark:text-red-400" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${
                                    stats.net_balance >= 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                }`}
                            >
                                {formatCurrency(Math.abs(stats.net_balance))}
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                {stats.net_balance >= 0 ? 'In your favor' : 'You owe overall'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <DollarSign className="size-4 text-neutral-600 dark:text-neutral-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_expenses}</div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Across all groups
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Group Balances */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Groups</CardTitle>
                            <CardDescription>Balances across all groups</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {groups.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <UsersIcon className="size-12 text-neutral-400 dark:text-neutral-600" />
                                    <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                        No groups yet
                                    </p>
                                    <Button asChild className="mt-4" size="sm">
                                        <Link href="/groups">Create a Group</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {groupBalances.map((balance) => (
                                        <Link
                                            key={balance.group_id}
                                            href={`/groups/${balance.group_id}`}
                                            className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">{balance.group_name}</span>
                                                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                                    {balance.net_balance === 0
                                                        ? 'Settled up'
                                                        : balance.net_balance > 0
                                                          ? 'You are owed'
                                                          : 'You owe'}
                                                </span>
                                            </div>
                                            <span
                                                className={`font-semibold ${
                                                    balance.net_balance === 0
                                                        ? 'text-neutral-600 dark:text-neutral-400'
                                                        : balance.net_balance > 0
                                                          ? 'text-green-600 dark:text-green-400'
                                                          : 'text-red-600 dark:text-red-400'
                                                }`}
                                            >
                                                {balance.net_balance === 0
                                                    ? formatCurrency(0)
                                                    : formatCurrency(Math.abs(balance.net_balance))}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest expenses across your groups</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentExpenses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Calendar className="size-12 text-neutral-400 dark:text-neutral-600" />
                                    <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                        No expenses yet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentExpenses.map((expense) => (
                                        <Link
                                            key={expense.id}
                                            href={`/groups/${expense.group.id}`}
                                            className="flex items-start justify-between rounded-lg border p-4 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium">{expense.description}</span>
                                                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                                                    <span>{expense.group.name}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(expense.expense_date)}</span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {expense.category}
                                                    </Badge>
                                                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                                        Paid by {expense.payer.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="font-semibold">
                                                {formatCurrency(expense.amount)}
                                            </span>
                                        </Link>
                                    ))}
                                    {recentExpenses.length >= 10 && (
                                        <Button asChild variant="outline" className="w-full" size="sm">
                                            <Link href="/expenses">View All Expenses</Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
