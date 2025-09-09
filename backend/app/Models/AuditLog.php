<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'model',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    /**
     * Get the user that owns the audit log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include logs by user.
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include logs by action.
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope a query to only include logs by model.
     */
    public function scopeByModel($query, string $model)
    {
        return $query->where('model', $model);
    }

    /**
     * Scope a query to only include logs by model ID.
     */
    public function scopeByModelId($query, int $modelId)
    {
        return $query->where('model_id', $modelId);
    }

    /**
     * Scope a query to search by action or model.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('action', 'like', "%{$search}%")
              ->orWhere('model', 'like', "%{$search}%");
        });
    }

    /**
     * Scope a query to order by latest first.
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Get action label.
     */
    public function getActionLabel(): string
    {
        return ucfirst(str_replace('_', ' ', $this->action));
    }

    /**
     * Get model label.
     */
    public function getModelLabel(): string
    {
        return ucfirst($this->model);
    }

    /**
     * Check if log has changes.
     */
    public function hasValueChanges(): bool
    {
        return !empty($this->old_values) || !empty($this->new_values);
    }

    /**
     * Get changes summary.
     */
    public function getChangesSummary(): string
    {
        if (!$this->hasValueChanges()) {
            return 'No changes recorded';
        }

        $changes = [];
        
        if (!empty($this->old_values)) {
            $changes[] = 'Old values: ' . count($this->old_values) . ' fields';
        }
        
        if (!empty($this->new_values)) {
            $changes[] = 'New values: ' . count($this->new_values) . ' fields';
        }

        return implode(', ', $changes);
    }
}
