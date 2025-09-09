import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchCategory, setSearchCategory] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log(`Searching for "${searchQuery}" in ${searchCategory}`);
      // TODO: Implement actual search functionality
      // This would typically navigate to a search results page or filter current data
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSearchCategory(category);
  };

  const getSearchPlaceholder = () => {
    switch (searchCategory) {
      case 'products':
        return 'Search by product name, category name, product description';
      case 'orders':
        return 'Search orders...';
      case 'customers':
        return 'Search customers...';
      default:
        return 'Search by product name, category name, product description';
    }
  };

  const getCategoryDisplayName = () => {
    switch (searchCategory) {
      case 'products':
        return 'Products';
      case 'orders':
        return 'Orders';
      case 'customers':
        return 'Customers';
      default:
        return 'Products';
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked');
      await logout();
      // The logout function in AuthContext will handle clearing the token and redirecting
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  return (
    <header className="app-topbar">
      <div className="container-fluid topbar-menu">
        <div className="d-flex align-items-center gap-2">
          {/* Topbar Brand Logo */}
          <div className="logo-topbar">
            {/* Logo light */}
            <a href="/" className="logo-light">
              <span className="logo-lg">
                <img src="/assets/images/logo.png" alt="logo" />
              </span>
              <span className="logo-sm">
                <img src="/assets/images/logo-sm.png" alt="small logo" />
              </span>
            </a>

            {/* Logo Dark */}
            <a href="/" className="logo-dark">
              <span className="logo-lg">
                <img src="/assets/images/logo-black.png" alt="dark logo" />
              </span>
              <span className="logo-sm">
                <img src="/assets/images/logo-sm.png" alt="small logo" />
              </span>
            </a>
          </div>

          {/* Sidebar Menu Toggle Button */}
          <button className="sidenav-toggle-button btn btn-primary btn-icon" onClick={onSidebarToggle}>
            <i className="ti ti-menu-4 fs-22"></i>
          </button>

          {/* Horizontal Menu Toggle Button */}
          <button className="topnav-toggle-button px-2" data-bs-toggle="collapse" data-bs-target="#topnav-menu-content">
            <i className="ti ti-menu-4 fs-22"></i>
          </button>

          {/* Search with Category Dropdown */}
          <div className="app-search d-none d-xl-flex">
            <form onSubmit={handleSearch} className="d-flex align-items-stretch">
              {/* Search Input */}
              <div className="position-relative">
                <input 
                  type="search" 
                  className="form-control topbar-search rounded-0 rounded-start" 
                  name="search" 
                  placeholder={getSearchPlaceholder()}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  style={{ 
                    minWidth: '250px',
                    height: '38px',
                    paddingLeft: '0.75rem'
                  }}
                />
              </div>

              {/* Separator */}
              <div 
                style={{
                  width: '1px',
                  height: '38px',
                  backgroundColor: '#dee2e6',
                  flexShrink: 0
                }}
              ></div>

              {/* Search Category Dropdown */}
              <div className="dropdown">
                <button 
                  className="btn btn-outline-secondary dropdown-toggle rounded-0" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{ 
                    borderLeft: 'none',
                    borderRight: 'none',
                    minWidth: '120px',
                    fontSize: '0.875rem',
                    height: '38px',
                    paddingTop: '0.4rem',
                    paddingBottom: '0.4rem'
                  }}
                >
                  {getCategoryDisplayName()}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button 
                      className={`dropdown-item ${searchCategory === 'products' ? 'active' : ''}`}
                      type="button"
                      onClick={() => handleCategoryChange('products')}
                    >
                      <i className="ti ti-package me-2"></i>
                      Products
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item ${searchCategory === 'orders' ? 'active' : ''}`}
                      type="button"
                      onClick={() => handleCategoryChange('orders')}
                    >
                      <i className="ti ti-shopping-cart me-2"></i>
                      Orders
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item ${searchCategory === 'customers' ? 'active' : ''}`}
                      type="button"
                      onClick={() => handleCategoryChange('customers')}
                    >
                      <i className="ti ti-users me-2"></i>
                      Customers
                    </button>
                  </li>
                </ul>
              </div>

              {/* Search Button */}
              <button 
                type="submit"
                className="btn btn-primary rounded-0 rounded-end"
                style={{ 
                  borderLeft: 'none',
                  height: '38px',
                  minWidth: '50px',
                  paddingLeft: '0.75rem',
                  paddingRight: '0.75rem'
                }}
              >
                <i data-lucide="search" className="fs-16"></i>
              </button>
            </form>
          </div>

        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Notifications Dropdown */}
          <div className="topbar-item">
            <div className="dropdown">
              <button className="topbar-link dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,22" type="button" data-bs-auto-close="outside" aria-haspopup="false" aria-expanded="false">
                <i data-lucide="bell" className="fs-xxl"></i>
                <span className="badge text-bg-danger badge-circle topbar-badge">3</span>
              </button>
              <div className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg">
                <div className="px-3 py-2 border-bottom">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="m-0 fs-md fw-semibold">Notifications</h6>
                    </div>
                    <div className="col text-end">
                      <a href="#!" className="badge badge-soft-danger badge-label py-1">03 Notifications</a>
                    </div>
                  </div>
                </div>
                <div className="px-2" style={{ maxHeight: '300px' }} data-simplebar>
                  <a href="#!" className="dropdown-item py-2">
                    <span className="d-flex">
                      <span className="flex-shrink-0">
                        <i className="ti ti-device-laptop fs-xxl text-primary"></i>
                      </span>
                      <span className="flex-grow-1 text-muted">
                        <span className="fw-medium text-body">Your order is placed</span>
                        <br />
                        <span className="fs-xs">If several languages coalesce the grammar</span>
                        <br />
                        <span className="fs-xs">3 min ago</span>
                      </span>
                    </span>
                  </a>
                  <a href="#!" className="dropdown-item py-2">
                    <span className="d-flex">
                      <span className="flex-shrink-0">
                        <i className="ti ti-user-check fs-xxl text-success"></i>
                      </span>
                      <span className="flex-grow-1 text-muted">
                        <span className="fw-medium text-body">Your item is shipped</span>
                        <br />
                        <span className="fs-xs">If several languages coalesce the grammar</span>
                        <br />
                        <span className="fs-xs">1 hour ago</span>
                      </span>
                    </span>
                  </a>
                  <a href="#!" className="dropdown-item py-2">
                    <span className="d-flex">
                      <span className="flex-shrink-0">
                        <i className="ti ti-alert-triangle fs-xxl text-danger"></i>
                      </span>
                      <span className="flex-grow-1 text-muted">
                        <span className="fw-medium text-body">Critical alert: Server crash detected</span>
                        <br />
                        <span className="fs-xs">30 minutes ago</span>
                      </span>
                    </span>
                  </a>
                </div>
                <a href="javascript:void(0);" className="dropdown-item text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2">
                  View All Alerts
                </a>
              </div>
            </div>
          </div>


          {/* Light/Dark Mode Button */}
          <div className="topbar-item d-none d-sm-flex">
                         <button className="topbar-link" id="light-dark-mode" type="button" onClick={toggleDarkMode}>
               {isDarkMode ? <i data-lucide="sun" className="fs-xxl mode-light-sun"></i> : <i data-lucide="moon" className="fs-xxl mode-light-moon"></i>}
             </button>
          </div>

          {/* User Dropdown */}
          <div className="topbar-item nav-user">
            <div className="dropdown">
              <button 
                className="topbar-link dropdown-toggle drop-arrow-none px-2" 
                data-bs-toggle="dropdown" 
                data-bs-offset="0,16" 
                type="button"
                aria-haspopup="true" 
                aria-expanded="false"
                style={{ border: 'none', background: 'transparent' }}
              >
                <img src="/assets/images/users/user-2.jpg" width="32" className="rounded-circle me-lg-2 d-flex" alt="user-image" />
                <div className="d-lg-flex align-items-center gap-1 d-none">
                  <h5 className="my-0">{user?.name || 'User'}</h5>
                  <i className="ti ti-chevron-down align-middle"></i>
                </div>
              </button>
              <div className="dropdown-menu dropdown-menu-end" style={{ zIndex: 9999 }}>
                {/* Header */}
                <div className="dropdown-header noti-title">
                  <h6 className="text-overflow m-0">Welcome back, {user?.name || 'User'}!</h6>
                </div>

                {/* My Profile */}
                <a href="/profile" className="dropdown-item">
                  <i className="ti ti-user-circle me-2 fs-17 align-middle"></i>
                  <span className="align-middle">Profile</span>
                </a>

                {/* Notifications */}
                <a href="/notifications" className="dropdown-item">
                  <i className="ti ti-bell-ringing me-2 fs-17 align-middle"></i>
                  <span className="align-middle">Notifications</span>
                </a>

                {/* Wallet */}
                <a href="/wallet" className="dropdown-item">
                  <i className="ti ti-credit-card me-2 fs-17 align-middle"></i>
                  <span className="align-middle">Balance: <span className="fw-semibold">$985.25</span></span>
                </a>

                {/* Settings */}
                <a href="/settings" className="dropdown-item">
                  <i className="ti ti-settings-2 me-2 fs-17 align-middle"></i>
                  <span className="align-middle">Account Settings</span>
                </a>

                {/* Support */}
                <a href="/support" className="dropdown-item">
                  <i className="ti ti-headset me-2 fs-17 align-middle"></i>
                  <span className="align-middle">Support Center</span>
                </a>

                {/* Divider */}
                <div className="dropdown-divider"></div>

                {/* Lock */}
                <a href="/lock-screen" className="dropdown-item">
                  <i className="ti ti-lock me-2 fs-17 align-middle"></i>
                  <span className="align-middle">Lock Screen</span>
                </a>

                {/* Logout */}
                <button onClick={handleLogout} className="dropdown-item text-danger fw-semibold border-0 bg-transparent w-100 text-start">
                  <i className="ti ti-logout-2 me-2 fs-17 align-middle"></i>
                  <span className="align-middle">Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
