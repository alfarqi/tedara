<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantThemeSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    /**
     * Get theme settings for the tenant.
     */
    public function show(Request $request, string $tenantHandle): JsonResponse
    {
        $tenant = $this->getTenant($tenantHandle);
        
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        $themeSettings = TenantThemeSetting::where('tenant_id', $tenant->id)
            ->with('theme')
            ->get();

        if ($themeSettings->isEmpty()) {
            // Get store information
            $store = $tenant->store();
            
            // Return default theme settings if none exist
            return response()->json([
                'data' => [
                    'theme' => [
                        'key' => 'default',
                        'name' => 'Default Theme',
                        'version' => '1.0.0',
                    ],
                    'settings' => [
                        'primary_color' => '#6f42c1',
                        'secondary_color' => '#6c757d',
                        'font_family' => 'Inter, sans-serif',
                        'header_style' => 'modern',
                        'footer_style' => 'simple',
                        'logo_url' => $this->buildLogoUrl($store?->logo),
                        'banner_url' => $this->buildLogoUrl($store?->settings['banner_image'] ?? null),
                        'store_name' => $store?->name ?? $tenant->display_name,
                        'store_slogan' => $store?->settings['slogan'] ?? $store?->description ?? 'Delicious food delivered fresh to your doorstep',
                        'contact_email' => $store?->settings['contact_email'] ?? null,
                        'contact_phone' => $store?->settings['contact_phone'] ?? null,
                        'social_links' => $store?->settings['social_links'] ?? [
                            'instagram' => $this->buildSocialUrl('instagram', $store?->settings['instagram'] ?? null),
                            'whatsapp' => $this->buildSocialUrl('whatsapp', $store?->settings['whatsapp'] ?? null),
                            'facebook' => $this->buildSocialUrl('facebook', $store?->settings['facebook'] ?? null),
                            'twitter' => $this->buildSocialUrl('twitter', $store?->settings['twitter'] ?? null),
                            'linkedin' => $this->buildSocialUrl('linkedin', $store?->settings['linkedin'] ?? null),
                            'youtube' => $this->buildSocialUrl('youtube', $store?->settings['youtube'] ?? null),
                            'tiktok' => $this->buildSocialUrl('tiktok', $store?->settings['tiktok'] ?? null),
                            'telegram' => $this->buildSocialUrl('telegram', $store?->settings['telegram'] ?? null),
                        ],
                    ]
                ],
                'meta' => [
                    'tenant' => [
                        'handle' => $tenant->handle,
                        'display_name' => $tenant->display_name,
                    ],
                'store' => $store ? [
                    'id' => $store->id,
                    'name' => $store->name,
                    'logo' => $this->buildLogoUrl($store->logo),
                    'description' => $store->description,
                ] : null
                ]
            ]);
        }

        $activeTheme = $themeSettings->first();
        
        // Get store information
        $store = $tenant->store();
        
        // Merge store information with theme settings
        $settings = $activeTheme->settings;
        if ($store) {
            // Get existing social_links from theme settings
            $existingSocialLinks = $settings['social_links'] ?? [];
            
            // Build social links from store settings, overriding theme settings
            $storeSocialLinks = [
                'instagram' => $this->buildSocialUrl('instagram', $store->settings['instagram'] ?? null),
                'whatsapp' => $this->buildSocialUrl('whatsapp', $store->settings['whatsapp'] ?? null),
                'facebook' => $this->buildSocialUrl('facebook', $store->settings['facebook'] ?? null),
                'twitter' => $this->buildSocialUrl('twitter', $store->settings['twitter'] ?? null),
                'linkedin' => $this->buildSocialUrl('linkedin', $store->settings['linkedin'] ?? null),
                'youtube' => $this->buildSocialUrl('youtube', $store->settings['youtube'] ?? null),
                'tiktok' => $this->buildSocialUrl('tiktok', $store->settings['tiktok'] ?? null),
                'telegram' => $this->buildSocialUrl('telegram', $store->settings['telegram'] ?? null),
            ];
            
            // Merge social links, with store settings taking precedence
            $mergedSocialLinks = array_merge($existingSocialLinks, $storeSocialLinks);
            
            $settings = array_merge($settings, [
                'logo_url' => $this->buildLogoUrl($store->logo),
                'banner_url' => $this->buildLogoUrl($store->settings['banner_image'] ?? null),
                'store_name' => $store->name ?? $tenant->display_name,
                'store_slogan' => $store->settings['slogan'] ?? $store->description ?? $settings['store_slogan'] ?? 'Delicious food delivered fresh to your doorstep',
                'contact_email' => $store->settings['contact_email'] ?? $settings['contact_email'] ?? null,
                'contact_phone' => $store->settings['contact_phone'] ?? $settings['contact_phone'] ?? null,
                'social_links' => $mergedSocialLinks,
            ]);
        }
        
        return response()->json([
            'data' => [
                'theme' => [
                    'key' => $activeTheme->theme->key,
                    'name' => $activeTheme->theme->name,
                    'version' => $activeTheme->theme->version,
                ],
                'settings' => $settings,
            ],
            'meta' => [
                'tenant' => [
                    'handle' => $tenant->handle,
                    'display_name' => $tenant->display_name,
                ],
                'store' => $store ? [
                    'id' => $store->id,
                    'name' => $store->name,
                    'logo' => $this->buildLogoUrl($store->logo),
                    'description' => $store->description,
                ] : null
            ]
        ]);
    }

    /**
     * Get tenant by handle or from container.
     */
    private function getTenant(string $tenantHandle): ?Tenant
    {
        // First try to get from container (resolved by middleware)
        try {
            $tenant = app('tenant');
            
            if ($tenant && $tenant->handle === $tenantHandle) {
                return $tenant;
            }
        } catch (\Exception $e) {
            // Container doesn't have tenant, continue to direct lookup
        }

        // Fallback to direct lookup
        return Tenant::where('handle', $tenantHandle)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Build logo URL from logo path
     */
    private function buildLogoUrl(?string $logo): ?string
    {
        if (empty($logo)) {
            return null;
        }

        // If it's already a full URL, return as is
        if (filter_var($logo, FILTER_VALIDATE_URL)) {
            return $logo;
        }

        // If it's just a filename, construct the full URL
        if (!str_contains($logo, '/')) {
            // This is likely an old filename format, try to construct a path
            return url('storage/uploads/store/logos/' . $logo);
        }

        // If it's a relative path, make it absolute using app URL
        if (str_starts_with($logo, 'uploads/')) {
            return url('storage/' . $logo);
        }

        // Default: assume it's a relative path and prepend storage URL
        return url('storage/' . $logo);
    }

    /**
     * Build social media URL from account name
     */
    private function buildSocialUrl(string $platform, ?string $account): ?string
    {
        if (empty($account)) {
            return null;
        }

        // If it's already a URL, return as is
        if (filter_var($account, FILTER_VALIDATE_URL)) {
            return $account;
        }

        // Build URL based on platform
        switch ($platform) {
            case 'instagram':
                return 'https://instagram.com/' . ltrim($account, '@');
            case 'facebook':
                return 'https://facebook.com/' . ltrim($account, '@');
            case 'twitter':
                return 'https://twitter.com/' . ltrim($account, '@');
            case 'linkedin':
                return 'https://linkedin.com/in/' . ltrim($account, '@');
            case 'youtube':
                return 'https://youtube.com/@' . ltrim($account, '@');
            case 'tiktok':
                return 'https://tiktok.com/@' . ltrim($account, '@');
            case 'whatsapp':
                // WhatsApp can be phone number or username
                if (preg_match('/^\+?[1-9]\d{1,14}$/', $account)) {
                    return 'https://wa.me/' . preg_replace('/[^0-9]/', '', $account);
                }
                return 'https://wa.me/' . ltrim($account, '@');
            case 'telegram':
                return 'https://t.me/' . ltrim($account, '@');
            default:
                return $account;
        }
    }
}
