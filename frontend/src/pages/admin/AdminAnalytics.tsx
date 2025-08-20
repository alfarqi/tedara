import React from 'react';
import Layout from '../../components/layout/Layout';

const AdminAnalytics: React.FC = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Platform Analytics</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item active">Analytics</li>
          </ol>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1">
        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Total Revenue</h5>
              <span className="badge badge-soft-success">+12.5%</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal">$<span data-target="2.4">0</span>M</h3>
                  <p className="mb-0 text-muted">This Month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Active Users</h5>
              <span className="badge badge-soft-primary">+8.2%</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="15.2">0</span>K</h3>
                  <p className="mb-0 text-muted">Daily Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Conversion Rate</h5>
              <span className="badge badge-soft-info">+5.1%</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="3.8">0</span>%</h3>
                  <p className="mb-0 text-muted">Average</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header d-flex border-dashed justify-content-between align-items-center">
              <h5 className="card-title">Growth Rate</h5>
              <span className="badge badge-soft-warning">+18.7%</span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="donut-chart" data-chart="donut" style={{minHeight: '60px', width: '60px'}}></div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal"><span data-target="156">0</span></h3>
                  <p className="mb-0 text-muted">New Stores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row">
        <div className="col-xl-8">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Revenue Overview</h4>
              <div className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="ti ti-dots-vertical"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a href="javascript:void(0);" className="dropdown-item">Export Data</a>
                  <a href="javascript:void(0);" className="dropdown-item">Print</a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div id="revenue-chart" style={{height: '300px'}}></div>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Top Categories</h4>
            </div>
            <div className="card-body">
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span>Electronics</span>
                <span className="fw-bold">32%</span>
              </div>
              <div className="progress mb-3" style={{height: '8px'}}>
                <div className="progress-bar bg-primary" style={{width: '32%'}}></div>
              </div>

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span>Fashion</span>
                <span className="fw-bold">28%</span>
              </div>
              <div className="progress mb-3" style={{height: '8px'}}>
                <div className="progress-bar bg-success" style={{width: '28%'}}></div>
              </div>

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span>Home & Garden</span>
                <span className="fw-bold">18%</span>
              </div>
              <div className="progress mb-3" style={{height: '8px'}}>
                <div className="progress-bar bg-warning" style={{width: '18%'}}></div>
              </div>

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span>Sports</span>
                <span className="fw-bold">12%</span>
              </div>
              <div className="progress mb-3" style={{height: '8px'}}>
                <div className="progress-bar bg-info" style={{width: '12%'}}></div>
              </div>

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span>Others</span>
                <span className="fw-bold">10%</span>
              </div>
              <div className="progress" style={{height: '8px'}}>
                <div className="progress-bar bg-secondary" style={{width: '10%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header justify-content-between align-items-center border-dashed">
              <h4 className="header-title">Performance Metrics</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="text-center">
                    <h3 className="text-primary">98.5%</h3>
                    <p className="text-muted">Uptime</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h3 className="text-success">2.3s</h3>
                    <p className="text-muted">Avg Response Time</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h3 className="text-warning">99.9%</h3>
                    <p className="text-muted">Success Rate</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h3 className="text-info">45.2K</h3>
                    <p className="text-muted">API Calls/Day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnalytics;
