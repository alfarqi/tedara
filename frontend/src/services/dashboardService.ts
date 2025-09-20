import { apiRequest } from './api';
import { getAuthHeaders } from '../config/api';
import type { DashboardApiResponse } from '../types/dashboard';

class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getStatistics(token?: string): Promise<DashboardApiResponse> {
    try {
      const response = await apiRequest<DashboardApiResponse>('/api/dashboard/statistics', {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      
      console.log('🔍 Dashboard API raw response:', response);
      
      // The API returns { success: true, data: {...} } structure
      // So we should return response.data directly since it contains the DashboardApiResponse
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        return response.data as DashboardApiResponse;
      }
      
      // If response.data contains the statistics directly, wrap it
      if (response.data && 'total_sales' in response.data) {
        return {
          success: true,
          data: response.data as any
        };
      }
      
      // If the response itself has the correct structure, return it
      if (response && 'success' in response && 'data' in response) {
        return response as unknown as DashboardApiResponse;
      }
      
      // Last resort: return error response
      console.warn('⚠️ Dashboard API response format unexpected:', response);
      return { success: false, data: {} as any };
      
    } catch (error) {
      console.error('❌ Dashboard API error:', error);
      return { success: false, data: {} as any };
    }
  }
}

export const dashboardService = new DashboardService();
