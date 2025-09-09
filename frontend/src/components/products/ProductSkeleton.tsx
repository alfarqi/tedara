import React from 'react';

interface ProductSkeletonProps {
  view: 'grid' | 'list';
  count?: number;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ view, count = 8 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  if (view === 'grid') {
    return (
      <div className="row row-cols-xxl-4 row-cols-lg-3 row-cols-sm-2 row-col-1 g-2">
        {skeletons.map((index) => (
          <div key={index} className="col">
            <article className="card h-100 mb-2" style={{ position: 'relative', borderRadius: '0.375rem 0.375rem 0 0' }}>
              <div className="card-body p-3" style={{ paddingBottom: '80px' }}>
                {/* Product Image Skeleton */}
                <div className="product-image-holder bg-light-subtle p-3 mb-3 border border-light rounded text-center position-relative">
                  <div 
                    className="skeleton-image"
                    style={{ 
                      height: '290px', 
                      backgroundColor: '#e9ecef',
                      borderRadius: '0.375rem',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                  />
                </div>

                {/* Product Name Skeleton */}
                <div className="mb-3">
                  <div 
                    className="form-control"
                    style={{ 
                      height: '38px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      border: '1px solid #dee2e6'
                    }}
                  />
                </div>

                {/* Price Skeleton */}
                <div className="mb-3">
                  <div 
                    className="form-control"
                    style={{ 
                      height: '38px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      border: '1px solid #dee2e6'
                    }}
                  />
                </div>

                {/* Stock Skeleton */}
                <div className="mb-3">
                  <div 
                    className="form-control"
                    style={{ 
                      height: '38px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      border: '1px solid #dee2e6'
                    }}
                  />
                </div>

                {/* Category Skeleton */}
                <div className="mb-3">
                  <div 
                    className="form-control"
                    style={{ 
                      height: '38px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      border: '1px solid #dee2e6'
                    }}
                  />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="mb-3">
                  <div className="d-flex gap-2">
                    <div 
                      className="btn btn-light"
                      style={{ 
                        flex: 1,
                        height: '38px',
                        backgroundColor: '#e9ecef',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        border: '1px solid #dee2e6'
                      }}
                    />
                    <div 
                      className="btn btn-light"
                      style={{ 
                        flex: 1,
                        height: '38px',
                        backgroundColor: '#e9ecef',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        border: '1px solid #dee2e6'
                      }}
                    />
                  </div>
                </div>

                {/* Save Button Skeleton */}
                <div 
                  className="btn w-100"
                  style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    left: '0', 
                    right: '0',
                    height: '48px',
                    backgroundColor: '#e9ecef',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    borderRadius: '0 0 0.375rem 0.375rem',
                    border: 'none'
                  }}
                />
              </div>
            </article>
          </div>
        ))}
      </div>
    );
  }

  // List view skeleton - simplified
  return (
    <div className="list-view-skeleton">
      {skeletons.map((index) => (
        <div key={index} className="card mb-3">
          <div className="card-body">
            <div className="row align-items-center">
              {/* Product Image Skeleton */}
              <div className="col-md-2">
                <div 
                  className="skeleton-image"
                  style={{ 
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#e9ecef',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    borderRadius: '0.375rem'
                  }}
                />
              </div>
              
              {/* Product Details Skeleton */}
              <div className="col-md-4">
                <div 
                  className="mb-2"
                  style={{ 
                    height: '20px',
                    backgroundColor: '#e9ecef',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    borderRadius: '0.25rem'
                  }}
                />
                <div 
                  className="mb-1"
                  style={{ 
                    height: '16px',
                    width: '60%',
                    backgroundColor: '#e9ecef',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    borderRadius: '0.25rem'
                  }}
                />
              </div>
              
              {/* Price Skeleton */}
              <div className="col-md-2">
                <div 
                  className="mb-2"
                  style={{ 
                    height: '20px',
                    backgroundColor: '#e9ecef',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    borderRadius: '0.25rem'
                  }}
                />
              </div>
              
              {/* Stock Skeleton */}
              <div className="col-md-2">
                <div 
                  className="mb-2"
                  style={{ 
                    height: '20px',
                    backgroundColor: '#e9ecef',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    borderRadius: '0.25rem'
                  }}
                />
              </div>
              
              {/* Actions Skeleton */}
              <div className="col-md-2">
                <div 
                  className="d-flex gap-1"
                  style={{ 
                    height: '32px',
                    backgroundColor: '#e9ecef',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    borderRadius: '0.25rem'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
