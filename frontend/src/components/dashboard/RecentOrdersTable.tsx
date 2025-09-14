import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../contexts/ToastContext';
import type { Order } from '../../types/order';

interface RecentOrdersTableProps {
  limit?: number;
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ limit = 5 }) => {
  const { showError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentOrders();
  }, [limit]);

  const loadRecentOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      console.log('🔍 Loading recent orders...');
      
      const recentOrders = await orderService.getRecentOrders(token || undefined);
      console.log('📦 Recent orders response:', recentOrders);
      
      // recentOrders should now be an array of Order objects
      if (Array.isArray(recentOrders)) {
        setOrders(recentOrders.slice(0, limit));
      } else {
        console.warn('⚠️ Unexpected response structure:', recentOrders);
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Error loading recent orders:', error);
      showError('Failed to load recent orders', 'Failed to load recent orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCustomerImage = (order: Order) => {
    // Use customer avatar if available, otherwise use a default avatar
    if (order.customer?.avatar) {
      return order.customer.avatar;
    }
    // Generate a default avatar based on customer name
    const name = order.customer?.name || 'Customer';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=40`;
  };


  if (loading) {
    return (
      <div className="card">
        <div className="card-header justify-content-between align-items-center border-dashed">
          <h4 className="card-title mb-0">Recent Orders</h4>
          <div className="d-flex gap-2">
            <div className="btn btn-sm btn-soft-secondary disabled">
              <i className="ti ti-plus me-1"></i> Add Order
            </div>
            <div className="btn btn-sm btn-primary disabled">
              <i className="ti ti-file-export me-1"></i> Export CSV
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
              <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                <tr className="text-uppercase fs-xxs">
                  <th className="ps-3">Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: limit }).map((_, index) => (
                  <tr key={index}>
                    <td className="ps-3">
                      <div className="placeholder-glow">
                        <span className="placeholder col-8"></span>
                      </div>
                    </td>
                    <td>
                      <div className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="placeholder-glow">
                          <span className="placeholder avatar-xs rounded-circle me-2"></span>
                        </div>
                        <div>
                          <div className="placeholder-glow">
                            <span className="placeholder col-6"></span>
                          </div>
                          <div className="placeholder-glow">
                            <span className="placeholder col-4"></span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="placeholder-glow">
                        <span className="placeholder col-5"></span>
                      </div>
                    </td>
                    <td>
                      <div className="placeholder-glow">
                        <span className="placeholder col-3"></span>
                      </div>
                    </td>
                    <td>
                      <div className="placeholder-glow">
                        <span className="placeholder col-3"></span>
                      </div>
                    </td>
                    <td>
                      <div className="placeholder-glow">
                        <span className="placeholder col-2"></span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-table data-table-rows-per-page={limit.toString()} className="card">
      <div className="card-header justify-content-between align-items-center border-dashed">
        <h4 className="card-title mb-0">Recent Orders {limit > 5 ? `(${limit} most recent)` : ''}</h4>
        <div className="d-flex gap-2">
          <a href="/orders" className="btn btn-sm btn-soft-info">
            <i className="ti ti-eye me-1"></i> View All Orders
          </a>
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
          <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
            <thead className="bg-light align-middle bg-opacity-25 thead-sm">
              <tr className="text-uppercase fs-xxs">
                <th className="ps-3">Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div className="d-flex flex-column align-items-center">
                      <i className="ti ti-shopping-cart fs-1 text-muted mb-3"></i>
                      <h5 className="text-muted mb-2">No recent orders found</h5>
                      <p className="text-muted mb-0">Try adjusting your filters or create a new order.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-3">
                      <a href={`/orders/${order.id}`} className="text-body fw-semibold">
                        #{order.order_id}
                      </a>
                    </td>
                    <td>
                      <span className="text-muted fs-xs">{formatDate(order.created_at)}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={getCustomerImage(order)} 
                          alt={order.customer?.name || 'Customer'} 
                          className="avatar-xs rounded-circle me-2" 
                        />
                        <div>
                          <h6 className="fs-sm mb-0">{order.customer?.name || 'Unknown Customer'}</h6>
                          <span className="text-muted fs-xs">{order.customer?.email || ''}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold">{formatCurrency(order.total)}</span>
                    </td>
                    <td>
                      <span className={`badge badge-soft-${order.payment_status === 'paid' ? 'success' : order.payment_status === 'pending' ? 'warning' : 'danger'} fs-xs`}>
                        {order.payment_status === 'paid' ? 'Paid' : order.payment_status === 'pending' ? 'Pending' : 'Failed'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-soft-${order.status === 'delivered' ? 'success' : order.status === 'processing' || order.status === 'shipped' ? 'info' : order.status === 'pending' ? 'warning' : 'danger'} fs-xs`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <a href="#" className="dropdown-toggle text-muted drop-arrow-none card-drop p-0" data-bs-toggle="dropdown">
                          <i className="ti ti-dots-vertical fs-lg"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href={`/orders/${order.id}`} className="dropdown-item">View Details</a>
                          {order.status === 'pending' && (
                            <a href="#" className="dropdown-item">Cancel Order</a>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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