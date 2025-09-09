export interface Store {
  id: number;
  name: string;
  domain: string;
  owner_id: number;
  status: 'active' | 'inactive' | 'suspended';
  description?: string;
  category?: string;
  logo?: string;
  currency: string;
  language: string;
  timezone: string;
  settings?: {
    maintenance_mode: boolean;
    auto_backup: boolean;
    email_notifications: boolean;
    sms_notifications: boolean;
  };
  created_at: string;
  updated_at: string;
  owner?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface CreateStoreRequest {
  name: string;
  domain: string;
  description?: string;
  category?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  logo?: string;
  settings?: {
    maintenance_mode?: boolean;
    auto_backup?: boolean;
    email_notifications?: boolean;
    sms_notifications?: boolean;
  };
}

export interface UpdateStoreRequest {
  name?: string;
  domain?: string;
  description?: string;
  category?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  logo?: string;
  status?: 'active' | 'inactive' | 'suspended';
  settings?: {
    maintenance_mode?: boolean;
    auto_backup?: boolean;
    email_notifications?: boolean;
    sms_notifications?: boolean;
  };
}

export interface StoreFilters {
  search?: string;
  status?: string;
  currency?: string;
  language?: string;
  owner_id?: number;
  from?: string;
  to?: string;
  per_page?: number;
  page?: number;
}

export interface StoreStatistics {
  total_products: number;
  total_orders: number;
  total_customers: number;
  total_revenue: number;
  pending_orders: number;
  low_stock_products: number;
}
