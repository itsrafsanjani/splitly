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
import { useForm } from '@inertiajs/react';
import { DollarSign } from 'lucide-react';
import { type FormEvent, type ReactNode, useState } from 'react';

interface RecordSettlementDialogProps {
    groupId: number;
    paidToUserId: number;
    paidToUserName: string;
    suggestedAmount?: number;
    trigger?: ReactNode;
}

export function RecordSettlementDialog({
    groupId,
    paidToUserId,
    paidToUserName,
    suggestedAmount,
    trigger,
}: RecordSettlementDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        group_id: groupId,
        paid_to: paidToUserId,
        amount: suggestedAmount?.toFixed(2) || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/settlements', {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="sm" variant="outline">
                        <DollarSign className="mr-2 size-4" />
                        Settle up
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Record a payment</DialogTitle>
                        <DialogDescription>
                            Record that you paid {paidToUserName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                                autoFocus
                            />
                            {errors.amount && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
                            )}
                            {suggestedAmount && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    You owe ${suggestedAmount.toFixed(2)}
                                </p>
                            )}
                        </div>
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
                            {processing ? 'Recording...' : 'Record payment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
