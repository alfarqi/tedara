import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useToast } from '../contexts/ToastContext';
import { orderService } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  quantity: number;
  unitWeight: number;
  price: number;
  totalWeight: number;
  total: number;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderForm {
  orderId: string;
  orderDate: string;
  orderStatus: string;
  customer: Customer;
  shipping: {
    method: string;
    address: string;
    cost: number;
  };
  payment: {
    method: string;
    status: string;
  };
  products: Product[];
  tags: string[];
}

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { token } = useAuth();
  
  const [orderForm, setOrderForm] = useState<OrderForm>({
    orderId: '',
    orderDate: '',
    orderStatus: '',
    customer: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    shipping: {
      method: '',
      address: '',
      cost: 0
    },
    payment: {
      method: '',
      status: ''
    },
    products: [],
    tags: []
  });

  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load order data when component mounts
  useEffect(() => {
    if (orderId && token) {
      loadOrderDetails();
    }
  }, [orderId, token]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrder(parseInt(orderId!), token || undefined);
      
      if (response.data) {
        // Handle different response structures
        const order = response.data.data || response.data;
        console.log('Full API response:', response);
        console.log('Full order data:', order);
        console.log('Order items (orderItems):', order.orderItems);
        console.log('Order items (order_items):', order.order_items);
        console.log('Order items count:', (order.orderItems || order.order_items)?.length || 0);
        
        // Format the order data for display
        setOrderForm({
          orderId: order.order_id || '',
          orderDate: new Date(order.created_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) + ' | ' + new Date(order.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          orderStatus: order.status || '',
          customer: {
            name: order.customer?.name || '',
            email: order.customer?.email || '',
            phone: order.customer?.phone || '',
            address: order.shipping_address ? 
              `${order.shipping_address.street}, ${order.shipping_address.city}, ${order.shipping_address.state}` : ''
          },
          shipping: {
            method: order.shipping_cost > 0 ? 'Shipping Required' : 'No Shipping Required',
            address: order.shipping_address ? 
              `${order.shipping_address.street}, ${order.shipping_address.city}, ${order.shipping_address.state}` : '',
            cost: parseFloat(String(order.shipping_cost)) || 0
          },
          payment: {
            method: order.payment_method || '',
            status: order.payment_status || ''
          },
          products: (order.orderItems || order.order_items)?.map((item: any) => {
            console.log('Order item:', item);
            console.log('Product data:', item.product);
            const mappedProduct = {
              id: item.id?.toString() || '',
              name: item.product?.name || 'Unknown Product',
              quantity: item.quantity || 0,
              unitWeight: 0, // Not available in API
              price: parseFloat(item.price || item.unit_price || 0) || 0,
              totalWeight: 0, // Not available in API
              total: parseFloat(item.total || item.total_price || 0) || 0
            };
            console.log('Mapped product:', mappedProduct);
            return mappedProduct;
          }) || [],
          tags: [] // Not available in API
        });
        
        console.log('Final orderForm state:', orderForm);
        console.log('Products array length:', orderForm.products.length);
        console.log('Products array:', orderForm.products);
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      showError('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderSummary = () => {
    const subtotal = orderForm.products.reduce((sum, product) => sum + product.total, 0);
    const shippingCost = orderForm.shipping.cost;
    const discount = 0; // Could be calculated from coupons
    const total = subtotal + shippingCost - discount;
    
    return {
      subtotal,
      shippingCost,
      discount,
      total
    };
  };

  const handleDeleteOrder = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    try {
      if (orderId && token) {
        await orderService.deleteOrder(parseInt(orderId), token);
        showSuccess('Success', 'Order deleted successfully');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showError('Error', 'Failed to delete order');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteOrder = () => {
    setShowDeleteModal(false);
  };

  const handleEditOrder = () => {
    navigate(`/orders/new?edit=${orderId}`);
  };

  const summary = calculateOrderSummary();

  if (loading) {
    return (
      <Layout>
        {/* Page Header Skeleton */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '200px' }}></div>
          </div>
          <div className="text-end">
            <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '300px' }}></div>
          </div>
        </div>

        <div className="row px-4 justify-content-center">
          <div className="col-lg-10">
            {/* Order Details Section Skeleton */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '150px' }}></div>
                <div className="skeleton-line" style={{ height: '32px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px', marginBottom: '8px' }}></div>
                    <div className="skeleton-line" style={{ height: '32px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px' }}></div>
                  </div>
                  <div className="col-md-4">
                    <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px', marginBottom: '8px' }}></div>
                    <div className="skeleton-line" style={{ height: '32px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '140px' }}></div>
                  </div>
                  <div className="col-md-4">
                    <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '90px', marginBottom: '8px' }}></div>
                    <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '160px' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer, Shipping, Payment Section Skeleton */}
            <div className="row mb-4">
              {/* Customer Section Skeleton */}
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-header">
                    <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="skeleton-circle me-3" style={{ width: '48px', height: '48px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
                      <div className="flex-grow-1">
                        <div className="skeleton-line" style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px', marginBottom: '8px' }}></div>
                        <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '140px', marginBottom: '6px' }}></div>
                        <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Section Skeleton */}
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-header">
                    <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                  </div>
                  <div className="card-body">
                    <div className="text-center">
                      <div className="skeleton-circle mx-auto mb-3" style={{ width: '48px', height: '48px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
                      <div className="skeleton-line" style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '140px', marginBottom: '8px' }}></div>
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '160px' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section Skeleton */}
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-header">
                    <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                  </div>
                  <div className="card-body">
                    <div className="text-center">
                      <div className="skeleton-circle mx-auto mb-3" style={{ width: '48px', height: '48px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
                      <div className="skeleton-line" style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px', marginBottom: '8px' }}></div>
                      <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section Skeleton */}
            <div className="card mb-4">
              <div className="card-header">
                <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead className="bg-light">
                      <tr>
                        <th><div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div></th>
                        <th><div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div></th>
                        <th><div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '100px' }}></div></th>
                        <th><div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((index) => (
                        <tr key={index}>
                          <td><div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '140px' }}></div></td>
                          <td><div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '60px' }}></div></td>
                          <td><div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div></td>
                          <td><div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Summary Section Skeleton */}
            <div className="card mb-4">
              <div className="card-header">
                <div className="skeleton-line" style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px' }}></div>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                  <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '60px' }}></div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                  <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '60px' }}></div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                  <div className="skeleton-line" style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '60px' }}></div>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <div className="skeleton-line" style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                  <div className="skeleton-line" style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '80px' }}></div>
                </div>
              </div>
            </div>

            {/* Action Buttons Section Skeleton */}
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-center gap-3">
                  <div className="skeleton-line" style={{ height: '38px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px' }}></div>
                  <div className="skeleton-line" style={{ height: '38px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px' }}></div>
                  <div className="skeleton-line" style={{ height: '38px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '120px' }}></div>
                </div>
              </div>
            </div>
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
          <h4 className="fs-sm text-uppercase fw-bold m-0">Order Details</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/orders">Orders</Link></li>
            <li className="breadcrumb-item active">Order #{orderForm.orderId}</li>
          </ol>
        </div>
      </div>

      <div className="row px-4 justify-content-center">
        <div className="col-lg-10">
          {/* Order Details Section */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="ti ti-file-text me-2"></i>
                Order Details
              </h5>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleEditOrder}
                >
                  <i className="ti ti-edit me-1"></i>
                  Edit Order
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Order ID</label>
                  <div className="fs-4 fw-bold text-primary">#{orderForm.orderId}</div>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Order Status</label>
                  <div className="fs-4 fw-bold text-primary">{orderForm.orderStatus}</div>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Order Date</label>
                  <div className="fs-6">{orderForm.orderDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Customer, Shipping, Payment */}
          <div className="row mb-4">
            {/* Customer Section */}
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="ti ti-user me-2"></i>
                    Customer
                  </h5>
                </div>
                <div className="card-body">
                  {orderForm.customer.name ? (
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-md me-3">
                        <i className="ti ti-user fs-2"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">{orderForm.customer.name}</h6>
                        <p className="text-muted mb-1">{orderForm.customer.email}</p>
                        <p className="text-muted mb-0">{orderForm.customer.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="ti ti-user fs-1 mb-2"></i>
                      <p>No customer information</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Section */}
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="ti ti-truck me-2"></i>
                    Shipping
                  </h5>
                </div>
                <div className="card-body">
                  {orderForm.shipping.method ? (
                    <div className="text-center text-muted py-4">
                      <i className="ti ti-truck fs-1 mb-2"></i>
                      <p className="mb-0">{orderForm.shipping.method}</p>
                      {orderForm.shipping.address && (
                        <p className="text-muted mb-0 mt-2">{orderForm.shipping.address}</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="ti ti-truck fs-1 mb-2"></i>
                      <p>No shipping information</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="ti ti-credit-card me-2"></i>
                    Payment
                  </h5>
                </div>
                <div className="card-body">
                  {orderForm.payment.method ? (
                    <div>
                      <p className="mb-1">Method: {orderForm.payment.method}</p>
                      <p className="mb-0">Status: {orderForm.payment.status}</p>
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="ti ti-credit-card fs-1 mb-2"></i>
                      <p>No payment information</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="ti ti-package me-2"></i>
                Products
              </h5>
            </div>
            <div className="card-body">
              {(() => {
                console.log('Rendering Products section - products.length:', orderForm.products.length);
                console.log('Rendering Products section - products:', orderForm.products);
                return orderForm.products.length > 0;
              })() ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="bg-light">
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderForm.products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.quantity}</td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>${product.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="ti ti-package fs-1 mb-2"></i>
                  <p>No products in this order</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="ti ti-receipt me-2"></i>
                Order Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>${summary.shippingCost.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Discount:</span>
                <span>-${summary.discount.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>${summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row px-4 justify-content-center">
        <div className="col-lg-10">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-center gap-3">
                <button 
                  className="btn btn-light"
                  onClick={() => navigate('/orders')}
                >
                  <i className="ti ti-arrow-left me-1"></i>
                  Back to Orders
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={handleEditOrder}
                >
                  <i className="ti ti-edit me-1"></i>
                  Edit Order
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteOrder}
                >
                  <i className="ti ti-trash me-1"></i>
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={cancelDeleteOrder}
                ></button>
              </div>
              <div className="modal-body text-center">
                <i className="ti ti-trash fs-1 text-danger mb-3"></i>
                <h5 className="mb-3">Are you sure?</h5>
                <p className="mb-0">This action cannot be undone. The order will be permanently deleted.</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={cancelDeleteOrder}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={confirmDeleteOrder}
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showDeleteModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </Layout>
  );
};

export default OrderDetails;
