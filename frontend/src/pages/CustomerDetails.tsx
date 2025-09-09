import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { customerService, type Customer as CustomerType } from '../services/customerService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

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
  const { token } = useAuth();
  const { showError } = useToast();
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load customer data on component mount
  useEffect(() => {
    if (id && token) {
      loadCustomer();
    }
  }, [id, token]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const response = await customerService.getCustomer(id as string, token);
      
      if (response.data) {
        console.log('Customer API Response:', response.data);
        setCustomer(response.data);
        // Set orders from the customer data if available
        if (response.data.orders) {
          console.log('Orders from API:', response.data.orders);
          setOrders(response.data.orders.map((order: any) => ({
            id: order.id?.toString() || order.order_id?.toString() || '0',
            orderId: order.order_id || order.id?.toString() || 'N/A',
            date: order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) : 'N/A',
            time: order.created_at ? new Date(order.created_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A',
            status: order.status || 'Unknown',
            total: `$${typeof order.total === 'number' ? order.total.toFixed(2) : order.total || '0.00'}`,
            paymentStatus: 'Paid', // Default for now
            deliveryStatus: 'Delivered', // Default for now
            items: order.order_items?.length || 1 // Use actual items count if available
          })));
        }
      }
    } catch (error) {
      console.error('Error loading customer:', error);
      showError('Error', 'Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

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



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-soft-success';
      case 'Processing': return 'badge-soft-warning';
      case 'Pending': return 'badge-soft-info';
      case 'Canceled': return 'badge-soft-danger';
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

  if (loading) {
    return (
      <Layout>
        {/* Page Header Skeleton */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '300px' }}></div>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/customers">Customers</a></li>
              <li className="breadcrumb-item active">
                <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
              </li>
            </ol>
          </div>
        </div>

        {/* Compact Customer Info Skeleton */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              {/* Avatar, Name and ID Skeleton - Left Side */}
              <div className="col-md-3">
                <div className="d-flex align-items-center">
                  <div className="skeleton-circle me-3" style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e9ecef'
                  }}></div>
                  <div>
                    <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '140px', marginBottom: '8px' }}></div>
                    <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px', marginBottom: '8px' }}></div>
                    <div className="skeleton-line" style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '10px', width: '60px' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Contact Info Skeleton */}
              <div className="col-md-3">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center">
                    <div className="skeleton-circle" style={{ width: '16px', height: '16px', backgroundColor: '#e9ecef', marginRight: '8px' }}></div>
                    <div className="skeleton-line" style={{ height: '18px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '160px' }}></div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="skeleton-circle" style={{ width: '16px', height: '16px', backgroundColor: '#e9ecef', marginRight: '8px' }}></div>
                    <div className="skeleton-line" style={{ height: '18px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '140px' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Join Date Skeleton */}
              <div className="col-md-2">
                <div className="text-center">
                  <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '90px', margin: '0 auto 8px' }}></div>
                  <div className="skeleton-line" style={{ height: '18px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px', margin: '0 auto' }}></div>
                </div>
              </div>
              
              {/* Statistics Skeleton */}
              <div className="col-md-4">
                <div className="row g-2 text-center">
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                      <div className="skeleton-line" style={{ height: '28px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '50px', margin: '0 auto 8px' }}></div>
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '60px', margin: '0 auto' }}></div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                      <div className="skeleton-line" style={{ height: '28px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '70px', margin: '0 auto 8px' }}></div>
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '60px', margin: '0 auto' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table Skeleton */}
        <div className="card">
          <div className="card-header">
            <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '200px' }}></div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-centered table-nowrap mb-0">
                <thead>
                  <tr>
                    <th scope="col">
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                    </th>
                    <th scope="col">
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                    </th>
                    <th scope="col">
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px' }}></div>
                    </th>
                    <th scope="col">
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                    </th>
                    <th scope="col">
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                    </th>
                    <th scope="col">
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                    </th>
                    <th scope="col">
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                    </th>
                    <th scope="col">
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '60px' }}></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td>
                        <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                      </td>
                      <td>
                        <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                      </td>
                      <td>
                        <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px' }}></div>
                      </td>
                      <td>
                        <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                      </td>
                      <td>
                        <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                      </td>
                      <td>
                        <div className="skeleton-line" style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '10px', width: '60px' }}></div>
                      </td>
                      <td>
                        <div className="skeleton-line" style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '10px', width: '60px' }}></div>
                      </td>
                      <td>
                        <div className="skeleton-line" style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '10px', width: '60px' }}></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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

      {/* Compact Customer Details Card */}
      <div className="row px-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="row g-3 align-items-center">
                {/* Avatar, Name and ID - Left Side */}
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-3" style={{ 
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div className="text-white" style={{ fontSize: '32px' }}>
                        <i className="ti ti-user"></i>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-1 fw-bold text-dark">{customer.name}</h4>
                      <p className="text-muted mb-1 small">Customer ID: #{customer.id}</p>
                      <span className={`badge ${getStatusBadge(customer.status)} fs-xs px-2 py-1`}>
                        {customer.status === 'vip' ? '👑 VIP' : customer.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="col-md-3">
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center">
                      <i className="ti ti-mail text-primary me-2" style={{ fontSize: '16px' }}></i>
                      <span className="fw-medium text-dark" style={{ fontSize: '15px' }}>{customer.email}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="ti ti-phone text-success me-2" style={{ fontSize: '16px' }}></i>
                      <span className="fw-medium text-dark" style={{ fontSize: '15px' }}>{customer.phone}</span>
                    </div>
                  </div>
                </div>
                
                {/* Join Date */}
                <div className="col-md-2">
                  <div className="text-center">
                    <div className="text-muted mb-1" style={{ fontSize: '14px' }}>Member Since</div>
                    <div className="text-dark fw-medium" style={{ fontSize: '15px' }}>
                      {new Date(customer.join_date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Statistics */}
                <div className="col-md-4">
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                        <div className="fw-bold text-primary" style={{ fontSize: '24px' }}>{customer.total_orders}</div>
                        <div className="text-muted" style={{ fontSize: '14px' }}>Orders</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                        <div className="fw-bold text-success" style={{ fontSize: '24px' }}>${typeof customer.total_spent === 'number' ? customer.total_spent.toFixed(2) : customer.total_spent || '0.00'}</div>
                        <div className="text-muted" style={{ fontSize: '14px' }}>Spent</div>
                      </div>
                    </div>
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
                                                      <Link to={`/orders/${order.id}`} className="link-reset text-decoration-none">
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
