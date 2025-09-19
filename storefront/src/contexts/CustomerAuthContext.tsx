import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTenant } from '../hooks/useTenant';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  store_id: number;
  status: string;
  total_orders: number;
  total_spent: number;
  join_date: string;
}

interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, storeId?: number) => Promise<boolean>;
  register: (data: RegisterData, storeId?: number) => Promise<boolean>;
  createGuest: (data: GuestData, storeId?: number) => Promise<Customer | null>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

interface GuestData {
  name: string;
  email: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

interface CustomerAuthProviderProps {
  children: ReactNode;
}

export const CustomerAuthProvider: React.FC<CustomerAuthProviderProps> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tenant = useTenant();
  
  // Debug logging
  React.useEffect(() => {
    console.log('CustomerAuthContext - Tenant value:', tenant);
  }, [tenant]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('customer_token');
    const storedCustomer = localStorage.getItem('customer_data');
    
    if (storedToken && storedCustomer) {
      try {
        const customerData = JSON.parse(storedCustomer);
        // Validate customer data has required fields
        if (customerData && customerData.id && customerData.email) {
          setToken(storedToken);
          setCustomer(customerData);
        } else {
          // Invalid customer data, clear it
          localStorage.removeItem('customer_token');
          localStorage.removeItem('customer_data');
        }
      } catch (error) {
        // Invalid JSON, clear it
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const clearError = () => setError(null);

  const login = async (email: string, password: string, storeId: number = 1): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!tenant) {
        console.error('Tenant is undefined. Current URL:', window.location.href);
        throw new Error('Store not found. Please check the URL.');
      }

      const response = await fetch(`http://localhost:8000/api/storefront/${tenant}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          store_id: storeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setCustomer(data.customer);
      setToken(data.token);
      
      // Store in localStorage
      localStorage.setItem('customer_token', data.token);
      localStorage.setItem('customer_data', JSON.stringify(data.customer));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData, storeId: number = 1): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!tenant) {
        console.error('Tenant is undefined. Current URL:', window.location.href);
        throw new Error('Store not found. Please check the URL.');
      }

      const response = await fetch(`http://localhost:8000/api/storefront/${tenant}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          store_id: storeId
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      setCustomer(responseData.customer);
      setToken(responseData.token);
      
      // Store in localStorage
      localStorage.setItem('customer_token', responseData.token);
      localStorage.setItem('customer_data', JSON.stringify(responseData.customer));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createGuest = async (data: GuestData, storeId: number = 1): Promise<Customer | null> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!tenant) {
        console.error('Tenant is undefined. Current URL:', window.location.href);
        throw new Error('Store not found. Please check the URL.');
      }

      const response = await fetch(`http://localhost:8000/api/storefront/${tenant}/auth/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          store_id: storeId
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create guest customer');
      }

      // For guest customers, we don't store the token or set as authenticated
      // They will be used for checkout only
      return responseData.customer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create guest customer';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_data');
  };

  const value: AuthContextType = {
    customer,
    token,
    isLoading,
    error,
    login,
    register,
    createGuest,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
