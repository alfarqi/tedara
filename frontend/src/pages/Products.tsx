import Layout from '../components/layout/Layout';
import { useState, useEffect } from 'react';
import ProductGrid from '../components/products/ProductGrid';
import ProductList from '../components/products/ProductList';
import ProductModals from '../components/products/ProductModals';
import ProductFilter from '../components/products/ProductFilter';
import ProductSkeleton from '../components/products/ProductSkeleton';
import { productService, type Product as ApiProduct } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Products: React.FC = () => {
  const { token } = useAuth();
  const { showError, showSuccess } = useToast();
  
  // API State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  // const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [savedProduct, setSavedProduct] = useState<any>(null);
  const [showSaveFirstModal, setShowSaveFirstModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProductForImage, setSelectedProductForImage] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [showProductTypeDropdown, setShowProductTypeDropdown] = useState(false);

  // Load products and statistics
  useEffect(() => {
    if (token) {
      loadProducts();
      loadStatistics();
    }
  }, [token]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getProducts({}, token || undefined);
      
      if (response.data && Array.isArray(response.data)) {
        const formattedProducts = response.data.map((product: ApiProduct) => 
          productService.formatProductForDisplay(product)
        );
        setProducts(formattedProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(
          response.data
            .map((product: ApiProduct) => product.category?.name)
            .filter((name): name is string => Boolean(name))
        )];
        setCategories(uniqueCategories);
      } else {
        console.log('Unexpected response format:', response);
        setProducts([]);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      showError('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await productService.getStatistics(token || undefined);
      if (response.data) {
        // setStatistics(response.data as ProductStatistics);
      }
    } catch (err) {
      console.error('Error loading statistics:', err);
      // Don't show error for statistics as it's not critical
    }
  };
  


  const [detailsFormData, setDetailsFormData] = useState({
    description: '',
    brand: '',
    subCategory: 'Choose Sub Category',
    tags: '',
    weight: '',
    dimensions: '',
    color: '',
    material: '',
    warranty: '',
    shippingInfo: '',
    seoTitle: '',
    seoDescription: '',
    metaKeywords: ''
  });

  const [categoryFormData, setCategoryFormData] = useState({
    categoryName: '',
    categoryDescription: '',
    parentCategory: '',
    categoryImage: ''
  });

  const [alertsFormData, setAlertsFormData] = useState({
    alertQuantity: '0',
    notifyQuantity: '15',
    notifyPercentage: '100'
  });

  const [quantityFormData, setQuantityFormData] = useState({
    enableOptions: false,
    options: [
      {
        name: '',
        values: ['']
      }
    ]
  });



  // Product types for dropdown
  const productTypes = [
    {
      id: 'ready-product',
      icon: 'ti ti-package',
      title: 'Ready Product',
      description: 'Tangible products',
      featureLevel: null
    },
    {
      id: 'on-demand-service',
      icon: 'ti ti-palette',
      title: 'On-demand Service',
      description: 'Design, printing, research',
      featureLevel: 'Plus / Pro'
    },
    {
      id: 'food',
      icon: 'ti ti-candle',
      title: 'Food',
      description: 'Food and beverages',
      featureLevel: 'Plus / Pro'
    },
    {
      id: 'digital-product',
      icon: 'ti ti-device-desktop',
      title: 'Digital Product',
      description: 'E-books and digital files',
      featureLevel: 'Plus / Pro'
    },
    {
      id: 'digital-card',
      icon: 'ti ti-credit-card',
      title: 'Digital Card',
      description: 'Recharge cards',
      featureLevel: 'Plus / Pro'
    },
    {
      id: 'bookings',
      icon: 'ti ti-calendar',
      title: 'Bookings',
      description: 'Courses and consultations',
      featureLevel: 'Plus / Pro'
    }
  ];

  // Function to add a new product
  const handleAddProduct = () => {
    setShowProductTypeDropdown(!showProductTypeDropdown);
  };

  const handleProductTypeSelect = (productType: any) => {
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      productName: '',
      basePrice: '',
      originalPrice: '',
      stock: '',
      category: '',
      image: '', // No default image for new products
      rating: 0,
      reviews: 0,
      discount: 'NEW',
      discountType: 'percentage',
      productType: productType.id,
      placeholderName: `${productType.title} + Product Name`
    };
    setProducts(prev => [newProduct, ...prev]); // Add to the beginning
    setShowProductTypeDropdown(false);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('.position-relative')) {
      setShowProductTypeDropdown(false);
    }
  };

  // Add event listener for clicking outside
  useEffect(() => {
    if (showProductTypeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProductTypeDropdown]);

  const toggleFilter = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsFilterOpen(!isFilterOpen);
  };



  const handleInputChange = (productId: number, field: string, value: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, [field]: value } : product
    ));
  };

  const handleDetailsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetailsFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAlertsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAlertsFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setQuantityFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setQuantityFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (productId: number) => {
    try {
      console.log('handleSubmit called with productId:', productId);
      const product = products.find(p => p.id === productId);
      console.log('Found product:', product);
      if (!product) return;

      // Check if product has required fields
      if (!product.productName || !product.basePrice) {
        showError('Error', 'Please fill in product name and price');
        return;
      }

      const productData = {
        name: product.productName,
        price: parseFloat(product.basePrice),
        original_price: parseFloat(product.originalPrice || product.basePrice),
        stock: parseInt(product.stock) || 0,
        category_id: 1, // Default category, could be enhanced
        status: 'active',
        brand: product.brand || '',
        weight: product.weight || 0,
        dimensions: product.dimensions || '',
        description: product.description || ''
      };

      // Check if this is an existing product (has a valid ID and is not a placeholder)
      console.log('Decision logic - productId:', productId, 'productName:', product.productName, 'basePrice:', product.basePrice);
      if (productId && productId > 0 && product.productName && product.basePrice) {
        // Update existing product
        console.log('Updating existing product with ID:', productId);
        await productService.updateProduct(productId, productData, token || undefined);
        showSuccess('Success', 'Product updated successfully');
      } else {
        // Create new product
        console.log('Creating new product');
        await productService.createProduct(productData, token || undefined);
        showSuccess('Success', 'Product created successfully');
      }

      // Reload products
      await loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      showError('Error', 'Failed to save product');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Details form submitted:', detailsFormData);
    setShowDetailsModal(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory = categoryFormData.categoryName;
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
    }
    setShowCategoryModal(false);
    setCategoryFormData({ categoryName: '', categoryDescription: '', parentCategory: '', categoryImage: '' });
  };

  const handleAlertsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Alerts form submitted:', alertsFormData);
    setShowAlertsModal(false);
  };

  const handleQuantitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quantity form submitted:', quantityFormData);
    setShowQuantityModal(false);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSavedProduct(null);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryFormData({ categoryName: '', categoryDescription: '', parentCategory: '', categoryImage: '' });
  };

  const handleCloseAlertsModal = () => {
    setShowAlertsModal(false);
  };

  const handleCloseQuantityModal = () => {
    setShowQuantityModal(false);
  };

  const handleProductDataClick = (product: any) => {
    // Check if product has been saved (has an id and basic data)
    if (product.id && product.productName && product.basePrice) {
      // Product is saved, open the details modal
      setSavedProduct(product);
      setShowDetailsModal(true);
    } else {
      // Product is not saved, show save first message
      setShowSaveFirstModal(true);
    }
  };

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        // Check if this is an unsaved product (new product that hasn't been saved to DB yet)
        // An unsaved product has 'NEW' discount and empty required fields
        const isUnsavedProduct = productToDelete.discount === 'NEW' && 
                                (!productToDelete.productName || !productToDelete.basePrice);
        
        console.log('Delete logic - isUnsavedProduct:', isUnsavedProduct, 'product:', productToDelete);
        
        if (isUnsavedProduct) {
          // For unsaved products, just remove from local state
          console.log('Removing unsaved product from local state');
          setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
          showSuccess('Success', 'Unsaved product removed');
        } else {
          // For saved products, delete from database
          console.log('Deleting saved product from database');
          await productService.deleteProduct(productToDelete.id, token || undefined);
          showSuccess('Success', 'Product deleted successfully');
        }
        
        setShowDeleteModal(false);
        setProductToDelete(null);
        
        // Only reload products if we deleted from database
        if (!isUnsavedProduct) {
          await loadProducts();
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        showError('Error', 'Failed to delete product');
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleImageReplace = (product: any) => {
    // Check if the product is a new, unsaved product
    // A new product has 'NEW' discount and likely empty productName/basePrice
    if (product.discount === 'NEW' && (!product.productName || !product.basePrice)) {
      setShowSaveFirstModal(true); // Show the "Save First" warning
    } else {
      setSelectedProductForImage(product);
      setShowImageModal(true);
    }
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedProductForImage(null);
    setUploadedImages([]);
    setYoutubeLink('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
    if (uploadedImages.length > 0) {
      const newImages = [...uploadedImages];
      const primaryImage = newImages.splice(index, 1)[0];
      newImages.unshift(primaryImage);
      setUploadedImages(newImages);
    }
  };

  const saveImages = () => {
    if (selectedProductForImage && uploadedImages.length > 0) {
      // Update the product with the first image as primary
      handleInputChange(selectedProductForImage.id, 'image', uploadedImages[0]);
      handleCloseImageModal();
    }
  };

  const handleAddCategoryClick = () => {
    setShowCategoryModal(true);
  };

  const handleAlertsClick = () => {
    setShowAlertsModal(true);
  };

  const handleQuantityClick = () => {
    setShowQuantityModal(true);
  };

  const handlePinProduct = (productId: number) => {
    console.log('Product pinned:', productId);
    // Here you can add logic to save pinned state to backend
  };

  const addNewOption = () => {
    setQuantityFormData(prev => ({
      ...prev,
      options: [...prev.options, { name: '', values: [''] }]
    }));
  };

  const addOptionValue = (optionIndex: number) => {
    setQuantityFormData(prev => ({
      ...prev,
      options: prev.options.map((option, index) => 
        index === optionIndex 
          ? { ...option, values: [...option.values, ''] }
          : option
      )
    }));
  };

  const handleOptionNameChange = (optionIndex: number, value: string) => {
    setQuantityFormData(prev => ({
      ...prev,
      options: prev.options.map((option, index) => 
        index === optionIndex 
          ? { ...option, name: value }
          : option
      )
    }));
  };

  const handleOptionValueChange = (optionIndex: number, valueIndex: number, value: string) => {
    setQuantityFormData(prev => ({
      ...prev,
      options: prev.options.map((option, index) => 
        index === optionIndex 
          ? { 
              ...option, 
              values: option.values.map((val, vIndex) => 
                vIndex === valueIndex ? value : val
              )
            }
          : option
      )
    }));
  };

  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Products Grid</h4>
        </div>

        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Inspinia</a></li>
            <li className="breadcrumb-item"><a href="javascript: void(0);">Ecommerce</a></li>
            <li className="breadcrumb-item active">Products Grid</li>
          </ol>
        </div>
      </div>

      {/* Header Section */}
      <div className="row mb-2 px-4">
          <div className="col-lg-12">
            <form className="bg-light-subtle rounded border p-3">
                             <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                 <div className="d-flex align-items-center gap-3">
                   <div className="position-relative">
                     <button 
                       type="button"
                       className="btn btn-purple dropdown-toggle"
                       onClick={handleAddProduct}
                       data-bs-toggle="dropdown"
                       aria-expanded={showProductTypeDropdown}
                     >
                       <i data-lucide="plus" className="fs-sm me-2"></i> Add Product
                     </button>
                     
                     {showProductTypeDropdown && (
                       <div className="dropdown-menu show" style={{ 
                         position: 'absolute', 
                         top: '100%', 
                         left: '0', 
                         zIndex: 1000,
                         minWidth: '287px',
                         maxWidth: '287px',
                         padding: '0.25rem 0',
                         margin: '0.125rem 0 0',
                         backgroundColor: '#fff',
                         border: 'none',
                         borderRadius: '0.375rem',
                         boxShadow: '0 0.5rem 1rem rgba(0,0,0,.175)'
                       }}>

                         
                         {productTypes.map((type) => (
                           <div key={type.id}>
                             <button
                               type="button"
                               className="dropdown-item d-flex align-items-start p-2"
                               onClick={() => handleProductTypeSelect(type)}
                               style={{ 
                                 border: 'none', 
                                 background: 'transparent', 
                                 width: '100%',
                                 transition: 'background-color 0.2s ease'
                               }}
                               onMouseEnter={(e) => {
                                 e.currentTarget.style.backgroundColor = '#f8f9fa';
                               }}
                               onMouseLeave={(e) => {
                                 e.currentTarget.style.backgroundColor = 'transparent';
                               }}
                             >
                               <div className="me-2">
                                 <i className={type.icon} style={{ fontSize: '1.8rem', color: '#6c757d' }}></i>
                               </div>
                               <div className="flex-grow-1 text-start">
                                 <div className="d-flex align-items-center mb-0">
                                   <span className="fw-semibold">{type.title}</span>
                                 </div>
                                 <span className="text-muted" style={{ fontSize: '0.75rem' }}>{type.description}</span>
                               </div>
                             </button>

                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>

                 <div className="d-flex gap-1">
                   <button 
                     type="button"
                     className={`btn btn-icon ${!isListView ? 'btn-primary' : 'btn-soft-primary'}`}
                     onClick={() => setIsListView(false)}
                   >
                     <i data-lucide="layout-grid" className="fs-lg"></i>
                   </button>
                   <button 
                     type="button"
                     className={`btn btn-icon ${isListView ? 'btn-primary' : 'btn-soft-primary'}`}
                     onClick={() => setIsListView(true)}
                   >
                     <i data-lucide="list" className="fs-lg"></i>
                   </button>
                   <button 
                     type="button"
                     className="btn btn-light btn-icon" 
                     onClick={toggleFilter}
                     title="Filter Products"
                   >
                     <i className="ti ti-filter fs-lg"></i>
                   </button>
                 </div>
              </div>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="row g-2 px-4">
          {/* Products Grid/List */}
          <div className="col-12">
            {loading ? (
              <ProductSkeleton view={isListView ? 'list' : 'grid'} count={8} />
            ) : error ? (
              <div className="text-center" style={{ padding: '4rem 2rem' }}>
                <div className="mb-4">
                  <i className="ti ti-alert-circle text-danger" style={{ fontSize: '4rem' }}></i>
                </div>
                <h4 className="text-danger mb-3">Failed to load products</h4>
                <p className="text-muted mb-4">{error}</p>
                <button className="btn btn-primary" onClick={loadProducts}>
                  <i className="ti ti-refresh me-2"></i>Try Again
                </button>
              </div>
            ) : !isListView ? (
              <ProductGrid
                products={products}
                categories={categories}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                handleImageReplace={handleImageReplace}
                handleProductDataClick={handleProductDataClick}
                handleDeleteClick={handleDeleteClick}
                handleAddCategoryClick={handleAddCategoryClick}
                handleAlertsClick={handleAlertsClick}
                handleQuantityClick={handleQuantityClick}
                handlePinProduct={handlePinProduct}
              />
            ) : (
              <ProductList
                products={products}
                categories={categories}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                handleImageReplace={handleImageReplace}
                handleProductDataClick={handleProductDataClick}
                handleDeleteClick={handleDeleteClick}
                handleAddCategoryClick={handleAddCategoryClick}
                handleAlertsClick={handleAlertsClick}
                handleQuantityClick={handleQuantityClick}
                handlePinProduct={handlePinProduct}
              />
            )}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
            <span className="text-muted fst-italic">Last modification: <i className="ti ti-clock"></i> 4:55 pm - 22.04.2025</span>
            <ul className="pagination pagination-boxed mb-0 justify-content-center">
              <li className="page-item disabled"><a href="#" className="page-link"><i className="ti ti-chevrons-left"></i></a></li>
              <li className="page-item active"><a href="#" className="page-link">1</a></li>
              <li className="page-item"><a href="#" className="page-link">2</a></li>
              <li className="page-item"><a href="#" className="page-link">3</a></li>
              <li className="page-item"><a href="#" className="page-link"><i className="ti ti-chevrons-right"></i></a></li>
            </ul>
          </div>
        </div>

      {/* Filter Component */}
      <ProductFilter isFilterOpen={isFilterOpen} toggleFilter={toggleFilter} />

      {/* All Modals */}
      <ProductModals
        showDetailsModal={showDetailsModal}
        showCategoryModal={showCategoryModal}
        showAlertsModal={showAlertsModal}
        showQuantityModal={showQuantityModal}
        showSaveFirstModal={showSaveFirstModal}
        showDeleteModal={showDeleteModal}
        showImageModal={showImageModal}
        savedProduct={savedProduct}
        productToDelete={productToDelete}
        selectedProductForImage={selectedProductForImage}
        uploadedImages={uploadedImages}
        youtubeLink={youtubeLink}
        categories={categories}
        detailsFormData={detailsFormData}
        categoryFormData={categoryFormData}
        alertsFormData={alertsFormData}
        quantityFormData={quantityFormData}
        handleCloseModal={handleCloseModal}
        handleCloseCategoryModal={handleCloseCategoryModal}
        handleCloseAlertsModal={handleCloseAlertsModal}
        handleCloseQuantityModal={handleCloseQuantityModal}
        handleCloseImageModal={handleCloseImageModal}
        handleDetailsSubmit={handleDetailsSubmit}
        handleCategorySubmit={handleCategorySubmit}
        handleAlertsSubmit={handleAlertsSubmit}
        handleQuantitySubmit={handleQuantitySubmit}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
        handleDetailsInputChange={handleDetailsInputChange}
        handleCategoryInputChange={handleCategoryInputChange}
        handleAlertsInputChange={handleAlertsInputChange}
        handleQuantityInputChange={handleQuantityInputChange}
        handleFileUpload={handleFileUpload}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        removeImage={removeImage}
        setPrimaryImage={setPrimaryImage}
        saveImages={saveImages}
        addNewOption={addNewOption}
        addOptionValue={addOptionValue}
        handleOptionNameChange={handleOptionNameChange}
        handleOptionValueChange={handleOptionValueChange}
        setShowSaveFirstModal={setShowSaveFirstModal}
        setYoutubeLink={setYoutubeLink}
      />
    </Layout>
  );
};

export default Products;
