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
                    ]
                ],
                'meta' => [
                    'tenant' => [
                        'handle' => $tenant->handle,
                        'display_name' => $tenant->display_name,
                    ]
                ]
            ]);
        }

        $activeTheme = $themeSettings->first();
        
        return response()->json([
            'data' => [
                'theme' => [
                    'key' => $activeTheme->theme->key,
                    'name' => $activeTheme->theme->name,
                    'version' => $activeTheme->theme->version,
                ],
                'settings' => $activeTheme->settings,
            ],
            'meta' => [
                'tenant' => [
                    'handle' => $tenant->handle,
                    'display_name' => $tenant->display_name,
                ]
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
}
