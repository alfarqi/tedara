import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';

const Users: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Sample user data
  const users = [
    {
      id: 'USR00123',
      name: 'Nathan Young',
      email: 'nathan@tedara.com',
      role: 'Store Owner',
      status: 'Inactive',
      avatar: '/assets/images/users/user-5.jpg',
      lastUpdated: '18 Apr, 2025 9:45 AM',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      joinDate: '15 Mar, 2024',
      storeCount: 2,
      orderCount: 45
    },
    {
      id: 'USR00145',
      name: 'Leah Kim',
      email: 'leah@tedara.com',
      role: 'Super Admin',
      status: 'Active',
      avatar: '/assets/images/users/user-3.jpg',
      lastUpdated: '21 Apr, 2025 3:15 PM',
      phone: '+1 (555) 987-6543',
      location: 'Los Angeles, USA',
      joinDate: '10 Jan, 2024',
      storeCount: 0,
      orderCount: 0
    },
    {
      id: 'USR00162',
      name: 'Sophie Lee',
      email: 'sophie@tedara.com',
      role: 'Support',
      status: 'Suspended',
      avatar: '/assets/images/users/user-1.jpg',
      lastUpdated: '19 Apr, 2025 10:00 AM',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, USA',
      joinDate: '22 Feb, 2024',
      storeCount: 0,
      orderCount: 0
    },
    {
      id: 'USR00178',
      name: 'David Chen',
      email: 'david@tedara.com',
      role: 'Store Owner',
      status: 'Active',
      avatar: '/assets/images/users/user-2.jpg',
      lastUpdated: '22 Apr, 2025 8:15 AM',
      phone: '+1 (555) 321-6540',
      location: 'San Francisco, USA',
      joinDate: '05 Apr, 2024',
      storeCount: 1,
      orderCount: 23
    },
    {
      id: 'USR00189',
      name: 'Isabella Rodriguez',
      email: 'isabella@tedara.com',
      role: 'Customer',
      status: 'Active',
      avatar: '/assets/images/users/user-4.jpg',
      lastUpdated: '20 Apr, 2025 2:45 PM',
      phone: '+1 (555) 789-0123',
      location: 'Miami, USA',
      joinDate: '12 Mar, 2024',
      storeCount: 0,
      orderCount: 12
    },
    {
      id: 'USR00195',
      name: 'Daniel Wilson',
      email: 'daniel@tedara.com',
      role: 'Store Owner',
      status: 'Inactive',
      avatar: '/assets/images/users/user-6.jpg',
      lastUpdated: '15 Apr, 2025 11:20 AM',
      phone: '+1 (555) 654-3210',
      location: 'Seattle, USA',
      joinDate: '28 Jan, 2024',
      storeCount: 3,
      orderCount: 67
    },
    {
      id: 'USR00201',
      name: 'Ava Thompson',
      email: 'ava@tedara.com',
      role: 'Customer',
      status: 'Active',
      avatar: '/assets/images/users/user-7.jpg',
      lastUpdated: '23 Apr, 2025 4:25 PM',
      phone: '+1 (555) 012-3456',
      location: 'Boston, USA',
      joinDate: '18 Feb, 2024',
      storeCount: 0,
      orderCount: 8
    }
  ];

  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Users</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item"><a href="javascript: void(0);">Admin</a></li>
            <li className="breadcrumb-item active">Users</li>
          </ol>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col-12">
          {/* Users Table */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header border-light justify-content-between">
                  <div className="d-flex gap-2">
                    <div className="app-search">
                      <input type="search" className="form-control" placeholder="Search users..."/>
                      <i className="ti ti-search app-search-icon text-muted"></i>
                    </div>
                    <button className="btn btn-danger d-none">Delete</button>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className="me-2 fw-semibold">Filter By:</span>

                    {/* Role Type Filter */}
                    <div className="app-search">
                      <select className="form-select form-control my-1 my-md-0">
                        <option value="All">Role</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Store Owner">Store Owner</option>
                        <option value="Customer">Customer</option>
                        <option value="Support">Support</option>
                      </select>
                      <i className="ti ti-shield app-search-icon text-muted"></i>
                    </div>

                    {/* Status Filter */}
                    <div className="app-search">
                      <select className="form-select form-control my-1 my-md-0">
                        <option value="All">Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                      <i className="ti ti-user-check app-search-icon text-muted"></i>
                    </div>

                    {/* Records Per Page */}
                    <div>
                      <select className="form-select form-control my-1 my-md-0">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
                    <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                      <tr className="text-uppercase fs-xxs">
                        <th className="ps-3" style={{width: '1%'}}>
                          <input className="form-check-input form-check-input-light fs-14 mt-0" type="checkbox" id="select-all-users" value="option"/>
                        </th>
                        <th>ID</th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Last Updated</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="ps-3">
                            <input className="form-check-input form-check-input-light fs-14 user-item-check mt-0" type="checkbox" value="option"/>
                          </td>
                          <td>
                            <h5 className="m-0">
                              <a 
                                href="#" 
                                className="link-reset text-primary" 
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleUserClick(user);
                                }}
                              >
                                #{user.id}
                              </a>
                            </h5>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar avatar-sm">
                                <img src={user.avatar} className="img-fluid rounded-circle" alt=""/>
                              </div>
                              <div>
                                <h5 className="fs-base mb-0">{user.name}</h5>
                                <p className="text-muted fs-xs mb-0">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td>{user.role}</td>
                          <td>{user.lastUpdated}</td>
                          <td>
                            <span className={`badge ${
                              user.status === 'Active' ? 'bg-success-subtle text-success' :
                              user.status === 'Inactive' ? 'bg-warning-subtle text-warning' :
                              'bg-danger-subtle text-danger'
                            } badge-label`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-1">
                              <a 
                                href="#" 
                                className="btn btn-light btn-icon btn-sm rounded-circle"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="ti ti-eye fs-lg"></i>
                              </a>
                              <a 
                                href="#" 
                                className="btn btn-light btn-icon btn-sm rounded-circle"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="ti ti-edit fs-lg"></i>
                              </a>
                              <a 
                                href="#" 
                                className="btn btn-light btn-icon btn-sm rounded-circle"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="ti ti-trash fs-lg"></i>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card-footer border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-0">Showing 1 to 8 of 8 entries</p>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-light" disabled>Previous</button>
                      <button className="btn btn-sm btn-primary">1</button>
                      <button className="btn btn-sm btn-light" disabled>Next</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <>
          {/* Modal Backdrop */}
          <div 
            className="modal-backdrop fade show" 
            style={{ 
              display: 'block',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1040
            }}
            onClick={closeUserModal}
          ></div>
          
          {/* Modal Dialog */}
          <div 
            className="modal fade show" 
            style={{ 
              display: 'block',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1050,
              overflow: 'auto'
            }}
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User Details</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={closeUserModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="avatar avatar-lg">
                      <img src={selectedUser.avatar} className="img-fluid rounded-circle" alt=""/>
                    </div>
                    <div>
                      <h4 className="fs-base mb-1">{selectedUser.name}</h4>
                      <p className="text-muted fs-xs mb-1">{selectedUser.email}</p>
                      <p className="text-muted fs-xs mb-1">
                        <i className="ti ti-phone me-1"></i> {selectedUser.phone}
                      </p>
                      <p className="text-muted fs-xs mb-1">
                        <i className="ti ti-map-pin me-1"></i> {selectedUser.location}
                      </p>
                      <p className="text-muted fs-xs mb-1">
                        <i className="ti ti-calendar-event me-1"></i> Joined: {selectedUser.joinDate}
                      </p>
                    </div>
                  </div>
                  <hr className="my-4"/>
                  <div className="row">
                    <div className="col-6">
                      <h6 className="fs-sm fw-semibold mb-2">Activity</h6>
                      <p className="text-muted fs-xs mb-1">
                        <i className="ti ti-store me-1"></i> {selectedUser.storeCount} Stores
                      </p>
                      <p className="text-muted fs-xs mb-1">
                        <i className="ti ti-package me-1"></i> {selectedUser.orderCount} Orders
                      </p>
                    </div>
                    <div className="col-6">
                      <h6 className="fs-sm fw-semibold mb-2">Status</h6>
                      <span className={`badge ${
                        selectedUser.status === 'Active' ? 'bg-success-subtle text-success' :
                        selectedUser.status === 'Inactive' ? 'bg-warning-subtle text-warning' :
                        'bg-danger-subtle text-danger'
                      } badge-label`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeUserModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Users;
