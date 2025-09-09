import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from './useUserStore';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link: string;
  icon: string;
  subSteps: {
    completed: number;
    total: number;
  };
}

export const useOnboardingProgress = () => {
  const { user } = useAuth();
  const { store } = useUserStore();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    // Define the onboarding steps with sub-step progress
    const onboardingSteps: OnboardingStep[] = [
      {
        id: 'store-info',
        title: 'Store Information',
        description: 'Add basic store details',
        completed: !!(store?.name && store?.description),
        link: '/store-settings',
        icon: 'ti ti-store',
        subSteps: {
          completed: store?.name && store?.description ? 3 : (store?.name ? 2 : 1),
          total: 3 // Store name, description, logo
        }
      },
      {
        id: 'first-product',
        title: 'First Product',
        description: 'Add your first product',
        completed: false, // TODO: Check if products exist
        link: '/products/create',
        icon: 'ti ti-package',
        subSteps: {
          completed: 0, // TODO: Check product creation progress
          total: 2 // Product details, product images
        }
      },
      {
        id: 'shipping-options',
        title: 'Shipping Options',
        description: 'Configure shipping methods',
        completed: false, // TODO: Check shipping configuration
        link: '/store-settings/shipping',
        icon: 'ti ti-truck',
        subSteps: {
          completed: 0, // TODO: Check shipping setup progress
          total: 1 // Basic shipping configuration
        }
      },
      {
        id: 'payment-options',
        title: 'Payment Options',
        description: 'Set up payment methods',
        completed: false, // TODO: Check payment configuration
        link: '/store-settings/payments',
        icon: 'ti ti-credit-card',
        subSteps: {
          completed: 0, // TODO: Check payment setup progress
          total: 3 // Payment gateway, currency, tax settings
        }
      },
      {
        id: 'theme-design',
        title: 'Theme & Design',
        description: 'Customize store appearance',
        completed: false, // TODO: Check theme configuration
        link: '/store-settings/design',
        icon: 'ti ti-palette',
        subSteps: {
          completed: 0, // TODO: Check theme setup progress
          total: 2 // Theme selection, customization
        }
      }
    ];

    setSteps(onboardingSteps);
    setCompletedSteps(onboardingSteps.filter(step => step.completed).length);
  }, [store, user]);

  const totalSteps = steps.length;
  const isOnboardingComplete = completedSteps === totalSteps;
  const shouldShowOnboarding = user?.role === 'store_owner' && !isOnboardingComplete;

  return {
    steps,
    completedSteps,
    totalSteps,
    isOnboardingComplete,
    shouldShowOnboarding
  };
};
