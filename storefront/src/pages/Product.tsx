import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { getTheme } from '../theme/registry';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductResponse {
  data: Product;
  meta: {
    tenant: {
      handle: string;
      display_name: string;
    };
  };
}

interface ProductProps {
  tenant: string;
}

export const Product: React.FC<ProductProps> = ({ tenant }) => {
  const { slug } = useParams<{ slug: string }>();
  const { theme: themeData, loading: themeLoading } = useTheme(tenant);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8000/api/storefront/${tenant}/products/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }

        const data: ProductResponse = await response.json();
        setProduct(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
        console.error('Product fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (tenant && slug) {
      fetchProduct();
    }
  }, [tenant, slug]);

  if (themeLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!themeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Theme Not Found</h1>
          <p className="text-gray-600">The theme could not be loaded.</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">{error || 'The requested product could not be found.'}</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(themeData.theme.key);
  const { Layout } = theme;

  return (
    <Layout theme={themeData}>
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                  <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              </div>

              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-4">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                    Add to Cart
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                    Add to Wishlist
                  </button>
                </div>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">SKU</dt>
                    <dd className="text-sm text-gray-900">{product.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Availability</dt>
                    <dd className="text-sm text-green-600">In Stock</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
