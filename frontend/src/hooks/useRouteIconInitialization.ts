import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { reinitializeIconsDelayed } from '../utils/iconUtils';

/**
 * Hook that reinitializes Lucide icons whenever the route changes
 * This is specifically designed for React Router applications
 */
export const useRouteIconInitialization = (delay: number = 100) => {
  const location = useLocation();

  useEffect(() => {
    // Reinitialize icons when route changes
    reinitializeIconsDelayed(delay);
  }, [location.pathname, delay]);
};






