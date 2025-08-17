import React, { useState } from 'react';

interface Product {
  id: number;
  productName: string;
  basePrice: string;
  originalPrice: string;
  stock: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  discount: string;
  discountType: string;
  productType?: string;
  placeholderName?: string;
}

interface ProductGridProps {
  products: Product[];
  categories: string[];
  handleInputChange: (productId: number, field: string, value: string) => void;
  handleSubmit: (productId: number) => void;
  handleImageReplace: (product: any) => void;
  handleProductDataClick: (product: any) => void;
  handleDeleteClick: (product: any) => void;
  handleAddCategoryClick: () => void;
  handleAlertsClick: () => void;
  handleQuantityClick: () => void;
  handlePinProduct?: (productId: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  handleInputChange,
  handleSubmit,
  handleImageReplace,
  handleProductDataClick,
  handleDeleteClick,
  handleAddCategoryClick,
  handleAlertsClick,
  handleQuantityClick,
  handlePinProduct
}) => {
  const [pinnedProducts, setPinnedProducts] = useState<Set<number>>(new Set());
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const handlePinClick = async (productId: number) => {
    setLoadingProductId(productId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPinnedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
    
    setLoadingProductId(null);
    
    // Call parent handler if provided
    if (handlePinProduct) {
      handlePinProduct(productId);
    }
  };

  return (
    <>
      {/* Global Preloader Overlay */}
      {loadingProductId && (
        <div 
          className="position-fixed d-flex align-items-center justify-content-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="card text-center d-flex flex-column align-items-center justify-content-center" style={{ 
            backgroundColor: 'rgba(111, 66, 193, 0.9)', 
            border: 'none',
            borderRadius: '0.5rem',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0.5rem 1rem rgba(0,0,0,.175)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '300px'
          }}>
            <div className="spinner-border text-white mb-3 d-flex align-items-center justify-content-center" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="fs-5 text-white text-center">Adding to pinned products...</div>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {products.length === 0 ? (
        <div className="col-12 text-center" style={{ padding: '4rem 2rem' }}>
          <div className="mb-4">
            <i className="ti ti-package text-muted" style={{ fontSize: '8rem', opacity: 0.3 }}></i>
          </div>
          <h4 className="text-muted mb-3">You currently have no products</h4>
          <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
            Start your business journey by adding the first product by clicking the "Add new product" button
          </p>
          <button className="btn btn-purple" style={{ 
            padding: '0.5rem 1.5rem',
            fontSize: '0.9rem',
            width: 'auto',
            minWidth: '200px'
          }}>
            Use Ready Template
          </button>
        </div>
      ) : (
        <div className="row row-cols-xxl-4 row-cols-lg-3 row-cols-sm-2 row-col-1 g-2">
      {products.map((product) => (
        <div key={product.id} className="col">
          <article className="card h-100 mb-2" style={{ position: 'relative', borderRadius: '0.375rem 0.375rem 0 0' }}>
            <div className="card-body p-3" style={{ paddingBottom: '80px' }}>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(product.id); }}>
                {/* Product Image with Replace Button */}
                <div className="product-image-holder bg-light-subtle p-3 mb-3 border border-light rounded text-center position-relative">
                  {product.image ? (
                    <div 
                      style={{ cursor: 'pointer', height: '290px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => handleImageReplace(product)}
                    >
                      <img src={product.image} alt={product.productName} className="img-fluid" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div 
                      className="d-flex flex-column align-items-center justify-content-center" 
                      style={{ height: '290px', cursor: 'pointer' }}
                      onClick={() => handleImageReplace(product)}
                    >
                      <i className="ti ti-photo text-muted mb-2" style={{ fontSize: '7rem' }}></i>
                      <span className="text-muted small">Click to upload product image</span>
                    </div>
                  )}
                  
                  {/* Pin Icon - Only show for saved products */}
                  {product.discount !== 'NEW' && product.productName && product.basePrice && (
                    <button
                      type="button"
                      className="btn btn-sm position-absolute"
                      title={pinnedProducts.has(product.id) ? "Unpin Product" : "Pin Product"}
                      onClick={() => handlePinClick(product.id)}
                      disabled={loadingProductId === product.id}
                      style={{
                        top: '0.5rem',
                        left: '0.5rem',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: pinnedProducts.has(product.id) ? '#dc3545' : '#ffffff',
                        color: pinnedProducts.has(product.id) ? '#ffffff' : '#adb5bd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0',
                        zIndex: 10,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loadingProductId === product.id ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <i className="ti ti-pin fs-sm"></i>
                      )}
                    </button>
                  )}
                  
                  <button 
                    type="button" 
                    className="btn btn-sm position-absolute top-0 end-0 m-2"
                    onClick={() => handleImageReplace(product)}
                    style={{ 
                      zIndex: 10,
                      backgroundColor: 'white',
                      borderColor: '#dee2e6',
                      color: '#6f42c1',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem'
                    }}
                  >
                    <i className="ti ti-camera fs-sm me-1"></i>
                    Upload Image
                  </button>
                </div>

                {/* Product Name */}
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="ti ti-package fs-sm"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      value={product.productName}
                      onChange={(e) => handleInputChange(product.id, 'productName', e.target.value)}
                      placeholder={product.placeholderName || "Product name"}
                      required
                    />
                  </div>
                </div>

                {/* Price Field */}
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="ti ti-currency-dollar fs-sm"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control border-start-0"
                      value={product.basePrice}
                      onChange={(e) => handleInputChange(product.id, 'basePrice', e.target.value)}
                      placeholder="Price"
                      required
                    />
                    <span className="input-group-text bg-light border-start-0">USD</span>
                  </div>
                </div>

                {/* Options and Quantity - Clickable Button */}
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="ti ti-box fs-sm"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 border-end-0"
                      value={product.stock}
                      onChange={(e) => handleInputChange(product.id, 'stock', e.target.value)}
                      placeholder="4"
                      style={{ width: '100px' }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-light border-start-0 border-end-0"
                      onClick={() => handleInputChange(product.id, 'stock', 'Unlimited Qty.')}
                      title="Set Unlimited"
                      style={{ width: '36px', height: '36px', padding: '0', borderLeftColor: '#dee2e6', borderRightColor: '#dee2e6' }}
                    >
                      <i className="ti ti-infinity fs-sm"></i>
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-light border-start-0"
                      onClick={handleAlertsClick}
                      title="Product Alerts"
                      style={{ width: '36px', height: '36px', padding: '0', borderLeftColor: '#dee2e6', borderRightColor: '#dee2e6' }}
                    >
                      <i className="ti ti-bell fs-sm"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-light border-start-0"
                      onClick={handleQuantityClick}
                      style={{ width: '80px' }}
                    >
                      Options
                    </button>
                  </div>
                </div>

                {/* Category/Classification */}
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="ti ti-category fs-sm"></i>
                    </span>
                    <select
                      className="form-select border-start-0"
                      value={product.category}
                      onChange={(e) => handleInputChange(product.id, 'category', e.target.value)}
                      required
                    >
                      <option value="">Choose Product Classification</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      className="btn btn-light border-start-0"
                      onClick={handleAddCategoryClick}
                      title="Add New Category"
                    >
                      Add Category
                    </button>
                  </div>
                </div>

                {/* Product Data Button and Delete Icon Row */}
                <div style={{ marginLeft: '-20px', marginRight: '-21px' }}>
                  <div className="d-flex align-items-center" style={{ height: '73px' }}>
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={() => handleProductDataClick(product)}
                      style={{ 
                        width: '50%',
                        borderTop: '1px solid #dee2e6',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
                        backgroundColor: 'transparent',
                        color: '#6c757d',
                        borderRadius: '0',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      <i className="ti ti-list fs-sm me-2"></i> Product Data
                    </button>
                    <button 
                      type="button" 
                      className="btn"
                      onClick={() => handleDeleteClick(product)}
                      style={{ 
                        width: '50%',
                        borderRadius: '0',
                        border: '1px solid #dee2e6',
                        borderBottom: 'none',
                        borderRight: 'none',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      <i className="ti ti-trash fs-sm me-1"></i> Delete
                    </button>
                  </div>
                </div>

                {/* Save Button - Attached to bottom */}
                <button type="submit" className="btn w-100" style={{ 
                  position: 'absolute', 
                  bottom: '0', 
                  left: '0', 
                  right: '0',
                  backgroundColor: '#6f42c1', 
                  borderColor: '#6f42c1', 
                  color: 'white', 
                  borderRadius: '0 0 0.375rem 0.375rem',
                  border: 'none',
                  padding: '12px'
                }}>
                  <i className="ti ti-check fs-sm me-1"></i> Save
                </button>
              </form>
            </div>
          </article>
        </div>
      ))}
        </div>
      )}
    </>
  );
};

export default ProductGrid;

