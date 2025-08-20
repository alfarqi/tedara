import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SidebarProps {
  size: 'default' | 'condensed' | 'compact' | 'offcanvas';
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: ReactNode;
  badge?: string;
  href?: string;
  active?: boolean;
  children?: MenuChild[];
}

interface MenuChild {
  title: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  icon?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ size, onToggle }) => {
  const location = useLocation();

  // Helper function to check if a menu item is active
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  // Check if user is on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');



  // Regular store menu items (shown when not on admin routes)
  const storeMenuItems: MenuItem[] = [
    {
      id: 'home',
      title: 'Home',
      icon: <i className="ti ti-home"></i>,
      href: '/dashboard',
      active: isActive('/dashboard')
    },
    {
      id: 'products',
      title: 'Products',
      icon: <i className="ti ti-package"></i>,
      href: '/products',
      active: isActive('/products')
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: <i className="ti ti-shopping-cart"></i>,
      href: '/orders',
      active: isActive('/orders')
    },
    {
      id: 'customers',
      title: 'Customers',
      icon: <i className="ti ti-users"></i>,
      href: '/customers',
      active: isActive('/customers')
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: <i className="ti ti-chart-bar"></i>,
      href: '/reports',
      active: isActive('/reports')
    },
    {
      id: 'questions-ratings',
      title: 'Reviews',
      icon: <i className="ti ti-star"></i>,
      href: '/questions-ratings',
      badge: '12',
      active: isActive('/questions-ratings')
    },
    {
      id: 'pages',
      title: 'Pages',
      icon: <i className="ti ti-file-text"></i>,
      href: '/pages',
      active: isActive('/pages')
    }
  ];

  // Admin menu items (shown when on admin routes)
  const adminMenuItems: MenuItem[] = [
    {
      id: 'admin-dashboard',
      title: 'Dashboard',
      icon: <i className="ti ti-dashboard"></i>,
      href: '/admin',
      active: isActive('/admin') && location.pathname === '/admin'
    },
    {
      id: 'stores',
      title: 'Stores',
      icon: <i className="ti ti-building-store"></i>,
      href: '/admin/stores',
      active: isActive('/admin/stores')
    },
    {
      id: 'users',
      title: 'Users',
      icon: <i className="ti ti-users"></i>,
      href: '/admin/users',
      active: isActive('/admin/users')
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <i className="ti ti-chart-line"></i>,
      href: '/admin/analytics',
      active: isActive('/admin/analytics')
    },
    {
      id: 'settings',
      title: 'System Settings',
      icon: <i className="ti ti-settings"></i>,
      href: '/admin/settings',
      active: isActive('/admin/settings')
    },
    {
      id: 'roles',
      title: 'Roles & Permissions',
      icon: <i className="ti ti-shield-lock"></i>,
      href: '/admin/roles',
      active: isActive('/admin/roles')
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      icon: <i className="ti ti-file-description"></i>,
      href: '/admin/audit-logs',
      active: isActive('/admin/audit-logs')
    },
    {
      id: 'domains',
      title: 'Domains',
      icon: <i className="ti ti-world"></i>,
      href: '/admin/domains',
      active: isActive('/admin/domains')
    },
    {
      id: 'support',
      title: 'Support',
      icon: <i className="ti ti-headset"></i>,
      href: '/admin/support',
      active: isActive('/admin/support')
    }
  ];

  // Store settings menu items (shown when not on admin routes)
  const storeSettingsMenuItems: MenuItem[] = [
    {
      id: 'store-settings',
      title: 'Store Settings',
      icon: <i className="ti ti-settings"></i>,
      href: '/store-settings',
      active: isActive('/store-settings')
    },
    {
      id: 'packages',
      title: 'Packages',
      icon: <i className="ti ti-package"></i>,
      href: '/packages',
      active: isActive('/packages')
    },
    {
      id: 'payment',
      title: 'Payment',
      icon: <i className="ti ti-credit-card"></i>,
      href: '/payment',
      active: isActive('/payment')
    }
  ];

  // Admin settings menu items (shown when on admin routes)
  const adminSettingsMenuItems: MenuItem[] = [
    {
      id: 'admin-profile',
      title: 'Admin Profile',
      icon: <i className="ti ti-user-circle"></i>,
      href: '/admin/profile',
      active: isActive('/admin/profile')
    },
    {
      id: 'admin-security',
      title: 'Security',
      icon: <i className="ti ti-shield"></i>,
      href: '/admin/security',
      active: isActive('/admin/security')
    },
    {
      id: 'admin-backup',
      title: 'Backup & Restore',
      icon: <i className="ti ti-database-backup"></i>,
      href: '/admin/backup',
      active: isActive('/admin/backup')
    }
  ];

  const appearanceMenuItems: MenuItem[] = [
    {
      id: 'theme-design',
      title: 'Theme & Design',
      icon: <i className="ti ti-palette"></i>,
      href: '/theme-design',
      active: isActive('/theme-design')
    }
  ];



  const getSidebarClasses = () => {
    const baseClasses = ['sidenav-menu'];
    
    if (size === 'offcanvas') {
      baseClasses.push('show');
    }
    
    return baseClasses.join(' ');
  };

  // Memoize these values to prevent unnecessary re-renders
  const shouldShowText = React.useMemo(() => size === 'default' || size === 'offcanvas', [size]);
  const shouldShowUser = React.useMemo(() => size === 'default' || size === 'offcanvas', [size]);

  // Ensure the data-sidenav-size attribute is set on the html element
  React.useEffect(() => {
    document.documentElement.setAttribute('data-sidenav-size', size);
  }, [size]);

  // Determine which menu items to show
  const currentMenuItems = isAdminRoute ? adminMenuItems : storeMenuItems;
  const currentSettingsItems = isAdminRoute ? adminSettingsMenuItems : storeSettingsMenuItems;

  return (
    <div 
      className={getSidebarClasses()}
      style={isAdminRoute ? { backgroundColor: '#0d333f' } : {}}
    >
      {/* Brand Logo */}
      <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="logo">
        <span className="logo logo-light">
          <span className="logo-lg"><img src="/assets/images/logo.png" alt="logo" /></span>
          <span className="logo-sm"><img src="/assets/images/logo-sm.png" alt="small logo" /></span>
        </span>
        <span className="logo logo-dark">
          <span className="logo-lg"><img src="/assets/images/logo-black.png" alt="dark logo" /></span>
          <span className="logo-sm"><img src="/assets/images/logo-sm.png" alt="small logo" /></span>
        </span>
      </Link>

      {/* Sidebar Hover Menu Toggle Button */}
      <button className="button-on-hover" onClick={onToggle}>
        <i className="ti ti-menu-4 fs-22 align-middle"></i>
      </button>

      {/* Full Sidebar Menu Close Button */}
      <button className="button-close-offcanvas" onClick={onToggle}>
        <i className="ti ti-x align-middle"></i>
      </button>

      <div className="scrollbar">
        {/* User */}
        {shouldShowUser && (
          <div className="sidenav-user">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link to="/profile" className="link-reset">
                  <img src="/assets/images/users/user-2.jpg" alt="user-image" className="rounded-circle mb-2 avatar-md" />
                  <span className="sidenav-user-name fw-bold">
                    {isAdminRoute ? 'Super Admin' : 'Damian D.'}
                  </span>
                  <span className="fs-12 fw-semibold">
                    {isAdminRoute ? 'Platform Administrator' : 'Art Director'}
                  </span>
                </Link>
              </div>
              <div>
                <a className="dropdown-toggle drop-arrow-none link-reset sidenav-user-set-icon" data-bs-toggle="dropdown" data-bs-offset="0,12" href="#!" aria-haspopup="false" aria-expanded="false">
                  <i className="ti ti-settings fs-24 align-middle ms-1"></i>
                </a>
                <div className="dropdown-menu">
                  <div className="dropdown-header noti-title">
                    <h6 className="text-overflow m-0">
                      {isAdminRoute ? 'Welcome Super Admin!' : 'Welcome back!'}
                    </h6>
                  </div>
                  <Link to="/profile" className="dropdown-item">
                    <i className="ti ti-user-circle me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Profile</span>
                  </Link>
                  <Link to="/notifications" className="dropdown-item">
                    <i className="ti ti-bell-ringing me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Notifications</span>
                  </Link>
                  {!isAdminRoute && (
                    <Link to="/wallet" className="dropdown-item">
                      <i className="ti ti-credit-card me-2 fs-17 align-middle"></i>
                      <span className="align-middle">Balance: <span className="fw-semibold">$985.25</span></span>
                    </Link>
                  )}
                  <Link to="/settings" className="dropdown-item">
                    <i className="ti ti-settings-2 me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Account Settings</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link to="/lock-screen" className="dropdown-item">
                    <i className="ti ti-lock me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Lock Screen</span>
                  </Link>
                  <Link to="/logout" className="dropdown-item text-danger fw-semibold">
                    <i className="ti ti-logout-2 me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Log Out</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Menu Items */}
        <ul className="side-nav">
          {currentMenuItems.map((item) => (
            <li key={item.id} className={`side-nav-item ${item.active ? 'active' : ''}`}>
              <Link 
                to={item.href || '#'} 
                className={`side-nav-link ${item.active ? 'active' : ''}`}
                style={item.active ? {
                  borderLeft: `3px solid ${isAdminRoute ? '#1f9126' : '#6f42c1'}`,
                  borderRadius: '0'
                } : {}}
              >
                <span className="menu-icon">{item.icon}</span>
                {shouldShowText && <span className="menu-text">{item.title}</span>}
                {shouldShowText && item.badge && <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem', padding: '0.35em 0.65em', fontWeight: 'normal' }}>{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Settings Menu Items */}
        <ul className="side-nav settings-section">
          {shouldShowText && <li className="side-nav-title">
            {isAdminRoute ? 'Admin Settings' : 'Settings'}
          </li>}
          
          {currentSettingsItems.map((item) => (
            <li key={item.id} className={`side-nav-item ${item.active ? 'active' : ''}`}>
              <Link 
                to={item.href || '#'} 
                className={`side-nav-link ${item.active ? 'active' : ''}`}
                style={item.active ? {
                  borderLeft: `3px solid ${isAdminRoute ? '#1f9126' : '#6f42c1'}`,
                  borderRadius: '0'
                } : {}}
              >
                <span className="menu-icon">{item.icon}</span>
                {shouldShowText && <span className="menu-text">{item.title}</span>}
                {shouldShowText && item.badge && <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem', padding: '0.35em 0.65em', fontWeight: 'normal' }}>{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Appearance Menu Items - Only show for store routes, not admin */}
        {!isAdminRoute && (
          <ul className="side-nav appearance-section">
            {shouldShowText && <li className="side-nav-title">Appearance</li>}
            
            {appearanceMenuItems.map((item) => (
              <li key={item.id} className={`side-nav-item ${item.active ? 'active' : ''}`}>
                <Link 
                  to={item.href || '#'} 
                  className={`side-nav-link ${item.active ? 'active' : ''}`}
                  style={item.active ? {
                    borderLeft: `3px solid ${isAdminRoute ? '#1f9126' : '#6f42c1'}`,
                    borderRadius: '0'
                  } : {}}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {shouldShowText && <span className="menu-text">{item.title}</span>}
                  {shouldShowText && item.badge && <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem', padding: '0.35em 0.65em', fontWeight: 'normal' }}>{item.badge}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Quick Switch Section for Admin */}
        {isAdminRoute && (
          <ul className="side-nav quick-switch-section">
            {shouldShowText && <li className="side-nav-title">Quick Switch</li>}
            <li className="side-nav-item">
              <Link to="/dashboard" className="side-nav-link">
                <span className="menu-icon"><i className="ti ti-arrow-left"></i></span>
                {shouldShowText && <span className="menu-text">Back to Store</span>}
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
