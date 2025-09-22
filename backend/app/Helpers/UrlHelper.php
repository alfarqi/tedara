<?php

namespace App\Helpers;

class UrlHelper
{
    /**
     * Build full URL for uploaded files, handling GoDaddy path structure
     */
    public static function buildFileUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        // If it's already a full URL, return as is
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        // Get the base URL from environment
        $baseUrl = config('app.url');
        
        // Handle different path formats
        if (str_starts_with($path, 'uploads/')) {
            // Path starts with uploads/ - add storage prefix
            return $baseUrl . '/backend/public/storage/' . $path;
        }
        
        if (str_starts_with($path, 'storage/')) {
            // Path already has storage/ prefix
            return $baseUrl . '/backend/public/' . $path;
        }
        
        if (!str_contains($path, '/')) {
            // Just a filename - construct full path
            return $baseUrl . '/backend/public/storage/uploads/store/logos/' . $path;
        }
        
        // Default: assume it's a relative path and prepend storage URL
        return $baseUrl . '/backend/public/storage/' . $path;
    }

    /**
     * Build logo URL specifically for store logos
     */
    public static function buildLogoUrl(?string $logo): ?string
    {
        if (empty($logo)) {
            return null;
        }

        // If it's already a full URL, return as is
        if (filter_var($logo, FILTER_VALIDATE_URL)) {
            return $logo;
        }

        $baseUrl = config('app.url');
        
        // Handle different logo path formats
        if (str_starts_with($logo, 'uploads/store/logos/')) {
            return $baseUrl . '/backend/public/storage/' . $logo;
        }
        
        if (str_starts_with($logo, 'uploads/')) {
            return $baseUrl . '/backend/public/storage/' . $logo;
        }
        
        if (str_starts_with($logo, 'storage/')) {
            return $baseUrl . '/backend/public/' . $logo;
        }
        
        if (!str_contains($logo, '/')) {
            // Just a filename - construct full path for store logos
            return $baseUrl . '/backend/public/storage/uploads/store/logos/' . $logo;
        }
        
        // Default: assume it's a relative path and prepend storage URL
        return $baseUrl . '/backend/public/storage/' . $logo;
    }

    /**
     * Get the correct storage URL for the current environment
     */
    public static function getStorageUrl(): string
    {
        $baseUrl = config('app.url');
        return $baseUrl . '/backend/public/storage';
    }
}
