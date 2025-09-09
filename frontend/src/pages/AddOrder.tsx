import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { orderService } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

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

const AddOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editOrderId = searchParams.get('edit');
  const isEditMode = !!editOrderId;
  const { token } = useAuth();
  const { showError, showSuccess } = useToast();

  // Sample order data for edit mode
  const sampleOrders = {
    '1': {
      orderId: 'WB20100',
      orderDate: 'Monday, April 28, 2025 | 10:30 AM',
      orderStatus: 'Processing',
      customer: {
        name: 'Emma Johnson',
        email: 'emma.johnson@ecomsite.com',
        phone: '+966 50 123 4567',
        address: '123 Main St, Riyadh, Saudi Arabia'
      },
      shipping: {
        method: 'Express Shipping',
        address: '123 Main St, Riyadh, Saudi Arabia',
        cost: 25
      },
      payment: {
        method: 'Credit Card',
        status: 'Paid'
      },
      products: [
        {
          id: '1',
          name: 'Modern Minimalist Fabric Sofa',
          quantity: 1,
          unitWeight: 50,
          price: 764.15,
          totalWeight: 50,
          total: 764.15
        }
      ],
      tags: ['VIP', 'Express']
    },
    '2': {
      orderId: 'WB20101',
      orderDate: 'Tuesday, April 29, 2025 | 2:15 PM',
      orderStatus: 'Shipped',
      customer: {
        name: 'Michael Brown',
        email: 'michael.brown@shopzone.com',
        phone: '+966 55 987 6543',
        address: '456 Oak Ave, Jeddah, Saudi Arabia'
      },
      shipping: {
        method: 'Standard Shipping',
        address: '456 Oak Ave, Jeddah, Saudi Arabia',
        cost: 15
      },
      payment: {
        method: 'PayPal',
        status: 'Paid'
      },
      products: [
        {
          id: '2',
          name: 'Curved Gaming Monitor',
          quantity: 1,
          unitWeight: 8,
          price: 299.99,
          totalWeight: 8,
          total: 299.99
        }
      ],
      tags: ['Gaming', 'Premium']
    }
  };

  const [orderForm, setOrderForm] = useState<OrderForm>({
    orderId: '199426525',
    orderDate: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' | ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    orderStatus: 'New',
    customer: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    shipping: {
      method: 'No shipping / delivery required',
      address: '',
      cost: 0
    },
    payment: {
      method: '',
      status: 'Pending'
    },
    products: [],
    tags: []
  });

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [customerFormExpanded, setCustomerFormExpanded] = useState(false);
  const [sendToAnotherPerson, setSendToAnotherPerson] = useState(false);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [foundCustomers, setFoundCustomers] = useState<Array<{id: string, name: string, email: string, phone: string}>>([]);
  
  // Shipping modal states
  const [shippingRequirement, setShippingRequirement] = useState<'yes' | 'no'>('yes');
  const [shippingAddress, setShippingAddress] = useState({
    country: '',
    city: '',
    neighborhood: '',
    street: '',
    houseDescription: '',
    postalCode: ''
  });

  // Payment modal states
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    codFee: 0
  });

  // Product modal states
  const [productTab, setProductTab] = useState<'search' | 'custom'>('search');
  const [customProduct, setCustomProduct] = useState({
    name: '',
    price: '',
    costPrice: '',
    quantity: '',
    weight: '',
    weightUnit: 'kg'
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load order data when in edit mode
  useEffect(() => {
    if (isEditMode && editOrderId && token) {
      loadOrderForEdit();
    } else if (isEditMode && editOrderId && sampleOrders[editOrderId as keyof typeof sampleOrders]) {
      // Fallback to sample data if no token (for demo purposes)
      const orderData = sampleOrders[editOrderId as keyof typeof sampleOrders];
      setOrderForm(orderData);
      
      // Set modal states based on loaded data
      if (orderData.shipping.method !== 'No shipping / delivery required') {
        setShippingRequirement('yes');
        // Parse address if available
        if (orderData.shipping.address) {
          const addressParts = orderData.shipping.address.split(', ');
          setShippingAddress({
            street: addressParts[0] || '',
            neighborhood: addressParts[1] || '',
            city: addressParts[2] || '',
            country: addressParts[3] || '',
            houseDescription: '',
            postalCode: ''
          });
        }
      }
      
      if (orderData.payment.method) {
        setPaymentMethod(orderData.payment.method);
        setPaymentStatus(orderData.payment.status);
      }
      
      if (orderData.customer.name) {
        setCustomerSearchTerm(orderData.customer.name);
      }
    }
  }, [isEditMode, editOrderId, token]);

  const loadOrderForEdit = async () => {
    try {
      if (!editOrderId || !token) return;
      
      const response = await orderService.getOrder(parseInt(editOrderId), token);
      if (response.data) {
        const order = response.data;
        console.log('Loading order for edit:', order);
        
        // Convert API order data to form format
        const orderData: OrderForm = {
          orderId: order.order_id,
          orderDate: new Date(order.created_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) + ' | ' + new Date(order.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          orderStatus: order.status || 'Processing',
          customer: {
            name: order.customer?.name || '',
            email: order.customer?.email || '',
            phone: order.customer?.phone || '',
            address: order.shipping_address?.street || ''
          },
          shipping: {
            method: 'Standard Shipping', // Default, could be enhanced
            address: order.shipping_address?.street || '',
            cost: parseFloat(order.shipping_cost || '0')
          },
          payment: {
            method: order.payment_method || 'Credit Card',
            status: order.payment_status || 'Pending'
          },
          products: order.order_items?.map((item: any) => ({
            id: item.id?.toString() || '',
            name: item.product?.name || 'Unknown Product',
            quantity: item.quantity || 0,
            unitWeight: 0, // Could be enhanced
            price: parseFloat(item.price || item.unit_price || '0'),
            totalWeight: 0, // Could be enhanced
            total: parseFloat(item.total || item.total_price || '0')
          })) || [],
          tags: [] // Could be enhanced
        };
        
        setOrderForm(orderData);
        
        // Set modal states based on loaded data
        if (orderData.shipping.method !== 'No shipping / delivery required') {
          setShippingRequirement('yes');
          // Parse address if available
          if (orderData.shipping.address) {
            const addressParts = orderData.shipping.address.split(', ');
            setShippingAddress({
              street: addressParts[0] || '',
              neighborhood: addressParts[1] || '',
              city: addressParts[2] || '',
              country: addressParts[3] || '',
              houseDescription: '',
              postalCode: ''
            });
          }
        }
        
        if (orderData.payment.method) {
          setPaymentMethod(orderData.payment.method);
          setPaymentStatus(orderData.payment.status);
        }
        
        if (orderData.customer.name) {
          setCustomerSearchTerm(orderData.customer.name);
        }
        
        showSuccess('Success', 'Order loaded for editing');
      }
    } catch (error) {
      console.error('Error loading order for edit:', error);
      showError('Error', 'Failed to load order for editing');
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

  const handleAddProduct = (product: Product) => {
    setOrderForm(prev => ({
      ...prev,
      products: [...prev.products, product]
    }));
    setShowProductModal(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setOrderForm(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };



  const handleSaveDraft = () => {
    // Handle saving as draft
    console.log('Saving as draft:', orderForm);
  };

  const handleDeleteOrder = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = () => {
    // Handle deleting the order
    console.log('Deleting order');
    setShowDeleteModal(false);
  };

  const cancelDeleteOrder = () => {
    setShowDeleteModal(false);
  };

  const handleCreateOrder = () => {
    // Handle creating the order
    console.log('Creating order:', orderForm);
  };

  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearchTerm(searchTerm);
    
    if (searchTerm.trim()) {
      setCustomerSearchLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        setCustomerSearchLoading(false);
        
        // Simulate found customers based on search term
        const mockCustomers = [
          { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '+966 50 123 4567' },
          { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+966 55 987 6543' },
          { id: '3', name: 'Ahmed Al-Rashid', email: 'ahmed@example.com', phone: '+966 54 111 2222' },
          { id: '4', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+966 56 333 4444' },
        ].filter(customer => 
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
        );
        
        setFoundCustomers(mockCustomers);
        setShowCustomerDropdown(mockCustomers.length > 0);
      }, 1000);
    } else {
      setCustomerSearchLoading(false);
      setFoundCustomers([]);
      setShowCustomerDropdown(false);
    }
  };

  const handleCustomerSelect = (customer: {id: string, name: string, email: string, phone: string}) => {
    setOrderForm(prev => ({
      ...prev,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: ''
      }
    }));
    setCustomerSearchTerm(customer.name);
    setShowCustomerDropdown(false);
    setFoundCustomers([]);
  };

  const summary = calculateOrderSummary();

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">{isEditMode ? 'Edit Order' : 'Create New Order'}</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item"><a href="/orders">Orders</a></li>
            <li className="breadcrumb-item active">{isEditMode ? 'Edit Order' : 'Create Order'}</li>
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
                                    <button className="btn btn-outline-primary btn-sm">
                   <i className="ti ti-plus me-1"></i>
                   Add Tag
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
                 <div className="card-header d-flex justify-content-between align-items-center">
                   <h5 className="mb-0">
                     <i className="ti ti-user me-2"></i>
                     Customer
                   </h5>
                   <button 
                     className="btn btn-outline-primary btn-sm"
                     onClick={() => setShowCustomerModal(true)}
                   >
                     <i className="ti ti-edit me-1"></i>
                     Edit
                   </button>
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
                       <p>No customer selected</p>
                     </div>
                   )}
                 </div>
               </div>
             </div>

             {/* Shipping Section */}
             <div className="col-md-4">
               <div className="card h-100">
                 <div className="card-header d-flex justify-content-between align-items-center">
                   <h5 className="mb-0">
                     <i className="ti ti-truck me-2"></i>
                     Shipping
                   </h5>
                   <button 
                     className="btn btn-outline-primary btn-sm"
                     onClick={() => setShowShippingModal(true)}
                   >
                     <i className="ti ti-edit me-1"></i>
                     Edit
                   </button>
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
                       <p>No shipping method selected</p>
                     </div>
                   )}
                 </div>
               </div>
             </div>

             {/* Payment Section */}
             <div className="col-md-4">
               <div className="card h-100">
                 <div className="card-header d-flex justify-content-between align-items-center">
                   <h5 className="mb-0">
                     <i className="ti ti-credit-card me-2"></i>
                     Payment
                   </h5>
                   <button 
                     className="btn btn-outline-primary btn-sm"
                     onClick={() => setShowPaymentModal(true)}
                   >
                     <i className="ti ti-edit me-1"></i>
                     Edit
                   </button>
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
                       <p>No payment method selected</p>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           </div>

           {/* Products Section */}
           <div className="card mb-4">
             <div className="card-header d-flex justify-content-between align-items-center">
               <h5 className="mb-0">
                 <i className="ti ti-package me-2"></i>
                 Products
               </h5>
               <button 
                 className="btn btn-primary btn-sm"
                 onClick={() => setShowProductModal(true)}
               >
                 <i className="ti ti-plus me-1"></i>
                 Add Product
               </button>
             </div>
             <div className="card-body">
               {orderForm.products.length > 0 ? (
                 <div className="table-responsive">
                   <table className="table table-hover">
                     <thead className="bg-light">
                       <tr>
                         <th>Product</th>
                         <th>Quantity</th>
                         <th>Unit Weight</th>
                         <th>Price</th>
                         <th>Total Weight</th>
                         <th>Total</th>
                         <th>Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {orderForm.products.map((product) => (
                         <tr key={product.id}>
                           <td>{product.name}</td>
                           <td>{product.quantity}</td>
                           <td>{product.unitWeight}g</td>
                           <td>${product.price}</td>
                           <td>{product.totalWeight}g</td>
                           <td>${product.total}</td>
                           <td>
                             <button 
                               className="btn btn-outline-danger btn-sm"
                               onClick={() => handleRemoveProduct(product.id)}
                             >
                               <i className="ti ti-trash"></i>
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <div className="text-center text-muted py-4">
                   <i className="ti ti-package fs-1 mb-2"></i>
                   <p>No products added</p>
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
                   onClick={handleSaveDraft}
                 >
                   <i className="ti ti-file-text me-1"></i>
                   Save as Draft
                 </button>
                 <button 
                   className="btn btn-danger"
                   onClick={handleDeleteOrder}
                 >
                   <i className="ti ti-trash me-1"></i>
                   Delete Order
                 </button>
                 <button 
                   className="btn btn-primary"
                   onClick={handleCreateOrder}
                 >
                   <i className="ti ti-check me-1"></i>
                   {isEditMode ? 'Update Order' : 'Create Order'}
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>

      {/* Modals would go here */}
             {/* Customer Modal */}
       {showCustomerModal && (
         <div className="modal fade show" style={{ display: 'block' }}>
           <div className="modal-dialog modal-lg">
             <div className="modal-content">
                                               <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title">Edit Customer Data</h5>
                                     <button 
                     type="button" 
                     className="btn-close btn-close-white"
                     onClick={() => {
                       setShowCustomerModal(false);
                       setCustomerFormExpanded(false);
                       setSendToAnotherPerson(false);
                       setCustomerSearchTerm('');
                       setCustomerSearchLoading(false);
                       setShowCustomerDropdown(false);
                       setFoundCustomers([]);
                     }}
                   ></button>
                </div>
                
                <div className="modal-body">
                                     {/* Customer Search Section */}
                   <div className="mb-4">
                     <label className="form-label fw-semibold">Search in customer list</label>
                     <div className="position-relative">
                       <div className="input-group">
                         <input 
                           type="text" 
                           className="form-control"
                           placeholder="Search for existing customer..."
                           value={customerSearchTerm}
                           onChange={(e) => handleCustomerSearch(e.target.value)}
                         />
                         {customerSearchLoading && (
                           <span className="input-group-text">
                             <div className="spinner-border spinner-border-sm text-success" role="status">
                               <span className="visually-hidden">Loading...</span>
                             </div>
                           </span>
                         )}
                         <button 
                           className="btn btn-primary"
                           style={{ 
                             backgroundColor: '#6f42c1', 
                             borderColor: '#6f42c1',
                             minWidth: '180px'
                           }}
                           onClick={() => setCustomerFormExpanded(true)}
                         >
                           <i className="ti ti-plus me-1"></i>
                           Add New Customer
                         </button>
                       </div>
                       
                       {/* Customer Dropdown */}
                       {showCustomerDropdown && foundCustomers.length > 0 && (
                         <div className="position-absolute w-100" style={{ zIndex: 1050, top: '100%' }}>
                           <div className="card border shadow-sm">
                             <div className="card-body p-0">
                               <div className="list-group list-group-flush">
                                 {foundCustomers.map((customer) => (
                                   <button
                                     key={customer.id}
                                     type="button"
                                     className="list-group-item list-group-item-action d-flex align-items-center py-2"
                                     onClick={() => handleCustomerSelect(customer)}
                                   >
                                     <div className="avatar avatar-sm me-3">
                                       <i className="ti ti-user fs-4"></i>
                                     </div>
                                     <div className="flex-grow-1 text-start">
                                       <h6 className="mb-1 fw-semibold">{customer.name}</h6>
                                       <p className="mb-1 text-muted small">{customer.email}</p>
                                       <p className="mb-0 text-muted small">{customer.phone}</p>
                                     </div>
                                   </button>
                                 ))}
                               </div>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>

                   {/* Order Assignment Toggle - Visible when form is collapsed */}
                   {!customerFormExpanded && (
                     <>
                       <div className="mb-4">
                         <div className="d-flex justify-content-between align-items-center">
                           <label className="form-label fw-semibold mb-0">Send order to another person?</label>
                           <div className="form-check form-switch">
                             <input 
                               className="form-check-input" 
                               type="checkbox" 
                               id="orderAssignmentToggle"
                               checked={sendToAnotherPerson}
                               onChange={(e) => setSendToAnotherPerson(e.target.checked)}
                             />
                           </div>
                         </div>
                       </div>

                       {/* Recipient Data Section - Visible when toggle is ON and form is collapsed */}
                       {sendToAnotherPerson && (
                         <div className="mb-4">
                           <h6 className="fw-semibold mb-3">Recipient Data</h6>
                           
                           {/* Recipient Name */}
                           <div className="mb-3">
                             <label className="form-label fw-semibold">
                               <i className="ti ti-user me-2"></i>
                               Recipient Name
                             </label>
                             <input 
                               type="text" 
                               className="form-control"
                               placeholder="Recipient Name"
                             />
                           </div>
                           
                           {/* Recipient Phone */}
                           <div className="mb-3">
                             <label className="form-label fw-semibold">
                               <i className="ti ti-phone me-2"></i>
                               Recipient Phone Number
                             </label>
                             <div className="input-group">
                               <select className="form-select" style={{ maxWidth: '100px' }}>
                                 <option>966+</option>
                                 <option>1+</option>
                                 <option>44+</option>
                               </select>
                               <input 
                                 type="tel" 
                                 className="form-control"
                                 placeholder="5678 234 051"
                               />
                             </div>
                           </div>
                           
                           {/* Recipient Email */}
                           <div className="mb-3">
                             <label className="form-label fw-semibold">
                               <i className="ti ti-mail me-2"></i>
                               Recipient Email
                             </label>
                             <input 
                               type="email" 
                               className="form-control"
                               placeholder="Recipient Email"
                             />
                           </div>
                           
                           {/* Receive Order Notifications Toggle */}
                           <div className="mb-3">
                             <div className="d-flex justify-content-between align-items-center">
                               <label className="form-label fw-semibold mb-0">Receive order notification messages</label>
                               <div className="form-check form-switch">
                                 <input 
                                   className="form-check-input" 
                                   type="checkbox" 
                                   id="orderNotificationToggle"
                                 />
                               </div>
                             </div>
                           </div>
                         </div>
                       )}
                     </>
                   )}



                                     {/* Expanded Customer Form */}
                   {customerFormExpanded && (
                     <>
                       {/* Customer Form Fields */}
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            <i className="ti ti-user me-2"></i>
                            First Name
                          </label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={orderForm.customer.name}
                            onChange={(e) => setOrderForm(prev => ({
                              ...prev,
                              customer: { ...prev.customer, name: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            <i className="ti ti-user me-2"></i>
                            Family Name
                          </label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Enter family name"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="ti ti-phone me-2"></i>
                          Phone Number
                        </label>
                        <div className="input-group">
                          <select className="form-select" style={{ maxWidth: '100px' }}>
                            <option>966+</option>
                            <option>1+</option>
                            <option>44+</option>
                          </select>
                          <input 
                            type="tel" 
                            className="form-control"
                            placeholder="5678 234 051"
                            value={orderForm.customer.phone}
                            onChange={(e) => setOrderForm(prev => ({
                              ...prev,
                              customer: { ...prev.customer, phone: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="ti ti-mail me-2"></i>
                          Email (Optional)
                        </label>
                        <input 
                          type="email" 
                          className="form-control"
                          value={orderForm.customer.email}
                          onChange={(e) => setOrderForm(prev => ({
                            ...prev,
                            customer: { ...prev.customer, email: e.target.value }
                          }))}
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            <i className="ti ti-calendar me-2"></i>
                            Date of Birth
                          </label>
                          <input 
                            type="date" 
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            <i className="ti ti-user me-2"></i>
                            Choose Type
                          </label>
                          <select className="form-select">
                            <option>Individual</option>
                            <option>Company</option>
                            <option>Organization</option>
                          </select>
                                                 </div>
                       </div>

                       {/* Order Assignment Toggle - After Customer Form */}
                       <div className="mb-4">
                         <div className="d-flex justify-content-between align-items-center">
                           <label className="form-label fw-semibold mb-0">Send order to another person?</label>
                           <div className="form-check form-switch">
                             <input 
                               className="form-check-input" 
                               type="checkbox" 
                               id="orderAssignmentToggle"
                               checked={sendToAnotherPerson}
                               onChange={(e) => setSendToAnotherPerson(e.target.checked)}
                             />
                           </div>
                         </div>
                       </div>

                       {/* Recipient Data Section - After Customer Form */}
                       {sendToAnotherPerson && (
                         <div className="mb-4">
                           <h6 className="fw-semibold mb-3">Recipient Data</h6>
                           
                           {/* Recipient Name */}
                           <div className="mb-3">
                             <label className="form-label fw-semibold">
                               <i className="ti ti-user me-2"></i>
                               Recipient Name
                             </label>
                             <input 
                               type="text" 
                               className="form-control"
                               placeholder="Recipient Name"
                             />
                           </div>
                           
                           {/* Recipient Phone */}
                           <div className="mb-3">
                             <label className="form-label fw-semibold">
                               <i className="ti ti-phone me-2"></i>
                               Recipient Phone Number
                             </label>
                             <div className="input-group">
                               <select className="form-select" style={{ maxWidth: '100px' }}>
                                 <option>966+</option>
                                 <option>1+</option>
                                 <option>44+</option>
                               </select>
                               <input 
                                 type="tel" 
                                 className="form-control"
                                 placeholder="5678 234 051"
                               />
                             </div>
                           </div>
                           
                           {/* Recipient Email */}
                           <div className="mb-3">
                             <label className="form-label fw-semibold">
                               <i className="ti ti-mail me-2"></i>
                               Recipient Email
                             </label>
                             <input 
                               type="email" 
                               className="form-control"
                               placeholder="Recipient Email"
                             />
                           </div>
                           
                           {/* Receive Order Notifications Toggle */}
                           <div className="mb-3">
                             <div className="d-flex justify-content-between align-items-center">
                               <label className="form-label fw-semibold mb-0">Receive order notification messages</label>
                               <div className="form-check form-switch">
                                 <input 
                                   className="form-check-input" 
                                   type="checkbox" 
                                   id="orderNotificationToggle"
                                 />
                               </div>
                             </div>
                           </div>
                         </div>
                       )}
                     </>
                   )}
                </div>
               
                               <div className="modal-footer">
                                     {customerFormExpanded ? (
                                                                  <button 
                         type="button" 
                         className="btn btn-primary"
                         style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                         onClick={() => {
                           setShowCustomerModal(false);
                           setCustomerFormExpanded(false);
                           setSendToAnotherPerson(false);
                           setCustomerSearchTerm('');
                           setCustomerSearchLoading(false);
                           setShowCustomerDropdown(false);
                           setFoundCustomers([]);
                         }}
                       >
                         Save
                       </button>
                   ) : (
                     <button 
                       type="button" 
                       className="btn btn-secondary"
                       onClick={() => {
                         setShowCustomerModal(false);
                         setCustomerFormExpanded(false);
                         setSendToAnotherPerson(false);
                         setCustomerSearchTerm('');
                         setCustomerSearchLoading(false);
                         setShowCustomerDropdown(false);
                         setFoundCustomers([]);
                       }}
                     >
                       Close
                     </button>
                   )}
                </div>
             </div>
           </div>
         </div>
               )}

              {/* Shipping Modal */}
        {showShippingModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title">Edit Shipping Data</h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white"
                    onClick={() => setShowShippingModal(false)}
                  ></button>
                </div>
                
                                 <div className="modal-body">

                                     {/* Shipping Requirement Options */}
                   <div className="mb-4">
                     <label className="form-label fw-semibold mb-3">Requires shipping / delivery?</label>
                     <select 
                       className="form-select"
                       value={shippingRequirement}
                       onChange={(e) => setShippingRequirement(e.target.value as 'yes' | 'no')}
                     >
                       <option value="yes">
                         <i className="ti ti-truck me-2"></i>
                         Yes, requires shipping / delivery
                       </option>
                       <option value="no">
                         <i className="ti ti-gift me-2"></i>
                         No, shipping is not free
                       </option>
                     </select>
                   </div>

                  {/* Shipping Address Section */}
                  {shippingRequirement === 'yes' && (
                    <>
                                             <div className="mb-4">
                         <h5 className="fw-semibold mb-3 border-bottom pb-1">
                           <i className="ti ti-map-pin me-2 fs-4"></i>
                           Shipping Address
                         </h5>
                        
                        {/* Country */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Choose country or search</label>
                          <select className="form-select">
                            <option value="">Select country</option>
                            <option value="SA">Saudi Arabia</option>
                            <option value="AE">United Arab Emirates</option>
                            <option value="KW">Kuwait</option>
                            <option value="BH">Bahrain</option>
                            <option value="OM">Oman</option>
                            <option value="QA">Qatar</option>
                          </select>
                        </div>

                        {/* City */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Type or search for city</label>
                          <select className="form-select">
                            <option value="">Select city</option>
                            <option value="Riyadh">Riyadh</option>
                            <option value="Jeddah">Jeddah</option>
                            <option value="Dammam">Dammam</option>
                            <option value="Mecca">Mecca</option>
                            <option value="Medina">Medina</option>
                          </select>
                        </div>

                        {/* Neighborhood */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Neighborhood name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Enter neighborhood name"
                            value={shippingAddress.neighborhood}
                            onChange={(e) => setShippingAddress(prev => ({
                              ...prev,
                              neighborhood: e.target.value
                            }))}
                          />
                        </div>

                        {/* Street */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Street name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Enter street name"
                            value={shippingAddress.street}
                            onChange={(e) => setShippingAddress(prev => ({
                              ...prev,
                              street: e.target.value
                            }))}
                          />
                        </div>

                        {/* House Description */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">House description</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Enter house description"
                            value={shippingAddress.houseDescription}
                            onChange={(e) => setShippingAddress(prev => ({
                              ...prev,
                              houseDescription: e.target.value
                            }))}
                          />
                        </div>

                        {/* Postal Code */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Postal code</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Enter postal code"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress(prev => ({
                              ...prev,
                              postalCode: e.target.value
                            }))}
                          />
                        </div>
                      </div>

                                             {/* Shipping Options Section */}
                       <div className="mb-4">
                         <h5 className="fw-semibold mb-3 border-bottom pb-1">
                           <i className="ti ti-truck me-2 fs-4"></i>
                           Shipping Options
                         </h5>
                        <div className="text-center text-muted py-4">
                          <i className="ti ti-truck fs-1 mb-3" style={{ color: '#adb5bd' }}></i>
                          <p className="mb-0">Please specify the address to view available shipping options for you</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowShippingModal(false)}
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                    onClick={() => {
                      // Update order form with shipping data
                      setOrderForm(prev => ({
                        ...prev,
                        shipping: {
                          method: shippingRequirement === 'yes' ? 'Shipping required' : 'No shipping required',
                          address: shippingRequirement === 'yes' ? 
                            `${shippingAddress.street}, ${shippingAddress.neighborhood}, ${shippingAddress.city}` : '',
                          cost: shippingRequirement === 'yes' ? 25 : 0
                        }
                      }));
                      setShowShippingModal(false);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

              {/* Payment Modal */}
        {showPaymentModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title">Edit Payment Data</h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white"
                    onClick={() => setShowPaymentModal(false)}
                  ></button>
                </div>
                
                <div className="modal-body">
                  {/* Payment Status Dropdown */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-3">Has payment been made?</label>
                    <select 
                      className="form-select"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="Pending">No, Payment is Pending</option>
                      <option value="Paid">Yes, Paid</option>
                    </select>
                  </div>

                  {/* Payment Options Section - Only show when Paid is selected */}
                  {paymentStatus === 'Paid' && (
                    <>
                      <div className="mb-4">
                        <div className="border-bottom pb-2 mb-3">
                          <h5 className="fw-semibold mb-0">
                            <i className="ti ti-credit-card me-2 fs-4"></i>
                            Payment Options
                          </h5>
                        </div>
                        
                        <div className="d-flex flex-column gap-3">
                          {/* Bank Transfer */}
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="radio" 
                              name="paymentMethod" 
                              id="bankTransfer"
                              value="Bank Transfer"
                              checked={paymentMethod === 'Bank Transfer'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="form-check-label d-flex align-items-center" htmlFor="bankTransfer">
                              <i className="ti ti-building-bank me-2 text-primary"></i>
                              Bank Transfer
                            </label>
                          </div>

                          {/* Cash on Delivery */}
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="radio" 
                              name="paymentMethod" 
                              id="cashOnDelivery"
                              value="Cash on Delivery"
                              checked={paymentMethod === 'Cash on Delivery'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="form-check-label d-flex align-items-center" htmlFor="cashOnDelivery">
                              <i className="ti ti-cash me-2 text-success"></i>
                              Cash on Delivery
                            </label>
                            {paymentMethod === 'Cash on Delivery' && (
                              <div className="mt-2 ms-4">
                                <small className="text-danger">
                                  <i className="ti ti-alert-triangle me-1"></i>
                                  Cash on delivery is not available due to missing shipping data.
                                </small>
                              </div>
                            )}
                          </div>

                          {/* Mada */}
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="radio" 
                              name="paymentMethod" 
                              id="mada"
                              value="Mada"
                              checked={paymentMethod === 'Mada'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="form-check-label d-flex align-items-center" htmlFor="mada">
                              <i className="ti ti-credit-card me-2 text-info"></i>
                              Mada
                            </label>
                          </div>

                          {/* Credit Card */}
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="radio" 
                              name="paymentMethod" 
                              id="creditCard"
                              value="Credit Card"
                              checked={paymentMethod === 'Credit Card'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="form-check-label d-flex align-items-center" htmlFor="creditCard">
                              <i className="ti ti-credit-card me-2 text-warning"></i>
                              Credit Card
                            </label>
                          </div>

                          {/* PayPal */}
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="radio" 
                              name="paymentMethod" 
                              id="paypal"
                              value="PayPal"
                              checked={paymentMethod === 'PayPal'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="form-check-label d-flex align-items-center" htmlFor="paypal">
                              <i className="ti ti-brand-paypal me-2 text-primary"></i>
                              PayPal
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Cash on Delivery Details Section */}
                      {paymentMethod === 'Cash on Delivery' && (
                        <div className="mb-4">
                          <div className="border-bottom pb-2 mb-3">
                            <h5 className="fw-semibold mb-0">
                              <i className="ti ti-cash me-2 fs-4"></i>
                              Cash on Delivery Details
                            </h5>
                          </div>
                          
                          <div className="mb-3">
                            <label className="form-label fw-semibold">
                              <i className="ti ti-coin me-2"></i>
                              Cash on Delivery Fee
                            </label>
                            <div className="input-group">
                              <input 
                                type="number" 
                                className="form-control"
                                placeholder="0"
                                value={paymentDetails.codFee || 0}
                                onChange={(e) => setPaymentDetails(prev => ({
                                  ...prev,
                                  codFee: parseFloat(e.target.value) || 0
                                }))}
                              />
                              <span className="input-group-text">SAR</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                    onClick={() => {
                      // Update order form with payment data
                      setOrderForm(prev => ({
                        ...prev,
                        payment: {
                          method: paymentMethod,
                          status: paymentStatus
                        }
                      }));
                      setShowPaymentModal(false);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

              {/* Product Modal */}
       {showProductModal && (
         <div className="modal fade show" style={{ display: 'block' }}>
           <div className="modal-dialog modal-lg">
             <div className="modal-content">
                               <div className="modal-header">
                  <h5 className="modal-title">Add Product</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setShowProductModal(false)}
                  ></button>
                </div>
                
                <div className="modal-body">
                 {/* Tab Buttons */}
                 <div className="d-flex gap-2 mb-4">
                   <button 
                     className={`btn flex-fill ${productTab === 'search' ? 'btn-primary' : 'btn-outline-primary'}`}
                     style={{ 
                       backgroundColor: productTab === 'search' ? '#6f42c1' : 'transparent', 
                       borderColor: '#6f42c1',
                       color: productTab === 'search' ? 'white' : '#6f42c1'
                     }}
                     onClick={() => setProductTab('search')}
                   >
                     <i className="ti ti-search me-2"></i>
                     Search for Product
                   </button>
                   <button 
                     className={`btn flex-fill ${productTab === 'custom' ? 'btn-primary' : 'btn-outline-primary'}`}
                     style={{ 
                       backgroundColor: productTab === 'custom' ? '#6f42c1' : 'transparent', 
                       borderColor: '#6f42c1',
                       color: productTab === 'custom' ? 'white' : '#6f42c1'
                     }}
                     onClick={() => setProductTab('custom')}
                   >
                     <i className="ti ti-plus me-2"></i>
                     Add Custom Product
                   </button>
                 </div>
                 
                 {/* Search Tab Content */}
                 {productTab === 'search' && (
                   <>
                     {/* Search Section */}
                     <div className="mb-4">
                       <div className="input-group">
                         <input 
                           type="text" 
                           className="form-control" 
                           placeholder="Search in the product list by product name or SKU"
                         />
                         <button className="btn btn-outline-secondary" type="button">
                           <i className="ti ti-search"></i>
                         </button>
                       </div>
                     </div>
                     
                     {/* Empty State */}
                     <div className="text-center text-muted py-5">
                       <i className="ti ti-search fs-1 mb-3" style={{ color: '#adb5bd' }}></i>
                       <p className="mb-0">Search for a product to add to the order</p>
                     </div>
                   </>
                 )}

                 {/* Custom Product Tab Content */}
                 {productTab === 'custom' && (
                   <>
                     {/* Product Name */}
                     <div className="mb-3">
                       <label className="form-label fw-semibold">
                         <i className="ti ti-tag me-2"></i>
                         Product Name
                       </label>
                       <input 
                         type="text" 
                         className="form-control"
                         placeholder="Enter product name"
                         value={customProduct.name}
                         onChange={(e) => setCustomProduct(prev => ({
                           ...prev,
                           name: e.target.value
                         }))}
                       />
                     </div>

                     {/* Price */}
                     <div className="mb-3">
                       <label className="form-label fw-semibold">
                         <i className="ti ti-currency-dollar me-2"></i>
                         Price
                       </label>
                       <input 
                         type="number" 
                         className="form-control"
                         placeholder="0.00"
                         value={customProduct.price}
                         onChange={(e) => setCustomProduct(prev => ({
                           ...prev,
                           price: e.target.value
                         }))}
                       />
                     </div>

                     {/* Cost Price */}
                     <div className="mb-3">
                       <label className="form-label fw-semibold">
                         <i className="ti ti-currency-dollar me-2"></i>
                         Cost Price
                       </label>
                       <input 
                         type="number" 
                         className="form-control"
                         placeholder="0.00"
                         value={customProduct.costPrice}
                         onChange={(e) => setCustomProduct(prev => ({
                           ...prev,
                           costPrice: e.target.value
                         }))}
                       />
                     </div>

                     {/* Quantity */}
                     <div className="mb-3">
                       <label className="form-label fw-semibold">
                         <i className="ti ti-package me-2"></i>
                         Quantity
                       </label>
                       <input 
                         type="number" 
                         className="form-control"
                         placeholder="1"
                         value={customProduct.quantity}
                         onChange={(e) => setCustomProduct(prev => ({
                           ...prev,
                           quantity: e.target.value
                         }))}
                       />
                     </div>

                     {/* Weight */}
                     <div className="mb-3">
                       <label className="form-label fw-semibold">
                         <i className="ti ti-weight me-2"></i>
                         Weight
                       </label>
                       <div className="input-group">
                         <input 
                           type="number" 
                           className="form-control"
                           placeholder="0"
                           value={customProduct.weight}
                           onChange={(e) => setCustomProduct(prev => ({
                             ...prev,
                             weight: e.target.value
                           }))}
                         />
                         <select 
                           className="form-select"
                           style={{ maxWidth: '80px' }}
                           value={customProduct.weightUnit}
                           onChange={(e) => setCustomProduct(prev => ({
                             ...prev,
                             weightUnit: e.target.value
                           }))}
                         >
                           <option value="kg">kg</option>
                           <option value="g">g</option>
                           <option value="lb">lb</option>
                           <option value="oz">oz</option>
                         </select>
                       </div>
                     </div>
                   </>
                 )}
               </div>
               
               <div className="modal-footer">
                 <button 
                   type="button" 
                   className="btn btn-secondary"
                   onClick={() => setShowProductModal(false)}
                 >
                   Close
                 </button>
                                   <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                    onClick={() => {
                      if (productTab === 'custom') {
                        // Add custom product
                        const newProduct: Product = {
                          id: Date.now().toString(),
                          name: customProduct.name || 'Custom Product',
                          quantity: parseInt(customProduct.quantity) || 1,
                          unitWeight: parseFloat(customProduct.weight) || 0,
                          price: parseFloat(customProduct.price) || 0,
                          totalWeight: (parseFloat(customProduct.weight) || 0) * (parseInt(customProduct.quantity) || 1),
                          total: (parseFloat(customProduct.price) || 0) * (parseInt(customProduct.quantity) || 1)
                        };
                        handleAddProduct(newProduct);
                        // Reset form
                        setCustomProduct({
                          name: '',
                          price: '',
                          costPrice: '',
                          quantity: '',
                          weight: '',
                          weightUnit: 'kg'
                        });
                      } else {
                        // Add sample product for demo (search tab)
                        const newProduct: Product = {
                          id: Date.now().toString(),
                          name: 'Sample Product',
                          quantity: 1,
                          unitWeight: 100,
                          price: 29.99,
                          totalWeight: 100,
                          total: 29.99
                        };
                        handleAddProduct(newProduct);
                      }
                    }}
                  >
                    Add
                  </button>
               </div>
             </div>
           </div>
         </div>
       )}

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
       {(showCustomerModal || showShippingModal || showPaymentModal || showProductModal || showDeleteModal) && (
         <div className="modal-backdrop fade show"></div>
       )}
    </Layout>
  );
};

export default AddOrder;
