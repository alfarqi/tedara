import { apiRequest } from './api';
import { getAuthHeaders } from '../config/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: string | number;
  original_price: string | number | null;
  stock: number;
  category_id: number;
  store_id: number;
  status: string;
  brand: string;
  weight: string | number;
  dimensions: string | null;
  rating: string | number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  images?: string[];
  tags?: string[];
  category?: {
    id: number;
    name: string;
    description?: string;
    parent_id?: number | null;
    store_id: number;
    image?: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
  };
}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  status?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ProductStatistics {
  total_products: number;
  active_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_value: number;
  average_price: number;
}

class ProductService {
  private baseUrl = '/api/products';

  async getProducts(filters: ProductFilters = {}, token?: string) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const url = `${this.baseUrl}?${params.toString()}`;
    return apiRequest(url, {
      method: 'GET',
      headers: token ? getAuthHeaders(token) : undefined,
    });
  }

  async getProduct(id: number, token?: string) {
    return apiRequest(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: token ? getAuthHeaders(token) : undefined,
    });
  }

  async createProduct(productData: Partial<Product>, token?: string) {
    return apiRequest(this.baseUrl, {
      method: 'POST',
      headers: token ? getAuthHeaders(token) : undefined,
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: number, productData: Partial<Product>, token?: string) {
    return apiRequest(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: token ? getAuthHeaders(token) : undefined,
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number, token?: string) {
    return apiRequest(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: token ? getAuthHeaders(token) : undefined,
    });
  }

  async bulkDeleteProducts(productIds: number[], token?: string) {
    return apiRequest(`${this.baseUrl}/bulk-delete`, {
      method: 'POST',
      headers: token ? getAuthHeaders(token) : undefined,
      body: JSON.stringify({ product_ids: productIds }),
    });
  }

  async getStatistics(token?: string) {
    return apiRequest(`${this.baseUrl}/statistics`, {
      method: 'GET',
      headers: token ? getAuthHeaders(token) : undefined,
    });
  }

  // Helper function to format product for display
  formatProductForDisplay(product: Product) {
    // Handle images field - it's stored as JSON array in database
    let imageUrl = '';
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = product.images[0];
    }

    // Convert string prices to numbers for calculations
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const originalPrice = product.original_price ? 
      (typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price) : 
      null;

    return {
      id: product.id,
      productName: product.name,
      basePrice: price.toString(),
      originalPrice: originalPrice ? originalPrice.toString() : '',
      stock: product.stock.toString(),
      category: product.category?.name || 'Uncategorized',
      image: imageUrl,
      rating: typeof product.rating === 'string' ? parseFloat(product.rating) : (product.rating || 0),
      reviews: product.reviews_count || 0,
      discount: originalPrice && originalPrice > price 
        ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`
        : 'NEW',
      discountType: 'percentage',
      description: product.description,
      sku: product.sku,
      brand: product.brand,
      weight: product.weight,
      dimensions: product.dimensions,
      status: product.status
    };
  }
}

export const productService = new ProductService();
