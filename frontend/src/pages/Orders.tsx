import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

interface Order {
  id: string;
  orderId: string;
  date: string;
  time: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: {
    type: string;
    icon: string;
    details: string;
  };
}

const Orders: React.FC = () => {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sample orders data
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderId: '#WB20100',
      date: '9 May, 2025',
      time: '10:10 AM',
      customer: {
        name: 'Mason Carter',
        email: 'mason.carter@shopmail.com',
        avatar: '/assets/images/users/user-2.jpg'
      },
      amount: '$129.45',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      paymentMethod: {
        type: 'Visa',
        icon: '/assets/images/cards/visa.svg',
        details: 'xxxx 7832'
      }
    },
    {
      id: '2',
      orderId: '#WB20101',
      date: '7 May, 2025',
      time: '11:45 AM',
      customer: {
        name: 'Ava Martin',
        email: 'ava.martin@marketplace.com',
        avatar: '/assets/images/users/user-9.jpg'
      },
      amount: '$87.00',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
      paymentMethod: {
        type: 'Mastercard',
        icon: '/assets/images/cards/mastercard.svg',
        details: 'xxxx 5487'
      }
    },
    {
      id: '3',
      orderId: '#WB20102',
      date: '26 Apr, 2025',
      time: '1:20 PM',
      customer: {
        name: 'Noah Wilson',
        email: 'noah.wilson@ecomsite.com',
        avatar: '/assets/images/users/user-1.jpg'
      },
      amount: '$59.90',
      paymentStatus: 'Failed',
      orderStatus: 'Cancelled',
      paymentMethod: {
        type: 'PayPal',
        icon: '/assets/images/cards/paypal.svg',
        details: 'xxx@email.com'
      }
    },
    {
      id: '4',
      orderId: '#WB20103',
      date: '27 Apr, 2025',
      time: '3:30 PM',
      customer: {
        name: 'Isabella Moore',
        email: 'isabella.moore@onlineshop.com',
        avatar: '/assets/images/users/user-10.jpg'
      },
      amount: '$215.20',
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      paymentMethod: {
        type: 'Stripe',
        icon: '/assets/images/cards/stripe.svg',
        details: 'xxxx 9901'
      }
    },
    {
      id: '5',
      orderId: '#WB20104',
      date: '28 Apr, 2025',
      time: '9:55 AM',
      customer: {
        name: 'Lucas Bennett',
        email: 'lucas.bennett@shopzone.com',
        avatar: '/assets/images/users/user-5.jpg'
      },
      amount: '$345.75',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      paymentMethod: {
        type: 'American Express',
        icon: '/assets/images/cards/american-express.svg',
        details: 'xxxx 4678'
      }
    }
  ]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(orders.map(order => order.id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-success';
      case 'Pending': return 'text-warning';
      case 'Failed': return 'text-danger';
      case 'Refunded': return 'text-info';
      default: return 'text-muted';
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered': return 'badge-soft-success';
      case 'Shipped': return 'badge-soft-info';
      case 'Processing': return 'badge-soft-warning';
      case 'Cancelled': return 'badge-soft-danger';
      default: return 'badge-soft-secondary';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentStatus = paymentStatusFilter === 'All' || order.paymentStatus === paymentStatusFilter;
    const matchesOrderStatus = orderStatusFilter === 'All' || order.orderStatus === orderStatusFilter;
    
    return matchesSearch && matchesPaymentStatus && matchesOrderStatus;
  });

  const handlePrintInvoice = (orderId: string) => {
    // Open invoice details page in a new tab
    window.open(`/invoice/${orderId}`, '_blank');
  };

  const handleDeleteOrder = (orderId: string) => {
    // Handle delete order functionality
    console.log('Deleting order:', orderId);
    // You can implement actual delete functionality here
    // For now, just log the action
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Orders</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Inspinia</a></li>
            <li className="breadcrumb-item"><a href="javascript: void(0);">Ecommerce</a></li>
            <li className="breadcrumb-item active">Orders</li>
          </ol>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row px-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar-md flex-shrink-0">
                  <span className="avatar-title text-bg-success rounded-circle fs-22">
                    <i className="ti ti-check"></i>
                  </span>
                </div>
                <h3 className="mb-0">1,240</h3>
              </div>
              <p className="mb-0">
                Completed Orders
                <span className="float-end badge badge-soft-success">+3.34%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar-md flex-shrink-0">
                  <span className="avatar-title text-bg-warning rounded-circle fs-22">
                    <i className="ti ti-hourglass"></i>
                  </span>
                </div>
                <h3 className="mb-0">320</h3>
              </div>
              <p className="mb-0">
                Pending Orders
                <span className="float-end badge badge-soft-warning">-1.12%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar-md flex-shrink-0">
                  <span className="avatar-title text-bg-danger rounded-circle fs-22">
                    <i className="ti ti-x"></i>
                  </span>
                </div>
                <h3 className="mb-0">87</h3>
              </div>
              <p className="mb-0">
                Canceled Orders
                <span className="float-end badge badge-soft-danger">-0.75%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar-md flex-shrink-0">
                  <span className="avatar-title text-bg-info rounded-circle fs-22">
                    <i className="ti ti-shopping-cart"></i>
                  </span>
                </div>
                <h3 className="mb-0">540</h3>
              </div>
              <p className="mb-0">
                New Orders
                <span className="float-end badge badge-soft-info">+4.22%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar-md flex-shrink-0">
                  <span className="avatar-title text-bg-primary rounded-circle fs-22">
                    <i className="ti ti-repeat"></i>
                  </span>
                </div>
                <h3 className="mb-0">120</h3>
              </div>
              <p className="mb-0">
                Returned Orders
                <span className="float-end badge badge-soft-primary">+0.56%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="row px-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header border-light justify-content-between">
              <div className="d-flex gap-2">
                <Link to="/orders/new" className="btn btn-primary">
                  <i className="ti ti-plus fs-sm me-2"></i> Add Order
                </Link>

                {selectedOrders.size > 0 && (
                  <button className="btn btn-danger">Delete</button>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="me-2 fw-semibold">Filter By:</span>

                {/* Payment Status Filter */}
                <div className="app-search">
                  <select 
                    className="form-select form-control my-1 my-md-0"
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  >
                    <option value="All">Payment Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                  <i className="ti ti-credit-card app-search-icon text-muted"></i>
                </div>

                {/* Delivery Status Filter */}
                <div className="app-search">
                  <select 
                    className="form-select form-control my-1 my-md-0"
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="All">Delivery Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <i className="ti ti-truck app-search-icon text-muted"></i>
                </div>

                {/* Date Range Filter */}
                <div className="app-search">
                  <select 
                    className="form-select form-control my-1 my-md-0"
                    value={dateRangeFilter}
                    onChange={(e) => setDateRangeFilter(e.target.value)}
                  >
                    <option value="All">Date Range</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="This Year">This Year</option>
                  </select>
                  <i className="ti ti-calendar app-search-icon text-muted"></i>
                </div>

                {/* Records Per Page */}
                <div>
                  <select 
                    className="form-select form-control my-1 my-md-0"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                <div className="app-search">
                  <input 
                    type="search" 
                    className="form-control" 
                    placeholder="Search order..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                      <input 
                        className="form-check-input form-check-input-light fs-14 mt-0" 
                        type="checkbox" 
                        checked={selectedOrders.size === orders.length && orders.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
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
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="ps-3">
                        <input 
                          className="form-check-input form-check-input-light fs-14 product-item-check mt-0" 
                          type="checkbox" 
                          checked={selectedOrders.has(order.id)}
                          onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <h5 className="fs-sm mb-0 fw-medium">
                          <Link to={`/orders/new?edit=${order.id}`} className="link-reset text-decoration-none">
                            {order.orderId}
                          </Link>
                        </h5>
                      </td>
                      <td>{order.date} <small className="text-muted">{order.time}</small></td>
                      <td>
                        <div className="d-flex justify-content-start align-items-center gap-2">
                          <div className="avatar avatar-sm d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', border: '2px solid #e9ecef', borderRadius: '50%' }}>
                            <i className="ti ti-user fs-4 text-muted"></i>
                          </div>
                          <div>
                            <h5 className="text-nowrap fs-base mb-0 lh-base">{order.customer.name}</h5>
                            <p className="text-muted fs-xs mb-0">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>{order.amount}</td>
                      <td className={`${getPaymentStatusColor(order.paymentStatus)} fw-semibold`}>
                        <i className="ti ti-point-filled fs-sm"></i> {order.paymentStatus}
                      </td>
                      <td>
                        <span className={`badge ${getOrderStatusBadge(order.orderStatus)} fs-xxs`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <img src={order.paymentMethod.icon} alt="" className="me-2" height="28" />
                        {order.paymentMethod.details}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button 
                            className="btn btn-sm btn-link p-0" 
                            title="Print Invoice"
                            onClick={() => handlePrintInvoice(order.id)}
                          >
                            <div className="d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: '#f8f9fa', borderRadius: '50%' }}>
                              <i className="ti ti-file-invoice fs-lg"></i>
                            </div>
                          </button>
                          <button 
                            className="btn btn-sm btn-link p-0 text-danger" 
                            title="Delete Order"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <div className="d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: '#f8f9fa', borderRadius: '50%' }}>
                              <i className="ti ti-trash fs-lg"></i>
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
