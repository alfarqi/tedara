// Onboarding Context for managing onboarding flow state
import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
// import { BUSINESS_TYPES } from '../types/onboarding.js';
import { storeService } from '../services/storeService';
import { useAuth } from './AuthContext';

// Define interfaces locally to avoid import issues
interface OnboardingData {
  step: number;
  shopName: string;
  storeLink: string;
  businessType: string;
  logo: File | null;
  logoPreview: string;
  isCompleted: boolean;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface OnboardingState {
  data: OnboardingData;
  steps: OnboardingStep[];
  isLoading: boolean;
  error: string | null;
}

interface OnboardingContextType extends OnboardingState {
  updateShopName: (name: string) => void;
  updateStoreLink: (link: string) => void;
  updateBusinessType: (type: string) => void;
  updateLogo: (file: File) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  completeOnboarding: (navigate?: (path: string, options?: { replace?: boolean }) => void) => Promise<void>;
  resetOnboarding: () => void;
}

// Initial state
const initialState: OnboardingState = {
  data: {
    step: 1,
    shopName: '',
    storeLink: '',
    businessType: '',
    logo: null,
    logoPreview: '',
    isCompleted: false
  },
  steps: [
    {
      id: 1,
      title: 'Shop Name',
      description: 'Enter your shop name',
      icon: 'ti ti-store',
      isCompleted: false,
      isActive: true
    },
    {
      id: 2,
      title: 'Business Type',
      description: 'Select your business category',
      icon: 'ti ti-category',
      isCompleted: false,
      isActive: false
    },
    {
      id: 3,
      title: 'Logo Upload',
      description: 'Upload your shop logo',
      icon: 'ti ti-photo',
      isCompleted: false,
      isActive: false
    },
    {
      id: 4,
      title: 'Processing',
      description: 'Creating your store',
      icon: 'ti ti-loader',
      isCompleted: false,
      isActive: false
    }
  ],
  isLoading: false,
  error: null
};

// Action types
type OnboardingAction =
  | { type: 'UPDATE_SHOP_NAME'; payload: string }
  | { type: 'UPDATE_STORE_LINK'; payload: string }
  | { type: 'UPDATE_BUSINESS_TYPE'; payload: string }
  | { type: 'UPDATE_LOGO'; payload: { file: File; preview: string } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_ONBOARDING' };

// Reducer
function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'UPDATE_SHOP_NAME':
      return {
        ...state,
        data: {
          ...state.data,
          shopName: action.payload
        },
        steps: state.steps.map(step => 
          step.id === 1 
            ? { ...step, isCompleted: action.payload.length > 0 }
            : step
        )
      };

    case 'UPDATE_STORE_LINK':
      return {
        ...state,
        data: {
          ...state.data,
          storeLink: action.payload
        }
      };

    case 'UPDATE_BUSINESS_TYPE':
      return {
        ...state,
        data: {
          ...state.data,
          businessType: action.payload
        },
        steps: state.steps.map(step => 
          step.id === 2 
            ? { ...step, isCompleted: action.payload.length > 0 }
            : step
        )
      };

    case 'UPDATE_LOGO':
      return {
        ...state,
        data: {
          ...state.data,
          logo: action.payload.file,
          logoPreview: action.payload.preview
        },
        steps: state.steps.map(step => 
          step.id === 3 
            ? { ...step, isCompleted: true }
            : step
        )
      };



    case 'NEXT_STEP':
      if (state.data.step < 4) {
        const newStep = state.data.step + 1;
        return {
          ...state,
          data: {
            ...state.data,
            step: newStep
          },
          steps: state.steps.map(step => ({
            ...step,
            isActive: step.id === newStep,
            isCompleted: step.id < newStep
          }))
        };
      }
      return state;

    case 'PREVIOUS_STEP':
      if (state.data.step > 1) {
        const newStep = state.data.step - 1;
        return {
          ...state,
          data: {
            ...state.data,
            step: newStep
          },
          steps: state.steps.map(step => ({
            ...step,
            isActive: step.id === newStep,
            isCompleted: step.id < newStep
          }))
        };
      }
      return state;

    case 'GO_TO_STEP':
      if (action.payload >= 1 && action.payload <= 4) {
        return {
          ...state,
          data: {
            ...state.data,
            step: action.payload
          },
          steps: state.steps.map(step => ({
            ...step,
            isActive: step.id === action.payload,
            isCompleted: step.id < action.payload
          }))
        };
      }
      return state;

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'RESET_ONBOARDING':
      return initialState;

    default:
      return state;
  }
}

// Create context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Provider component
interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  
  // Safely get auth context with error handling
  let user, token;
  try {
    const authContext = useAuth();
    user = authContext.user;
    token = authContext.token;
  } catch (error) {
    user = null;
    token = null;
  }
  


  // No localStorage persistence - onboarding data is session-only

  // No localStorage persistence - onboarding data is session-only

  const updateShopName = (name: string) => {
    dispatch({ type: 'UPDATE_SHOP_NAME', payload: name });
  };

  const updateStoreLink = (link: string) => {
    dispatch({ type: 'UPDATE_STORE_LINK', payload: link });
  };

  const updateBusinessType = (type: string) => {
    dispatch({ type: 'UPDATE_BUSINESS_TYPE', payload: type });
  };

  const updateLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      dispatch({ type: 'UPDATE_LOGO', payload: { file, preview } });
    };
    reader.readAsDataURL(file);
  };



  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const goToStep = (step: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  };

  const completeOnboarding = async (navigate?: (path: string, options?: { replace?: boolean }) => void) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      // Check if user is authenticated
      if (!user || !token) {
        throw new Error('User must be authenticated to complete onboarding');
      }

      // Prepare store data for API
      const storeData = {
        name: state.data.shopName,
        storeLink: state.data.storeLink,
        businessType: state.data.businessType,
        logo: state.data.logo || undefined,
        logoPreview: state.data.logoPreview,
      };

      // Debug logging
      console.log('Onboarding data being sent:', storeData);
      console.log('Shop name:', storeData.name);
      console.log('Store link:', storeData.storeLink);
      console.log('Business type:', storeData.businessType);

      // Check if required data is present
      if (!storeData.name || storeData.name.trim() === '') {
        throw new Error('Shop name is required to create store');
      }
      if (!storeData.businessType || storeData.businessType.trim() === '') {
        throw new Error('Business type is required to create store');
      }

      try {
        // Call the store service to create the store
        const response = await storeService.setupStore(storeData, token);
        
        // Check if store was created successfully (backend returns data directly)
        if (response.data && response.data.id) {
          // Store creation completed successfully
        } else {
          throw new Error(response.message || 'Failed to create store');
        }
      } catch (apiError) {
        throw new Error(
          apiError instanceof Error 
            ? apiError.message 
            : 'Failed to create store. Please try again.'
        );
      }

      // Mark onboarding as completed - clear the session flag
      sessionStorage.removeItem('new_registration');

      // Redirect immediately
      // Use passed navigate function
      if (navigate) {
        // Ensure user is authenticated before redirecting
        if (user && token) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/auth', { replace: true });
        }
      } else {
        // This should not happen as navigate function should always be provided
        throw new Error('Navigation function not available');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete onboarding';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const resetOnboarding = () => {
    dispatch({ type: 'RESET_ONBOARDING' });
  };

  const value: OnboardingContextType = {
    ...state,
    updateShopName,
    updateStoreLink,
    updateBusinessType,
    updateLogo,
    nextStep,
    previousStep,
    goToStep,
    completeOnboarding,
    resetOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook to use onboarding context
export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  
  return context;
};
