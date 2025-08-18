import React, { useState } from 'react';
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();

  // Helper function to check if a menu item is active
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      title: 'Home',
      icon: <i className="ti ti-home"></i>,
      href: '/',
      active: isActive('/')
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

  const settingsMenuItems: MenuItem[] = [
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

  const appearanceMenuItems: MenuItem[] = [
    {
      id: 'theme-design',
      title: 'Theme & Design',
      icon: <i className="ti ti-palette"></i>,
      href: '/theme-design',
      active: isActive('/theme-design')
    }
  ];

  const bottomMenuItems: MenuItem[] = [];

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

  return (
    <div className={getSidebarClasses()}>
      {/* Brand Logo */}
      <a href="/" className="logo">
        <span className="logo logo-light">
          <span className="logo-lg"><img src="/assets/images/logo.png" alt="logo" /></span>
          <span className="logo-sm"><img src="/assets/images/logo-sm.png" alt="small logo" /></span>
        </span>
        <span className="logo logo-dark">
          <span className="logo-lg"><img src="/assets/images/logo-black.png" alt="dark logo" /></span>
          <span className="logo-sm"><img src="/assets/images/logo-sm.png" alt="small logo" /></span>
        </span>
      </a>

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
                <a href="/profile" className="link-reset">
                  <img src="/assets/images/users/user-2.jpg" alt="user-image" className="rounded-circle mb-2 avatar-md" />
                  <span className="sidenav-user-name fw-bold">Damian D.</span>
                  <span className="fs-12 fw-semibold">Art Director</span>
                </a>
              </div>
              <div>
                <a className="dropdown-toggle drop-arrow-none link-reset sidenav-user-set-icon" data-bs-toggle="dropdown" data-bs-offset="0,12" href="#!" aria-haspopup="false" aria-expanded="false">
                  <i className="ti ti-settings fs-24 align-middle ms-1"></i>
                </a>
                <div className="dropdown-menu">
                  <div className="dropdown-header noti-title">
                    <h6 className="text-overflow m-0">Welcome back!</h6>
                  </div>
                  <a href="/profile" className="dropdown-item">
                    <i className="ti ti-user-circle me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Profile</span>
                  </a>
                  <a href="/notifications" className="dropdown-item">
                    <i className="ti ti-bell-ringing me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Notifications</span>
                  </a>
                  <a href="/wallet" className="dropdown-item">
                    <i className="ti ti-credit-card me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Balance: <span className="fw-semibold">$985.25</span></span>
                  </a>
                  <a href="/settings" className="dropdown-item">
                    <i className="ti ti-settings-2 me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Account Settings</span>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="/lock-screen" className="dropdown-item">
                    <i className="ti ti-lock me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Lock Screen</span>
                  </a>
                  <a href="/logout" className="dropdown-item text-danger fw-semibold">
                    <i className="ti ti-logout-2 me-2 fs-17 align-middle"></i>
                    <span className="align-middle">Log Out</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidenav Menu */}
        <ul className="side-nav">
          
          {menuItems.map((item) => (
            <li key={item.id} className={`side-nav-item ${item.active ? 'active' : ''}`}>
              <Link 
                to={item.href || '#'} 
                className={`side-nav-link ${item.active ? 'active' : ''}`}
                style={item.active ? {
                  borderLeft: '3px solid #6f42c1',
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
          {shouldShowText && <li className="side-nav-title">Settings</li>}
          
          {settingsMenuItems.map((item) => (
            <li key={item.id} className={`side-nav-item ${item.active ? 'active' : ''}`}>
              <Link 
                to={item.href || '#'} 
                className={`side-nav-link ${item.active ? 'active' : ''}`}
                style={item.active ? {
                  borderLeft: '3px solid #6f42c1',
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

        {/* Appearance Menu Items */}
        <ul className="side-nav appearance-section">
          {shouldShowText && <li className="side-nav-title">Appearance</li>}
          
          {appearanceMenuItems.map((item) => (
            <li key={item.id} className={`side-nav-item ${item.active ? 'active' : ''}`}>
              <Link 
                to={item.href || '#'} 
                className={`side-nav-link ${item.active ? 'active' : ''}`}
                style={item.active ? {
                  borderLeft: '3px solid #6f42c1',
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
      </div>
    </div>
  );
};

export default Sidebar;
