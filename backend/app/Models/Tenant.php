<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'handle',
        'display_name',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the domains for the tenant.
     */
    public function domains(): HasMany
    {
        return $this->hasMany(TenantDomain::class);
    }

    /**
     * Get the primary domain for the tenant.
     */
    public function primaryDomain()
    {
        return $this->hasOne(TenantDomain::class)->where('is_primary', true);
    }

    /**
     * Get the theme settings for the tenant.
     */
    public function themeSettings(): HasMany
    {
        return $this->hasMany(TenantThemeSetting::class);
    }

    /**
     * Get the storefront pages for the tenant.
     */
    public function storefrontPages(): HasMany
    {
        return $this->hasMany(StorefrontPage::class);
    }

    /**
     * Get the home page for the tenant.
     */
    public function homePage()
    {
        return $this->hasOne(StorefrontPage::class)->where('is_home', true);
    }

    /**
     * Get the products for the tenant.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the store associated with this tenant.
     */
    public function store()
    {
        // Find store by matching the tenant handle with user's store_handle
        $user = \App\Models\User::where('store_handle', $this->handle)
            ->whereNotNull('store_handle')
            ->first();
        
        return $user ? $user->ownedStores()->first() : null;
    }

    /**
     * Check if tenant is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}




