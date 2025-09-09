<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any users.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can view the user.
     */
    public function view(User $user, User $model): bool
    {
        // Super admin can view all users
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Users can view their own profile
        if ($user->id === $model->id) {
            return true;
        }

        // Store owners can view users in their stores (if we add store relationship later)
        if ($user->isStoreOwner()) {
            // For now, store owners can only view their own profile
            return false;
        }

        return false;
    }

    /**
     * Determine whether the user can create users.
     */
    public function create(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can update the user.
     */
    public function update(User $user, User $model): bool
    {
        // Super admin can update any user
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Users can update their own profile
        if ($user->id === $model->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the user.
     */
    public function delete(User $user, User $model): bool
    {
        // Super admin can delete any user (except themselves)
        if ($user->isSuperAdmin()) {
            return $user->id !== $model->id;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the user.
     */
    public function restore(User $user, User $model): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can permanently delete the user.
     */
    public function forceDelete(User $user, User $model): bool
    {
        // Super admin can permanently delete any user (except themselves)
        if ($user->isSuperAdmin()) {
            return $user->id !== $model->id;
        }

        return false;
    }

    /**
     * Determine whether the user can manage user roles.
     */
    public function manageRoles(User $user, User $model): bool
    {
        // Only super admin can manage roles
        if ($user->isSuperAdmin()) {
            // Cannot change own role
            return $user->id !== $model->id;
        }

        return false;
    }

    /**
     * Determine whether the user can manage user status.
     */
    public function manageStatus(User $user, User $model): bool
    {
        // Only super admin can manage user status
        if ($user->isSuperAdmin()) {
            // Cannot suspend themselves
            return $user->id !== $model->id;
        }

        return false;
    }

    /**
     * Determine whether the user can view user analytics.
     */
    public function viewAnalytics(User $user, User $model): bool
    {
        // Super admin can view analytics for any user
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Users can view their own analytics
        if ($user->id === $model->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can reset user password.
     */
    public function resetPassword(User $user, User $model): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can force password change.
     */
    public function forcePasswordChange(User $user, User $model): bool
    {
        return $user->isSuperAdmin();
    }
}
