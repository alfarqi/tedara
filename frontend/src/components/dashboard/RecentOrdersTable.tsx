

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerImage: string;
  product: string;
  date: string;
  amount: string;
  status: 'delivered' | 'pending' | 'completed' | 'cancelled';
}

const RecentOrdersTable: React.FC = () => {
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: '#ORD-1001',
      customerName: 'John Doe',
      customerImage: '/assets/images/users/user-1.jpg',
      product: 'Smart Watch',
      date: '2025-04-29',
      amount: '$89.99',
      status: 'delivered'
    },
    {
      id: '2',
      orderNumber: '#ORD-1002',
      customerName: 'Emma Watson',
      customerImage: '/assets/images/users/user-2.jpg',
      product: 'Bluetooth Speaker',
      date: '2025-04-28',
      amount: '$39.50',
      status: 'pending'
    },
    {
      id: '3',
      orderNumber: '#ORD-1003',
      customerName: 'Liam Johnson',
      customerImage: '/assets/images/users/user-4.jpg',
      product: 'Smart Watch',
      date: '2025-04-27',
      amount: '$89.99',
      status: 'completed'
    },
    {
      id: '4',
      orderNumber: '#ORD-1004',
      customerName: 'Olivia Brown',
      customerImage: '/assets/images/users/user-6.jpg',
      product: 'Gaming Mouse',
      date: '2025-04-26',
      amount: '$24.99',
      status: 'cancelled'
    },
    {
      id: '5',
      orderNumber: '#ORD-1005',
      customerName: 'Noah Smith',
      customerImage: '/assets/images/users/user-5.jpg',
      product: 'Fitness Tracker Band',
      date: '2025-04-25',
      amount: '$34.95',
      status: 'completed'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return <i className="ti ti-circle-filled fs-xs text-success"></i>;
      case 'pending':
        return <i className="ti ti-circle-filled fs-xs text-warning"></i>;
      case 'cancelled':
        return <i className="ti ti-circle-filled fs-xs text-danger"></i>;
      default:
        return <i className="ti ti-circle-filled fs-xs text-secondary"></i>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  return (
    <div data-table data-table-rows-per-page="5" className="card">
      <div className="card-header justify-content-between align-items-center border-dashed">
        <h4 className="card-title mb-0">Recent Orders</h4>
        <div className="d-flex gap-2">
          <a href="javascript:void(0);" className="btn btn-sm btn-soft-secondary">
            <i className="ti ti-plus me-1"></i> Add Order
          </a>
          <a href="javascript:void(0);" className="btn btn-sm btn-primary">
            <i className="ti ti-file-export me-1"></i> Export CSV
          </a>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-centered table-custom table-sm table-nowrap table-hover mb-0">
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img src={order.customerImage} alt="" className="avatar-sm rounded-circle me-2" />
                      <div>
                        <h5 className="fs-base my-1">
                          <a href="ecommerce-order-details.html" className="text-body">{order.orderNumber}</a>
                        </h5>
                        <span className="text-muted fs-xs">{order.customerName}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted fs-xs">Product</span>
                    <h5 className="fs-base mt-1 fw-normal">{order.product}</h5>
                  </td>
                  <td>
                    <span className="text-muted fs-xs">Date</span>
                    <h5 className="fs-base mt-1 fw-normal">{order.date}</h5>
                  </td>
                  <td>
                    <span className="text-muted fs-xs">Amount</span>
                    <h5 className="fs-base mt-1 fw-normal">{order.amount}</h5>
                  </td>
                  <td>
                    <span className="text-muted fs-xs">Status</span>
                    <h5 className="fs-base mt-1 fw-normal">
                      {getStatusIcon(order.status)} {getStatusText(order.status)}
                    </h5>
                  </td>
                  <td style={{ width: '30px' }}>
                    <div className="dropdown">
                      <a href="#" className="dropdown-toggle text-muted drop-arrow-none card-drop p-0" data-bs-toggle="dropdown">
                        <i className="ti ti-dots-vertical fs-lg"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="#" className="dropdown-item">View Details</a>
                        <a href="#" className="dropdown-item">Cancel Order</a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer border-0">
        <div className="align-items-center justify-content-between row text-center text-sm-start">
          <div className="col-sm">
            <div data-table-pagination-info="orders"></div>
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0">
            <div data-table-pagination></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
