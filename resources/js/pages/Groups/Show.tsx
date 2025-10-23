import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { AddMemberDialog } from '@/components/add-member-dialog';
import { RecordSettlementDialog } from '@/components/record-settlement-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Calendar, DollarSign, User as UserIcon, Users as UsersIcon } from 'lucide-react';

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
    payer: User;
    shares: ExpenseShare[];
}

interface Group {
    id: number;
    name: string;
    description: string | null;
    users: User[];
    expenses: Expense[];
}

interface Balances {
    [debtorId: number]: {
        [creditorId: number]: number;
    };
}

interface Props {
    group: Group;
    balances: Balances;
}

const splitTypeLabels: Record<string, string> = {
    equal: 'Split equally',
    exact: 'Exact amounts',
    percentage: 'By percentage',
    shares: 'By shares',
};

export default function Show({ group, balances }: Props) {
    const { auth } = usePage<SharedData>().props;
    const currentUserId = auth.user.id;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: group.name,
            href: `/groups/${group.id}`,
        },
    ];

    const getUserById = (id: number) => group.users.find((u) => u.id === id);

    // Get balances where current user owes money
    const userOwes = balances[currentUserId] || {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={group.name} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{group.name}</h1>
                        {group.description && (
                            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                                {group.description}
                            </p>
                        )}
                    </div>
                    <AddExpenseDialog groupId={group.id} users={group.users} />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Expenses</CardTitle>
                                <CardDescription>Recent transactions in this group</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {group.expenses.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <DollarSign className="size-12 text-neutral-400" />
                                        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                            No expenses yet. Add your first expense to get started!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {group.expenses.map((expense) => (
                                            <div
                                                key={expense.id}
                                                className="group rounded-lg border border-sidebar-border/50 p-4 transition hover:border-sidebar-border dark:border-sidebar-border/30 dark:hover:border-sidebar-border/50"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-medium">{expense.description}</h3>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {expense.category}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                                                            <span className="flex items-center gap-1">
                                                                <UserIcon className="size-3" />
                                                                Paid by {expense.payer.name}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="size-3" />
                                                                {new Date(expense.expense_date).toLocaleDateString()}
                                                            </span>
                                                            <span className="text-xs">
                                                                {splitTypeLabels[expense.split_type]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold">${expense.amount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Balances</CardTitle>
                                <CardDescription>Who owes what</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {Object.keys(balances).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                                            <DollarSign className="size-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <p className="mt-3 text-sm font-medium">All settled up!</p>
                                        <p className="mt-1 text-center text-xs text-neutral-600 dark:text-neutral-400">
                                            Everyone is square
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {Object.entries(balances).map(([debtorId, creditors]) =>
                                            Object.entries(creditors).map(([creditorId, amount]) => {
                                                const debtor = getUserById(Number(debtorId));
                                                const creditor = getUserById(Number(creditorId));
                                                const isCurrentUserDebtor = Number(debtorId) === currentUserId;

                                                return (
                                                    <div
                                                        key={`${debtorId}-${creditorId}`}
                                                        className="space-y-2 rounded-lg border border-sidebar-border/50 p-3 dark:border-sidebar-border/30"
                                                    >
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div>
                                                                <span className={isCurrentUserDebtor ? 'font-semibold' : ''}>
                                                                    {isCurrentUserDebtor ? 'You owe' : debtor?.name + ' owes'}
                                                                </span>{' '}
                                                                <span className={!isCurrentUserDebtor && Number(creditorId) === currentUserId ? 'font-semibold' : ''}>
                                                                    {Number(creditorId) === currentUserId ? 'you' : creditor?.name}
                                                                </span>
                                                            </div>
                                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                                ${amount.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        {isCurrentUserDebtor && (
                                                            <RecordSettlementDialog
                                                                groupId={group.id}
                                                                paidToUserId={Number(creditorId)}
                                                                paidToUserName={creditor?.name || ''}
                                                                suggestedAmount={amount}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            }),
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Members</CardTitle>
                                        <CardDescription>{group.users.length} {group.users.length === 1 ? 'member' : 'members'}</CardDescription>
                                    </div>
                                    <AddMemberDialog groupId={group.id} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {group.users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                        >
                                            <div className="flex size-10 items-center justify-center rounded-full bg-neutral-200 font-medium dark:bg-neutral-700">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {user.name}
                                                    {user.id === currentUserId && (
                                                        <span className="ml-2 text-xs text-neutral-600 dark:text-neutral-400">
                                                            (you)
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
