import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, DollarSign, Edit, Filter, Trash2, User as UserIcon, Users as UsersIcon, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
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
    image: string | null;
    payer: User;
    group: {
        id: number;
        name: string;
    };
    shares: ExpenseShare[];
}

interface Group {
    id: number;
    name: string;
}

interface Filters {
    search?: string;
    category?: string;
    split_type?: string;
    group_id?: number;
    paid_by?: number;
    date_from?: string;
    date_to?: string;
    amount_min?: number;
    amount_max?: number;
}

interface Props {
    expenses: {
        data: Expense[];
        links: any[];
        meta: any;
    };
    filters: Filters;
    categories: string[];
    groups: Group[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Index({ expenses, filters, categories, groups }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState<Filters>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleDelete = (expense: Expense) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            router.delete(`/expenses/${expense.id}`);
        }
    };

    const handleFilterChange = (key: keyof Filters, value: string | number | undefined) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/expenses', localFilters, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/expenses', {}, { preserveState: true, preserveScroll: true });
    };

    const hasActiveFilters = Object.keys(filters).length > 0;

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(parseFloat(amount));
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
            <Head title="All Expenses" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">All Expenses</h1>
                        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                            View and manage all your shared expenses
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="relative"
                        >
                            <Filter className="size-4 mr-2" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                    {Object.keys(filters).length}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {showFilters && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Filter Expenses</CardTitle>
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-neutral-600 dark:text-neutral-400"
                                    >
                                        <X className="size-4 mr-1" />
                                        Clear all
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="search">Search</Label>
                                    <Input
                                        id="search"
                                        placeholder="Search description..."
                                        value={localFilters.search || ''}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={localFilters.category || ''}
                                        onValueChange={(value) => handleFilterChange('category', value)}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="All categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All categories</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="split_type">Split Type</Label>
                                    <Select
                                        value={localFilters.split_type || ''}
                                        onValueChange={(value) => handleFilterChange('split_type', value)}
                                    >
                                        <SelectTrigger id="split_type">
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All types</SelectItem>
                                            <SelectItem value="equal">Equal</SelectItem>
                                            <SelectItem value="percentage">Percentage</SelectItem>
                                            <SelectItem value="custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="group_id">Group</Label>
                                    <Select
                                        value={localFilters.group_id?.toString() || ''}
                                        onValueChange={(value) => handleFilterChange('group_id', value ? parseInt(value) : undefined)}
                                    >
                                        <SelectTrigger id="group_id">
                                            <SelectValue placeholder="All groups" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All groups</SelectItem>
                                            {groups.map((group) => (
                                                <SelectItem key={group.id} value={group.id.toString()}>
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_from">Date From</Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        value={localFilters.date_from || ''}
                                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_to">Date To</Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        value={localFilters.date_to || ''}
                                        onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount_min">Min Amount</Label>
                                    <Input
                                        id="amount_min"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={localFilters.amount_min || ''}
                                        onChange={(e) => handleFilterChange('amount_min', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount_max">Max Amount</Label>
                                    <Input
                                        id="amount_max"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={localFilters.amount_max || ''}
                                        onChange={(e) => handleFilterChange('amount_max', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowFilters(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={applyFilters}>
                                    Apply Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {expenses.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 p-12 py-20 dark:border-sidebar-border">
                        <div className="rounded-full bg-neutral-100 p-6 dark:bg-neutral-800">
                            <DollarSign className="size-12 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <h3 className="mt-6 text-lg font-semibold">
                            No expenses yet
                        </h3>
                        <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
                            Create your first expense in a group to get started
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {expenses.data.map((expense) => (
                            <Card key={expense.id} className="transition hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">
                                                {expense.description}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                <Link
                                                    href={`/groups/${expense.group.id}`}
                                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {expense.group.name}
                                                </Link>
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/expenses/${expense.id}/edit`}>
                                                    <Edit className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(expense)}
                                                className="text-red-600 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                            <DollarSign className="size-4" />
                                            <span className="font-semibold">
                                                {formatCurrency(expense.amount)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                            <Calendar className="size-4" />
                                            <span>{formatDate(expense.expense_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                            <UserIcon className="size-4" />
                                            <span>Paid by {expense.payer.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                            <UsersIcon className="size-4" />
                                            <span>
                                                {expense.shares.length}{' '}
                                                {expense.shares.length === 1
                                                    ? 'participant'
                                                    : 'participants'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">
                                            {expense.category}
                                        </Badge>
                                        <Badge variant="outline">
                                            {expense.split_type} split
                                        </Badge>
                                    </div>
                                    {expense.image && (
                                        <div className="mt-3">
                                            <img
                                                src={`/storage/${expense.image}`}
                                                alt="Receipt"
                                                className="h-20 w-auto rounded border object-cover"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
