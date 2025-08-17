import { useEffect } from 'react';
import { reinitializeIconsDelayed } from '../utils/iconUtils';

export const useIconInitialization = () => {
  useEffect(() => {
    // Reinitialize icons when component mounts
    reinitializeIconsDelayed(50);
  }, []);
};
