import { apiRequest } from './api';
import { getAuthHeaders } from '../config/api';
import type { 
  QuestionRating, 
  QuestionRatingStatistics, 
  QuestionRatingFilters, 
  PaginatedResponse, 
  ApiResponse,
  Reply,
  CreateReplyRequest,
  UpdateReplyRequest
} from '../types/questionRating';

class QuestionRatingService {
  /**
   * Get all questions and ratings with optional filters
   */
  async getQuestionsRatings(filters: QuestionRatingFilters = {}, token?: string): Promise<PaginatedResponse<QuestionRating>> {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.product_id) params.append('product_id', filters.product_id.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.rating) params.append('rating', filters.rating.toString());
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.has_reply !== undefined) params.append('has_reply', filters.has_reply.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/api/questions-ratings?${queryString}` : '/api/questions-ratings';
    
    const response = await apiRequest<PaginatedResponse<QuestionRating>>(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return response.data || { success: true, data: [], pagination: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
  }

  /**
   * Get a specific question or rating by ID
   */
  async getQuestionRating(id: number, token?: string): Promise<ApiResponse<QuestionRating>> {
    const response = await apiRequest<ApiResponse<QuestionRating>>(`/api/questions-ratings/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return response.data || { success: false, data: {} as QuestionRating };
  }

  /**
   * Create a new question or rating
   */
  async createQuestionRating(data: {
    type: 'question' | 'rating';
    content: string;
    rating?: number;
    product_id?: number;
    store_id: number;
  }, token?: string): Promise<ApiResponse<QuestionRating>> {
    const response = await apiRequest<ApiResponse<QuestionRating>>('/api/questions-ratings', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return response.data || { success: false, data: {} as QuestionRating };
  }

  /**
   * Update a question or rating
   */
  async updateQuestionRating(id: number, data: {
    content?: string;
    rating?: number;
    status?: 'published' | 'unpublished';
  }, token?: string): Promise<ApiResponse<QuestionRating>> {
    const response = await apiRequest<ApiResponse<QuestionRating>>(`/api/questions-ratings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return response.data || { success: false, data: {} as QuestionRating };
  }

  /**
   * Delete a question or rating
   */
  async deleteQuestionRating(id: number, token?: string): Promise<ApiResponse<void>> {
    const response = await apiRequest<ApiResponse<void>>(`/api/questions-ratings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return response.data || { success: false, data: undefined };
  }

  /**
   * Get statistics for questions and ratings
   */
  async getStatistics(token?: string): Promise<ApiResponse<QuestionRatingStatistics>> {
    const response = await apiRequest<ApiResponse<QuestionRatingStatistics>>('/api/questions-ratings/statistics', {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return response.data || { success: false, data: {} as QuestionRatingStatistics };
  }

  /**
   * Bulk update status of questions and ratings
   */
  async bulkUpdateStatus(ids: number[], status: 'published' | 'unpublished', token?: string): Promise<ApiResponse<{ updated_count: number }>> {
    const response = await apiRequest<ApiResponse<{ updated_count: number }>>('/api/questions-ratings/bulk-update-status', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ ids, status }),
    });
    return response.data || { success: false, data: { updated_count: 0 } };
  }

  /**
   * Bulk delete questions and ratings
   */
  async bulkDelete(ids: number[], token?: string): Promise<ApiResponse<{ deleted_count: number }>> {
    const response = await apiRequest<ApiResponse<{ deleted_count: number }>>('/api/questions-ratings/bulk-delete', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ ids }),
    });
    return response.data || { success: false, data: { deleted_count: 0 } };
  }

  /**
   * Get questions and ratings for a specific product
   */
  async getProductQuestionsRatings(productId: number, filters: Omit<QuestionRatingFilters, 'product_id'> = {}, token?: string): Promise<PaginatedResponse<QuestionRating>> {
    return this.getQuestionsRatings({ ...filters, product_id: productId }, token);
  }

  /**
   * Get only questions
   */
  async getQuestions(filters: Omit<QuestionRatingFilters, 'type'> = {}, token?: string): Promise<PaginatedResponse<QuestionRating>> {
    return this.getQuestionsRatings({ ...filters, type: 'question' }, token);
  }

  /**
   * Get only ratings
   */
  async getRatings(filters: Omit<QuestionRatingFilters, 'type'> = {}, token?: string): Promise<PaginatedResponse<QuestionRating>> {
    return this.getQuestionsRatings({ ...filters, type: 'rating' }, token);
  }

  /**
   * Get published questions and ratings
   */
  async getPublished(filters: Omit<QuestionRatingFilters, 'status'> = {}, token?: string): Promise<PaginatedResponse<QuestionRating>> {
    return this.getQuestionsRatings({ ...filters, status: 'published' }, token);
  }

  /**
   * Get unpublished questions and ratings
   */
  async getUnpublished(filters: Omit<QuestionRatingFilters, 'status'> = {}, token?: string): Promise<PaginatedResponse<QuestionRating>> {
    return this.getQuestionsRatings({ ...filters, status: 'unpublished' }, token);
  }

  // Reply methods

  /**
   * Get replies for a specific question/rating
   */
  async getReplies(questionRatingId: number, token?: string): Promise<ApiResponse<Reply[]>> {
    const response = await apiRequest<ApiResponse<Reply[]>>(`/api/questions-ratings/${questionRatingId}/replies`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return response.data || { success: false, data: [] };
  }

  /**
   * Create a new reply
   */
  async createReply(replyData: CreateReplyRequest, token?: string): Promise<ApiResponse<Reply>> {
    const response = await apiRequest<ApiResponse<Reply>>('/api/replies', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(replyData),
    });
    return response.data || { success: false, data: {} as Reply };
  }

  /**
   * Get a specific reply
   */
  async getReply(id: number, token?: string): Promise<ApiResponse<Reply>> {
    const response = await apiRequest<ApiResponse<Reply>>(`/api/replies/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return response.data || { success: false, data: {} as Reply };
  }

  /**
   * Update a reply
   */
  async updateReply(id: number, replyData: UpdateReplyRequest, token?: string): Promise<ApiResponse<Reply>> {
    const response = await apiRequest<ApiResponse<Reply>>(`/api/replies/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(replyData),
    });
    return response.data || { success: false, data: {} as Reply };
  }

  /**
   * Delete a reply
   */
  async deleteReply(id: number, token?: string): Promise<ApiResponse<void>> {
    const response = await apiRequest<ApiResponse<void>>(`/api/replies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return response.data || { success: false, data: undefined };
  }
}

export const questionRatingService = new QuestionRatingService();
export default questionRatingService;