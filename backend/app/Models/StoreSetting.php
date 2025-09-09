<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'store_id',
        'key',
        'value',
    ];

    /**
     * Get the store that owns the setting.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Scope a query to only include settings by store.
     */
    public function scopeByStore($query, int $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    /**
     * Scope a query to only include settings by key.
     */
    public function scopeByKey($query, string $key)
    {
        return $query->where('key', $key);
    }

    /**
     * Get setting value as boolean.
     */
    public function getBooleanValue(): bool
    {
        return filter_var($this->value, FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * Get setting value as integer.
     */
    public function getIntegerValue(): int
    {
        return (int) $this->value;
    }

    /**
     * Get setting value as float.
     */
    public function getFloatValue(): float
    {
        return (float) $this->value;
    }

    /**
     * Get setting value as array (JSON).
     */
    public function getArrayValue(): array
    {
        return json_decode($this->value, true) ?? [];
    }
}
