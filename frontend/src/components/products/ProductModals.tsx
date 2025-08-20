import React from 'react';

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
}

interface ProductModalsProps {
  showDetailsModal: boolean;
  showCategoryModal: boolean;
  showAlertsModal: boolean;
  showQuantityModal: boolean;
  showSaveFirstModal: boolean;
  showDeleteModal: boolean;
  showImageModal: boolean;
  savedProduct: Product | null;
  productToDelete: Product | null;
  selectedProductForImage: Product | null;
  uploadedImages: string[];
  youtubeLink: string;
  categories: string[];
  detailsFormData: any;
  categoryFormData: any;
  alertsFormData: any;
  quantityFormData: any;
  handleCloseModal: () => void;
  handleCloseCategoryModal: () => void;
  handleCloseAlertsModal: () => void;
  handleCloseQuantityModal: () => void;
  handleCloseImageModal: () => void;
  handleDetailsSubmit: (e: React.FormEvent) => void;
  handleCategorySubmit: (e: React.FormEvent) => void;
  handleAlertsSubmit: (e: React.FormEvent) => void;
  handleQuantitySubmit: (e: React.FormEvent) => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
  handleDetailsInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCategoryInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleAlertsInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleQuantityInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent) => void;
  handleDrop: (event: React.DragEvent) => void;
  removeImage: (index: number) => void;
  setPrimaryImage: (index: number) => void;
  saveImages: () => void;
  addNewOption: () => void;
  addOptionValue: (optionIndex: number) => void;
  handleOptionNameChange: (optionIndex: number, value: string) => void;
  handleOptionValueChange: (optionIndex: number, valueIndex: number, value: string) => void;
  setShowSaveFirstModal: (show: boolean) => void;
  setYoutubeLink: (link: string) => void;
}

const ProductModals: React.FC<ProductModalsProps> = ({
  showDetailsModal,
  showCategoryModal,
  showAlertsModal,
  showQuantityModal,
  showSaveFirstModal,
  showDeleteModal,
  showImageModal,
  savedProduct,
  productToDelete,
  uploadedImages,
  youtubeLink,
  categories,
  detailsFormData,
  categoryFormData,
  alertsFormData,
  quantityFormData,
  handleCloseModal,
  handleCloseCategoryModal,
  handleCloseAlertsModal,
  handleCloseQuantityModal,
  handleCloseImageModal,
  handleDetailsSubmit,
  handleCategorySubmit,
  handleAlertsSubmit,
  handleQuantitySubmit,
  handleConfirmDelete,
  handleCancelDelete,
  handleDetailsInputChange,
  handleCategoryInputChange,
  handleAlertsInputChange,
  handleQuantityInputChange,
  handleFileUpload,
  handleDragOver,
  handleDrop,
  removeImage,
  setPrimaryImage,
  saveImages,
  addNewOption,
  addOptionValue,
  handleOptionNameChange,
  handleOptionValueChange,
  setShowSaveFirstModal,
  setYoutubeLink
}) => {
  return (
    <>
      {/* Product Data Modal */}
      {showDetailsModal && (
        <>
          <div className="modal fade show" id="productDataModal" tabIndex={-1} aria-labelledby="productDataModalLabel" aria-hidden="false" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" style={{ minWidth: '520px' }}>
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title" id="productDataModalLabel" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Product Data ({savedProduct?.productName})</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal} aria-label="Close"></button>
                </div>
                
                <div className="modal-body">
                  <form onSubmit={handleDetailsSubmit}>
                    {/* Basic Product Information */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            name="description"
                            value={detailsFormData.description}
                            onChange={handleDetailsInputChange}
                            rows={3}
                            placeholder="Product description..."
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Brand</label>
                          <input
                            type="text"
                            className="form-control"
                            name="brand"
                            value={detailsFormData.brand}
                            onChange={handleDetailsInputChange}
                            placeholder="Brand name"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Sub Category</label>
                          <select
                            className="form-select"
                            name="subCategory"
                            value={detailsFormData.subCategory}
                            onChange={handleDetailsInputChange}
                          >
                            <option value="">Choose Sub Category</option>
                            <option value="sub1">Sub Category 1</option>
                            <option value="sub2">Sub Category 2</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Tags</label>
                          <input
                            type="text"
                            className="form-control"
                            name="tags"
                            value={detailsFormData.tags}
                            onChange={handleDetailsInputChange}
                            placeholder="Tags (comma separated)"
                          />
                        </div>
                      </div>
                    </div>

                    <hr />

                    {/* Product Weight */}
                    <div className="mb-3">
                      <label className="form-label">Product Weight</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          name="weight"
                          value={detailsFormData.weight}
                          onChange={handleDetailsInputChange}
                          placeholder="Product weight"
                        />
                        <select className="form-select" style={{ maxWidth: '80px' }}>
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="lb">lb</option>
                        </select>
                      </div>
                    </div>

                    {/* Discount End Date */}
                    <div className="mb-3">
                      <label className="form-label">Discount End Date</label>
                      <div className="input-group">
                        <input
                          type="date"
                          className="form-control"
                          name="discountEndDate"
                          placeholder="Discount end date (optional)"
                        />
                        <span className="input-group-text">
                          <i className="ti ti-calendar"></i>
                        </span>
                      </div>
                    </div>

                    {/* GTIN and MPN Row */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">GTIN</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              name="gtin"
                              placeholder="Global Trade Item Number"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">MPN</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              name="mpn"
                              placeholder="Manufacturer Part Number"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Storage Code and Max Quantity Row */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Storage Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="storageCode"
                            placeholder="Storage location code"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Max Quantity</label>
                          <input
                            type="number"
                            className="form-control"
                            name="maxQuantity"
                            placeholder="Maximum order quantity"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sub Title and Promotional Title Row */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Sub Title</label>
                          <input
                            type="text"
                            className="form-control"
                            name="subTitle"
                            placeholder="Product subtitle"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Promotional Title</label>
                          <input
                            type="text"
                            className="form-control"
                            name="promotionalTitle"
                            placeholder="Promotional title"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Close
                  </button>
                  <button type="button" className="btn btn-purple" onClick={handleDetailsSubmit}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>
        </>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <>
          <div className="modal fade show" id="categoryModal" tabIndex={-1} aria-labelledby="categoryModalLabel" aria-hidden="false" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '520px' }}>
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title" id="categoryModalLabel" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Add New Category</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCloseCategoryModal} aria-label="Close"></button>
                </div>
                
                <div className="modal-body">
                  <form onSubmit={handleCategorySubmit}>
                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="categoryName"
                        value={categoryFormData.categoryName}
                        onChange={handleCategoryInputChange}
                        placeholder="Enter category name"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Parent Category</label>
                      <select
                        className="form-select"
                        name="parentCategory"
                        value={categoryFormData.parentCategory}
                        onChange={handleCategoryInputChange}
                      >
                        <option value="">No Parent Category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseCategoryModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-purple" onClick={handleCategorySubmit}>
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={handleCloseCategoryModal}></div>
        </>
      )}

      {/* Product Alerts Modal */}
      {showAlertsModal && (
        <>
          <div className="modal fade show" id="alertsModal" tabIndex={-1} aria-labelledby="alertsModalLabel" aria-hidden="false" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '520px' }}>
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title" id="alertsModalLabel" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Product Alerts</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCloseAlertsModal} aria-label="Close"></button>
                </div>
                
                <div className="modal-body">
                  <form onSubmit={handleAlertsSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Alert Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        name="alertQuantity"
                        value={alertsFormData.alertQuantity}
                        onChange={handleAlertsInputChange}
                        placeholder="Quantity to trigger alert"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Notify Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        name="notifyQuantity"
                        value={alertsFormData.notifyQuantity}
                        onChange={handleAlertsInputChange}
                        placeholder="Quantity to notify"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Notify Percentage</label>
                      <input
                        type="number"
                        className="form-control"
                        name="notifyPercentage"
                        value={alertsFormData.notifyPercentage}
                        onChange={handleAlertsInputChange}
                        placeholder="Percentage to notify"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseAlertsModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-purple" onClick={handleAlertsSubmit}>
                    Save Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={handleCloseAlertsModal}></div>
        </>
      )}

      {/* Quantity Management Modal */}
      {showQuantityModal && (
        <>
          <div className="modal fade show" id="quantityModal" tabIndex={-1} aria-labelledby="quantityModalLabel" aria-hidden="false" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" style={{ minWidth: '520px' }}>
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title" id="quantityModalLabel" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Quantity Management</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCloseQuantityModal} aria-label="Close"></button>
                </div>
                
                <div className="modal-body">
                  <form onSubmit={handleQuantitySubmit}>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="enableOptions"
                          checked={quantityFormData.enableOptions}
                          onChange={handleQuantityInputChange}
                          id="enableOptions"
                        />
                        <label className="form-check-label" htmlFor="enableOptions">
                          Enable Product Options (Colors, Sizes, etc.)
                        </label>
                      </div>
                    </div>
                    
                    {quantityFormData.enableOptions && (
                      <div>
                        <h6 className="mb-3">Product Options</h6>
                        {quantityFormData.options.map((option: any, optionIndex: number) => (
                          <div key={optionIndex} className="card mb-3">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4">
                                  <label className="form-label">Option Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={option.name}
                                    onChange={(e) => handleOptionNameChange(optionIndex, e.target.value)}
                                    placeholder="e.g., Color, Size"
                                  />
                                </div>
                                <div className="col-md-8">
                                  <label className="form-label">Option Values</label>
                                  <div className="d-flex gap-2 mb-2">
                                    {option.values.map((value: string, valueIndex: number) => (
                                      <input
                                        key={valueIndex}
                                        type="text"
                                        className="form-control"
                                        value={value}
                                        onChange={(e) => handleOptionValueChange(optionIndex, valueIndex, e.target.value)}
                                        placeholder="Value"
                                      />
                                    ))}
                                    <button
                                      type="button"
                                      className="btn btn-light"
                                      onClick={() => addOptionValue(optionIndex)}
                                    >
                                      <i className="ti ti-plus"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={addNewOption}
                        >
                          <i className="ti ti-plus me-1"></i> Add New Option
                        </button>
                      </div>
                    )}
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseQuantityModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-purple" onClick={handleQuantitySubmit}>
                    Save Options
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={handleCloseQuantityModal}></div>
        </>
      )}

      {/* Save First Modal */}
      {showSaveFirstModal && (
        <>
          <div className="modal fade show" id="saveFirstModal" tabIndex={-1} aria-labelledby="saveFirstModalLabel" aria-hidden="false" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '520px' }}>
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title" id="saveFirstModalLabel" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Save Product First</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowSaveFirstModal(false)} aria-label="Close"></button>
                </div>
                
                <div className="modal-body text-center">
                  <i className="ti ti-alert-circle text-warning" style={{ fontSize: '4rem' }}></i>
                  <h4 className="mt-3 mb-3">You need to save the product first!</h4>
                  <p className="text-muted">Please fill in the basic product information and click Save before adding more details or uploading images.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-purple" onClick={() => setShowSaveFirstModal(false)}>
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowSaveFirstModal(false)}></div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="modal fade show" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="false" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '520px' }}>
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                  <h5 className="modal-title" id="deleteModalLabel" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Confirm Delete</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCancelDelete} aria-label="Close"></button>
                </div>
                
                <div className="modal-body text-center">
                  <i className="ti ti-trash text-danger" style={{ fontSize: '4rem' }}></i>
                  <h4 className="mt-3 mb-3">Are you sure?</h4>
                  <p className="text-muted">This action cannot be undone. The product "{productToDelete?.productName}" will be permanently deleted.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={handleCancelDelete}></div>
        </>
      )}

      {/* Image Upload Modal */}
      {showImageModal && (
        <>
          <div className="modal fade show" id="imageModal" tabIndex={-1} aria-labelledby="imageModalLabel" aria-hidden="false" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" style={{ minWidth: '520px' }}>
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title" id="imageModalLabel" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Upload Product Images</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCloseImageModal} aria-label="Close"></button>
                </div>
                
                <div className="modal-body">
                  {/* Drag & Drop Area */}
                  <div 
                    className="border-2 border-dashed border-light rounded p-5 text-center mb-4"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{ 
                      borderColor: '#dee2e6',
                      backgroundColor: '#f8f9fa',
                      minHeight: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="ti ti-cloud-upload text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                    <h5>Drag & Drop Images Here</h5>
                    <p className="text-muted mb-3">or</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      id="fileInput"
                    />
                    <label htmlFor="fileInput" className="btn btn-purple">
                      Browse Files
                    </label>
                  </div>

                  {/* YouTube Link */}
                  <div className="mb-4">
                    <label className="form-label">YouTube Video Link (Optional)</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-brand-youtube text-danger"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add YouTube video link"
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="mb-4">
                      <h6 className="mb-3">Uploaded Images</h6>
                      <div className="row">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="col-md-4 mb-3">
                            <div className="position-relative">
                              <img 
                                src={image} 
                                alt={`Product ${index + 1}`} 
                                className="img-fluid rounded border"
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                onClick={() => removeImage(index)}
                              >
                                <i className="ti ti-x fs-sm"></i>
                              </button>
                              <div className="mt-2 d-flex gap-1">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeImage(index)}
                                  title="Delete"
                                >
                                  <i className="ti ti-trash fs-sm"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Crop"
                                >
                                  <i className="ti ti-crop fs-sm"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => setPrimaryImage(index)}
                                  title="Set as Primary"
                                >
                                  <i className="ti ti-check fs-sm"></i>
                                </button>
                              </div>
                              {index === 0 && (
                                <div className="mt-1">
                                  <small className="text-success">
                                    <i className="ti ti-check fs-sm me-1"></i> Primary Image
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseImageModal}
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-purple" 
                    onClick={saveImages}
                    disabled={uploadedImages.length === 0}
                  >
                    Save Images
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={handleCloseImageModal}></div>
        </>
      )}
    </>
  );
};

export default ProductModals;

