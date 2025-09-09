import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

// Types for API responses
export interface ApiResponse<T = any> {
  data?: T;
  meta?: {
    message: string;
    status: string;
    errors?: Record<string, string[]>;
    pagination?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

// For authentication responses, the data is returned directly
export type AuthApiResponse<T = any> = T;

// Re-export types for backward compatibility
export type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

// Generic API request function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { useDefaultHeaders?: boolean } = {}
): Promise<ApiResponse<T>> {
  const url = getApiUrl(endpoint);
  
  
  const { useDefaultHeaders = true, ...requestOptions } = options;
  
  const config: RequestInit = {
    ...requestOptions,
    headers: useDefaultHeaders 
      ? {
          ...API_CONFIG.DEFAULT_HEADERS,
          ...options.headers,
        }
      : options.headers || {},
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle validation errors (422)
      if (response.status === 422 && errorData.errors) {
        const errorMessages = Object.values(errorData.errors)
          .flat()
          .join(', ');
        throw new Error(errorMessages || 'Validation failed');
      }
      
      // Handle authentication errors (401)
      if (response.status === 401) {
        throw new Error('Invalid credentials');
      }
      
      // Handle other errors
      throw new Error(errorData.meta?.message || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Laravel returns data in the correct format already
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

// Authentication API service
export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiRequest<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register user
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    
    try {
      const result = await apiRequest<RegisterResponse>(API_CONFIG.ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logout(token: string): Promise<ApiResponse> {
    return apiRequest(API_CONFIG.ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
  },

  // Get current user
  async getCurrentUser(token: string): Promise<ApiResponse> {
    return apiRequest(API_CONFIG.ENDPOINTS.ME, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Refresh token
  async refreshToken(token: string): Promise<ApiResponse<{ token: string }>> {
    return apiRequest<{ token: string }>(API_CONFIG.ENDPOINTS.REFRESH, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
  },

  // Change password
  async changePassword(
    token: string,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ): Promise<ApiResponse> {
    return apiRequest(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      }),
    });
  },

  // Register store for existing user
  async registerStore(token: string, storeData: any): Promise<ApiResponse> {
    return apiRequest(API_CONFIG.ENDPOINTS.REGISTER_STORE, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(storeData),
    });
  },
};

// Generic API service for other endpoints
export const api = {
  // Generic GET request
  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Generic POST request
  async post<T>(endpoint: string, data: any, token?: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
  },

  // Generic PUT request
  async put<T>(endpoint: string, data: any, token?: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
  },

  // Generic DELETE request
  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  },
};
