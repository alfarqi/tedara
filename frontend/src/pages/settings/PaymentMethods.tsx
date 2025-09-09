import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ToggleSwitch } from '../../components/common';

const PaymentMethods: React.FC = () => {
  const paymentMethods = [
    { id: 'mada', name: 'Mada', enabled: true, icon: '💳' },
    { id: 'visa', name: 'Visa', enabled: true, icon: '💳' },
    { id: 'mastercard', name: 'Mastercard', enabled: true, icon: '💳' },
    { id: 'paypal', name: 'PayPal', enabled: false, icon: '💳' },
    { id: 'apple-pay', name: 'Apple Pay', enabled: false, icon: '🍎' },
    { id: 'google-pay', name: 'Google Pay', enabled: false, icon: '🤖' }
  ];

  return (
    <Layout>
      <div className="container-fluid">
        {/* Page Title */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">Payment Methods</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/store-settings">Store Settings</Link></li>
              <li className="breadcrumb-item active">Payment Methods</li>
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
                  <i className="ti ti-credit-card me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Payment Methods</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Configure payment methods for your store</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="col-md-6">
                      <div className="card border">
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <span className="fs-4 me-3">{method.icon}</span>
                              <div>
                                <h6 className="mb-0" style={{ fontSize: '0.9rem', fontWeight: '600' }}>{method.name}</h6>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Payment method</small>
                              </div>
                            </div>
                            <ToggleSwitch
                              checked={method.enabled}
                              onChange={() => {}}
                            />
                          </div>
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
                  <i className="ti ti-settings me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Payment Settings</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Configure payment processing settings</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Minimum Order Amount</label>
                    <input type="number" className="form-control" placeholder="0.00" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Maximum Order Amount</label>
                    <input type="number" className="form-control" placeholder="10000.00" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Payment Due Days</label>
                    <input type="number" className="form-control" placeholder="30" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Auto-capture Payments</label>
                    <select className="form-select">
                      <option>Immediately</option>
                      <option>After 24 hours</option>
                      <option>After 48 hours</option>
                      <option>Manual</option>
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

export default PaymentMethods;






