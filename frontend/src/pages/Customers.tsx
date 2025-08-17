import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    group: '',
    firstName: '',
    familyName: '',
    email: '',
    phoneCode: '+966',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });

  const [customers] = useState<Customer[]>([
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
  ]);

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
    const matchesSearch = customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddCustomer = () => {
    // Handle adding new customer
    console.log('Adding customer:', customerForm);
    setShowAddCustomerModal(false);
    // Reset form
    setCustomerForm({
      group: '',
      firstName: '',
      familyName: '',
      email: '',
      phoneCode: '+966',
      phone: '',
      dateOfBirth: '',
      gender: ''
    });
  };

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
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avatar avatar-sm">
                    <div className="avatar-title bg-soft-success text-success fs-24 rounded">
                      <i className="ti ti-users"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-medium text-muted fs-12 mb-1">Total Customers</p>
                  <h4 className="mb-0 fs-20 fw-semibold">2,847</h4>
                  <p className="text-success fs-12 mb-0">
                    <i className="ti ti-trending-up me-1"></i>
                    +12.5%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avatar avatar-sm">
                    <div className="avatar-title bg-soft-warning text-warning fs-24 rounded">
                      <i className="ti ti-user-check"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-medium text-muted fs-12 mb-1">Active Customers</p>
                  <h4 className="mb-0 fs-20 fw-semibold">2,156</h4>
                  <p className="text-success fs-12 mb-0">
                    <i className="ti ti-trending-up me-1"></i>
                    +8.2%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avatar avatar-sm">
                    <div className="avatar-title bg-soft-info text-info fs-24 rounded">
                      <i className="ti ti-crown"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-medium text-muted fs-12 mb-1">VIP Customers</p>
                  <h4 className="mb-0 fs-20 fw-semibold">342</h4>
                  <p className="text-success fs-12 mb-0">
                    <i className="ti ti-trending-up me-1"></i>
                    +15.3%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avatar avatar-sm">
                    <div className="avatar-title bg-soft-danger text-danger fs-24 rounded">
                      <i className="ti ti-user-x"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-medium text-muted fs-12 mb-1">Inactive Customers</p>
                  <h4 className="mb-0 fs-20 fw-semibold">691</h4>
                  <p className="text-danger fs-12 mb-0">
                    <i className="ti ti-trending-down me-1"></i>
                    -2.1%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avatar avatar-sm">
                    <div className="avatar-title bg-soft-primary text-primary fs-24 rounded">
                      <i className="ti ti-calendar"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-medium text-muted fs-12 mb-1">New This Month</p>
                  <h4 className="mb-0 fs-20 fw-semibold">156</h4>
                  <p className="text-success fs-12 mb-0">
                    <i className="ti ti-trending-up me-1"></i>
                    +22.4%
                  </p>
                </div>
              </div>
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
                            {customer.customerId}
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
                      <td>{customer.joinDate}</td>
                      <td>{customer.totalOrders}</td>
                      <td>{customer.totalSpent}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(customer.status)} fs-xxs`}>
                          {customer.status}
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
                    <label className="form-label fw-semibold">Choose Group</label>
                    <div className="app-search">
                      <select 
                        className="form-select form-control"
                        value={customerForm.group}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, group: e.target.value }))}
                      >
                        <option value="">Choose Group</option>
                        <option value="vip">VIP Customers</option>
                        <option value="regular">Regular Customers</option>
                        <option value="wholesale">Wholesale Customers</option>
                      </select>
                      <i className="ti ti-chevron-down app-search-icon text-muted"></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">First Name</label>
                    <div className="app-search">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="First Name"
                        value={customerForm.firstName}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                      <i className="ti ti-users app-search-icon text-muted"></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Family Name</label>
                    <div className="app-search">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Family Name"
                        value={customerForm.familyName}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, familyName: e.target.value }))}
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
                    <div className="input-group">
                      <select 
                        className="form-select"
                        style={{ maxWidth: '100px' }}
                        value={customerForm.phoneCode}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, phoneCode: e.target.value }))}
                      >
                        <option value="+966">+966</option>
                        <option value="+971">+971</option>
                        <option value="+973">+973</option>
                        <option value="+974">+974</option>
                        <option value="+965">+965</option>
                      </select>
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="54xxxxxxx"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <span className="input-group-text">
                        <i className="ti ti-phone text-muted"></i>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Date of Birth</label>
                    <div className="app-search">
                      <input 
                        type="date" 
                        className="form-control" 
                        placeholder="Date of Birth"
                        value={customerForm.dateOfBirth}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      />
                      <i className="ti ti-calendar app-search-icon text-muted"></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Gender</label>
                    <div className="app-search">
                      <select 
                        className="form-select form-control"
                        value={customerForm.gender}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, gender: e.target.value }))}
                      >
                        <option value="">Choose Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <i className="ti ti-user app-search-icon text-muted"></i>
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
