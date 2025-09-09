<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    /**
     * Determine whether the user can view any customers.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isStoreOwner() || $user->isStoreManager();
    }

    /**
     * Determine whether the user can view the customer.
     */
    public function view(User $user, Customer $customer): bool
    {
        // Super admin can view all customers
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view customers in their stores
        if ($user->isStoreOwner()) {
            return $customer->store->owner_id === $user->id;
        }

        // Store managers can view customers in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can view all customers
        }

        return false;
    }

    /**
     * Determine whether the user can create customers.
     */
    public function create(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isStoreOwner() || $user->isStoreManager();
    }

    /**
     * Determine whether the user can update the customer.
     */
    public function update(User $user, Customer $customer): bool
    {
        // Super admin can update any customer
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can update customers in their stores
        if ($user->isStoreOwner()) {
            return $customer->store->owner_id === $user->id;
        }

        // Store managers can update customers in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can update all customers
        }

        return false;
    }

    /**
     * Determine whether the user can delete the customer.
     */
    public function delete(User $user, Customer $customer): bool
    {
        // Super admin can delete any customer
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can delete customers in their stores
        if ($user->isStoreOwner()) {
            return $customer->store->owner_id === $user->id;
        }

        // Store managers can delete customers in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can delete all customers
        }

        return false;
    }

    /**
     * Determine whether the user can restore the customer.
     */
    public function restore(User $user, Customer $customer): bool
    {
        return $user->isSuperAdmin() || 
               ($user->isStoreOwner() && $customer->store->owner_id === $user->id) ||
               $user->isStoreManager();
    }

    /**
     * Determine whether the user can permanently delete the customer.
     */
    public function forceDelete(User $user, Customer $customer): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can view customer analytics.
     */
    public function viewAnalytics(User $user, Customer $customer): bool
    {
        // Super admin can view analytics for any customer
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view analytics for customers in their stores
        if ($user->isStoreOwner()) {
            return $customer->store->owner_id === $user->id;
        }

        // Store managers can view analytics for customers in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can view all analytics
        }

        return false;
    }

    /**
     * Determine whether the user can manage customer status.
     */
    public function manageStatus(User $user, Customer $customer): bool
    {
        // Super admin can manage any customer status
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can manage status for customers in their stores
        if ($user->isStoreOwner()) {
            return $customer->store->owner_id === $user->id;
        }

        // Store managers can manage status for customers in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can manage all status
        }

        return false;
    }

    /**
     * Determine whether the user can view customer orders.
     */
    public function viewOrders(User $user, Customer $customer): bool
    {
        // Super admin can view orders for any customer
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view orders for customers in their stores
        if ($user->isStoreOwner()) {
            return $customer->store->owner_id === $user->id;
        }

        // Store managers can view orders for customers in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can view all orders
        }

        return false;
    }
}
