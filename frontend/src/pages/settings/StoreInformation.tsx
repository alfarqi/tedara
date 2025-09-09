import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// Custom Toggle Switch Component
const CustomToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => {
  return (
    <input 
      className="switch" 
      type="checkbox" 
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
};

// Custom CSS for the new toggle switch
const customToggleStyle = `
  .switch {
    position: relative;
    height: 1.2rem;
    width: 2.4rem;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    border-radius: 9999px;
    background-color: rgba(100, 116, 139, 0.377);
    transition: all .3s ease;
  }

  .switch:checked {
    background-color: rgba(32, 151, 243, 1);
  }

  .switch::before {
    position: absolute;
    content: "";
    left: calc(1.2rem - 1.3rem);
    top: calc(1.2rem - 1.3rem);
    display: block;
    height: 1.3rem;
    width: 1.3rem;
    cursor: pointer;
    border: 1px solid rgba(100, 116, 139, 0.527);
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 3px 10px rgba(100, 116, 139, 0.327);
    transition: all .3s ease;
  }

  .switch:hover::before {
    box-shadow: 0 0 0px 8px rgba(0, 0, 0, .15)
  }

  .switch:checked:hover::before {
    box-shadow: 0 0 0px 8px rgba(32, 151, 243, .15)
  }

  .switch:checked:before {
    transform: translateX(100%);
    border-color: rgba(32, 151, 243, 1);
  }
`;

const StoreInformation: React.FC = () => {
  // Products Settings State
  const [productSettings, setProductSettings] = useState({
    allowDuplicateProducts: true,
    customizePurchaseTimes: true,
    showOutOfStockAtEnd: false,
    showMoreDetailsButton: true,
    showZeroPriceMark: false,
    showRecommendedProducts: true,
    showPriceRange: true,
    digitalProductProtection: false,
    showWeight: true,
    showSKU: true,
    showHSCode: true
  });

  // Orders Settings State
  const [orderSettings, setOrderSettings] = useState({
    receiveOrders: true,
    orderReceptionTimes: true,
    allowOrderNotes: true,
    allowCustomerCancel: true,
    setExecutedStatus: true,
    autoRestoreInventory: true,
    disablePaymentGracePeriod: true,
    showShippingIndicator: true,
    enablePriceQuote: false,
    enableReorder: true,
    acknowledgementBeforeSend: true,
    customizeCompletionPage: true,
    customizePreparationList: true,
    shippingPolicyFees: true
  });

  // Customers Settings State
  const [customerSettings, setCustomerSettings] = useState({
    emailOptional: false,
    enableEmailLogin: true,
    mergeCartAfterLogin: true,
    notifySafariApplePay: true
  });

  // Questions & Reviews Settings State
  const [qaSettings, setQaSettings] = useState({
    publishQuestionsDirectly: true,
    enableQuestionsOnPages: true,
    enableQuestionsOnProducts: false,
    preventVisitorQuestions: false
  });

  // Default Weight Setting
  const [defaultWeight, setDefaultWeight] = useState({
    unit: 'kg',
    value: '0.1'
  });

  const handleProductSettingChange = (key: string, value: boolean) => {
    setProductSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleOrderSettingChange = (key: string, value: boolean) => {
    setOrderSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCustomerSettingChange = (key: string, value: boolean) => {
    setCustomerSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleQASettingChange = (key: string, value: boolean) => {
    setQaSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDefaultWeightChange = (field: string, value: string) => {
    setDefaultWeight(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement save functionality
    console.log('Saving settings...', {
      productSettings,
      orderSettings,
      customerSettings,
      qaSettings,
      defaultWeight
    });
  };

  return (
    <Layout>
      <style>{customToggleStyle}</style>
      <div className="container-fluid">
        {/* Page Title */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">Store Settings</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/store-settings">Store Settings</Link></li>
              <li className="breadcrumb-item active">Store Options</li>
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
                    <i className="ti ti-package"></i>
                    Products
                  </Link>
            </div>
          </div>
        </div>

        {/* Default Weight Setting */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Default weight for each product when sending the order to the shipping company</h6>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <select 
                      className="form-select" 
                      style={{ width: '80px' }}
                      value={defaultWeight.unit}
                      onChange={(e) => handleDefaultWeightChange('unit', e.target.value)}
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="lb">lb</option>
                      <option value="oz">oz</option>
                    </select>
                    <input 
                      type="number" 
                      className="form-control" 
                      style={{ width: '100px' }}
                      value={defaultWeight.value}
                      onChange={(e) => handleDefaultWeightChange('value', e.target.value)}
                      step="0.1"
                      min="0"
                    />
                    <i className="ti ti-shopping-cart text-muted"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-package me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Products</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Configure product display and behavior settings</p>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: '0' }}>
                <div className="row g-3">
                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Allow duplicate products in the cart</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.allowDuplicateProducts}
                        onChange={(checked) => handleProductSettingChange('allowDuplicateProducts', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Customize the appearance of purchase times for products</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.customizePurchaseTimes}
                        onChange={(checked) => handleProductSettingChange('customizePurchaseTimes', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Display out-of-stock products at the end of pages</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.showOutOfStockAtEnd}
                        onChange={(checked) => handleProductSettingChange('showOutOfStockAtEnd', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Display a "more details" button for product description</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.showMoreDetailsButton}
                        onChange={(checked) => handleProductSettingChange('showMoreDetailsButton', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Display a mark when product price is zero</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.showZeroPriceMark}
                        onChange={(checked) => handleProductSettingChange('showZeroPriceMark', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Display products you might like on the product page</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.showRecommendedProducts}
                        onChange={(checked) => handleProductSettingChange('showRecommendedProducts', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Enable displaying price range on the product</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.showPriceRange}
                        onChange={(checked) => handleProductSettingChange('showPriceRange', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Apply digital product protection for PDF files</h6>
                        <i className="ti ti-info-circle text-muted"></i>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.digitalProductProtection}
                        onChange={(checked) => handleProductSettingChange('digitalProductProtection', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Display weight in product details, cart page, and invoices</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.showWeight}
                        onChange={(checked) => handleProductSettingChange('showWeight', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Display SKU in product and order details</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={productSettings.showSKU}
                        onChange={(checked) => handleProductSettingChange('showSKU', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Show HS Code field within product data</h6>
                  </div>
                      <CustomToggleSwitch
                        checked={productSettings.showHSCode}
                        onChange={(checked) => handleProductSettingChange('showHSCode', checked)}
                      />
                  </div>
                  </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Orders Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-shopping-cart me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Orders</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Configure order processing and management settings</p>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: '0' }}>
                <div className="row g-3">
                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Receive Orders</h6>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Order Reception Times</h6>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Allow adding a note to the order</h6>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Allow customer to cancel order before execution</h6>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Set status (Executed) when order</h6>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Automatically restore inventory based on order status</h6>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Disable payment grace period in bank transfer</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={orderSettings.disablePaymentGracePeriod}
                        onChange={(checked) => handleOrderSettingChange('disablePaymentGracePeriod', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Show shipping indicator</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={orderSettings.showShippingIndicator}
                        onChange={(checked) => handleOrderSettingChange('showShippingIndicator', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Enable price quote request feature</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={orderSettings.enablePriceQuote}
                        onChange={(checked) => handleOrderSettingChange('enablePriceQuote', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Enable reorder</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={orderSettings.enableReorder}
                        onChange={(checked) => handleOrderSettingChange('enableReorder', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Acknowledgement before sending order</h6>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Customize order completion page</h6>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Customize order preparation list</h6>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Method of deducting shipping policy fees</h6>
                  </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                  </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Customers Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-users me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Customers</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Configure customer account and behavior settings</p>
              </div>
                    </div>
                  </div>
              <div className="card-body" style={{ paddingTop: '0' }}>
                <div className="row g-3">
                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Email is optional for customers</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={customerSettings.emailOptional}
                        onChange={(checked) => handleCustomerSettingChange('emailOptional', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Enable login using email</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={customerSettings.enableEmailLogin}
                        onChange={(checked) => handleCustomerSettingChange('enableEmailLogin', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Merge customer shopping cart after login</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={customerSettings.mergeCartAfterLogin}
                        onChange={(checked) => handleCustomerSettingChange('mergeCartAfterLogin', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Notify customers using Safari browser to pay via Apple Pay</h6>
                  </div>
                      <CustomToggleSwitch
                        checked={customerSettings.notifySafariApplePay}
                        onChange={(checked) => handleCustomerSettingChange('notifySafariApplePay', checked)}
                      />
                </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                    </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Method for determining customer address</h6>
                  </div>
                      <button className="btn btn-outline-primary btn-sm">Assign</button>
                  </div>
                </div>
                    </div>
                  </div>
                  </div>
                </div>
        </div>

        {/* Questions & Reviews Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-message-circle me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Questions & Reviews</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Configure customer questions and review settings</p>
                  </div>
                    </div>
                  </div>
              <div className="card-body" style={{ paddingTop: '0' }}>
                <div className="row g-3">
                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Publish questions directly without review</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={qaSettings.publishQuestionsDirectly}
                        onChange={(checked) => handleQASettingChange('publishQuestionsDirectly', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Activate questions on profile pages</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={qaSettings.enableQuestionsOnPages}
                        onChange={(checked) => handleQASettingChange('enableQuestionsOnPages', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Activate adding questions to products</h6>
                </div>
                      <CustomToggleSwitch
                        checked={qaSettings.enableQuestionsOnProducts}
                        onChange={(checked) => handleQASettingChange('enableQuestionsOnProducts', checked)}
                      />
                    </div>
                    <hr className="my-2" style={{ borderColor: '#e9ecef', opacity: 0.5, marginLeft: '-1rem', marginRight: '-1rem' }} />
                  </div>

                  <div className="col-12" style={{ padding: '0 0 0 1rem' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: 'normal', lineHeight: '1.2' }}>Prevent visitors from adding questions</h6>
                      </div>
                      <CustomToggleSwitch
                        checked={qaSettings.preventVisitorQuestions}
                        onChange={(checked) => handleQASettingChange('preventVisitorQuestions', checked)}
                      />
                    </div>
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
                <button 
                  className="btn btn-primary"
                  onClick={handleSaveSettings}
                >
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

export default StoreInformation;





