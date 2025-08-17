

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  stock: string;
  price: string;
  rating: number;
  reviews: number;
  status: 'active' | 'low-stock' | 'out-of-stock';
}

const ProductInventoryTable: React.FC = () => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Smart Watch',
      category: 'Wearables',
      image: '/assets/images/products/1.png',
      stock: '120 units',
      price: '$89.99',
      rating: 4,
      reviews: 45,
      status: 'active'
    },
    {
      id: '2',
      name: 'Bluetooth Speaker',
      category: 'Audio',
      image: '/assets/images/products/2.png',
      stock: '75 units',
      price: '$39.50',
      rating: 3,
      reviews: 20,
      status: 'low-stock'
    },
    {
      id: '3',
      name: 'Gaming Mouse',
      category: 'Accessories',
      image: '/assets/images/products/4.png',
      stock: '0 units',
      price: '$24.99',
      rating: 5,
      reviews: 14,
      status: 'out-of-stock'
    },
    {
      id: '4',
      name: '4K Action Camera',
      category: 'Cameras',
      image: '/assets/images/products/5.png',
      stock: '60 units',
      price: '$149.00',
      rating: 4,
      reviews: 31,
      status: 'active'
    },
    {
      id: '5',
      name: 'Fitness Tracker Band',
      category: 'Wearables',
      image: '/assets/images/products/6.png',
      stock: '220 units',
      price: '$34.95',
      rating: 4.5,
      reviews: 18,
      status: 'active'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <i className="ti ti-circle-filled fs-xs text-success"></i>;
      case 'low-stock':
        return <i className="ti ti-circle-filled fs-xs text-warning"></i>;
      case 'out-of-stock':
        return <i className="ti ti-circle-filled fs-xs text-danger"></i>;
      default:
        return <i className="ti ti-circle-filled fs-xs text-secondary"></i>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="ti ti-star-filled"></span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="ti ti-star-half-filled"></span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="ti ti-star"></span>);
    }

    return stars;
  };

  return (
    <div data-table data-table-rows-per-page="5" className="card">
      <div className="card-header justify-content-between align-items-center border-dashed">
        <h4 className="card-title mb-0">Product Inventory</h4>
        <div className="d-flex gap-2">
          <a href="ecommerce-add-product.html" className="btn btn-sm btn-soft-secondary">
            <i className="ti ti-plus me-1"></i> Add Product
          </a>
          <a href="javascript:void(0);" className="btn btn-sm btn-primary">
            <i className="ti ti-file-export me-1"></i> Export CSV
          </a>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-centered table-custom table-sm table-nowrap table-hover mb-0">
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img src={product.image} alt="" className="avatar-sm rounded-circle me-2" />
                      <div>
                        <h5 className="fs-base my-1">
                          <a href="ecommerce-product-details.html" className="text-body">{product.name}</a>
                        </h5>
                        <span className="text-muted fs-xs">{product.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted fs-xs">Stock</span>
                    <h5 className="fs-base mt-1 fw-normal">{product.stock}</h5>
                  </td>
                  <td>
                    <span className="text-muted fs-xs">Price</span>
                    <h5 className="fs-base mt-1 fw-normal">{product.price}</h5>
                  </td>
                  <td>
                    <span className="text-muted fs-xs">Ratings</span>
                    <h5 className="fs-base mt-1 fw-normal">
                      <span className="text-warning">
                        {renderStars(product.rating)}
                      </span>
                      <span className="ms-1">
                        <a href="ecommerce-reviews.html" className="link-reset fw-semibold">({product.reviews})</a>
                      </span>
                    </h5>
                  </td>
                  <td>
                    <span className="text-muted fs-xs">Status</span>
                    <h5 className="fs-base mt-1 fw-normal">
                      {getStatusIcon(product.status)} {getStatusText(product.status)}
                    </h5>
                  </td>
                  <td style={{ width: '30px' }}>
                    <div className="dropdown">
                      <a href="#" className="dropdown-toggle text-muted drop-arrow-none card-drop p-0" data-bs-toggle="dropdown">
                        <i className="ti ti-dots-vertical fs-lg"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="#" className="dropdown-item">Edit Product</a>
                        <a href="#" className="dropdown-item">Remove</a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer border-0">
        <div className="align-items-center justify-content-between row text-center text-sm-start">
          <div className="col-sm">
            <div data-table-pagination-info="products"></div>
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0">
            <div data-table-pagination></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInventoryTable;
