<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * Determine whether the user can view any products.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isStoreOwner() || $user->isStoreManager() || $user->isCustomer();
    }

    /**
     * Determine whether the user can view the product.
     */
    public function view(User $user, Product $product): bool
    {
        // Super admin can view all products
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view products in their stores
        if ($user->isStoreOwner()) {
            return $product->store->owner_id === $user->id;
        }

        // Store managers can view products in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can view all products
        }

        // Customers can view active products
        if ($user->isCustomer()) {
            return $product->isActive();
        }

        return false;
    }

    /**
     * Determine whether the user can create products.
     */
    public function create(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isStoreOwner() || $user->isStoreManager();
    }

    /**
     * Determine whether the user can update the product.
     */
    public function update(User $user, Product $product): bool
    {
        // Super admin can update any product
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can update products in their stores
        if ($user->isStoreOwner()) {
            return $product->store->owner_id === $user->id;
        }

        // Store managers can update products in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can update all products
        }

        return false;
    }

    /**
     * Determine whether the user can delete the product.
     */
    public function delete(User $user, Product $product): bool
    {
        // Super admin can delete any product
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can delete products in their stores
        if ($user->isStoreOwner()) {
            return $product->store->owner_id === $user->id;
        }

        // Store managers can delete products in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can delete all products
        }

        return false;
    }

    /**
     * Determine whether the user can restore the product.
     */
    public function restore(User $user, Product $product): bool
    {
        return $user->isSuperAdmin() || 
               ($user->isStoreOwner() && $product->store->owner_id === $user->id) ||
               $user->isStoreManager();
    }

    /**
     * Determine whether the user can permanently delete the product.
     */
    public function forceDelete(User $user, Product $product): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can manage product inventory.
     */
    public function manageInventory(User $user, Product $product): bool
    {
        // Super admin can manage any product inventory
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can manage inventory for products in their stores
        if ($user->isStoreOwner()) {
            return $product->store->owner_id === $user->id;
        }

        // Store managers can manage inventory for products in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can manage all inventory
        }

        return false;
    }

    /**
     * Determine whether the user can manage product pricing.
     */
    public function managePricing(User $user, Product $product): bool
    {
        // Super admin can manage any product pricing
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can manage pricing for products in their stores
        if ($user->isStoreOwner()) {
            return $product->store->owner_id === $user->id;
        }

        // Store managers can manage pricing for products in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can manage all pricing
        }

        return false;
    }

    /**
     * Determine whether the user can view product analytics.
     */
    public function viewAnalytics(User $user, Product $product): bool
    {
        // Super admin can view analytics for any product
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view analytics for products in their stores
        if ($user->isStoreOwner()) {
            return $product->store->owner_id === $user->id;
        }

        // Store managers can view analytics for products in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can view all analytics
        }

        return false;
    }
}
