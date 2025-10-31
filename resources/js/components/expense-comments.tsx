import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Comment {
    id: number;
    user_id: number;
    comment: string;
    created_at: string;
    user: User;
}

interface Props {
    expenseId: number;
    comments: Comment[];
}

export function ExpenseComments({ expenseId, comments }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [showComments, setShowComments] = useState(false);
    const { data, setData, post, reset, processing } = useForm({
        comment: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/expenses/${expenseId}/comments`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleDelete = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            useForm().delete(`/expense-comments/${commentId}`, {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    return (
        <div className="mt-3 border-t border-sidebar-border/30 pt-3">
            <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
                <MessageCircle className="size-4" />
                <span>
                    {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </span>
            </button>

            {showComments && (
                <div className="mt-3 space-y-3">
                    {/* Existing Comments */}
                    {comments.length > 0 && (
                        <div className="space-y-2">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {comment.user.name}
                                                </span>
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {formatDate(comment.created_at)}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                                                {comment.comment}
                                            </p>
                                        </div>
                                        {comment.user_id === auth.user.id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(comment.id)}
                                                className="size-8 p-0 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Comment Form */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Textarea
                            placeholder="Add a comment..."
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            rows={2}
                            className="resize-none text-sm"
                            disabled={processing}
                        />
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!data.comment.trim() || processing}
                            className="shrink-0"
                        >
                            <Send className="size-4" />
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
