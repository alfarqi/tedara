

import React from 'react';

interface OrdersChartCardProps {
  title: string;
}

const OrdersChartCard: React.FC<OrdersChartCardProps> = ({ title }) => {
  return (
    <div className="card">
      <div className="card-header border-dashed card-tabs d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="card-title">{title}</h4>
        </div>
        <ul className="nav nav-tabs nav-justified card-header-tabs nav-bordered">
          <li className="nav-item">
            <a href="#today-ct" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
              <i className="ti ti-home d-md-none d-block"></i>
              <span className="d-none d-md-block">Today</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#monthly-ct" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
              <i className="ti ti-user-circle d-md-none d-block"></i>
              <span className="d-none d-md-block">Monthly</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#annual-ct" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
              <i className="ti ti-settings d-md-none d-block"></i>
              <span className="d-none d-md-block">Annual</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="card-body p-0">
        <div className="row g-0">
          <div className="col-xxl-8 border-end border-dashed">
            <div id="orders-chart" style={{ minHeight: '405px' }}>
              {/* Chart will be rendered by JavaScript */}
            </div>
          </div>
          <div className="col-xxl-4">
            <div className="p-3 bg-light-subtle border-bottom border-dashed">
              <div className="row">
                <div className="col">
                  <h4 className="fs-sm mb-1">Would you like the full report?</h4>
                  <small className="text-muted fs-xs mb-0">
                    All 120 orders have been successfully delivered
                  </small>
                </div>
                <div className="col-auto align-self-center">
                  <button type="button" className="btn btn-sm btn-default rounded-circle btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Download">
                    <i className="ti ti-download fs-xl"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="row row-cols-xxl-2 row-cols-md-2 row-cols-1 g-1 p-1">
              {/* Total Sales Widget */}
              <div className="col">
                <div className="card rounded-0 border shadow-none border-dashed mb-0">
                  <div className="card-body">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <h5 className="fs-xl mb-0">$24,500</h5>
                      <span>18.45% <i className="ti ti-arrow-up text-success"></i></span>
                    </div>
                    <p className="text-muted mb-2">Total sales in period</p>
                    <div className="progress progress-sm mb-0">
                      <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '18.45%' }} aria-valuenow={18.45} aria-valuemin={0} aria-valuemax={100}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Number of Customers Widget */}
              <div className="col">
                <div className="card rounded-0 border shadow-none border-dashed mb-0">
                  <div className="card-body">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <h5 className="fs-xl mb-0">1,240</h5>
                      <span>10.35% <i className="ti ti-arrow-down text-danger"></i></span>
                    </div>
                    <p className="text-muted mb-2">Number of customers</p>
                    <div className="progress progress-sm mb-0">
                      <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '10.35%' }} aria-valuenow={10.35} aria-valuemin={0} aria-valuemax={100}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Sold Widget */}
              <div className="col">
                <div className="card rounded-0 border shadow-none border-dashed mb-0">
                  <div className="card-body">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <h5 className="fs-xl mb-0">3,750</h5>
                      <span>22.61% <i className="ti ti-bolt text-primary"></i></span>
                    </div>
                    <p className="text-muted mb-2 text-truncate">Products sold in the period</p>
                    <div className="progress progress-sm mb-0">
                      <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '22.61%' }} aria-valuenow={22.61} aria-valuemin={0} aria-valuemax={100}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Average Order Value Widget */}
              <div className="col">
                <div className="card rounded-0 border shadow-none border-dashed mb-0">
                  <div className="card-body">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <h5 className="fs-xl mb-0">$65.49 <small className="fs-6">USD</small></h5>
                      <span>5.92% <i className="ti ti-arrow-up text-success"></i></span>
                    </div>
                    <p className="text-muted mb-2">Average order value</p>
                    <div className="progress progress-sm mb-0">
                      <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '5.92%' }} aria-valuenow={5.92} aria-valuemin={0} aria-valuemax={100}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center my-3">
              <a href="chat.html" className="link-reset text-decoration-underline fw-semibold link-offset-3">
                View all Reports <i className="ti ti-send-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersChartCard;
