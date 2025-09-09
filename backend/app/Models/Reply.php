<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reply extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'question_rating_id',
        'user_id',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the question/rating that this reply belongs to.
     */
    public function questionRating(): BelongsTo
    {
        return $this->belongsTo(QuestionRating::class);
    }

    /**
     * Get the user who wrote this reply.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get only published replies.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope to get only unpublished replies.
     */
    public function scopeUnpublished($query)
    {
        return $query->where('status', 'unpublished');
    }
}
