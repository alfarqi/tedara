<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'title',
        'content',
        'status',
        'seo_title',
        'seo_url',
        'seo_description',
        'show_in_footer',
        'language',
    ];

    protected $casts = [
        'show_in_footer' => 'boolean',
    ];

    /**
     * Get the store that owns the page.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Scope a query to only include active pages.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include pages that should be shown in footer.
     */
    public function scopeShowInFooter($query)
    {
        return $query->where('show_in_footer', true);
    }

    /**
     * Scope a query to filter by language.
     */
    public function scopeLanguage($query, $language)
    {
        return $query->where('language', $language);
    }

    /**
     * Scope a query to filter by store.
     */
    public function scopeForStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }
}



