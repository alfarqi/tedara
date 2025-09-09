<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;

class StorePolicy
{
    /**
     * Determine whether the user can view any stores.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isStoreOwner() || $user->isStoreManager();
    }

    /**
     * Determine whether the user can view the store.
     */
    public function view(User $user, Store $store): bool
    {
        // Super admin can view all stores
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view their own stores
        if ($user->isStoreOwner() && $store->owner_id === $user->id) {
            return true;
        }

        // Store managers can view stores they manage (if we add manager relationship later)
        if ($user->isStoreManager()) {
            // For now, managers can view stores in the same system
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create stores.
     */
    public function create(User $user): bool
    {
        // Only super admins and store owners can create stores
        return $user->isSuperAdmin() || $user->isStoreOwner();
    }

    /**
     * Determine whether the user can update the store.
     */
    public function update(User $user, Store $store): bool
    {
        // Super admin can update any store
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can update their own stores
        if ($user->isStoreOwner() && $store->owner_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the store.
     */
    public function delete(User $user, Store $store): bool
    {
        // Only super admins can delete stores
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can delete their own stores (with restrictions)
        if ($user->isStoreOwner() && $store->owner_id === $user->id) {
            // Check if store has active orders or products
            if ($store->orders()->exists() || $store->products()->exists()) {
                return false; // Cannot delete store with data
            }
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the store.
     */
    public function restore(User $user, Store $store): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can permanently delete the store.
     */
    public function forceDelete(User $user, Store $store): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can manage store settings.
     */
    public function manageSettings(User $user, Store $store): bool
    {
        // Super admin can manage any store settings
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can manage their own store settings
        if ($user->isStoreOwner() && $store->owner_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view store analytics.
     */
    public function viewAnalytics(User $user, Store $store): bool
    {
        // Super admin can view analytics for any store
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view analytics for their own stores
        if ($user->isStoreOwner() && $store->owner_id === $user->id) {
            return true;
        }

        // Store managers can view analytics for stores they manage
        if ($user->isStoreManager()) {
            return true;
        }

        return false;
    }
}
