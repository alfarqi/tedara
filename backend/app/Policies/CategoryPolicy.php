<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    /**
     * Determine whether the user can view any categories.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isStoreOwner() || $user->isStoreManager() || $user->isCustomer();
    }

    /**
     * Determine whether the user can view the category.
     */
    public function view(User $user, Category $category): bool
    {
        // Super admin can view all categories
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view categories in their stores
        if ($user->isStoreOwner()) {
            return $category->store->owner_id === $user->id;
        }

        // Store managers can view categories in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can view all categories
        }

        // Customers can view categories
        if ($user->isCustomer()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create categories.
     */
    public function create(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isStoreOwner() || $user->isStoreManager();
    }

    /**
     * Determine whether the user can update the category.
     */
    public function update(User $user, Category $category): bool
    {
        // Super admin can update any category
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can update categories in their stores
        if ($user->isStoreOwner()) {
            return $category->store->owner_id === $user->id;
        }

        // Store managers can update categories in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can update all categories
        }

        return false;
    }

    /**
     * Determine whether the user can delete the category.
     */
    public function delete(User $user, Category $category): bool
    {
        // Super admin can delete any category
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can delete categories in their stores
        if ($user->isStoreOwner()) {
            return $category->store->owner_id === $user->id;
        }

        // Store managers can delete categories in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can delete all categories
        }

        return false;
    }

    /**
     * Determine whether the user can restore the category.
     */
    public function restore(User $user, Category $category): bool
    {
        return $user->isSuperAdmin() || 
               ($user->isStoreOwner() && $category->store->owner_id === $user->id) ||
               $user->isStoreManager();
    }

    /**
     * Determine whether the user can permanently delete the category.
     */
    public function forceDelete(User $user, Category $category): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can manage category hierarchy.
     */
    public function manageHierarchy(User $user, Category $category): bool
    {
        // Super admin can manage any category hierarchy
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can manage hierarchy for categories in their stores
        if ($user->isStoreOwner()) {
            return $category->store->owner_id === $user->id;
        }

        // Store managers can manage hierarchy for categories in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can manage all hierarchy
        }

        return false;
    }

    /**
     * Determine whether the user can manage category ordering.
     */
    public function manageOrdering(User $user, Category $category): bool
    {
        // Super admin can manage any category ordering
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can manage ordering for categories in their stores
        if ($user->isStoreOwner()) {
            return $category->store->owner_id === $user->id;
        }

        // Store managers can manage ordering for categories in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can manage all ordering
        }

        return false;
    }
}
