import React from 'react';
import Layout from '../../components/layout/Layout';

const Domains: React.FC = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Domain Management</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item active">Domains</li>
          </ol>
        </div>
      </div>

      {/* Domain Statistics */}
      <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1">
        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Total Domains</h5>
              <span className="badge badge-soft-primary">All</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="89">0</span></h3>
                  <p className="mb-0 text-muted">Registered Domains</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Active Domains</h5>
              <span className="badge badge-soft-success">Active</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="76">0</span></h3>
                  <p className="mb-0 text-muted">Active Domains</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Pending Verification</h5>
              <span className="badge badge-soft-warning">Pending</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="8">0</span></h3>
                  <p className="mb-0 text-muted">Awaiting Verification</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Expiring Soon</h5>
              <span className="badge badge-soft-danger">Alert</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="5">0</span></h3>
                  <p className="mb-0 text-muted">Expiring in 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Management */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">All Domains</h4>
              <div className="d-flex gap-2">
                <button className="btn btn-primary btn-sm">
                  <i className="ti ti-plus me-1"></i>
                  Add Domain
                </button>
                <div className="dropdown">
                  <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="ti ti-dots-vertical"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a href="javascript:void(0);" className="dropdown-item">Export Data</a>
                    <a href="javascript:void(0);" className="dropdown-item">Bulk Actions</a>
                    <a href="javascript:void(0);" className="dropdown-item">DNS Settings</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-centered table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Store</th>
                      <th>Status</th>
                      <th>SSL</th>
                      <th>Expiry Date</th>
                      <th>DNS Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="ti ti-world me-2 text-primary"></i>
                          <div>
                            <h6 className="mb-0">techstore.com</h6>
                            <small className="text-muted">Primary Domain</small>
                          </div>
                        </div>
                      </td>
                      <td>TechStore Pro</td>
                      <td><span className="badge bg-success">Active</span></td>
                      <td><span className="badge bg-success">Valid</span></td>
                      <td>2024-12-15</td>
                      <td><span className="badge bg-success">Verified</span></td>
                      <td>
                        <div className="dropdown">
                          <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a href="javascript:void(0);" className="dropdown-item">View Details</a>
                            <a href="javascript:void(0);" className="dropdown-item">Edit Domain</a>
                            <a href="javascript:void(0);" className="dropdown-item">DNS Settings</a>
                            <div className="dropdown-divider"></div>
                            <a href="javascript:void(0);" className="dropdown-item text-danger">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="ti ti-world me-2 text-primary"></i>
                          <div>
                            <h6 className="mb-0">fashionhub.com</h6>
                            <small className="text-muted">Primary Domain</small>
                          </div>
                        </div>
                      </td>
                      <td>Fashion Hub</td>
                      <td><span className="badge bg-success">Active</span></td>
                      <td><span className="badge bg-success">Valid</span></td>
                      <td>2024-11-20</td>
                      <td><span className="badge bg-success">Verified</span></td>
                      <td>
                        <div className="dropdown">
                          <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a href="javascript:void(0);" className="dropdown-item">View Details</a>
                            <a href="javascript:void(0);" className="dropdown-item">Edit Domain</a>
                            <a href="javascript:void(0);" className="dropdown-item">DNS Settings</a>
                            <div className="dropdown-divider"></div>
                            <a href="javascript:void(0);" className="dropdown-item text-danger">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="ti ti-world me-2 text-warning"></i>
                          <div>
                            <h6 className="mb-0">homegarden.com</h6>
                            <small className="text-muted">Pending Verification</small>
                          </div>
                        </div>
                      </td>
                      <td>Home & Garden</td>
                      <td><span className="badge bg-warning">Pending</span></td>
                      <td><span className="badge bg-secondary">N/A</span></td>
                      <td>2025-01-10</td>
                      <td><span className="badge bg-warning">Pending</span></td>
                      <td>
                        <div className="dropdown">
                          <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a href="javascript:void(0);" className="dropdown-item">Verify Domain</a>
                            <a href="javascript:void(0);" className="dropdown-item">DNS Settings</a>
                            <div className="dropdown-divider"></div>
                            <a href="javascript:void(0);" className="dropdown-item text-danger">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="ti ti-world me-2 text-danger"></i>
                          <div>
                            <h6 className="mb-0">sportsgear.com</h6>
                            <small className="text-muted">Expiring Soon</small>
                          </div>
                        </div>
                      </td>
                      <td>Sports Gear</td>
                      <td><span className="badge bg-danger">Expiring</span></td>
                      <td><span className="badge bg-warning">Expiring</span></td>
                      <td>2024-02-15</td>
                      <td><span className="badge bg-success">Verified</span></td>
                      <td>
                        <div className="dropdown">
                          <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a href="javascript:void(0);" className="dropdown-item">Renew Domain</a>
                            <a href="javascript:void(0);" className="dropdown-item">View Details</a>
                            <a href="javascript:void(0);" className="dropdown-item">DNS Settings</a>
                            <div className="dropdown-divider"></div>
                            <a href="javascript:void(0);" className="dropdown-item text-danger">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DNS Settings */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">DNS Configuration</h4>
              <button className="btn btn-info btn-sm">
                <i className="ti ti-refresh me-1"></i>
                Refresh DNS
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="mb-3">A Record</h6>
                  <div className="mb-3">
                    <label className="form-label">Domain</label>
                    <input type="text" className="form-control" defaultValue="@" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">IP Address</label>
                    <input type="text" className="form-control" defaultValue="192.168.1.100" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">TTL</label>
                    <input type="number" className="form-control" defaultValue="3600" />
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="mb-3">CNAME Record</h6>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" defaultValue="www" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Target</label>
                    <input type="text" className="form-control" defaultValue="tedara.com" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">TTL</label>
                    <input type="number" className="form-control" defaultValue="3600" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h6 className="mb-3">MX Record</h6>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <input type="number" className="form-control" defaultValue="10" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mail Server</label>
                    <input type="text" className="form-control" defaultValue="mail.tedara.com" />
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="mb-3">TXT Record</h6>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" defaultValue="@" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Value</label>
                    <input type="text" className="form-control" defaultValue="v=spf1 include:_spf.tedara.com ~all" />
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary">Save DNS Settings</button>
                <button className="btn btn-secondary">Reset to Default</button>
                <button className="btn btn-outline-primary">Test DNS</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Domains;
