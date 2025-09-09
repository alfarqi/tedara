import Layout from '../../components/layout/Layout';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToggleSwitch } from '../../components/common';

interface NotificationSetting {
  id: string;
  name: string;
  appNotification: boolean;
  emailNotification: boolean;
  isNew?: boolean;
}

const Notifications: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { id: 'new-orders', name: 'New Orders', appNotification: true, emailNotification: false },
    { id: 'add-to-cart', name: 'Add Product to Cart', appNotification: true, emailNotification: true },
    { id: 'store-rating', name: 'Store Rating', appNotification: true, emailNotification: true },
    { id: 'product-rating', name: 'Product Ratings', appNotification: true, emailNotification: true },
    { id: 'shipping-rating', name: 'Shipping Company Rating', appNotification: true, emailNotification: true },
    { id: 'customer-inquiry', name: 'Customer Inquiry', appNotification: true, emailNotification: true },
    { id: 'staff-activation', name: 'Activate Store Staff Accounts', appNotification: true, emailNotification: true },
    { id: 'electronic-payments', name: 'Electronic Payments', appNotification: true, emailNotification: true, isNew: true },
    { id: 'low-stock', name: 'Low Stock Alert', appNotification: true, emailNotification: true },
    { id: 'cod-payments', name: 'Cash on Delivery Payments', appNotification: true, emailNotification: true }
  ]);

  const handleNotificationChange = (id: string, type: 'app' | 'email', checked: boolean) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, [type === 'app' ? 'appNotification' : 'emailNotification']: checked }
          : setting
      )
    );
  };

  const handleSaveSettings = () => {
    // TODO: Implement save functionality
    console.log('Saving notification settings...', notificationSettings);
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
              <li className="breadcrumb-item active">Notifications</li>
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

        {/* Notification Settings Table */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-bell me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Notifications</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Configure notification settings for your store</p>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: '0' }}>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                        <th style={{ padding: '1rem 0.75rem', fontWeight: '600', fontSize: '14px', color: '#495057' }}>Notification Type</th>
                        <th style={{ padding: '1rem 0.75rem', fontWeight: '600', fontSize: '14px', color: '#495057', textAlign: 'center' }}>Application Notifications</th>
                        <th style={{ padding: '1rem 0.75rem', fontWeight: '600', fontSize: '14px', color: '#495057', textAlign: 'center' }}>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notificationSettings.map((setting, index) => (
                        <tr key={setting.id} style={{ borderBottom: index < notificationSettings.length - 1 ? '1px solid #f1f3f4' : 'none' }}>
                          <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle' }}>
                            <div className="d-flex align-items-center">
                              <span style={{ fontSize: '14px', fontWeight: '500', color: '#212529' }}>
                                {setting.name}
                              </span>
                              {setting.isNew && (
                                <span 
                                  className="badge ms-2" 
                                  style={{ 
                                    backgroundColor: '#e3f2fd', 
                                    color: '#1976d2', 
                                    fontSize: '10px',
                                    fontWeight: '500',
                                    padding: '2px 6px'
                                  }}
                                >
                                  New
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '1rem 0.75rem', textAlign: 'center', verticalAlign: 'middle' }}>
                            <ToggleSwitch
                              checked={setting.appNotification}
                              onChange={(checked) => handleNotificationChange(setting.id, 'app', checked)}
                            />
                          </td>
                          <td style={{ padding: '1rem 0.75rem', textAlign: 'center', verticalAlign: 'middle' }}>
                            <ToggleSwitch
                              checked={setting.emailNotification}
                              onChange={(checked) => handleNotificationChange(setting.id, 'email', checked)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default Notifications;






