export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  product?: {
    id: number;
    name: string;
    image?: string;
  };
}

export interface Order {
  id: number;
  order_id: string;
  customer_id: number;
  store_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  shipping_address?: any;
  shipping_cost: number;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  store?: {
    id: number;
    name: string;
  };
  orderItems?: OrderItem[];
}

export interface OrderFilters {
  search?: string;
  status?: string;
  payment_status?: string;
  payment_method?: string;
  customer_id?: number;
  from?: string;
  to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface OrderStatistics {
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  cancelled_orders: number;
  paid_orders: number;
  total_revenue: number;
  average_order_value: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

