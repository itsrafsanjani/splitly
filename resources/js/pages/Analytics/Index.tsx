import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BarChart3, DollarSign, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface CategoryData {
    category: string;
    total: number;
    count: number;
}

interface MonthlyData {
    month: string;
    total: number;
    count: number;
}

interface MemberSpending {
    name: string;
    total: number;
    count: number;
}

interface Stats {
    total_spent: number;
    total_expenses: number;
    avg_expense: number;
    categories_count: number;
}

interface Props {
    categoryData: CategoryData[];
    monthlyData: MonthlyData[];
    memberSpending: MemberSpending[];
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Analytics',
        href: '/analytics',
    },
];

const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f97316',
    '#06b6d4',
    '#84cc16',
];

export default function Index({ categoryData, monthlyData, memberSpending, stats }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Spending Analytics</h1>
                        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                            Visual insights into your expense patterns
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <DollarSign className="size-4 text-neutral-600 dark:text-neutral-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_spent)}</div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Across all groups
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <BarChart3 className="size-4 text-neutral-600 dark:text-neutral-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_expenses}</div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Tracked transactions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
                            <TrendingUp className="size-4 text-neutral-600 dark:text-neutral-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.avg_expense)}</div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">Per transaction</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <PieChartIcon className="size-4 text-neutral-600 dark:text-neutral-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.categories_count}</div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Unique categories
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Monthly Spending Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Spending Over Time</CardTitle>
                            <CardDescription>Last 12 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {monthlyData.length === 0 ? (
                                <div className="flex h-[300px] items-center justify-center text-sm text-neutral-600 dark:text-neutral-400">
                                    No data available
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthlyData}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                                        <XAxis
                                            dataKey="month"
                                            tickFormatter={formatMonth}
                                            className="text-xs text-neutral-600 dark:text-neutral-400"
                                        />
                                        <YAxis className="text-xs text-neutral-600 dark:text-neutral-400" />
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                            labelFormatter={formatMonth}
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#3b82f6"
                                            fill="url(#colorTotal)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Category Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Breakdown</CardTitle>
                            <CardDescription>Spending by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {categoryData.length === 0 ? (
                                <div className="flex h-[300px] items-center justify-center text-sm text-neutral-600 dark:text-neutral-400">
                                    No data available
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            dataKey="total"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={(entry) => `${entry.category}: ${formatCurrency(entry.total)}`}
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Member Spending */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Member Spending</CardTitle>
                            <CardDescription>Who paid what</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {memberSpending.length === 0 ? (
                                <div className="flex h-[300px] items-center justify-center text-sm text-neutral-600 dark:text-neutral-400">
                                    No data available
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={memberSpending}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                                        <XAxis
                                            dataKey="name"
                                            className="text-xs text-neutral-600 dark:text-neutral-400"
                                        />
                                        <YAxis className="text-xs text-neutral-600 dark:text-neutral-400" />
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="total" fill="#3b82f6" name="Total Paid" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
