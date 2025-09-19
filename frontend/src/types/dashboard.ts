export interface DashboardStatistics {
  total_sales: {
    current: number;
    previous: number;
    growth: number;
    formatted: string;
  };
  total_orders: {
    current: number;
    previous: number;
    growth: number;
    formatted: string;
  };
  new_customers: {
    current: number;
    previous: number;
    growth: number;
    formatted: string;
  };
  revenue: {
    current: number;
    previous: number;
    growth: number;
    formatted: string;
  };
  additional_stats: {
    total_products: number;
    active_products: number;
    total_customers: number;
    total_orders_all_time: number;
  };
}

export interface DashboardApiResponse {
  success: boolean;
  data: DashboardStatistics;
}

export interface DashboardCardData {
  title: string;
  value: string;
  subtitle: string;
  badge: {
    text: string;
    color: string;
  };
  chartData: {
    target: number;
    current: number;
  };
  growth?: {
    value: number;
    isPositive: boolean;
  };
}












