import { apiRequest } from './api';
import { API_CONFIG, getAuthHeaders } from '../config/api';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  store_id: number;
  status: 'active' | 'inactive' | 'vip';
  total_orders: number;
  total_spent: number;
  join_date: string;
  created_at: string;
  updated_at: string;
  store?: {
    id: number;
    name: string;
    domain: string;
  };
  orders?: Array<{
    id: number;
    order_id: string;
    status: string;
    total: number;
    created_at: string;
  }>;
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  store_id?: number;
  from?: string;
  to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CustomerStatistics {
  total_customers: number;
  active_customers: number;
  vip_customers: number;
  inactive_customers: number;
  new_this_month: number;
  top_spenders: Array<{
    id: string;
    name: string;
    total_spent: number;
  }>;
  top_orderers: Array<{
    id: string;
    name: string;
    total_orders: number;
  }>;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  store_id: number;
  status?: 'active' | 'inactive' | 'vip';
  join_date?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'vip';
  join_date?: string;
}

// Customer Service
export const customerService = {
  // Get all customers with filters
  async getCustomers(filters: CustomerFilters = {}, token?: string): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.store_id) params.append('store_id', filters.store_id.toString());
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const queryString = params.toString();
    const url = queryString ? `${API_CONFIG.ENDPOINTS.CUSTOMERS}?${queryString}` : API_CONFIG.ENDPOINTS.CUSTOMERS;
    
    return apiRequest<Customer[]>(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Get single customer
  async getCustomer(id: string, token?: string): Promise<any> {
    return apiRequest<Customer>(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Create new customer
  async createCustomer(customerData: CreateCustomerRequest, token?: string): Promise<any> {
    return apiRequest<Customer>(API_CONFIG.ENDPOINTS.CUSTOMERS, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(customerData),
    });
  },

  // Update customer
  async updateCustomer(id: string, customerData: UpdateCustomerRequest, token?: string): Promise<any> {
    return apiRequest<Customer>(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(customerData),
    });
  },

  // Delete customer
  async deleteCustomer(id: string, token?: string): Promise<any> {
    return apiRequest(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  },

  // Get customer statistics
  async getCustomerStatistics(token?: string): Promise<any> {
    return apiRequest<CustomerStatistics>(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/statistics`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Bulk delete customers
  async bulkDeleteCustomers(customerIds: string[], token?: string): Promise<any> {
    return apiRequest(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/bulk-delete`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ customer_ids: customerIds }),
    });
  },
};
