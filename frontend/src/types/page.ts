export interface Page {
  id: number;
  store_id: number;
  title: string;
  content: string;
  status: 'active' | 'inactive';
  seo_title: string;
  seo_url: string;
  seo_description: string;
  show_in_footer: boolean;
  language: 'EN' | 'AR';
  created_at: string;
  updated_at: string;
}

export interface CreatePageRequest {
  title: string;
  content: string;
  status?: 'active' | 'inactive';
  seo_title?: string;
  seo_url: string;
  seo_description?: string;
  show_in_footer?: boolean;
  language?: 'EN' | 'AR';
}

export interface UpdatePageRequest extends Partial<CreatePageRequest> {
  id: number;
}

export interface PageFilters {
  status?: 'all' | 'active' | 'inactive';
  language?: 'all' | 'EN' | 'AR';
  show_in_footer?: boolean;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface PageStatistics {
  total_pages: number;
  active_pages: number;
  inactive_pages: number;
  footer_pages: number;
  pages_by_language: {
    EN: number;
    AR: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}









