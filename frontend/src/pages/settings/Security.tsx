import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';

const Security: React.FC = () => {
  return (
    <Layout>
      <div className="container-fluid">
        {/* Page Title */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">Security</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/store-settings">Store Settings</Link></li>
              <li className="breadcrumb-item active">Security</li>
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
                  <i className="ti ti-shield-lock me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Security Settings</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Manage your account security and authentication</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-control" placeholder="Enter current password" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-control" placeholder="Enter new password" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" placeholder="Confirm new password" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Two-Factor Authentication</label>
                    <select className="form-select">
                      <option>Enabled</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-device-desktop me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Login Sessions</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Monitor and manage active login sessions</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead className="bg-light">
                      <tr>
                        <th>Device</th>
                        <th>Location</th>
                        <th>Last Activity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Chrome on Windows</td>
                        <td>Riyadh, Saudi Arabia</td>
                        <td>Active now</td>
                        <td><span className="badge" style={{ backgroundColor: '#10b981' }}>Current</span></td>
                      </tr>
                      <tr>
                        <td>Safari on iPhone</td>
                        <td>Jeddah, Saudi Arabia</td>
                        <td>2 hours ago</td>
                        <td><button className="btn btn-sm btn-outline-danger">Revoke</button></td>
                      </tr>
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

export default Security;






