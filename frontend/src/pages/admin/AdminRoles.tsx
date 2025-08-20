import React from 'react';
import Layout from '../../components/layout/Layout';

const AdminRoles: React.FC = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Roles & Permissions</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item active">Roles</li>
          </ol>
        </div>
      </div>

      {/* Roles Overview */}
      <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1">
        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Total Roles</h5>
              <span className="badge badge-soft-primary">All</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="8">0</span></h3>
                  <p className="mb-0 text-muted">Active Roles</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Super Admins</h5>
              <span className="badge badge-soft-danger">VIP</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="3">0</span></h3>
                  <p className="mb-0 text-muted">Super Admin Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Store Admins</h5>
              <span className="badge badge-soft-success">Active</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="156">0</span></h3>
                  <p className="mb-0 text-muted">Store Admin Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Regular Users</h5>
              <span className="badge badge-soft-info">Standard</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="2,688">0</span></h3>
                  <p className="mb-0 text-muted">Regular Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Management */}
      <div className="row">
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Roles List</h4>
              <button className="btn btn-primary btn-sm">
                <i className="ti ti-plus me-1"></i>
                Add Role
              </button>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Super Admin</h6>
                    <small className="text-muted">Full system access</small>
                  </div>
                  <span className="badge bg-danger">3 users</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Platform Admin</h6>
                    <small className="text-muted">Platform management</small>
                  </div>
                  <span className="badge bg-primary">12 users</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Store Owner</h6>
                    <small className="text-muted">Store management</small>
                  </div>
                  <span className="badge bg-success">156 users</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Store Manager</h6>
                    <small className="text-muted">Store operations</small>
                  </div>
                  <span className="badge bg-info">89 users</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Customer Support</h6>
                    <small className="text-muted">Support operations</small>
                  </div>
                  <span className="badge bg-warning">45 users</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Viewer</h6>
                    <small className="text-muted">Read-only access</small>
                  </div>
                  <span className="badge bg-secondary">2,688 users</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Permissions Editor</h4>
              <div className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="ti ti-dots-vertical"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a href="javascript:void(0);" className="dropdown-item">Export Permissions</a>
                  <a href="javascript:void(0);" className="dropdown-item">Reset to Default</a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="mb-3">User Management</h6>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="createUsers" defaultChecked />
                      <label className="form-check-label" htmlFor="createUsers">
                        Create Users
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="editUsers" defaultChecked />
                      <label className="form-check-label" htmlFor="editUsers">
                        Edit Users
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="deleteUsers" />
                      <label className="form-check-label" htmlFor="deleteUsers">
                        Delete Users
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="viewUsers" defaultChecked />
                      <label className="form-check-label" htmlFor="viewUsers">
                        View Users
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <h6 className="mb-3">Store Management</h6>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="createStores" defaultChecked />
                      <label className="form-check-label" htmlFor="createStores">
                        Create Stores
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="editStores" defaultChecked />
                      <label className="form-check-label" htmlFor="editStores">
                        Edit Stores
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="deleteStores" />
                      <label className="form-check-label" htmlFor="deleteStores">
                        Delete Stores
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="viewStores" defaultChecked />
                      <label className="form-check-label" htmlFor="viewStores">
                        View Stores
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <h6 className="mb-3">System Settings</h6>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="editSettings" defaultChecked />
                      <label className="form-check-label" htmlFor="editSettings">
                        Edit Settings
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="viewSettings" defaultChecked />
                      <label className="form-check-label" htmlFor="viewSettings">
                        View Settings
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="systemMaintenance" />
                      <label className="form-check-label" htmlFor="systemMaintenance">
                        System Maintenance
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <h6 className="mb-3">Analytics & Reports</h6>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="viewAnalytics" defaultChecked />
                      <label className="form-check-label" htmlFor="viewAnalytics">
                        View Analytics
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="exportReports" defaultChecked />
                      <label className="form-check-label" htmlFor="exportReports">
                        Export Reports
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="manageReports" />
                      <label className="form-check-label" htmlFor="manageReports">
                        Manage Reports
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary">Save Permissions</button>
              <button className="btn btn-secondary ms-2">Reset to Default</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminRoles;
