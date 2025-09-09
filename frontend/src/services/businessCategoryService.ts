import { apiRequest } from './api';
import { API_CONFIG, getAuthHeaders } from '../config/api';
import type { BusinessCategory } from '../types/businessCategory';

// Business Category Service
export const businessCategoryService = {
  // Get all business categories
  async getCategories(token?: string): Promise<{ data: BusinessCategory[] }> {
    return apiRequest<{ data: BusinessCategory[] }>(API_CONFIG.ENDPOINTS.BUSINESS_CATEGORIES, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Create or get existing business category
  async createCategory(name: string, description?: string, token?: string): Promise<{ data: BusinessCategory }> {
    return apiRequest<{ data: BusinessCategory }>(API_CONFIG.ENDPOINTS.BUSINESS_CATEGORIES, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        name,
        description,
      }),
    });
  },

  // Get category by ID
  async getCategory(id: number, token?: string): Promise<{ data: BusinessCategory }> {
    return apiRequest<{ data: BusinessCategory }>(`${API_CONFIG.ENDPOINTS.BUSINESS_CATEGORIES}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },
};

// Re-export types for convenience
export type { BusinessCategory } from '../types/businessCategory';







