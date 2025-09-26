// Environment-based API configuration for storefront
const getBaseUrl = (): string => {
  // Check if we're in production (Netlify)
  if (import.meta.env.PROD) {
    const prodUrl = import.meta.env.VITE_API_URL || 'http://api.tedara.com/backend/public';
    console.log('🚀 Storefront Production API URL:', prodUrl);
    return prodUrl;
  }
  
  // Development environment
  const devUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  console.log('🔧 Storefront Development API URL:', devUrl);
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
    // Storefront endpoints
    STOREFRONT: '/api/storefront',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get storefront API URL for a specific tenant
export const getStorefrontApiUrl = (tenantHandle: string, endpoint: string = ''): string => {
  return `${API_CONFIG.BASE_URL}/api/storefront/${tenantHandle}${endpoint}`;
};
