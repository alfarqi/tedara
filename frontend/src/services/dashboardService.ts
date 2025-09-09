import { apiRequest } from './api';
import { getAuthHeaders } from '../config/api';
import type { DashboardApiResponse } from '../types/dashboard';

class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getStatistics(token?: string): Promise<DashboardApiResponse> {
    return apiRequest<DashboardApiResponse>('/api/dashboard/statistics', {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }
}

export const dashboardService = new DashboardService();
