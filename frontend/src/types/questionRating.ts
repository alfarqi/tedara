export interface Reply {
  id: number;
  content: string;
  question_rating_id: number;
  user_id: number;
  status: 'published' | 'unpublished';
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface QuestionRating {
  id: number;
  type: 'question' | 'rating';
  content: string;
  rating?: number;
  user_id?: number;
  product_id?: number;
  store_id: number;
  status: 'published' | 'unpublished';
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  product?: {
    id: number;
    name: string;
  };
  store?: {
    id: number;
    name: string;
  };
  replies?: Reply[];
}

export interface QuestionRatingStatistics {
  total_questions: number;
  total_ratings: number;
  published_questions: number;
  published_ratings: number;
  unpublished_questions: number;
  unpublished_ratings: number;
  average_rating: number;
  recent_questions: number;
  recent_ratings: number;
}

export interface QuestionRatingFilters {
  type?: 'question' | 'rating' | 'store-rating' | 'product-rating' | 'shipping-rating' | 'blog';
  status?: 'published' | 'unpublished';
  product_id?: string | number;
  search?: string;
  rating?: string | number;
  date_from?: string;
  date_to?: string;
  has_reply?: boolean;
  per_page?: number;
  page?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface CreateReplyRequest {
  content: string;
  question_rating_id: number;
  status?: 'published' | 'unpublished';
}

export interface UpdateReplyRequest {
  content: string;
  status?: 'published' | 'unpublished';
}
