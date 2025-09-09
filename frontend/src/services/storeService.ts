import { apiRequest } from './api';
import { API_CONFIG, getAuthHeaders } from '../config/api';
import type { 
  Store, 
  CreateStoreRequest, 
  UpdateStoreRequest, 
  StoreFilters, 
  StoreStatistics 
} from '../types/store';

// Store Service
export const storeService = {
  // Get all stores with filters
  async getStores(filters: StoreFilters = {}, token?: string): Promise<any> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = queryParams.toString() 
      ? `${API_CONFIG.ENDPOINTS.STORES}?${queryParams.toString()}`
      : API_CONFIG.ENDPOINTS.STORES;

    return apiRequest<{ data: Store[]; meta: any }>(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Get store by ID
  async getStore(id: number, token?: string): Promise<any> {
    return apiRequest<{ data: Store }>(`${API_CONFIG.ENDPOINTS.STORES}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Create new store
  async createStore(storeData: CreateStoreRequest, token?: string): Promise<any> {
    return apiRequest<{ data: Store }>(API_CONFIG.ENDPOINTS.STORES, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(storeData),
    });
  },

  // Update store
  async updateStore(id: number, storeData: UpdateStoreRequest, token?: string): Promise<any> {
    return apiRequest<{ data: Store }>(`${API_CONFIG.ENDPOINTS.STORES}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(storeData),
    });
  },

  // Delete store
  async deleteStore(id: number, token?: string): Promise<any> {
    return apiRequest(`${API_CONFIG.ENDPOINTS.STORES}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  },

  // Get store statistics
  async getStoreStatistics(id: number, token?: string): Promise<any> {
    return apiRequest<{ data: StoreStatistics }>(`${API_CONFIG.ENDPOINTS.STORES}/${id}/statistics`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Check domain availability
  async checkDomainAvailability(domain: string, token?: string): Promise<any> {
    const cleanDomain = this.sanitizeDomain(domain);
    
    return apiRequest('/api/stores/check-domain', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ domain: cleanDomain }),
    });
  },

  // Sanitize domain to remove spaces and invalid characters
  sanitizeDomain(domain: string): string {
    return domain
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .trim();
  },

  // Setup store (for onboarding)
  async setupStore(storeData: {
    name: string;
    storeLink: string;
    businessType: string;
    logo?: File;
    logoPreview?: string;
  }, token?: string): Promise<any> {
    // Generate a clean domain from storeLink
    let cleanDomain = this.sanitizeDomain(storeData.storeLink);
    
    // Ensure domain is not empty and has reasonable length
    if (!cleanDomain || cleanDomain.length < 3) {
      // Generate a unique domain based on store name and timestamp
      const nameBased = this.sanitizeDomain(storeData.name) || 'store';
      const timestamp = Date.now().toString().slice(-6);
      cleanDomain = `${nameBased}-${timestamp}`;
    }
    
    // Ensure domain is not too long (max 255 chars for database)
    if (cleanDomain.length > 250) {
      cleanDomain = cleanDomain.substring(0, 250);
    }
    
    // Final validation - ensure domain meets all requirements
    if (!/^[a-z0-9\-]+$/.test(cleanDomain) || cleanDomain.length < 3) {
      // Fallback to a guaranteed valid domain
      cleanDomain = `store-${Date.now().toString().slice(-6)}`;
    }
    
    // First, create the store without the logo
    const storePayload = {
      name: storeData.name,
      description: `Store specializing in ${storeData.businessType}`,
      category: storeData.businessType,
      domain: cleanDomain,
      currency: 'SAR',
      language: 'ar',
      timezone: 'Asia/Riyadh',
      status: 'active'
    };

    // Debug logging
    console.log('Store payload being sent:', storePayload);
    console.log('Clean domain:', cleanDomain);
    console.log('Original storeLink:', storeData.storeLink);

    // Create store with JSON payload
    let storeResponse;
    try {
      storeResponse = await apiRequest<Store>(API_CONFIG.ENDPOINTS.STORES, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(storePayload),
      });
    } catch (error: any) {
      console.error('Store creation error:', error);
      if (error.response?.data?.meta?.errors) {
        console.error('Validation errors:', error.response.data.meta.errors);
      }
      throw error;
    }

    // If logo is provided and store was created successfully, upload the logo
    if (storeData.logo && storeResponse.data) {
      try {
        const logoResponse = await this.uploadLogo(storeData.logo, token);
        
        // Update store with logo URL if upload was successful
        if (logoResponse.data && logoResponse.data.url) {
          // TODO: Update store with logo URL
        }
      } catch (logoError) {
        // Don't fail the whole process if logo upload fails
        // This is expected behavior - logo upload is optional
      }
    }

    return storeResponse;
  },

  // Upload store logo
  async uploadLogo(file: File, token?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'store');
    formData.append('folder', 'logos');

    return apiRequest<{ data: { url: string } }>(API_CONFIG.ENDPOINTS.UPLOADS, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - let browser set multipart/form-data
        'Accept': 'application/json',
      },
      // Disable default headers to prevent Content-Type: application/json
      useDefaultHeaders: false,
      body: formData,
    });
  },
};

// Re-export types for convenience
export type { Store, CreateStoreRequest, UpdateStoreRequest, StoreFilters, StoreStatistics } from '../types/store';
