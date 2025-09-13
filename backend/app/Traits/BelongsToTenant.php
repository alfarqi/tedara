<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait BelongsToTenant
{
    /**
     * Boot the trait.
     */
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            try {
                $tenant = app('tenant');
                if ($tenant) {
                    $builder->where('tenant_id', $tenant->id);
                }
            } catch (\Exception $e) {
                // If tenant is not bound, don't apply the scope
                // This allows models to work in non-tenant contexts
            }
        });

        static::creating(function (Model $model) {
            try {
                $tenant = app('tenant');
                if ($tenant && !$model->tenant_id) {
                    $model->tenant_id = $tenant->id;
                }
            } catch (\Exception $e) {
                // If tenant is not bound, don't auto-set tenant_id
                // This allows models to work in non-tenant contexts
            }
        });
    }

    /**
     * Get the tenant that owns the model.
     */
    public function tenant()
    {
        return $this->belongsTo(\App\Models\Tenant::class);
    }
}
