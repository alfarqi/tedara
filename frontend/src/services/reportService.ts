import { apiRequest } from './api';
import { API_CONFIG, getAuthHeaders } from '../config/api';

export interface SalesReport {
  id: string;
  date: string;
  orders: number;
  refunds: number;
  avgRevenuePerOrder: string;
  tax: string;
  revenue: string;
  balance: string;
}

export interface SalesReportResponse {
  daily_stats: SalesReport[];
  summary: {
    total_orders: number;
    total_revenue: number;
    total_tax: number;
    avg_order_value: number;
    completed_orders: number;
    pending_orders: number;
    cancelled_orders: number;
  };
  date_range: {
    from: string;
    to: string;
  };
}

export interface ProductReport {
  id: string;
  productName: string;
  sku: string;
  price: string;
  rating: number;
  reviews: number;
  views: string;
  orders: number;
  conversion: string;
  image: string;
}

export interface ProductReportResponse {
  products: ProductReport[];
  total_count: number;
  performance_filter: string;
}

export interface CustomerReport {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  last_order_date: string;
  status: string;
  join_date: string;
}

export interface CustomerReportResponse {
  customers: CustomerReport[];
  summary: {
    total_customers: number;
    active_customers: number;
    vip_customers: number;
    total_revenue: number;
    avg_customer_value: number;
    new_customers_this_month: number;
  };
}

export interface VisitReport {
  id: number;
  date: string;
  visits: number;
  unique_visitors: number;
  page_views: number;
  bounce_rate: number;
  avg_session_duration: number;
}

export interface VisitReportResponse {
  visits: VisitReport[];
  summary: {
    total_visits: number;
    total_unique_visitors: number;
    avg_bounce_rate: number;
    avg_session_duration: number;
    trend: 'up' | 'down';
  };
}

export interface TrendingProduct {
  id: string;
  productName: string;
  sku: string;
  price: string;
  trending_score: number;
  orders: number;
  views: string;
  category: string;
  image: string;
}

export interface TrendingProductResponse {
  trending_products: TrendingProduct[];
  total_count: number;
}

class ReportService {
  /**
   * Get sales reports with date filtering
   */
  async getSalesReports(fromDate?: string, toDate?: string, token?: string): Promise<SalesReportResponse> {
    const params = new URLSearchParams();
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);

    const response = await apiRequest(`/api/reports/sales?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    return response.data;
  }

  /**
   * Get product performance reports
   */
  async getProductReports(performanceFilter: string = 'All', token?: string): Promise<ProductReportResponse> {
    const params = new URLSearchParams();
    if (performanceFilter !== 'All') {
      params.append('performance_filter', performanceFilter);
    }

    const response = await apiRequest(`/api/reports/products?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    return response.data;
  }

  /**
   * Get customer analytics reports
   */
  async getCustomerReports(token?: string): Promise<CustomerReportResponse> {
    const response = await apiRequest('/api/reports/customers', {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    return response.data;
  }

  /**
   * Get visit analytics reports
   */
  async getVisitReports(token?: string): Promise<VisitReportResponse> {
    const response = await apiRequest('/api/reports/visits', {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    return response.data;
  }

  /**
   * Get most requested/trending products
   */
  async getTrendingProducts(token?: string): Promise<TrendingProductResponse> {
    const response = await apiRequest('/api/reports/most-requested', {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    return response.data;
  }

  /**
   * Export reports to CSV/Excel
   */
  async exportReport(reportType: string, filters?: any, token?: string): Promise<string> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const response = await apiRequest(`/api/export/${reportType}?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    return response.data.url;
  }
}

export const reportService = new ReportService();
