// API Product interface matching the backend response
export interface ApiProduct {
  id: number;
  tenant_id: string;
  name: string;
  description: string;
  sku: string;
  price: string | number;
  original_price: string | number | null;
  stock: number;
  category_id: number;
  store_id: number;
  status: string;
  images: string[];
  weight: string | number;
  dimensions: string | null;
  brand: string;
  tags: string[];
  rating: string | number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  is_active: number;
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

// Frontend Product interface for display
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  categoryId: number;
  categorySlug: string;
  images: string[];
  featured: boolean;
  available: boolean;
  preparationTime: string;
  calories: number;
  allergens: string[];
  ingredients: string[];
  customizations?: ProductCustomization[];
}

export interface ProductCustomization {
  name: string;
  options: string[];
  default: string | string[];
}

import { getStorefrontApiUrl } from '../../../config/api';

class ProductService {
  private getBaseUrl(tenantHandle: string) {
    return getStorefrontApiUrl(tenantHandle);
  }

  /**
   * Fetch products for a specific tenant
   */
  async getProducts(tenantHandle: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.getBaseUrl(tenantHandle)}/products`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle paginated response structure
      const products = data.data?.data || data.data;
      
      if (!products || !Array.isArray(products)) {
        console.warn('No products data received from API');
        return [];
      }
      
      // Transform API products to frontend format
      return products.map((apiProduct: ApiProduct) => this.transformProduct(apiProduct));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  /**
   * Fetch a single product by ID for a specific tenant
   */
  async getProduct(tenantHandle: string, productId: number): Promise<Product | null> {
    try {
      const response = await fetch(`${this.getBaseUrl(tenantHandle)}/products/${productId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.data) {
        console.warn('No product data received from API');
        return null;
      }
      
      // Transform API product to frontend format
      return this.transformProduct(data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  /**
   * Find a product by slug and category slug
   */
  async findProductBySlug(tenantHandle: string, categorySlug: string, productSlug: string): Promise<Product | null> {
    try {
      // First get all products
      const products = await this.getProducts(tenantHandle);
      
      // Find the product that matches both category and product slugs
      const foundProduct = products.find(product => 
        product.categorySlug === categorySlug && product.slug === productSlug
      );
      
      return foundProduct || null;
    } catch (error) {
      console.error('Error finding product by slug:', error);
      return null;
    }
  }

  /**
   * Transform API product to frontend format
   */
  private transformProduct(apiProduct: ApiProduct): Product {
    // Convert string prices to numbers
    const price = typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : apiProduct.price;
    
    // Create slug from name
    const slug = apiProduct.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Create category slug - handle case where category might be undefined
    const categorySlug = apiProduct.category?.name
      ? apiProduct.category.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : 'uncategorized';

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      slug,
      description: apiProduct.description,
      price,
      currency: 'BD', // Default currency
      categoryId: apiProduct.category_id,
      categorySlug,
      images: apiProduct.images || [],
      featured: apiProduct.tags?.includes('featured') || false,
      available: apiProduct.status === 'active' && apiProduct.stock > 0,
      preparationTime: '15-20 min', // Default preparation time
      calories: 0, // Not available in API
      allergens: [], // Not available in API
      ingredients: [], // Not available in API
    };
  }
}

export const productService = new ProductService();
