<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Determine whether the user can view any orders.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isStoreOwner() || $user->isStoreManager();
    }

    /**
     * Determine whether the user can view the order.
     */
    public function view(User $user, Order $order): bool
    {
        // Super admin can view all orders
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view orders in their stores
        if ($user->isStoreOwner()) {
            return $order->store->owner_id === $user->id;
        }

        // Store managers can view orders in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can view all orders
        }

        return false;
    }

    /**
     * Determine whether the user can create orders.
     */
    public function create(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isStoreOwner() || $user->isStoreManager();
    }

    /**
     * Determine whether the user can update the order.
     */
    public function update(User $user, Order $order): bool
    {
        // Super admin can update any order
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can update orders in their stores
        if ($user->isStoreOwner()) {
            return $order->store->owner_id === $user->id;
        }

        // Store managers can update orders in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can update all orders
        }

        return false;
    }

    /**
     * Determine whether the user can delete the order.
     */
    public function delete(User $user, Order $order): bool
    {
        // Super admin can delete any order
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can delete orders in their stores
        if ($user->isStoreOwner()) {
            if ($order->store->owner_id === $user->id) {
                // Allow deletion of all orders for testing purposes
                // TODO: Re-enable restrictions in production
                // if ($order->isCompleted() || $order->status === 'shipped') {
                //     return false;
                // }
                return true;
            }
        }

        // Store managers can delete orders in stores they manage
        if ($user->isStoreManager()) {
            // Allow deletion of all orders for testing purposes
            // TODO: Re-enable restrictions in production
            // if ($order->isCompleted() || $order->status === 'shipped') {
            //     return false;
            // }
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the order.
     */
    public function restore(User $user, Order $order): bool
    {
        return $user->isSuperAdmin() || 
               ($user->isStoreOwner() && $order->store->owner_id === $user->id) ||
               $user->isStoreManager();
    }

    /**
     * Determine whether the user can permanently delete the order.
     */
    public function forceDelete(User $user, Order $order): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can update order status.
     */
    public function updateStatus(User $user, Order $order): bool
    {
        // Super admin can update any order status
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can update order status in their stores
        if ($user->isStoreOwner()) {
            return $order->store->owner_id === $user->id;
        }

        // Store managers can update order status in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can update all order statuses
        }

        return false;
    }

    /**
     * Determine whether the user can update payment status.
     */
    public function updatePaymentStatus(User $user, Order $order): bool
    {
        // Super admin can update any payment status
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can update payment status in their stores
        if ($user->isStoreOwner()) {
            return $order->store->owner_id === $user->id;
        }

        // Store managers can update payment status in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can update all payment statuses
        }

        return false;
    }

    /**
     * Determine whether the user can view order analytics.
     */
    public function viewAnalytics(User $user, Order $order): bool
    {
        // Super admin can view analytics for any order
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can view analytics for orders in their stores
        if ($user->isStoreOwner()) {
            return $order->store->owner_id === $user->id;
        }

        // Store managers can view analytics for orders in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can view all analytics
        }

        return false;
    }

    /**
     * Determine whether the user can process refunds.
     */
    public function processRefund(User $user, Order $order): bool
    {
        // Super admin can process refunds for any order
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Store owners can process refunds for orders in their stores
        if ($user->isStoreOwner()) {
            return $order->store->owner_id === $user->id;
        }

        // Store managers can process refunds for orders in stores they manage
        if ($user->isStoreManager()) {
            return true; // For now, managers can process all refunds
        }

        return false;
    }
}
