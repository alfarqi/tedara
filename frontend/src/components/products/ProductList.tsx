import React, { useState } from "react";

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

interface ProductListProps {
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

const ProductList: React.FC<ProductListProps> = ({
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
  handlePinProduct,
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
        <div className="row g-2">
          {products.map((product) => (
        <div key={product.id} className="col-12">
          <article className="card mb-2" style={{ position: "relative" }}>
            <div className="card-body p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(product.id);
                }}
              >
                <div className="row">
                  {/* Checkbox and Pin */}
                  <div className="col-md-auto">
                    <div className="d-flex flex-column align-items-center justify-content-between" style={{ height: "80px" }}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`product-${product.id}`}
                        />
                      </div>
                      {/* Pin Icon - Only show for saved products */}
                      {product.discount !== 'NEW' && product.productName && product.basePrice && (
                        <button
                          type="button"
                          className="btn btn-sm"
                          title={pinnedProducts.has(product.id) ? "Unpin Product" : "Pin Product"}
                          onClick={() => handlePinClick(product.id)}
                          disabled={loadingProductId === product.id}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: pinnedProducts.has(product.id) ? "#dc3545" : "#ffffff",
                            color: pinnedProducts.has(product.id) ? "#ffffff" : "#adb5bd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0",
                            transition: "all 0.3s ease"
                          }}
                        >
                          {loadingProductId === product.id ? (
                            <div className="spinner-border spinner-border-sm" role="status" style={{ width: "12px", height: "12px" }}>
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            <i className="ti ti-pin fs-xs"></i>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Product Image - Thumbnail */}
                  <div className="col-md-auto">
                    <div
                      className="product-image-holder bg-light-subtle p-2 border border-light rounded text-center position-relative"
                      style={{ width: "80px", height: "80px" }}
                    >
                      {product.image ? (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => handleImageReplace(product)}
                        >
                          <img
                            src={product.image}
                            alt={product.productName}
                            className="img-fluid rounded-circle"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="d-flex flex-column align-items-center justify-content-center"
                          style={{
                            width: "100%",
                            height: "100%",
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageReplace(product)}
                        >
                          <i
                            className="ti ti-photo text-muted"
                            style={{ fontSize: "1.5rem" }}
                          ></i>
                        </div>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm position-absolute"
                        onClick={() => handleImageReplace(product)}
                        style={{
                          zIndex: 10,
                          backgroundColor: "#6f42c1",
                          borderColor: "#6f42c1",
                          color: "white",
                          fontSize: "0.6rem",
                          padding: "0.1rem 0.2rem",
                          width: "19px",
                          height: "19px",
                          borderRadius: "50%",
                          top: "3px",
                          right: "3px",
                        }}
                      >
                        <i className="ti ti-plus fs-sm"></i>
                      </button>
                    </div>
                  </div>

                  {/* Product Name - Top Row */}
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="ti ti-package fs-sm"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        value={product.productName}
                        onChange={(e) =>
                          handleInputChange(
                            product.id,
                            "productName",
                            e.target.value
                          )
                        }
                        placeholder={product.placeholderName || "Product name"}
                        required
                      />
                    </div>
                    <div className="input-group mt-2">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="ti ti-package fs-sm"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 border-end-0"
                        value={product.stock}
                        onChange={(e) =>
                          handleInputChange(product.id, "stock", e.target.value)
                        }
                        placeholder="Quantity"
                        style={{ width: "80px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-light border-end-0"
                        onClick={() =>
                          handleInputChange(
                            product.id,
                            "stock",
                            "Unlimited Qty."
                          )
                        }
                        title="Set Unlimited"
                        style={{
                          width: "36px",
                          height: "36px",
                          padding: "0",
                          borderLeftColor: "#dee2e6",
                          borderRightColor: "#dee2e6",
                        }}
                      >
                        <i className="ti ti-infinity fs-sm"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-light border-start-0 border-end-0"
                        onClick={handleAlertsClick}
                        title="Product Alerts"
                        style={{
                          width: "36px",
                          height: "36px",
                          padding: "0",
                          borderLeftColor: "#dee2e6",
                          borderRightColor: "#dee2e6",
                        }}
                      >
                        <i className="ti ti-bell fs-sm"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-light border-start-0"
                        onClick={handleQuantityClick}
                        style={{ width: "120px" }}
                      >
                        Options
                      </button>
                    </div>
                  </div>

                  {/* Price Field - Top Row */}
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        $
                      </span>
                      <input
                        type="number"
                        className="form-control border-start-0"
                        value={product.basePrice}
                        onChange={(e) =>
                          handleInputChange(
                            product.id,
                            "basePrice",
                            e.target.value
                          )
                        }
                        placeholder="Price"
                        required
                      />
                    </div>
                    <div className="input-group mt-2">
                      <select
                        className="form-select border-end-0"
                        value={product.category}
                        onChange={(e) =>
                          handleInputChange(
                            product.id,
                            "category",
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="">Choose Category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
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

                  {/* Category Field - Top Row */}

                                     {/* Action Buttons - Top Row */}
                   <div className="col-md-2" style={{ flex: '0 0 22%', maxWidth: '22%' }}>
                     <div className="d-flex flex-column gap-2">
                       
                       <div className="d-flex gap-1">
                         <button
                           type="button"
                           className="btn btn-light"
                           onClick={() => handleDeleteClick(product)}
                           style={{
                             backgroundColor: "transparent",
                             color: "#6c757d",
                             border: "1px solid #dee2e6",
                             flex: 1,
                             minWidth: "80px"
                           }}
                         >
                           <i className="ti ti-trash fs-sm me-1"></i> Delete
                         </button>
                         <button
                           type="button"
                           className="btn btn-light dropdown-toggle"
                           onClick={() => handleProductDataClick(product)}
                           style={{
                             backgroundColor: "transparent",
                             color: "#6c757d",
                             border: "1px solid #dee2e6",
                             flex: 1,
                             minWidth: "80px"
                           }}
                         >
                           <i className="ti ti-list fs-sm me-2"></i> Product Data
                         </button>
                       </div>
                       <button
                         type="submit"
                         className="btn"
                         style={{
                           backgroundColor: "#6f42c1",
                           borderColor: "#6f42c1",
                           color: "white",
                           width: "100%",
                           minHeight: "38px"
                         }}
                       >
                         <i className="ti ti-check fs-sm me-1"></i> Save
                       </button>
                     </div>
                     
                   </div>
                </div>

                
               
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

export default ProductList;
