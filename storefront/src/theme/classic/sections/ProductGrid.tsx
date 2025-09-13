import React from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  is_active: boolean;
}

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
  limit?: number;
  show_prices?: boolean;
  show_ratings?: boolean;
  columns?: number;
  show_pagination?: boolean;
  show_filters?: boolean;
  show_sorting?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title = 'Products',
  subtitle,
  products = [],
  limit,
  show_prices = true,
  show_ratings = false,
  columns = 3,
  show_pagination = false,
  show_filters = false,
  show_sorting = false
}) => {
  // Sample products if none provided
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Sample Product 1',
      slug: 'sample-product-1',
      description: 'This is a sample product description.',
      price: 29.99,
      image: '/images/sample-product-1.jpg',
      is_active: true,
    },
    {
      id: '2',
      name: 'Sample Product 2',
      slug: 'sample-product-2',
      description: 'Another sample product for demonstration.',
      price: 49.99,
      image: '/images/sample-product-2.jpg',
      is_active: true,
    },
    {
      id: '3',
      name: 'Sample Product 3',
      slug: 'sample-product-3',
      description: 'A third sample product to show variety.',
      price: 19.99,
      image: '/images/sample-product-3.jpg',
      is_active: true,
    },
    {
      id: '4',
      name: 'Sample Product 4',
      slug: 'sample-product-4',
      description: 'Fourth sample product with different pricing.',
      price: 79.99,
      image: '/images/sample-product-4.jpg',
      is_active: true,
    },
  ];

  const displayProducts = products.length > 0 ? products : sampleProducts;
  const limitedProducts = limit ? displayProducts.slice(0, limit) : displayProducts;

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Filters and Sorting */}
        {(show_filters || show_sorting) && (
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            {show_filters && (
              <div className="flex flex-wrap gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Home & Garden</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Brands</option>
                  <option>Brand A</option>
                  <option>Brand B</option>
                </select>
              </div>
            )}
            
            {show_sorting && (
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name: A to Z</option>
                <option>Name: Z to A</option>
              </select>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-8`}>
          {limitedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Product Image */}
              <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  <a href={`/product/${product.slug}`} className="hover:text-blue-600">
                    {product.name}
                  </a>
                </h3>
                
                {product.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                {/* Rating */}
                {show_ratings && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="h-4 w-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">(4.5)</span>
                  </div>
                )}
                
                {/* Price */}
                {show_prices && (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {show_pagination && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
};
