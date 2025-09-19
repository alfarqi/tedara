<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Model
{
    use HasFactory, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'store_id',
        'status',
        'total_orders',
        'total_spent',
        'join_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'join_date' => 'date',
        'total_spent' => 'decimal:2',
        'password' => 'hashed',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the store that owns the customer.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the orders for the customer.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the addresses for the customer.
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Scope a query to only include active customers.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include VIP customers.
     */
    public function scopeVip($query)
    {
        return $query->where('status', 'vip');
    }

    /**
     * Scope a query to only include customers by store.
     */
    public function scopeByStore($query, int $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    /**
     * Scope a query to only include customers by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to search customers by name or email.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%");
        });
    }

    /**
     * Scope a query to order by total spent (highest first).
     */
    public function scopeTopSpenders($query)
    {
        return $query->orderBy('total_spent', 'desc');
    }

    /**
     * Scope a query to order by total orders (highest first).
     */
    public function scopeTopOrderers($query)
    {
        return $query->orderBy('total_orders', 'desc');
    }

    /**
     * Check if customer is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if customer is VIP.
     */
    public function isVip(): bool
    {
        return $this->status === 'vip';
    }

    /**
     * Get customer's average order value.
     */
    public function getAverageOrderValue(): float
    {
        if ($this->total_orders === 0) {
            return 0;
        }

        return round($this->total_spent / $this->total_orders, 2);
    }

    /**
     * Get customer's lifetime value.
     */
    public function getLifetimeValue(): float
    {
        return $this->total_spent;
    }

    /**
     * Get customer's order count.
     */
    public function getOrderCount(): int
    {
        return $this->total_orders;
    }
}
