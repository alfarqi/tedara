import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ToggleSwitch } from '../../components/common';

const Advanced: React.FC = () => {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceTitle, setMaintenanceTitle] = useState('Store Under Maintenance');
  const [maintenanceMessage, setMaintenanceMessage] = useState('Sorry dear customer, the store is currently under maintenance and we will resume work shortly.');

  const handleSaveMaintenanceSettings = () => {
    // TODO: Implement save functionality
    console.log('Saving maintenance settings...', {
      maintenanceMode,
      maintenanceTitle,
      maintenanceMessage
    });
    setShowMaintenanceModal(false);
  };

  return (
    <Layout>
      <div className="container-fluid">
        {/* Page Title */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">Advanced</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/store-settings">Store Settings</Link></li>
              <li className="breadcrumb-item active">Advanced</li>
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
                    to="/store-settings/advanced"
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
                    <i className="ti ti-tools"></i>
                    Advanced
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

        {/* Advanced Settings Cards */}
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100" style={{ cursor: 'pointer' }} onClick={() => setShowMaintenanceModal(true)}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="ti ti-alert-triangle fs-1 text-warning"></i>
                </div>
                <h6 className="card-title">Maintenance Mode</h6>
                <p className="card-text text-muted small">Temporarily close the store</p>
                <div className="mt-3">
                  <ToggleSwitch
                    checked={maintenanceMode}
                    onChange={(checked) => setMaintenanceMode(checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="ti ti-database fs-1 text-primary"></i>
                </div>
                <h6 className="card-title">Cache Settings</h6>
                <p className="card-text text-muted small">Configure cache duration</p>
                <div className="mt-3">
                  <select className="form-select form-select-sm">
                    <option>1 hour</option>
                    <option>6 hours</option>
                    <option>12 hours</option>
                    <option>24 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="ti ti-clock fs-1 text-info"></i>
                </div>
                <h6 className="card-title">Session Timeout</h6>
                <p className="card-text text-muted small">Set session duration</p>
                <div className="mt-3">
                  <select className="form-select form-select-sm">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="ti ti-upload fs-1 text-success"></i>
                </div>
                <h6 className="card-title">Upload Limits</h6>
                <p className="card-text text-muted small">Set max file size</p>
                <div className="mt-3">
                  <select className="form-select form-select-sm">
                    <option>2 MB</option>
                    <option>5 MB</option>
                    <option>10 MB</option>
                    <option>20 MB</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="ti ti-shield-check fs-1 text-warning"></i>
                </div>
                <h6 className="card-title">Backup Settings</h6>
                <p className="card-text text-muted small">Database backup frequency</p>
                <div className="mt-3">
                  <select className="form-select form-select-sm">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="ti ti-server fs-1 text-secondary"></i>
                </div>
                <h6 className="card-title">System Info</h6>
                <p className="card-text text-muted small">View system details</p>
                <div className="mt-3">
                  <small className="text-muted">PHP 8.1.0</small><br/>
                  <small className="text-muted">MySQL 8.0</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="ti ti-activity fs-1 text-danger"></i>
                </div>
                <h6 className="card-title">System Health</h6>
                <p className="card-text text-muted small">Monitor performance</p>
                <div className="mt-3">
                  <div className="progress mb-1" style={{ height: '4px' }}>
                    <div className="progress-bar bg-success" style={{ width: '45%' }}></div>
                  </div>
                  <small className="text-muted">CPU: 45%</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="ti ti-settings fs-1 text-dark"></i>
                </div>
                <h6 className="card-title">Advanced Config</h6>
                <p className="card-text text-muted small">Additional settings</p>
                <div className="mt-3">
                  <button className="btn btn-outline-primary btn-sm">Configure</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Mode Modal */}
        {showMaintenanceModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Maintenance Mode</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowMaintenanceModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Maintenance Mode Toggle */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h6 className="mb-1">Maintenance Mode</h6>
                        <p className="text-muted small mb-0">
                          Once maintenance mode is activated, only you can access the store for preparation, 
                          while customers will see a maintenance page. We recommend logging out from the control panel 
                          or using another browser to view the maintenance page.
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={maintenanceMode}
                        onChange={(checked) => setMaintenanceMode(checked)}
                      />
                    </div>
                  </div>

                  {/* Maintenance Title */}
                  <div className="mb-4">
                    <label className="form-label fw-medium">Main Title for Maintenance</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={maintenanceTitle}
                        onChange={(e) => setMaintenanceTitle(e.target.value)}
                        placeholder="Store Under Maintenance"
                      />
                      <select className="form-select" style={{ maxWidth: '80px' }}>
                        <option>EN</option>
                        <option>AR</option>
                      </select>
                    </div>
                  </div>

                  {/* Maintenance Message */}
                  <div className="mb-4">
                    <label className="form-label fw-medium">Maintenance Message</label>
                    <div className="input-group">
                      <textarea
                        className="form-control"
                        rows={4}
                        value={maintenanceMessage}
                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                        placeholder="Sorry dear customer, the store is currently under maintenance and we will resume work shortly."
                      />
                      <select className="form-select" style={{ maxWidth: '80px' }}>
                        <option>EN</option>
                        <option>AR</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowMaintenanceModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={handleSaveMaintenanceSettings}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Advanced;






