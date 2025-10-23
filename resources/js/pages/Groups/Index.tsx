import { CreateGroupDialog } from '@/components/create-group-dialog';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Users as UsersIcon, Wallet } from 'lucide-react';

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

interface Props {
    groups: Group[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Index({ groups }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Groups" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Your Groups</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Manage shared expenses with friends and family
                    </p>
                </div>

                <CreateGroupDialog />

                {groups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 p-12 py-20 dark:border-sidebar-border">
                        <div className="rounded-full bg-neutral-100 p-6 dark:bg-neutral-800">
                            <UsersIcon className="size-12 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <h3 className="mt-6 text-lg font-semibold">
                            No groups yet
                        </h3>
                        <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
                            Create your first group to start tracking
                            <br />
                            shared expenses with others
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {groups.map((group) => (
                            <Link
                                key={group.id}
                                href={`/groups/${group.id}`}
                                className="group relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 transition hover:border-sidebar-border hover:shadow-md dark:border-sidebar-border dark:bg-neutral-900 dark:hover:border-sidebar-border/70"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                                            {group.name}
                                        </h3>
                                        {group.description && (
                                            <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                {group.description}
                                            </p>
                                        )}
                                    </div>
                                    <ArrowRight className="size-5 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300" />
                                </div>
                                <div className="mt-6 flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                        <UsersIcon className="size-4" />
                                        <span>
                                            {group.users.length}{' '}
                                            {group.users.length === 1
                                                ? 'member'
                                                : 'members'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                        <Wallet className="size-4" />
                                        <span>
                                            {group.expenses_count}{' '}
                                            {group.expenses_count === 1
                                                ? 'expense'
                                                : 'expenses'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
