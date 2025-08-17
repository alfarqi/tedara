import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

interface Customer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: string;
  status: 'Active' | 'Inactive' | 'VIP';
  avatar?: string;
}

interface Order {
  id: string;
  orderId: string;
  date: string;
  time: string;
  status: 'Completed' | 'Pending' | 'Cancelled' | 'Processing' | 'Shipped';
  total: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  deliveryStatus: 'Delivered' | 'In Transit' | 'Pending' | 'Shipped' | 'Cancelled';
  items: number;
}

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // Sample customer data
  const sampleCustomers: Customer[] = [
    {
      id: '1',
      customerId: '#CUST001',
      name: 'Emma Johnson',
      email: 'emma.johnson@ecomsite.com',
      phone: '+966 50 123 4567',
      joinDate: '15 Mar, 2024',
      totalOrders: 12,
      totalSpent: '$2,450.00',
      status: 'Active'
    },
    {
      id: '2',
      customerId: '#CUST002',
      name: 'Michael Brown',
      email: 'michael.brown@shopzone.com',
      phone: '+966 55 987 6543',
      joinDate: '22 Jan, 2024',
      totalOrders: 8,
      totalSpent: '$1,890.50',
      status: 'VIP'
    },
    {
      id: '3',
      customerId: '#CUST003',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@onlineshop.com',
      phone: '+966 54 111 2222',
      joinDate: '8 Feb, 2024',
      totalOrders: 5,
      totalSpent: '$890.25',
      status: 'Active'
    },
    {
      id: '4',
      customerId: '#CUST004',
      name: 'David Lee',
      email: 'david.lee@ecomstore.com',
      phone: '+966 56 333 4444',
      joinDate: '3 Apr, 2024',
      totalOrders: 3,
      totalSpent: '$450.75',
      status: 'Inactive'
    },
    {
      id: '5',
      customerId: '#CUST005',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@shopmail.com',
      phone: '+966 57 555 6666',
      joinDate: '19 Dec, 2023',
      totalOrders: 15,
      totalSpent: '$3,200.00',
      status: 'VIP'
    }
  ];

  // Sample orders data
  const sampleOrders: Order[] = [
    {
      id: '1',
      orderId: '#WB20100',
      date: '15 Mar, 2024',
      time: '10:10 AM',
      status: 'Completed',
      total: '$245.00',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      items: 3
    },
    {
      id: '2',
      orderId: '#WB20101',
      date: '10 Mar, 2024',
      time: '2:30 PM',
      status: 'Processing',
      total: '$189.50',
      paymentStatus: 'Pending',
      deliveryStatus: 'In Transit',
      items: 2
    },
    {
      id: '3',
      orderId: '#WB20102',
      date: '5 Mar, 2024',
      time: '9:15 AM',
      status: 'Cancelled',
      total: '$320.00',
      paymentStatus: 'Failed',
      deliveryStatus: 'Cancelled',
      items: 4
    },
    {
      id: '4',
      orderId: '#WB20103',
      date: '1 Mar, 2024',
      time: '4:45 PM',
      status: 'Shipped',
      total: '$156.75',
      paymentStatus: 'Paid',
      deliveryStatus: 'Shipped',
      items: 1
    },
    {
      id: '5',
      orderId: '#WB20104',
      date: '25 Feb, 2024',
      time: '11:20 AM',
      status: 'Completed',
      total: '$89.25',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      items: 2
    }
  ];

  useEffect(() => {
    // Find customer by ID
    const foundCustomer = sampleCustomers.find(c => c.id === id);
    if (foundCustomer) {
      setCustomer(foundCustomer);
      // For demo purposes, show all sample orders
      setOrders(sampleOrders);
    }
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-soft-success';
      case 'Processing': return 'badge-soft-warning';
      case 'Pending': return 'badge-soft-info';
      case 'Canceled': return 'badge-soft-danger';
      default: return 'badge-soft-secondary';
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return 'badge-soft-success';
      case 'Pending': return 'badge-soft-warning';
      case 'Failed': return 'badge-soft-danger';
      default: return 'badge-soft-secondary';
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered': return 'badge-soft-success';
      case 'In Transit': return 'badge-soft-warning';
      case 'Pending': return 'badge-soft-info';
      default: return 'badge-soft-secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-success';
      case 'Pending': return 'text-warning';
      case 'Failed': return 'text-danger';
      default: return 'text-muted';
    }
  };

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.total.includes(searchTerm);
    
    const matchesPaymentStatus = paymentStatusFilter === 'All' || order.paymentStatus === paymentStatusFilter;
    const matchesOrderStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    
    return matchesSearch && matchesPaymentStatus && matchesOrderStatus;
  });

  if (!customer) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="text-center">
            <h4>Customer not found</h4>
            <Link to="/customers" className="btn btn-primary">Back to Customers</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">CUSTOMER DETAILS</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/customers">Customers</Link></li>
            <li className="breadcrumb-item active">{customer.name}</li>
          </ol>
        </div>
      </div>

      {/* Customer Details Card */}
      <div className="row px-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Customer Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-lg me-3">
                      <div className="avatar-title bg-soft-primary text-primary fs-24 rounded">
                        <i className="ti ti-user"></i>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-1">{customer.name}</h4>
                      <p className="text-muted mb-0">{customer.customerId}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <p className="mb-0">{customer.email}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone</label>
                    <p className="mb-0">{customer.phone}</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Join Date</label>
                    <p className="mb-0">{customer.joinDate}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <div>
                      <span className={`badge ${getStatusBadge(customer.status)} fs-sm`}>
                        {customer.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Total Orders</label>
                    <p className="mb-0 fs-4 fw-bold">{customer.totalOrders}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Total Spent</label>
                    <p className="mb-0 fs-4 fw-bold text-success">{customer.totalSpent}</p>
                  </div>
                </div>
              </div>
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
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Items</th>
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
                      <td>{order.total}</td>
                      <td className={`${getPaymentStatusColor(order.paymentStatus)} fw-semibold`}>
                        <i className="ti ti-point-filled fs-sm"></i> {order.paymentStatus}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.status)} fs-xxs`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.items}</td>
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

export default CustomerDetails;
