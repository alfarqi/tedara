import React from 'react';
import Layout from '../../components/layout/Layout';

const AdminDashboard: React.FC = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Super Admin Dashboard</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item active">Super Admin</li>
          </ol>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1">
        {/* Total Stores */}
        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Total Stores</h5>
              <span className="badge badge-soft-success">Active</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="156">0</span></h3>
                  <p className="mb-0 text-muted">Active Stores</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Total Users</h5>
              <span className="badge badge-soft-primary">Registered</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="2,847">0</span></h3>
                  <p className="mb-0 text-muted">Registered Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">System Health</h5>
              <span className="badge badge-soft-info">Status</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="98">0</span>%</h3>
                  <p className="mb-0 text-muted">Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Platform Revenue</h5>
              <span className="badge badge-soft-warning">Monthly</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal">$<span data-target="45.2">0</span>K</h3>
                  <p className="mb-0 text-muted">Monthly Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="row">
        {/* Recent Activity */}
        <div className="col-xl-8">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Recent Activity</h4>
              <div className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="ti ti-dots-vertical"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a href="javascript:void(0);" className="dropdown-item">Export Report</a>
                  <a href="javascript:void(0);" className="dropdown-item">Print</a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-centered table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>User</th>
                      <th>Store</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Store Created</td>
                      <td>John Doe</td>
                      <td>TechStore Pro</td>
                      <td>2 min ago</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>User Registration</td>
                      <td>Jane Smith</td>
                      <td>Fashion Hub</td>
                      <td>5 min ago</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>Payment Processed</td>
                      <td>Mike Johnson</td>
                      <td>Electronics Plus</td>
                      <td>10 min ago</td>
                      <td><span className="badge bg-warning">Pending</span></td>
                    </tr>
                    <tr>
                      <td>System Update</td>
                      <td>Admin</td>
                      <td>Platform</td>
                      <td>15 min ago</td>
                      <td><span className="badge bg-info">In Progress</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Quick Actions</h4>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary">
                  <i className="ti ti-plus me-2"></i>
                  Add New Store
                </button>
                <button className="btn btn-success">
                  <i className="ti ti-user-plus me-2"></i>
                  Create User
                </button>
                <button className="btn btn-info">
                  <i className="ti ti-settings me-2"></i>
                  System Settings
                </button>
                <button className="btn btn-warning">
                  <i className="ti ti-file-text me-2"></i>
                  View Reports
                </button>
                <button className="btn btn-danger">
                  <i className="ti ti-shield me-2"></i>
                  Security Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
