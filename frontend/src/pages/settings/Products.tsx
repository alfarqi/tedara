import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ToggleSwitch } from '../../components/common';

const ProductSettings: React.FC = () => {
  const productSettings = [
    { id: 'duplicate-cart', name: 'Ability to duplicate products in the cart', enabled: true, description: 'Allow customers to add the same product multiple times to their cart' },
    { id: 'purchase-times', name: 'Customize product purchase display times', enabled: true, description: 'Show how many times a product has been purchased' },
    { id: 'out-of-stock-end', name: 'Display out-of-stock products at the end of pages', enabled: true, description: 'Show out-of-stock products at the bottom of product listings' },
    { id: 'more-details-button', name: 'Show more details button for product description', enabled: true, description: 'Display a "Show More" button for long product descriptions' },
    { id: 'zero-price-label', name: 'Show label when product price is zero', enabled: false, description: 'Display a special label for free products' },
    { id: 'related-products', name: 'Show products you might like on the product page', enabled: true, description: 'Display related product recommendations' },
    { id: 'price-range', name: 'Enable price range display on the product', enabled: true, description: 'Show price range for products with variable pricing' },
    { id: 'digital-protection', name: 'Enable digital product protection for PDF files', enabled: false, description: 'Add protection to downloadable PDF products', hasInfo: true },
    { id: 'display-weight', name: 'Display weight in product details, cart page, and invoices', enabled: true, description: 'Show product weight in various locations' },
    { id: 'display-sku', name: 'Display SKU in product and order details', enabled: true, description: 'Show Stock Keeping Unit in product information' },
    { id: 'hs-code', name: 'Show HS Code field within product data', enabled: true, description: 'Display Harmonized System code for international shipping' },
    { id: 'default-weight', name: 'Default weight for each product when sending the order to the shipping company', enabled: true, description: 'Set default weight for shipping calculations', hasInput: true, inputValue: '0.1', inputUnit: 'kg' }
  ];

  return (
    <Layout>
      <div className="container-fluid">
        {/* Page Title */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">Products</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/store-settings">Store Settings</Link></li>
              <li className="breadcrumb-item active">Products</li>
            </ol>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex gap-2">
                  <Link
                    to="/store-settings/general"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-settings"></i>
                    General Settings
                  </Link>
                  <Link
                    to="/store-settings/store"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-building-store"></i>
                    Store Information
                  </Link>
                  <Link
                    to="/store-settings/payment"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-credit-card"></i>
                    Payment Methods
                  </Link>
                  <Link
                    to="/store-settings/shipping"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-truck-delivery"></i>
                    Shipping & Delivery
                  </Link>
                  <Link
                    to="/store-settings/notifications"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-bell"></i>
                    Notifications
                  </Link>
                  <Link
                    to="/store-settings/security"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-shield-lock"></i>
                    Security
                  </Link>
                  <Link
                    to="/store-settings/products"
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-package"></i>
                    Products
                  </Link>
                  <Link
                    to="/store-settings/invoice"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-file-invoice"></i>
                    Invoice
                  </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-package me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Products</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Product display and behavior settings</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  {productSettings.map((setting) => (
                    <div key={setting.id} className="col-12 mb-3">
                      <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                        <div className="d-flex align-items-center flex-grow-1">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-2" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                {setting.name}
                              </h6>
                              {setting.hasInfo && (
                                <i className="ti ti-info-circle text-muted" style={{ fontSize: '0.85rem' }}></i>
                              )}
                            </div>
                            <small className="text-muted d-block mt-1" style={{ fontSize: '0.8rem' }}>{setting.description}</small>
                            {setting.hasInput && (
                              <div className="d-flex align-items-center mt-2">
                                <input
                                  type="number"
                                  className="form-control form-control-sm me-2"
                                  style={{ width: '80px' }}
                                  defaultValue={setting.inputValue}
                                />
                                <select className="form-select form-select-sm" style={{ width: '80px' }}>
                                  <option>{setting.inputUnit}</option>
                                  <option>kg</option>
                                  <option>g</option>
                                  <option>lb</option>
                                </select>
                                <i className="ti ti-weight ms-2 text-muted"></i>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ms-3">
                          <ToggleSwitch
                            checked={setting.enabled}
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-layout-grid me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Product Display Settings</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Configure how products are displayed and organized</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Products per Page</label>
                    <select className="form-select">
                      <option>12</option>
                      <option>24</option>
                      <option>36</option>
                      <option>48</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Default Sort Order</label>
                    <select className="form-select">
                      <option>Newest First</option>
                      <option>Oldest First</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Name: A to Z</option>
                      <option>Name: Z to A</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Image Quality</label>
                    <select className="form-select">
                      <option>High Quality</option>
                      <option>Medium Quality</option>
                      <option>Low Quality</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Lazy Loading</label>
                    <select className="form-select">
                      <option>Enabled</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-end">
                <button className="btn btn-secondary me-2">Cancel</button>
                <button className="btn" style={{ backgroundColor: '#6366f1', borderColor: '#6366f1', color: 'white' }}>
                  <i className="ti ti-device-floppy me-2"></i>Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductSettings;
