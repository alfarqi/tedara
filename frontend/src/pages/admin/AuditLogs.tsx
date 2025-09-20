import React from 'react';
import Layout from '../../components/layout/Layout';
import { ASSETS } from '../../utils/assets';

const AuditLogs: React.FC = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Audit Logs</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item active">Audit Logs</li>
          </ol>
        </div>
      </div>

      {/* Audit Statistics */}
      <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1">
        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Total Logs</h5>
              <span className="badge badge-soft-primary">All</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="15,847">0</span></h3>
                  <p className="mb-0 text-muted">Total Entries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Today's Logs</h5>
              <span className="badge badge-soft-success">Today</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="156">0</span></h3>
                  <p className="mb-0 text-muted">Today's Entries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Security Alerts</h5>
              <span className="badge badge-soft-warning">Alerts</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="8">0</span></h3>
                  <p className="mb-0 text-muted">Active Alerts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Failed Logins</h5>
              <span className="badge badge-soft-danger">Failed</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="23">0</span></h3>
                  <p className="mb-0 text-muted">Failed Attempts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Audit Logs</h4>
              <div className="d-flex gap-2">
                <select className="form-select form-select-sm" style={{width: '150px'}}>
                  <option>All Actions</option>
                  <option>Login</option>
                  <option>Logout</option>
                  <option>Create</option>
                  <option>Update</option>
                  <option>Delete</option>
                </select>
                <select className="form-select form-select-sm" style={{width: '150px'}}>
                  <option>All Users</option>
                  <option>Admin</option>
                  <option>Store Owner</option>
                  <option>Manager</option>
                </select>
                <input type="date" className="form-control form-control-sm" style={{width: '150px'}} />
                <button className="btn btn-primary btn-sm">
                  <i className="ti ti-search me-1"></i>
                  Search
                </button>
                <div className="dropdown">
                  <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="ti ti-dots-vertical"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a href="javascript:void(0);" className="dropdown-item">Export Logs</a>
                    <a href="javascript:void(0);" className="dropdown-item">Clear Old Logs</a>
                    <a href="javascript:void(0);" className="dropdown-item">Settings</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-centered table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>IP Address</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-01-20 14:30:25</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={ASSETS.USER_1} alt="user" className="rounded-circle me-2" width="32" />
                          <div>
                            <h6 className="mb-0">John Doe</h6>
                            <small className="text-muted">Super Admin</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-success">Login</span></td>
                      <td>Authentication</td>
                      <td>192.168.1.100</td>
                      <td><span className="badge bg-success">Success</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>2024-01-20 14:25:18</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={ASSETS.USER_2} alt="user" className="rounded-circle me-2" width="32" />
                          <div>
                            <h6 className="mb-0">Jane Smith</h6>
                            <small className="text-muted">Store Owner</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-primary">Create</span></td>
                      <td>Product</td>
                      <td>192.168.1.101</td>
                      <td><span className="badge bg-success">Success</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>2024-01-20 14:20:42</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={ASSETS.USER_3} alt="user" className="rounded-circle me-2" width="32" />
                          <div>
                            <h6 className="mb-0">Mike Johnson</h6>
                            <small className="text-muted">Manager</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-warning">Update</span></td>
                      <td>Order</td>
                      <td>192.168.1.102</td>
                      <td><span className="badge bg-success">Success</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>2024-01-20 14:15:33</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle me-2 d-flex align-items-center justify-content-center" 
                               style={{width: '32px', height: '32px', backgroundColor: '#e9ecef'}}>
                            <i className="ti ti-user text-muted"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">Unknown User</h6>
                            <small className="text-muted">Failed Login</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-danger">Login</span></td>
                      <td>Authentication</td>
                      <td>203.45.67.89</td>
                      <td><span className="badge bg-danger">Failed</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger">Alert</button>
                      </td>
                    </tr>
                    <tr>
                      <td>2024-01-20 14:10:15</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={ASSETS.USER_4} alt="user" className="rounded-circle me-2" width="32" />
                          <div>
                            <h6 className="mb-0">Sarah Wilson</h6>
                            <small className="text-muted">Store Owner</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-info">Delete</span></td>
                      <td>Product</td>
                      <td>192.168.1.103</td>
                      <td><span className="badge bg-success">Success</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Alerts */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Security Alerts</h4>
              <button className="btn btn-warning btn-sm">
                <i className="ti ti-shield me-1"></i>
                View All Alerts
              </button>
            </div>
            <div className="card-body">
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <i className="ti ti-alert-triangle me-2"></i>
                <div>
                  <strong>Multiple Failed Login Attempts:</strong> 5 failed login attempts detected from IP 203.45.67.89 in the last 10 minutes.
                </div>
              </div>
              <div className="alert alert-warning d-flex align-items-center" role="alert">
                <i className="ti ti-shield me-2"></i>
                <div>
                  <strong>Unusual Activity:</strong> User "mike.johnson" accessed admin panel from new IP address 192.168.1.102.
                </div>
              </div>
              <div className="alert alert-info d-flex align-items-center" role="alert">
                <i className="ti ti-info-circle me-2"></i>
                <div>
                  <strong>System Update:</strong> Database backup completed successfully at 14:00:00.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuditLogs;
