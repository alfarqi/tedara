import React from 'react';
import Layout from '../../components/layout/Layout';
import { ASSETS } from '../../utils/assets';

const Support: React.FC = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Support Management</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item active">Support</li>
          </ol>
        </div>
      </div>

      {/* Support Statistics */}
      <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1">
        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Total Tickets</h5>
              <span className="badge badge-soft-primary">All</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="1,247">0</span></h3>
                  <p className="mb-0 text-muted">Total Tickets</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Open Tickets</h5>
              <span className="badge badge-soft-warning">Open</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="89">0</span></h3>
                  <p className="mb-0 text-muted">Open Tickets</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">In Progress</h5>
              <span className="badge badge-soft-info">Progress</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="45">0</span></h3>
                  <p className="mb-0 text-muted">In Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Resolved</h5>
              <span className="badge badge-soft-success">Resolved</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="1,113">0</span></h3>
                  <p className="mb-0 text-muted">Resolved Tickets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Support Tickets</h4>
              <div className="d-flex gap-2">
                <select className="form-select form-select-sm" style={{width: '150px'}}>
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
                <select className="form-select form-select-sm" style={{width: '150px'}}>
                  <option>All Priority</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                <button className="btn btn-primary btn-sm">
                  <i className="ti ti-plus me-1"></i>
                  New Ticket
                </button>
                <div className="dropdown">
                  <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="ti ti-dots-vertical"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a href="javascript:void(0);" className="dropdown-item">Export Data</a>
                    <a href="javascript:void(0);" className="dropdown-item">Bulk Actions</a>
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
                      <th>Ticket ID</th>
                      <th>Subject</th>
                      <th>Customer</th>
                      <th>Store</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="fw-bold">#TKT-001</span>
                      </td>
                      <td>
                        <div>
                          <h6 className="mb-0">Payment Gateway Issue</h6>
                          <small className="text-muted">Unable to process payments</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={ASSETS.USER_1} alt="user" className="rounded-circle me-2" width="32" />
                          <div>
                            <h6 className="mb-0">John Doe</h6>
                            <small className="text-muted">john@example.com</small>
                          </div>
                        </div>
                      </td>
                      <td>TechStore Pro</td>
                      <td><span className="badge bg-danger">Critical</span></td>
                      <td><span className="badge bg-warning">Open</span></td>
                      <td>2 hours ago</td>
                      <td>
                        <div className="dropdown">
                          <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a href="javascript:void(0);" className="dropdown-item">View Ticket</a>
                            <a href="javascript:void(0);" className="dropdown-item">Assign to Agent</a>
                            <a href="javascript:void(0);" className="dropdown-item">Update Status</a>
                            <div className="dropdown-divider"></div>
                            <a href="javascript:void(0);" className="dropdown-item text-danger">Close Ticket</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="fw-bold">#TKT-002</span>
                      </td>
                      <td>
                        <div>
                          <h6 className="mb-0">Product Import Problem</h6>
                          <small className="text-muted">CSV import not working</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={ASSETS.USER_2} alt="user" className="rounded-circle me-2" width="32" />
                          <div>
                            <h6 className="mb-0">Jane Smith</h6>
                            <small className="text-muted">jane@example.com</small>
                          </div>
                        </div>
                      </td>
                      <td>Fashion Hub</td>
                      <td><span className="badge bg-warning">High</span></td>
                      <td><span className="badge bg-info">In Progress</span></td>
                      <td>1 day ago</td>
                      <td>
                        <div className="dropdown">
                          <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a href="javascript:void(0);" className="dropdown-item">View Ticket</a>
                            <a href="javascript:void(0);" className="dropdown-item">Assign to Agent</a>
                            <a href="javascript:void(0);" className="dropdown-item">Update Status</a>
                            <div className="dropdown-divider"></div>
                            <a href="javascript:void(0);" className="dropdown-item text-danger">Close Ticket</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="fw-bold">#TKT-003</span>
                      </td>
                      <td>
                        <div>
                          <h6 className="mb-0">Theme Customization</h6>
                          <small className="text-muted">Need help with colors</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={ASSETS.USER_3} alt="user" className="rounded-circle me-2" width="32" />
                          <div>
                            <h6 className="mb-0">Mike Johnson</h6>
                            <small className="text-muted">mike@example.com</small>
                          </div>
                        </div>
                      </td>
                      <td>Home & Garden</td>
                      <td><span className="badge bg-info">Medium</span></td>
                      <td><span className="badge bg-success">Resolved</span></td>
                      <td>3 days ago</td>
                      <td>
                        <div className="dropdown">
                          <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a href="javascript:void(0);" className="dropdown-item">View Ticket</a>
                            <a href="javascript:void(0);" className="dropdown-item">Reopen Ticket</a>
                            <a href="javascript:void(0);" className="dropdown-item">Add Note</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="fw-bold">#TKT-004</span>
                      </td>
                      <td>
                        <div>
                          <h6 className="mb-0">Order Notification</h6>
                          <small className="text-muted">Email notifications not sent</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={ASSETS.USER_4} alt="user" className="rounded-circle me-2" width="32" />
                          <div>
                            <h6 className="mb-0">Sarah Wilson</h6>
                            <small className="text-muted">sarah@example.com</small>
                          </div>
                        </div>
                      </td>
                      <td>Sports Gear</td>
                      <td><span className="badge bg-secondary">Low</span></td>
                      <td><span className="badge bg-warning">Open</span></td>
                      <td>5 days ago</td>
                      <td>
                        <div className="dropdown">
                          <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a href="javascript:void(0);" className="dropdown-item">View Ticket</a>
                            <a href="javascript:void(0);" className="dropdown-item">Assign to Agent</a>
                            <a href="javascript:void(0);" className="dropdown-item">Update Status</a>
                            <div className="dropdown-divider"></div>
                            <a href="javascript:void(0);" className="dropdown-item text-danger">Close Ticket</a>
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
    </Layout>
  );
};

export default Support;
