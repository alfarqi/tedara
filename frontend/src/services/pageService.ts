import { apiRequest, type ApiResponse } from './api';
import type { 
  Page, 
  CreatePageRequest, 
  PageFilters, 
  PageStatistics,
  PaginatedResponse 
} from '../types/page';

class PageService {
  private baseUrl = '/api/pages';

  /**
   * Get all pages with optional filters
   */
  async getPages(filters: PageFilters = {}, token?: string): Promise<PaginatedResponse<Page>> {
    const params = new URLSearchParams();
    
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.language && filters.language !== 'all') {
      params.append('language', filters.language);
    }
    if (filters.show_in_footer !== undefined) {
      params.append('show_in_footer', filters.show_in_footer.toString());
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.per_page) {
      params.append('per_page', filters.per_page.toString());
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    const response = await apiRequest<{ data: Page[]; meta: any; links: any }>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Transform the response to match PaginatedResponse format
    return {
      data: response.data?.data || response.data || [],
      meta: response.data?.meta || response.meta || {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: null,
        to: null
      },
      links: response.data?.links || {
        first: '',
        last: '',
        prev: null,
        next: null
      }
    } as PaginatedResponse<Page>;
  }

  /**
   * Get a specific page by ID
   */
  async getPage(id: number, token?: string): Promise<ApiResponse<Page>> {
    return apiRequest<Page>(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create a new page
   */
  async createPage(pageData: CreatePageRequest, token?: string): Promise<ApiResponse<Page>> {
    return apiRequest<Page>(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });
  }

  /**
   * Update an existing page
   */
  async updatePage(id: number, pageData: Partial<CreatePageRequest>, token?: string): Promise<ApiResponse<Page>> {
    return apiRequest<Page>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });
  }

  /**
   * Delete a page
   */
  async deletePage(id: number, token?: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Toggle page status (active/inactive)
   */
  async togglePageStatus(id: number, token?: string): Promise<ApiResponse<Page>> {
    return apiRequest<Page>(`${this.baseUrl}/${id}/toggle-status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get page statistics
   */
  async getStatistics(token?: string): Promise<ApiResponse<PageStatistics>> {
    return apiRequest<PageStatistics>(`${this.baseUrl}/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get public pages for a store (no authentication required)
   */
  async getPublicPages(storeSlug: string, filters: { show_in_footer?: boolean; language?: string } = {}): Promise<ApiResponse<Page[]>> {
    const params = new URLSearchParams();
    
    if (filters.show_in_footer !== undefined) {
      params.append('show_in_footer', filters.show_in_footer.toString());
    }
    if (filters.language) {
      params.append('language', filters.language);
    }

    const queryString = params.toString();
    const url = queryString 
      ? `/public/stores/${storeSlug}/pages?${queryString}` 
      : `/public/stores/${storeSlug}/pages`;

    return apiRequest<Page[]>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get a specific public page by SEO URL (no authentication required)
   */
  async getPublicPage(storeSlug: string, seoUrl: string): Promise<ApiResponse<Page>> {
    return apiRequest<Page>(`/public/stores/${storeSlug}/pages/${seoUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate SEO URL from title
   */
  generateSeoUrl(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }

  /**
   * Validate SEO URL format
   */
  isValidSeoUrl(url: string): boolean {
    const regex = /^[a-z0-9\-]+$/;
    return regex.test(url) && url.length > 0 && url.length <= 255;
  }

  /**
   * Format page content for display
   */
  formatPageContent(content: string): string {
    // Basic HTML sanitization and formatting
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, ''); // Remove iframe tags
  }

  /**
   * Extract plain text from HTML content
   */
  extractPlainText(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  /**
   * Generate page preview text
   */
  generatePreview(content: string, maxLength: number = 150): string {
    const plainText = this.extractPlainText(content);
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  }
}

export const pageService = new PageService();
