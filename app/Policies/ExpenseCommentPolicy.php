<?php

namespace App\Policies;

use App\Models\ExpenseComment;
use App\Models\User;

class ExpenseCommentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ExpenseComment $comment): bool
    {
        return $comment->expense->group->users->contains($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ExpenseComment $comment): bool
    {
        return $comment->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ExpenseComment $comment): bool
    {
        return $comment->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ExpenseComment $comment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ExpenseComment $comment): bool
    {
        return false;
    }
}
