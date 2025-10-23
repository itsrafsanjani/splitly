import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { type FormEvent } from 'react';

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
        users: User[];
    };
    shares: ExpenseShare[];
}

interface Props {
    expense: Expense;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'All Expenses',
        href: '/expenses',
    },
];

const categories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Shopping', 'Other'];
const splitTypes = [
    { value: 'equal', label: 'Split equally' },
    { value: 'exact', label: 'Exact amounts' },
    { value: 'percentage', label: 'By percentage' },
    { value: 'shares', label: 'By shares' },
];

export default function Edit({ expense }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        description: expense.description,
        amount: expense.amount,
        expense_date: expense.expense_date,
        category: expense.category,
        split_type: expense.split_type,
        participants: expense.shares.reduce((acc, share) => {
            acc[share.user_id] = parseFloat(share.share_amount);
            return acc;
        }, {} as Record<number, number>),
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(`/expenses/${expense.id}`, {
            preserveScroll: true,
            transform: (data) => {
                // Prepare participants based on split type
                let participants: Record<string, number> = {};

                if (data.split_type === 'equal') {
                    // For equal split, calculate the share amount and send as object
                    const amount = parseFloat(data.amount);
                    const shareAmount = amount / expense.group.users.length;
                    expense.group.users.forEach(u => {
                        participants[u.id.toString()] = shareAmount;
                    });
                } else {
                    // Filter out participants with 0 values
                    Object.entries(data.participants).forEach(([userId, value]) => {
                        if (value > 0) {
                            participants[userId] = value;
                        }
                    });
                }

                return {
                    ...data,
                    participants,
                };
            },
        });
    };

    const handleSplitTypeChange = (value: string) => {
        setData('split_type', value);
        // Reset participants when changing split type
        const initialParticipants = expense.group.users.reduce((acc, user) => ({ ...acc, [user.id]: 0 }), {} as Record<number, number>);
        setData('participants', initialParticipants);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Expense - ${expense.description}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/expenses">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Expense</h1>
                        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                            Update expense details and split information
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="What was this for?"
                                required
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount ($)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                                {errors.amount && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="expense_date">Date</Label>
                                <Input
                                    id="expense_date"
                                    type="date"
                                    value={data.expense_date}
                                    onChange={(e) => setData('expense_date', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="split_type">Split type</Label>
                            <Select value={data.split_type} onValueChange={handleSplitTypeChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {splitTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {data.split_type !== 'equal' && (
                            <div className="grid gap-3 rounded-lg border border-sidebar-border/50 p-4 dark:border-sidebar-border/30">
                                <Label className="text-sm font-medium">
                                    {data.split_type === 'exact' && 'Enter exact amounts for each person'}
                                    {data.split_type === 'percentage' && 'Enter percentages for each person'}
                                    {data.split_type === 'shares' && 'Enter number of shares for each person'}
                                </Label>
                                {expense.group.users.map((user) => (
                                    <div key={user.id} className="flex items-center gap-2">
                                        <Label className="w-32 text-sm">{user.name}</Label>
                                        <Input
                                            type="number"
                                            step={data.split_type === 'exact' ? '0.01' : '1'}
                                            min="0"
                                            value={data.participants[user.id] || ''}
                                            onChange={(e) =>
                                                setData('participants', {
                                                    ...data.participants,
                                                    [user.id]: parseFloat(e.target.value) || 0,
                                                })
                                            }
                                            placeholder="0"
                                            className="flex-1"
                                            required={data.split_type !== 'equal'}
                                        />
                                        {data.split_type === 'percentage' && <span className="text-sm">%</span>}
                                    </div>
                                ))}
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    {data.split_type === 'percentage' && 'Total should add up to 100%'}
                                    {data.split_type === 'exact' && `Total should add up to $${data.amount || '0.00'}`}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 size-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/expenses">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
