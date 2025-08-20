import Layout from '../components/layout/Layout';
import { useState, useEffect } from 'react';
import ProductGrid from '../components/products/ProductGrid';
import ProductList from '../components/products/ProductList';
import ProductModals from '../components/products/ProductModals';
import ProductFilter from '../components/products/ProductFilter';
import type { Product } from '../types/product';

const Products: React.FC = () => {
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

  const [categories, setCategories] = useState([
    'Furniture',
    'Electronics', 
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books'
  ]);

  // Product data for all items
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      productName: 'Modern Minimalist Fabric Sofa Single Seater',
      basePrice: '764.15',
      originalPrice: '899.00',
      stock: '12',
      category: 'Furniture',
      image: '/assets/images/products/1.png',
      rating: 4.5,
      reviews: 45,
      discount: '15% OFF',
      discountType: 'percentage'
    },
    {
      id: 2,
      productName: 'Funky Streetwear Sneakers - Neon Splash',
      basePrice: '44.99',
      originalPrice: '59.99',
      stock: '8',
      category: 'Fashion',
      image: '/assets/images/products/2.png',
      rating: 3.0,
      reviews: 32,
      discount: '25% OFF',
      discountType: 'percentage'
    },
    {
      id: 3,
      productName: 'Noise Canceling Wireless Earbuds - Black Edition',
      basePrice: '42.49',
      originalPrice: '49.99',
      stock: '15',
      category: 'Electronics',
      image: '/assets/images/products/3.png',
      rating: 3.0,
      reviews: 58,
      discount: '15% OFF',
      discountType: 'percentage'
    },
    {
      id: 4,
      productName: 'Minimalist Solid Wood Dining Chair',
      basePrice: '96.00',
      originalPrice: '120.00',
      stock: '6',
      category: 'Furniture',
      image: '/assets/images/products/4.png',
      rating: 4.0,
      reviews: 46,
      discount: '20% OFF',
      discountType: 'percentage'
    },
    {
      id: 5,
      productName: 'Modern Black Minimalist Wall Clock',
      basePrice: '39.99',
      originalPrice: '49.99',
      stock: '10',
      category: 'Home & Garden',
      image: '/assets/images/products/5.png',
      rating: 4.0,
      reviews: 62,
      discount: '20% OFF',
      discountType: 'percentage'
    },
    {
      id: 6,
      productName: 'Elegant Brown Wooden Chair',
      basePrice: '96.00',
      originalPrice: '120.00',
      stock: '7',
      category: 'Furniture',
      image: '/assets/images/products/6.png',
      rating: 4.0,
      reviews: 48,
      discount: '20% OFF',
      discountType: 'percentage'
    },
    {
      id: 7,
      productName: 'Apple iMac 24" Retina 4.5K Display',
      basePrice: '1039.20',
      originalPrice: '1299.00',
      stock: '3',
      category: 'Electronics',
      image: '/assets/images/products/7.png',
      rating: 4.5,
      reviews: 65,
      discount: '20% OFF',
      discountType: 'percentage'
    },
    {
      id: 8,
      productName: 'Coolest Ergonomic Lounge Chair',
      basePrice: '256.00',
      originalPrice: '320.00',
      stock: '5',
      category: 'Furniture',
      image: '/assets/images/products/8.png',
      rating: 4.0,
      reviews: 52,
      discount: '20% OFF',
      discountType: 'percentage'
    }
  ]);

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

  const handleSubmit = (productId: number) => {
    // Handle form submission for individual product
    console.log('Saving product:', productId);
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

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
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
      <div className="container-fluid">
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
            {!isListView ? (
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
