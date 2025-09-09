import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { ToggleSwitch } from '../../components/common';

const InvoiceSettings: React.FC = () => {
  const [invoiceMethod, setInvoiceMethod] = useState<'cart' | 'custom'>('cart');
  const [customPhrase, setCustomPhrase] = useState('');
  const [storeName, setStoreName] = useState('Electronic Store');
  const [displayOptions, setDisplayOptions] = useState({
    showProductImage: true,
    showProductDescription: true,
    showContactInfo: true,
    showInvoiceAcknowledgment: true,
    showReturnPolicy: true,
    showOrderNotes: true,
    showStoreAddress: true,
    showInvoiceBarcode: true,
    showProductBarcode: true,
    issueEnglishVersion: false,
    showProductWeight: true
  });

  const handleDisplayOptionChange = (option: keyof typeof displayOptions, checked: boolean) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  return (
    <Layout>
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
              <li className="breadcrumb-item active">Invoice Settings</li>
            </ol>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex gap-2 flex-wrap">
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
                to="/store-settings/information"
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
                <i className="ti ti-info-circle"></i>
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
                <i className="ti ti-shield-check"></i>
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
              <Link
                to="/store-settings/invoice"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  border: '1px solid #6f42c1',
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

        {/* Main Content - Two Column Layout */}
        <div className="row">
          {/* Left Column - Invoice Preview */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-eye me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Invoice Preview</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Preview how your invoice will appear to customers</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {/* Warning Message */}
                <div className="alert alert-info d-flex align-items-center mb-4">
                  <i className="ti ti-info-circle me-2"></i>
                  <small>This is a sample invoice, not a real one, and is only for reflecting elements</small>
                </div>

                {/* Invoice Content */}
                <div className="invoice-preview" style={{ 
                  border: '1px solid #dee2e6', 
                  borderRadius: '8px', 
                  padding: '20px',
                  backgroundColor: '#fff',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  {/* Date and Time */}
                  <div className="text-end mb-3">
                    <small className="text-muted">Wednesday, 20 July 2022 | 12:58 PM</small>
                  </div>

                  {/* Store Logo */}
                  <div className="text-center mb-4">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#6f42c1',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}>
                      {storeName.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Custom Phrase */}
                  {customPhrase && (
                    <div className="text-center mb-3">
                      <p className="mb-0 fw-medium" style={{ fontSize: '14px', color: '#6c757d' }}>{customPhrase}</p>
                    </div>
                  )}

                  {/* Store Name */}
                  <div className="text-center mb-4">
                    <h3 className="mb-0" style={{ color: '#6f42c1', fontWeight: 'bold' }}>{storeName || 'Electronic Store'}</h3>
                  </div>

                  {/* Invoice Header */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h4 className="mb-1" style={{ color: '#495057', fontWeight: 'bold' }}>Invoice</h4>
                      <p className="mb-0 text-muted">Invoice #: INV-2022-001</p>
                    </div>
                    <div className="text-end">
                      <p className="mb-1"><strong>Date:</strong> 20/07/2022</p>
                      <p className="mb-0"><strong>Time:</strong> 12:58 PM</p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 className="mb-2" style={{ color: '#495057', fontWeight: 'bold' }}>Bill To:</h6>
                      <p className="mb-1">John Doe</p>
                      <p className="mb-1">john.doe@email.com</p>
                      <p className="mb-0">123 Main Street, City, Country</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="mb-2" style={{ color: '#495057', fontWeight: 'bold' }}>Ship To:</h6>
                      <p className="mb-1">John Doe</p>
                      <p className="mb-1">123 Main Street</p>
                      <p className="mb-0">City, Country 12345</p>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="table-responsive mb-4">
                    <table className="table table-bordered">
                      <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                          <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Product</th>
                          <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Description</th>
                          <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Qty</th>
                          <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Price</th>
                          <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                            <div className="d-flex align-items-center">
                              {displayOptions.showProductImage && (
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  backgroundColor: '#e9ecef',
                                  borderRadius: '4px',
                                  marginRight: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <i className="ti ti-photo text-muted"></i>
                                </div>
                              )}
                              <div>
                                <div className="fw-medium">Wireless Headphones</div>
                                {displayOptions.showProductBarcode && (
                                  <small className="text-muted">Barcode: 123456789</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                            {displayOptions.showProductDescription ? (
                              <small>High-quality wireless headphones with noise cancellation</small>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>2</td>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>$99.99</td>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>$199.98</td>
                        </tr>
                        <tr>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                            <div className="d-flex align-items-center">
                              {displayOptions.showProductImage && (
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  backgroundColor: '#e9ecef',
                                  borderRadius: '4px',
                                  marginRight: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <i className="ti ti-photo text-muted"></i>
                                </div>
                              )}
                              <div>
                                <div className="fw-medium">USB-C Cable</div>
                                {displayOptions.showProductBarcode && (
                                  <small className="text-muted">Barcode: 987654321</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                            {displayOptions.showProductDescription ? (
                              <small>Fast charging USB-C cable, 6ft length</small>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>1</td>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>$19.99</td>
                          <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>$19.99</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Order Notes */}
                  {displayOptions.showOrderNotes && (
                    <div className="mb-4">
                      <h6 style={{ color: '#495057', fontWeight: 'bold' }}>Order Notes:</h6>
                      <p className="mb-0 text-muted">Please handle with care. Deliver to front door.</p>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>$219.97</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span>$9.99</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <span>$18.00</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Total:</strong>
                        <strong>$247.96</strong>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Acknowledgment */}
                  {displayOptions.showInvoiceAcknowledgment && (
                    <div className="mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                      <h6 className="mb-2" style={{ color: '#495057', fontWeight: 'bold' }}>Invoice Acknowledgment</h6>
                      <p className="mb-0 small text-muted">
                        Thank you for your purchase! This invoice serves as confirmation of your order. 
                        Please keep this document for your records.
                      </p>
                    </div>
                  )}

                  {/* Return Policy */}
                  {displayOptions.showReturnPolicy && (
                    <div className="mt-4 p-3" style={{ backgroundColor: '#fff3cd', borderRadius: '6px' }}>
                      <h6 className="mb-2" style={{ color: '#856404', fontWeight: 'bold' }}>Return & Exchange Policy</h6>
                      <p className="mb-0 small" style={{ color: '#856404' }}>
                        Returns accepted within 30 days of purchase. Items must be in original condition. 
                        Contact us for return authorization.
                      </p>
                    </div>
                  )}

                  {/* Store Address */}
                  {displayOptions.showStoreAddress && (
                    <div className="mt-4 text-center">
                      <h6 className="mb-2" style={{ color: '#495057', fontWeight: 'bold' }}>Store Information</h6>
                      <p className="mb-1 small text-muted">123 Business Street, Commerce City, CC 12345</p>
                      <p className="mb-0 small text-muted">Phone: (555) 123-4567 | Email: info@store.com</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  {displayOptions.showContactInfo && (
                    <div className="mt-4 text-center">
                      <h6 className="mb-2" style={{ color: '#495057', fontWeight: 'bold' }}>Contact Information</h6>
                      <p className="mb-1 small text-muted">Customer Service: (555) 123-4567</p>
                      <p className="mb-0 small text-muted">Email: support@store.com | Website: www.store.com</p>
                    </div>
                  )}

                  {/* Invoice Barcode */}
                  {displayOptions.showInvoiceBarcode && (
                    <div className="mt-4 text-center">
                      <div style={{
                        display: 'inline-block',
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        border: '1px solid #dee2e6'
                      }}>
                        <div style={{
                          height: '40px',
                          backgroundColor: '#000',
                          width: '200px',
                          margin: '0 auto 5px'
                        }}></div>
                        <small className="text-muted">Invoice Barcode: INV-2022-001</small>
                      </div>
                    </div>
                  )}

                  {/* Product Weight */}
                  {displayOptions.showProductWeight && (
                    <div className="mt-3 text-center">
                      <small className="text-muted">Total Weight: 2.5 lbs</small>
                    </div>
                  )}

                  {/* English Version Note */}
                  {displayOptions.issueEnglishVersion && (
                    <div className="mt-4 text-center">
                      <div className="badge bg-info">English Version Available</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Control Elements */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-settings me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Control Elements</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Configure invoice display options and settings</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {/* Invoice Issuance Method */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Invoice Issuance Method</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="invoiceMethod"
                        id="cart"
                        value="cart"
                        checked={invoiceMethod === 'cart'}
                        onChange={(e) => setInvoiceMethod(e.target.value as 'cart' | 'custom')}
                      />
                      <label className="form-check-label" htmlFor="cart">
                        Cart
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="invoiceMethod"
                        id="custom"
                        value="custom"
                        checked={invoiceMethod === 'custom'}
                        onChange={(e) => setInvoiceMethod(e.target.value as 'cart' | 'custom')}
                      />
                      <label className="form-check-label" htmlFor="custom">
                        Custom
                      </label>
                    </div>
                  </div>
                </div>

                {/* Store Address */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Store Address</label>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a custom phrase before the store name, at the top of the invoice"
                      value={customPhrase}
                      onChange={(e) => setCustomPhrase(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="ti ti-store"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Electronic Store"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Display Options */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Display Options</label>
                  
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Show Product Image</label>
                      <small className="text-muted d-block">Display product image</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showProductImage}
                      onChange={(checked) => handleDisplayOptionChange('showProductImage', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Show Product Description</label>
                      <small className="text-muted d-block">Display a snippet from product description</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showProductDescription}
                      onChange={(checked) => handleDisplayOptionChange('showProductDescription', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Show Contact Information</label>
                      <small className="text-muted d-block">Display contact information</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showContactInfo}
                      onChange={(checked) => handleDisplayOptionChange('showContactInfo', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Show Invoice Acknowledgment / Order Summary</label>
                      <small className="text-muted d-block">Display acknowledgment text</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showInvoiceAcknowledgment}
                      onChange={(checked) => handleDisplayOptionChange('showInvoiceAcknowledgment', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Show Return & Exchange Policy</label>
                      <small className="text-muted d-block">Display return and exchange policy</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showReturnPolicy}
                      onChange={(checked) => handleDisplayOptionChange('showReturnPolicy', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Show Order Notes</label>
                      <small className="text-muted d-block">Display order notes entered by the customer</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showOrderNotes}
                      onChange={(checked) => handleDisplayOptionChange('showOrderNotes', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Show Store Address</label>
                      <small className="text-muted d-block">Display store address</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showStoreAddress}
                      onChange={(checked) => handleDisplayOptionChange('showStoreAddress', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Show Invoice Barcode</label>
                      <small className="text-muted d-block">Display invoice barcode</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showInvoiceBarcode}
                      onChange={(checked) => handleDisplayOptionChange('showInvoiceBarcode', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Show Product Barcode</label>
                      <small className="text-muted d-block">Display product barcode</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showProductBarcode}
                      onChange={(checked) => handleDisplayOptionChange('showProductBarcode', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">Issue English Version of Invoice</label>
                      <small className="text-muted d-block">You will be able to print the invoice in Arabic and English</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.issueEnglishVersion}
                      onChange={(checked) => handleDisplayOptionChange('issueEnglishVersion', checked)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <label className="form-label mb-0">Show Product Weight</label>
                      <small className="text-muted d-block">Display product weight</small>
                    </div>
                    <ToggleSwitch
                      checked={displayOptions.showProductWeight}
                      onChange={(checked) => handleDisplayOptionChange('showProductWeight', checked)}
                    />
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
                <button className="btn btn-primary">
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

export default InvoiceSettings;