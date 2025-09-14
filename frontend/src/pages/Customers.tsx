import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { customerService, type Customer as CustomerType, type CustomerStatistics } from '../services/customerService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

// interface Customer {
//   id: string;
//   customerId: string;
//   name: string;
//   email: string;
//   phone: string;
//   joinDate: string;
//   totalOrders: number;
//   totalSpent: string;
//   status: 'Active' | 'Inactive' | 'VIP';
//   avatar?: string;
// }

const Customers: React.FC = () => {
  const { token, user } = useAuth();
  const { showError, showSuccess } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [statistics, setStatistics] = useState<CustomerStatistics | null>(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive' | 'vip',
    join_date: new Date().toISOString().split('T')[0]
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers({
        search: searchTerm,
        status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase(),
        per_page: rowsPerPage
      }, token || undefined);
      
      if (response.data) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      showError('Error', 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await customerService.getCustomerStatistics(token || undefined);
      if (response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Load customers and statistics on component mount
  useEffect(() => {
    if (token) {
      loadCustomers();
      loadStatistics();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Reload customers when filters change
  useEffect(() => {
    if (token) {
      loadCustomers();
    }
  }, [searchTerm, statusFilter, rowsPerPage, token]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(new Set(customers.map(customer => customer.id)));
    } else {
      setSelectedCustomers(new Set());
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    const newSelected = new Set(selectedCustomers);
    if (checked) {
      newSelected.add(customerId);
    } else {
      newSelected.delete(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'badge-soft-success';
      case 'VIP': return 'badge-soft-warning';
      case 'Inactive': return 'badge-soft-danger';
      default: return 'badge-soft-secondary';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'Active' && customer.status === 'active') ||
                         (statusFilter === 'VIP' && customer.status === 'vip') ||
                         (statusFilter === 'Inactive' && customer.status === 'inactive');
    
    return matchesSearch && matchesStatus;
  });

  const handleAddCustomer = async () => {
    try {
      if (!user?.id) {
        showError('Error', 'User not found. Please login again.');
        return;
      }

      const customerData = {
        ...customerForm,
        store_id: user.id, // Using user ID as store ID for now
        phone: customerForm.phone.startsWith('+') ? customerForm.phone : `+966${customerForm.phone}`
      };

      const response = await customerService.createCustomer(customerData, token || undefined);
      
      if (response.data) {
        showSuccess('Success', 'Customer created successfully!');
        setShowAddCustomerModal(false);
        loadCustomers(); // Reload the list
        loadStatistics(); // Reload statistics
        
        // Reset form
        setCustomerForm({
          name: '',
          email: '',
          phone: '',
          status: 'active' as const,
          join_date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      showError('Error', 'Failed to create customer');
    }
  };

  if (loading) {
    return (
      <Layout>
        {/* Page Header */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">CUSTOMERS</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Customers</li>
            </ol>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="row px-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted">Loading customers...</h5>
                <p className="text-muted">Please wait while we fetch your customer data.</p>
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
          <h4 className="fs-sm text-uppercase fw-bold m-0">CUSTOMERS</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active">Customers</li>
          </ol>
        </div>
      </div>

      {/* Customer Statistics Cards */}
      <div className="row px-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar-md flex-shrink-0">
                  <span className="avatar-title text-bg-success rounded-circle fs-22">
                    <i className="ti ti-users"></i>
                  </span>
                </div>
                <h3 className="mb-0">{statistics?.total_customers || 0}</h3>
              </div>
              <p className="mb-0">
                Total Customers
                <span className="float-end badge badge-soft-success">+{statistics?.new_this_month || 0}</span>
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
                    <i className="ti ti-user-check"></i>
                  </span>
                </div>
                <h3 className="mb-0">{statistics?.active_customers || 0}</h3>
              </div>
              <p className="mb-0">
                Active Customers
                <span className="float-end badge badge-soft-warning">Active</span>
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
                    <i className="ti ti-crown"></i>
                  </span>
                </div>
                <h3 className="mb-0">{statistics?.vip_customers || 0}</h3>
              </div>
              <p className="mb-0">
                VIP Customers
                <span className="float-end badge badge-soft-info">VIP</span>
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
                    <i className="ti ti-user-x"></i>
                  </span>
                </div>
                <h3 className="mb-0">{statistics?.inactive_customers || 0}</h3>
              </div>
              <p className="mb-0">
                Inactive Customers
                <span className="float-end badge badge-soft-danger">Inactive</span>
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
                    <i className="ti ti-calendar"></i>
                  </span>
                </div>
                <h3 className="mb-0">{statistics?.new_this_month || 0}</h3>
              </div>
              <p className="mb-0">
                New This Month
                <span className="float-end badge badge-soft-primary">New</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="row px-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header border-light justify-content-between">
              <div className="d-flex gap-2">
                                 <button 
                   className="btn btn-primary"
                   onClick={() => setShowAddCustomerModal(true)}
                 >
                   <i className="ti ti-plus fs-sm me-2"></i> Add Customer
                 </button>

                {selectedCustomers.size > 0 && (
                  <button className="btn btn-danger">Delete</button>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="me-2 fw-semibold">Filter By:</span>

                {/* Status Filter */}
                <div className="app-search">
                  <select 
                    className="form-select form-control my-1 my-md-0"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">Customer Status</option>
                    <option value="Active">Active</option>
                    <option value="VIP">VIP</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <i className="ti ti-user-check app-search-icon text-muted"></i>
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
                    placeholder="Search customer..."
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
                        checked={selectedCustomers.size === customers.length && customers.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th>Customer ID</th>
                    <th>Customer</th>
                    <th>Join Date</th>
                    <th>Total Orders</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="ps-3">
                        <input 
                          className="form-check-input form-check-input-light fs-14 product-item-check mt-0" 
                          type="checkbox" 
                          checked={selectedCustomers.has(customer.id)}
                          onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <h5 className="fs-sm mb-0 fw-medium">
                          <Link to={`/customers/${customer.id}`} className="link-reset text-decoration-none">
                            #{customer.id}
                          </Link>
                        </h5>
                      </td>
                      <td>
                        <div className="d-flex justify-content-start align-items-center gap-2">
                          <div className="avatar avatar-sm d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', border: '2px solid #e9ecef', borderRadius: '50%' }}>
                            <i className="ti ti-user fs-4 text-muted"></i>
                          </div>
                          <div>
                            <h5 className="text-nowrap fs-base mb-0 lh-base">{customer.name}</h5>
                            <p className="text-muted fs-xs mb-0">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>{new Date(customer.join_date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</td>
                      <td>{customer.total_orders}</td>
                      <td>${typeof customer.total_spent === 'number' ? customer.total_spent.toFixed(2) : customer.total_spent || '0.00'}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(customer.status === 'active' ? 'Active' : customer.status === 'vip' ? 'VIP' : 'Inactive')} fs-xxs`}>
                          {customer.status === 'active' ? 'Active' : customer.status === 'vip' ? 'VIP' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div>
                          <p className="mb-0 fs-sm">{customer.phone}</p>
                          <p className="text-muted fs-xs mb-0">{customer.email}</p>
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

       {/* Add Customer Modal */}
               {showAddCustomerModal && (
          <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                               <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title">Create New Customer</h5>
                 <button 
                   type="button" 
                   className="btn-close btn-close-white" 
                   onClick={() => setShowAddCustomerModal(false)}
                 ></button>
               </div>
               <div className="modal-body">
                                   <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <div className="app-search">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Full Name"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <i className="ti ti-users app-search-icon text-muted"></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <div className="app-search">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Email"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                      <i className="ti ti-mail app-search-icon text-muted"></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <div className="app-search">
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="+966 54xxxxxxx"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <i className="ti ti-phone app-search-icon text-muted"></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Join Date</label>
                    <div className="app-search">
                      <input 
                        type="date" 
                        className="form-control" 
                        placeholder="Join Date"
                        value={customerForm.join_date}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, join_date: e.target.value }))}
                      />
                      <i className="ti ti-calendar app-search-icon text-muted"></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <div className="app-search">
                      <select 
                        className="form-select form-control"
                        value={customerForm.status}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'vip' }))}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="vip">VIP</option>
                      </select>
                      <i className="ti ti-user-check app-search-icon text-muted"></i>
                    </div>
                  </div>
               </div>
               <div className="modal-footer">
                 <button 
                   type="button" 
                   className="btn btn-secondary"
                   onClick={() => setShowAddCustomerModal(false)}
                 >
                   Cancel
                 </button>
                                   <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleAddCustomer}
                  >
                    Save
                  </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Modal Backdrop */}
       {showAddCustomerModal && (
         <div className="modal-backdrop fade show"></div>
       )}
     </Layout>
   );
 };

export default Customers;
