// Environment-based API configuration
const getBaseUrl = (): string => {
  // Check if we're in production (Netlify)
  if (import.meta.env.PROD) {
    const prodUrl = import.meta.env.VITE_API_URL || 'https://api.tedara.com/backend/public';
    console.log('🚀 Admin Production API URL:', prodUrl);
    return prodUrl;
  }
  
  // Development environment
  const devUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  console.log('🔧 Admin Development API URL:', devUrl);
  return devUrl;
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 30000, // 30 seconds
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    CHANGE_PASSWORD: '/api/auth/change-password',
    REGISTER_STORE: '/api/auth/register-store',
    
    // Business Categories
    BUSINESS_CATEGORIES: '/api/business-categories',
    
    // Stores
    STORES: '/api/stores',
    
    // Products
    PRODUCTS: '/api/products',
    
    // Orders
    ORDERS: '/api/orders',
    
    // Customers
    CUSTOMERS: '/api/customers',
    
    // Uploads
    UPLOADS: '/api/uploads',
    
    // Exports
    EXPORTS: '/api/export',
    
    // Notifications
    NOTIFICATIONS: '/api/notifications',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
