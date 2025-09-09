<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionRating extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'question_ratings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'content',
        'rating',
        'user_id',
        'product_id',
        'store_id',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Get the user that owns the question/rating.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that owns the question/rating.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the store that owns the question/rating.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the replies for this question/rating.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Reply::class);
    }

    /**
     * Scope a query to only include questions.
     */
    public function scopeQuestions($query)
    {
        return $query->where('type', 'question');
    }

    /**
     * Scope a query to only include ratings.
     */
    public function scopeRatings($query)
    {
        return $query->where('type', 'rating');
    }

    /**
     * Scope a query to only include published items.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope a query to only include items by store.
     */
    public function scopeByStore($query, int $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    /**
     * Scope a query to only include items by product.
     */
    public function scopeByProduct($query, int $productId)
    {
        return $query->where('product_id', $productId);
    }

    /**
     * Scope a query to only include items by user.
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to search by content.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where('content', 'like', "%{$search}%");
    }

    /**
     * Check if this is a question.
     */
    public function isQuestion(): bool
    {
        return $this->type === 'question';
    }

    /**
     * Check if this is a rating.
     */
    public function isRating(): bool
    {
        return $this->type === 'rating';
    }

    /**
     * Check if this is published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    /**
     * Get formatted rating stars.
     */
    public function getRatingStars(): string
    {
        if (!$this->isRating() || !$this->rating) {
            return '';
        }

        return str_repeat('★', $this->rating) . str_repeat('☆', 5 - $this->rating);
    }

    /**
     * Get type label.
     */
    public function getTypeLabel(): string
    {
        return ucfirst($this->type);
    }

    /**
     * Get status label.
     */
    public function getStatusLabel(): string
    {
        return ucfirst($this->status);
    }
}
