<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
        'description',
    ];

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

    /**
     * Get a system setting value by key.
     */
    public static function getValue(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a system setting value by key.
     */
    public static function setValue(string $key, $value, string $description = null): void
    {
        static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'description' => $description,
            ]
        );
    }

    /**
     * Get a system setting value as boolean.
     */
    public static function getBoolean(string $key, bool $default = false): bool
    {
        $value = static::getValue($key, $default);
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * Get a system setting value as integer.
     */
    public static function getInteger(string $key, int $default = 0): int
    {
        return (int) static::getValue($key, $default);
    }

    /**
     * Get a system setting value as array.
     */
    public static function getArray(string $key, array $default = []): array
    {
        $value = static::getValue($key, $default);
        return is_array($value) ? $value : json_decode($value, true) ?? $default;
    }
}
