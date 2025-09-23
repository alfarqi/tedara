<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Theme extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'key',
        'name',
        'version',
        'is_enabled',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    /**
     * Get the tenant theme settings for the theme.
     */
    public function tenantThemeSettings(): HasMany
    {
        return $this->hasMany(TenantThemeSetting::class);
    }
}












