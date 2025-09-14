import { apiRequest, type ApiResponse } from './api';
import { getAuthHeaders } from '../config/api';
import type { 
  Order, 
  OrderFilters, 
  OrderStatistics, 
  PaginatedResponse
} from '../types/order';

// Re-export types for convenience
export type { Order, OrderFilters, OrderStatistics };

class OrderService {
  /**
   * Get all orders with optional filters
   */
  async getOrders(filters: OrderFilters = {}, token?: string): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('filter[status]', filters.status);
    if (filters.payment_status) params.append('filter[payment_status]', filters.payment_status);
    if (filters.payment_method) params.append('filter[payment_method]', filters.payment_method);
    if (filters.customer_id) params.append('filter[customer_id]', filters.customer_id.toString());
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/api/orders?${queryString}` : '/api/orders';
    
    const response = await apiRequest<{ data: Order[]; meta: { pagination: any } }>(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    console.log('🔍 Raw API response:', response);
    
    // Transform the response to match our PaginatedResponse interface
    if (response.data && response.meta) {
      const pagination = response.meta.pagination as any || {};
      const result = {
        data: response.data.data || response.data,
        meta: {
          current_page: pagination.current_page || 1,
          last_page: pagination.last_page || 1,
          per_page: pagination.per_page || 15,
          total: pagination.total || 0,
          from: pagination.from || 0,
          to: pagination.to || 0,
          pagination: {
            current_page: pagination.current_page || 1,
            last_page: pagination.last_page || 1,
            per_page: pagination.per_page || 15,
            total: pagination.total || 0,
            from: pagination.from || 0,
            to: pagination.to || 0,
          }
        },
        links: {
          first: '',
          last: '',
        }
      } as PaginatedResponse<Order>;
      
      console.log('🔍 Transformed response:', result);
      return result;
    }
    
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0, from: 0, to: 0 }, links: { first: '', last: '' } };
  }

  /**
   * Get recent orders (last 5 orders)
   */
  async getRecentOrders(token?: string): Promise<Order[]> {
    try {
      const response = await this.getOrders({
        per_page: 5,
        sort_by: 'created_at',
        sort_order: 'desc'
      }, token);
      
      console.log('🔍 Orders API response:', response);
      
      // The response should now be a PaginatedResponse with data array
      if (response && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('⚠️ Unexpected orders response structure:', response);
        return [];
      }
    } catch (error) {
      console.error('❌ Error in getRecentOrders:', error);
      return [];
    }
  }

  /**
   * Get a specific order by ID
   */
  async getOrder(id: number, token?: string): Promise<ApiResponse<Order>> {
    return apiRequest<Order>(`/api/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  /**
   * Get order statistics
   */
  async getStatistics(token?: string): Promise<ApiResponse<OrderStatistics>> {
    return apiRequest<OrderStatistics>('/api/orders/statistics', {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  /**
   * Get order statistics (alias for getStatistics)
   */
  async getOrderStatistics(_filters: any = {}, token?: string): Promise<ApiResponse<OrderStatistics>> {
    return this.getStatistics(token);
  }

  /**
   * Format order for display
   */
  formatOrderForDisplay(order: Order): any {
    console.log('🔍 Formatting order for display:', order);
    
    const formattedOrder = {
      ...order,
      // Map snake_case to camelCase for frontend compatibility
      orderId: order.order_id || order.id?.toString() || 'Unknown',
      formattedTotal: this.formatCurrency(order.total || 0),
      formattedDate: this.formatDate(order.created_at),
      statusText: this.getStatusText(order.status),
      paymentStatusText: this.getPaymentStatusText(order.payment_status),
      customerName: order.customer?.name || 'Unknown Customer',
      customerEmail: order.customer?.email || '',
      productCount: order.orderItems?.length || 0,
      primaryProduct: order.orderItems?.[0]?.product?.name || 'Multiple Items',
      // Map customer data
      customer: {
        name: order.customer?.name || 'Unknown Customer',
        email: order.customer?.email || '',
        avatar: order.customer?.avatar || this.getDefaultAvatar(order.customer?.name || 'Customer')
      },
      // Map status fields
      paymentStatus: this.getPaymentStatusText(order.payment_status),
      orderStatus: this.getStatusText(order.status),
      // Map payment method
      paymentMethod: {
        type: order.payment_method || 'Unknown',
        icon: this.getPaymentMethodIcon(order.payment_method || ''),
        details: order.payment_method || 'Unknown'
      },
      // Map date fields
      date: this.formatDate(order.created_at),
      time: this.formatTime(order.created_at)
    };
    
    console.log('🔍 Formatted order:', formattedOrder);
    return formattedOrder;
  }

  /**
   * Format currency
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Format date
   */
  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get status text
   */
  private getStatusText(status: string): string {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get payment status text
   */
  private getPaymentStatusText(paymentStatus: string): string {
    switch (paymentStatus) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get default avatar URL
   */
  private getDefaultAvatar(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=40`;
  }

  /**
   * Get payment method icon
   */
  private getPaymentMethodIcon(paymentMethod: string): string {
    switch (paymentMethod.toLowerCase()) {
      case 'credit_card':
      case 'visa':
      case 'mastercard':
        return 'ti ti-credit-card';
      case 'paypal':
        return 'ti ti-brand-paypal';
      case 'stripe':
        return 'ti ti-brand-stripe';
      case 'cash':
        return 'ti ti-currency-dollar';
      case 'bank_transfer':
        return 'ti ti-building-bank';
      default:
        return 'ti ti-credit-card';
    }
  }

  /**
   * Format time
   */
  private formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: Partial<Order>, token?: string): Promise<ApiResponse<Order>> {
    return apiRequest<Order>('/api/orders', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Update an order
   */
  async updateOrder(id: number, orderData: Partial<Order>, token?: string): Promise<ApiResponse<Order>> {
    return apiRequest<Order>(`/api/orders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Delete an order
   */
  async deleteOrder(id: number, token?: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/api/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  }

  /**
   * Bulk delete orders
   */
  async bulkDeleteOrders(orderIds: number[], token?: string): Promise<ApiResponse<{ deleted_count: number }>> {
    return apiRequest<{ deleted_count: number }>('/api/orders/bulk-delete', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ order_ids: orderIds }),
    });
  }
}

export const orderService = new OrderService();