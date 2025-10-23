import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface User {
    id: number;
    name: string;
}

interface AddExpenseDialogProps {
    groupId: number;
    users: User[];
}

const categories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Shopping', 'Other'];
const splitTypes = [
    { value: 'equal', label: 'Split equally' },
    { value: 'exact', label: 'Exact amounts' },
    { value: 'percentage', label: 'By percentage' },
    { value: 'shares', label: 'By shares' },
];

export function AddExpenseDialog({ groupId, users }: AddExpenseDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        group_id: groupId,
        description: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        category: 'Food',
        split_type: 'equal',
        participants: users.reduce((acc, user) => ({ ...acc, [user.id]: 0 }), {} as Record<number, number>),
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post('/expenses', {
            preserveScroll: true,
            transform: (data) => {
                // Prepare participants based on split type
                let participants: Record<string, number> = {};

                if (data.split_type === 'equal') {
                    // For equal split, calculate the share amount and send as object
                    const amount = parseFloat(data.amount);
                    const shareAmount = amount / users.length;
                    users.forEach(u => {
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
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const handleSplitTypeChange = (value: string) => {
        setData('split_type', value);
        // Reset participants when changing split type
        const initialParticipants = users.reduce((acc, user) => ({ ...acc, [user.id]: 0 }), {} as Record<number, number>);
        setData('participants', initialParticipants);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" />
                    Add expense
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add an expense</DialogTitle>
                        <DialogDescription>
                            Record a new expense and split it among group members.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                                {users.map((user) => (
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
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Adding...' : 'Add expense'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
