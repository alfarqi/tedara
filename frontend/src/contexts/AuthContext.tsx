import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../services/api';
import type { LoginRequest, RegisterRequest, User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      const newState = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      return newState;
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await authApi.getCurrentUser(token);
          
          // Backend returns user data wrapped in 'user' property
          const responseData = response as any;
          if (responseData && responseData.user && responseData.user.id && responseData.user.email) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user: responseData.user, token },
            });
          } else {
            // Invalid token, clear it
            localStorage.removeItem('auth_token');
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authApi.login(credentials);
      
      // Cast response to handle the direct data structure
      const loginData = response as any;
      
      if (loginData && loginData.user && loginData.token) {
        const { user, token } = loginData;
        
        // Store token in localStorage
        localStorage.setItem('auth_token', token);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        throw new Error(loginData?.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authApi.register(userData);
      
      // Backend returns data directly, not wrapped in 'data' property
      const responseData = response as any;
      
      if (responseData && responseData.user && responseData.token) {
        const { user, token } = responseData;
        
        // Store token in localStorage
        localStorage.setItem('auth_token', token);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
        
        return { success: true };
      } else {
        const errorMessage = (response as any)?.message || 'Registration failed';
        
        // Don't dispatch AUTH_FAILURE for registration errors - just return the error
        dispatch({ type: 'SET_LOADING', payload: false });
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      // Handle validation errors properly
      let errorMessage = 'Registration failed';
      
      if (error instanceof Error) {
        // Check if it's a validation error (email already taken, etc.)
        if (error.message.includes('already been taken') || error.message.includes('Validation failed')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      // Don't dispatch AUTH_FAILURE for registration errors - just return the error
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (state.token) {
        await authApi.logout(state.token);
      }
    } catch (error) {
      // Logout error - continue with local cleanup
    } finally {
      // Clear token from localStorage
      localStorage.removeItem('auth_token');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!state.token) return;
    
    try {
      const response = await authApi.getCurrentUser(state.token);
      
      // Backend returns user data wrapped in 'user' property
      const responseData = response as any;
      if (responseData && responseData.user && responseData.user.id && responseData.user.email) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: responseData.user, token: state.token! },
        });
      }
    } catch (error) {
      // If refresh fails, logout the user
      await logout();
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    // In development, provide a fallback to prevent crashes during HMR
    if (process.env.NODE_ENV === 'development') {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: async () => {},
        register: async () => ({ success: false, error: 'Auth context not available' }),
        logout: async () => {},
        clearError: () => {},
        refreshUser: async () => {},
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
