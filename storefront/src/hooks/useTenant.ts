import { useParams, useLocation } from 'react-router-dom';
import { logMobileDebug, isMobile } from '../utils/mobileDebug';

export function useTenant() {
  const { tenant } = useParams<{ tenant: string }>();
  const location = useLocation();
  
  logMobileDebug('useTenant hook called', { 
    tenantFromParams: tenant, 
    pathname: location.pathname,
    isMobile: isMobile()
  });
  
  // Fallback: extract tenant from pathname if params don't work
  if (!tenant) {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    logMobileDebug('No tenant from params, extracting from pathname', { pathSegments });
    
    if (pathSegments.length > 0) {
      const possibleTenant = pathSegments[0];
      // Only return if it's not a common route
      const commonRoutes = ['admin', 'orders', 'cart', 'checkout', 'account', 'addresses', 'contact'];
      if (!commonRoutes.includes(possibleTenant)) {
        logMobileDebug('Tenant extracted from pathname', { extractedTenant: possibleTenant });
        return possibleTenant;
      } else {
        logMobileDebug('Path segment is a common route, not a tenant', { possibleTenant });
      }
    }
  }
  
  logMobileDebug('Final tenant value', { finalTenant: tenant });
  return tenant;
}