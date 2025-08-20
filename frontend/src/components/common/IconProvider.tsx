import { useEffect, type ReactNode } from 'react';
import { reinitializeIconsDelayed } from '../../utils/iconUtils';

interface IconProviderProps {
  children: ReactNode;
  delay?: number;
}

/**
 * IconProvider component that reinitializes Lucide icons for its children
 * Use this to wrap components that contain icons that need to be reinitialized
 */
export const IconProvider: React.FC<IconProviderProps> = ({ 
  children, 
  delay = 50 
}) => {
  useEffect(() => {
    reinitializeIconsDelayed(delay);
  }, [delay]);

  return <>{children}</>;
};






