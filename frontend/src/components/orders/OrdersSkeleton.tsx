import React from 'react';

interface OrdersSkeletonProps {
  count?: number;
}

const OrdersSkeleton: React.FC<OrdersSkeletonProps> = ({ count = 10 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="card">
      <div className="card-header border-light justify-content-between">
        <div className="d-flex gap-2">
          {/* Add Order Button Skeleton */}
          <div 
            className="btn btn-primary"
            style={{ 
              width: '120px',
              height: '38px',
              backgroundColor: '#e9ecef',
              animation: 'pulse 1.5s ease-in-out infinite',
              border: 'none'
            }}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="me-2 fw-semibold">Filter By:</span>

          {/* Payment Status Filter Skeleton */}
          <div className="app-search">
            <div 
              className="form-select form-control my-1 my-md-0"
              style={{ 
                width: '140px',
                height: '38px',
                backgroundColor: '#e9ecef',
                animation: 'pulse 1.5s ease-in-out infinite',
                border: '1px solid #dee2e6'
              }}
            />
            <i className="ti ti-credit-card app-search-icon text-muted"></i>
          </div>

          {/* Delivery Status Filter Skeleton */}
          <div className="app-search">
            <div 
              className="form-select form-control my-1 my-md-0"
              style={{ 
                width: '140px',
                height: '38px',
                backgroundColor: '#e9ecef',
                animation: 'pulse 1.5s ease-in-out infinite',
                border: '1px solid #dee2e6'
              }}
            />
            <i className="ti ti-truck app-search-icon text-muted"></i>
          </div>

          {/* Date Range Filter Skeleton */}
          <div className="app-search">
            <div 
              className="form-select form-control my-1 my-md-0"
              style={{ 
                width: '120px',
                height: '38px',
                backgroundColor: '#e9ecef',
                animation: 'pulse 1.5s ease-in-out infinite',
                border: '1px solid #dee2e6'
              }}
            />
            <i className="ti ti-calendar app-search-icon text-muted"></i>
          </div>

          {/* Records Per Page Skeleton */}
          <div>
            <div 
              className="form-select form-control my-1 my-md-0"
              style={{ 
                width: '80px',
                height: '38px',
                backgroundColor: '#e9ecef',
                animation: 'pulse 1.5s ease-in-out infinite',
                border: '1px solid #dee2e6'
              }}
            />
          </div>

          {/* Search Input Skeleton */}
          <div className="app-search">
            <div 
              className="form-control"
              style={{ 
                width: '200px',
                height: '38px',
                backgroundColor: '#e9ecef',
                animation: 'pulse 1.5s ease-in-out infinite',
                border: '1px solid #dee2e6'
              }}
            />
            <i className="ti ti-search app-search-icon text-muted"></i>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
          <thead className="bg-light align-middle bg-opacity-25 thead-sm">
            <tr className="text-uppercase fs-xxs">
              <th className="ps-3" style={{ width: '1%' }}>
                <div 
                  className="form-check-input form-check-input-light fs-14 mt-0"
                  style={{ 
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#e9ecef',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    border: '1px solid #dee2e6'
                  }}
                />
              </th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Payment Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skeletons.map((index) => (
              <tr key={index}>
                {/* Checkbox Skeleton */}
                <td className="ps-3">
                  <div 
                    className="form-check-input form-check-input-light fs-14 product-item-check mt-0"
                    style={{ 
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      border: '1px solid #dee2e6'
                    }}
                  />
                </td>

                {/* Order ID Skeleton */}
                <td>
                  <div 
                    className="fs-sm mb-0 fw-medium"
                    style={{ 
                      height: '20px',
                      width: '80px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      borderRadius: '0.25rem'
                    }}
                  />
                </td>

                {/* Date Skeleton */}
                <td>
                  <div 
                    className="mb-0"
                    style={{ 
                      height: '20px',
                      width: '60px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      borderRadius: '0.25rem'
                    }}
                  />
                  <div 
                    className="text-muted"
                    style={{ 
                      height: '14px',
                      width: '40px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      borderRadius: '0.25rem',
                      marginTop: '4px'
                    }}
                  />
                </td>

                {/* Customer Skeleton */}
                <td>
                  <div className="d-flex justify-content-start align-items-center gap-2">
                    {/* Avatar Skeleton */}
                    <div 
                      className="avatar avatar-sm d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        border: '2px solid #e9ecef', 
                        borderRadius: '50%',
                        backgroundColor: '#e9ecef',
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }}
                    />
                    <div>
                      {/* Customer Name Skeleton */}
                      <div 
                        className="text-nowrap fs-base mb-0 lh-base"
                        style={{ 
                          height: '18px',
                          width: '100px',
                          backgroundColor: '#e9ecef',
                          animation: 'pulse 1.5s ease-in-out infinite',
                          borderRadius: '0.25rem'
                        }}
                      />
                      {/* Customer Email Skeleton */}
                      <div 
                        className="text-muted fs-xs mb-0"
                        style={{ 
                          height: '14px',
                          width: '120px',
                          backgroundColor: '#e9ecef',
                          animation: 'pulse 1.5s ease-in-out infinite',
                          borderRadius: '0.25rem',
                          marginTop: '4px'
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* Amount Skeleton */}
                <td>
                  <div 
                    className="mb-0"
                    style={{ 
                      height: '20px',
                      width: '70px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      borderRadius: '0.25rem'
                    }}
                  />
                </td>

                {/* Payment Status Skeleton */}
                <td>
                  <div 
                    className="fw-semibold"
                    style={{ 
                      height: '20px',
                      width: '60px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      borderRadius: '0.25rem'
                    }}
                  />
                </td>

                {/* Order Status Skeleton */}
                <td>
                  <div 
                    className="badge fs-xxs"
                    style={{ 
                      height: '24px',
                      width: '80px',
                      backgroundColor: '#e9ecef',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      borderRadius: '12px'
                    }}
                  />
                </td>

                {/* Payment Method Skeleton */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {/* Payment Icon Skeleton */}
                    <div 
                      className="me-2"
                      style={{ 
                        width: '28px',
                        height: '28px',
                        backgroundColor: '#e9ecef',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        borderRadius: '0.25rem'
                      }}
                    />
                    {/* Payment Details Skeleton */}
                    <div 
                      className="mb-0"
                      style={{ 
                        height: '20px',
                        width: '80px',
                        backgroundColor: '#e9ecef',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        borderRadius: '0.25rem'
                      }}
                    />
                  </div>
                </td>

                {/* Actions Skeleton */}
                <td>
                  <div className="d-flex gap-1">
                    {/* Print Invoice Button Skeleton */}
                    <div 
                      className="btn btn-sm btn-link p-0"
                      style={{ 
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#e9ecef',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        borderRadius: '50%',
                        border: 'none'
                      }}
                    />
                    {/* Delete Button Skeleton */}
                    <div 
                      className="btn btn-sm btn-link p-0 text-danger"
                      style={{ 
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#e9ecef',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        borderRadius: '50%',
                        border: 'none'
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersSkeleton;









