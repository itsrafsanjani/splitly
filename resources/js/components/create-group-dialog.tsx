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
import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';

export function CreateGroupDialog() {
    const [open, setOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        members: [auth.user.id],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/groups', {
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
                <Button>
                    <Plus className="mr-2 size-4" />
                    Create new group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create a new group</DialogTitle>
                        <DialogDescription>
                            Start tracking shared expenses with friends and
                            family.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Group name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g., Roommates, Trip to Vegas"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Description (optional)
                            </Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="What's this group for?"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                        <div className="rounded-lg border border-dashed border-sidebar-border/50 p-4 dark:border-sidebar-border/30">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                You'll be able to add members after creating the
                                group.
                            </p>
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
                            {processing ? 'Creating...' : 'Create group'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
