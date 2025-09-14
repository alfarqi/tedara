import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { orderService, type OrderFilters, type OrderStatistics } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import OrdersSkeleton from '../components/orders/OrdersSkeleton';

interface DisplayOrder {
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
  const { token } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  // const [orders, setOrders] = useState<any[]>([]);
  const [displayOrders, setDisplayOrders] = useState<DisplayOrder[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Load orders and statistics
  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, [currentPage, rowsPerPage, searchTerm, paymentStatusFilter, orderStatusFilter, dateRangeFilter, token]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // setError(null);

      const filters: OrderFilters = {
        search: searchTerm || undefined,
        payment_status: paymentStatusFilter !== 'All' ? paymentStatusFilter.toLowerCase() : undefined,
        status: orderStatusFilter !== 'All' ? orderStatusFilter.toLowerCase() : undefined,
        page: currentPage,
        per_page: rowsPerPage,
        sort_by: 'created_at',
        sort_order: 'desc'
      };

      // Apply date range filter
      if (dateRangeFilter !== 'All') {
        const now = new Date();
        switch (dateRangeFilter) {
          case 'Today':
            filters.from = now.toISOString().split('T')[0];
            filters.to = now.toISOString().split('T')[0];
            break;
          case 'Last 7 Days':
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filters.from = sevenDaysAgo.toISOString().split('T')[0];
            filters.to = now.toISOString().split('T')[0];
            break;
          case 'Last 30 Days':
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filters.from = thirtyDaysAgo.toISOString().split('T')[0];
            filters.to = now.toISOString().split('T')[0];
            break;
          case 'This Year':
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            filters.from = startOfYear.toISOString().split('T')[0];
            filters.to = now.toISOString().split('T')[0];
            break;
        }
      }

      const response = await orderService.getOrders(filters, token || undefined);
      
      // Debug logging
      console.log('Orders API Response:', response);
      
      // Ensure we have an array of orders
      const ordersData = Array.isArray(response.data) ? response.data : [];
      // setOrders(ordersData);
      setTotalOrders(response.meta?.total || 0);
      setTotalPages(response.meta?.last_page || 1);
      
      // Format orders for display - ensure we're mapping over an array
      const formattedOrders = ordersData.map(order => orderService.formatOrderForDisplay(order));
      setDisplayOrders(formattedOrders);

    } catch (err) {
      console.error('Error loading orders:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orders. Please try again.';
      // setError(errorMessage);
      showError('Error', errorMessage, 5000);
      
      // Set empty arrays on error to prevent map errors
      // setOrders([]);
      setDisplayOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await orderService.getOrderStatistics({}, token || undefined);
      setStatistics(response.data || null);
    } catch (err) {
      console.error('Error loading statistics:', err);
      // Set default statistics instead of showing error
      setStatistics({
        total_orders: 0,
        completed_orders: 0,
        pending_orders: 0,
        cancelled_orders: 0,
        paid_orders: 0,
        total_revenue: 0,
        average_order_value: 0
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(displayOrders.map(order => order.id)));
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

  const handleBulkDelete = async () => {
    if (selectedOrders.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedOrders.size} order(s)?`)) {
      return;
    }

    try {
      const orderIds = Array.from(selectedOrders).map(id => parseInt(id));
      await orderService.bulkDeleteOrders(orderIds, token || undefined);
      
      // Reload orders and clear selection
      setSelectedOrders(new Set());
      await loadOrders();
      await loadStatistics();
      
      showSuccess('Success', `Successfully deleted ${selectedOrders.size} order(s)`, 3000);
    } catch (err) {
      console.error('Error deleting orders:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete orders. Please try again.';
      showError('Error', errorMessage, 5000);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      console.log('Attempting to delete order:', orderToDelete);
      console.log('User token:', token);
      
      const response = await orderService.deleteOrder(parseInt(orderToDelete), token || undefined);
      console.log('Delete response:', response);
      
      // Reload orders
      await loadOrders();
      await loadStatistics();
      
      showSuccess('Success', 'Order deleted successfully', 3000);
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        response: err instanceof Error && 'response' in err ? (err as any).response : null,
        status: err instanceof Error && 'response' in err ? (err as any).response?.status : null,
      });
      
      let errorMessage = 'Failed to delete order. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as any).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.status === 403) {
          errorMessage = 'You are not authorized to delete this order.';
        } else if (response?.status === 404) {
          errorMessage = 'Order not found.';
        }
      }
      
      showError('Error', errorMessage, 5000);
    }
  };

  const cancelDeleteOrder = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
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

  const handlePrintInvoice = (orderId: string) => {
    // Navigate to invoice details page in the same tab
    navigate(`/invoice/${orderId}`);
  };

  // Filter orders based on current filters (this is now mostly handled by the API, but client-side filtering for search term on displayOrders is still here)
  const filteredOrders = displayOrders.filter(order => {
    // Add safety checks to prevent undefined errors
    const orderId = order.orderId || '';
    const customerName = order.customer?.name || '';
    const customerEmail = order.customer?.email || '';
    
    const matchesSearch = orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    // The status filters are now primarily handled by the API, but keeping this for consistency if needed for client-side refinement
    const matchesPaymentStatus = paymentStatusFilter === 'All' || order.paymentStatus === paymentStatusFilter;
    const matchesOrderStatus = orderStatusFilter === 'All' || order.orderStatus === orderStatusFilter;
    
    return matchesSearch && matchesPaymentStatus && matchesOrderStatus;
  });



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
                <h3 className="mb-0">{statistics?.completed_orders || 0}</h3>
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
                <h3 className="mb-0">{statistics?.pending_orders || 0}</h3>
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
                <h3 className="mb-0">{statistics?.cancelled_orders || 0}</h3>
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
                <h3 className="mb-0">{statistics?.total_orders || 0}</h3>
              </div>
              <p className="mb-0">
                Total Orders
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
                    <i className="ti ti-currency-dollar"></i>
                  </span>
                </div>
                <h3 className="mb-0">${Number(statistics?.total_revenue || 0).toFixed(2)}</h3>
              </div>
              <p className="mb-0">
                Total Revenue
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
                  <button className="btn btn-danger" onClick={handleBulkDelete}>
                    Delete ({selectedOrders.size})
                  </button>
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

            {loading ? (
              <OrdersSkeleton count={rowsPerPage} />
            ) : (
              <div className="table-responsive">
              <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
                <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                  <tr className="text-uppercase fs-xxs">
                    <th className="ps-3" style={{ width: '1%' }}>
                      <input 
                        className="form-check-input form-check-input-light fs-14 mt-0" 
                        type="checkbox" 
                        checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
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
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-5">
                        <div className="d-flex flex-column align-items-center">
                          <i className="ti ti-shopping-cart fs-1 text-muted mb-3"></i>
                          <h5 className="text-muted mb-2">No orders found</h5>
                          <p className="text-muted mb-0">Try adjusting your filters or create a new order.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="card-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalOrders)} of {totalOrders} orders
                  </div>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      })}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 9998 }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 9999 }}>
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="ti ti-alert-triangle me-2"></i>
                  Delete Order
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={cancelDeleteOrder}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  Are you sure you want to delete this order? This action cannot be undone.
                </p>
                <div className="alert alert-warning">
                  <i className="ti ti-alert-triangle me-2"></i>
                  <strong>Warning:</strong> Deleting an order will permanently remove it from the system and cannot be recovered.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDeleteOrder}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDeleteOrder}
                >
                  <i className="ti ti-trash me-2"></i>
                  Delete Order
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 9997 }}></div>
        </div>
      )}
    </Layout>
  );
};

export default Orders;
