<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Models\TenantDomain;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = $this->resolveTenant($request);
        
        if ($tenant) {
            app()->instance('tenant', $tenant);
        }

        return $next($request);
    }

    /**
     * Resolve tenant from request.
     */
    private function resolveTenant(Request $request): ?Tenant
    {
        // First, try to resolve by domain
        $host = $request->getHost();
        $domain = TenantDomain::where('domain', $host)->first();
        
        if ($domain) {
            return $domain->tenant;
        }

        // If not found by domain, try to resolve by path segment
        $pathSegments = explode('/', trim($request->getPathInfo(), '/'));
        
        // Skip 'api', 'admin', and 'storefront' segments
        $excludedSegments = ['api', 'admin', 'storefront'];
        $tenantHandle = null;
        
        foreach ($pathSegments as $segment) {
            if (!in_array($segment, $excludedSegments)) {
                $tenantHandle = $segment;
                break;
            }
        }

        if ($tenantHandle) {
            return Tenant::where('handle', $tenantHandle)
                ->where('status', 'active')
                ->first();
        }

        return null;
    }
}
