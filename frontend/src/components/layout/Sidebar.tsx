import React, { useMemo, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useUserStore } from '../../hooks/useUserStore';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

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

const Sidebar: React.FC<SidebarProps> = memo(({ size, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { store, loading: storeLoading } = useUserStore();

  // Check if user is on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Memoize user display data to prevent unnecessary re-renders
  const userDisplayData = useMemo(() => {
    if (isAdminRoute) {
      return {
        displayName: 'Super Admin',
        displayInitial: 'S',
        hasStoreLogo: false,
        isLoading: false
      };
    }

    // For store owners, show loading state until we have definitive data
    if (storeLoading) {
      return {
        displayName: 'Loading...',
        displayInitial: null,
        hasStoreLogo: false,
        isLoading: true
      };
    }

    // Once store data is loaded, use store name if available, otherwise user name
    // But prioritize store name to avoid the switching effect
    const finalName = store?.name || user?.name || 'Store';
    const finalInitial = store?.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'S';
    
    return {
      displayName: finalName,
      displayInitial: finalInitial,
      hasStoreLogo: !!(store && store.logo),
      isLoading: false
    };
  }, [isAdminRoute, store, storeLoading, user?.name]);

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
      id: 'theme-design',
      title: 'Theme & Design',
      icon: <i className="ti ti-palette"></i>,
      href: '/theme-design',
      active: isActive('/theme-design')
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
      style={{ 
        backgroundColor: '#f8f9fa', 
        borderRight: '1px solid #e9ecef',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Brand Logo */}
      <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="logo">
        <span className="logo logo-light" style={{ display: 'none' }}>
          <span className="logo-lg"><img src="/assets/images/logo.png" alt="logo" /></span>
          <span className="logo-sm"><img src="/assets/images/logo-sm.png" alt="small logo" /></span>
        </span>
        <span className="logo logo-dark" style={{ display: 'block' }}>
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

      <div className="scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
        {/* Store Profile */}
        {shouldShowUser && (
          <div className="sidenav-user" style={{ 
            padding: '1.5rem 1rem',
            borderTop: '1px solid #e9ecef',
            borderBottom: '1px solid #e9ecef',
            margin: 0,
            borderRadius: 0
          }}>
            <div className="d-flex flex-column align-items-center text-center">
              {/* Store Logo - centered */}
              <Link to="/store-settings" className="link-reset mb-3">
                {userDisplayData.hasStoreLogo ? (
                  <img 
                    src={store!.logo} 
                    alt="store-logo" 
                    className="rounded-circle" 
                    style={{ 
                      width: '64px', 
                      height: '64px', 
                      objectFit: 'cover',
                      border: '2px solid #e9ecef'
                    }} 
                  />
                ) : (
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                    style={{ 
                      width: '64px', 
                      height: '64px', 
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      border: '2px solid #e9ecef'
                    }}
                  >
                    {userDisplayData.isLoading ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      userDisplayData.displayInitial
                    )}
                  </div>
                )}
              </Link>
              
              {/* Store Info - centered below avatar */}
              <div className="w-100">
                {/* Store Name */}
                <Link to="/store-settings" className="link-reset">
                  <div className="sidenav-user-name fw-bold" style={{ color: '#343a40', fontSize: '0.875rem', lineHeight: '1.2' }}>
                    {userDisplayData.displayName}
                  </div>
                </Link>

                {/* Store Link */}
                {!isAdminRoute && user?.role === 'store_owner' ? (
                  <div className="mt-0">
                    <a
                      href={store?.domain ? `https://${store.domain}.tedara.com` : '#'}
                      target={store?.domain ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                      style={{
                        fontSize: '0.8rem',
                        color: '#6c757d',
                        opacity: store?.domain ? 1 : 0.6
                      }}
                      title={store?.domain ? "Visit Store" : "Store not set up yet"}
                      onClick={!store?.domain ? (e) => e.preventDefault() : undefined}
                    >
                      {storeLoading ? 'Loading...' : (store?.domain ? `tedara.com/${store.domain}` : 'tedara.com/yourstore')}
                    </a>
                  </div>
                ) : (
                  // Show category for admin or when no store
                  isAdminRoute ? (
                    <div className="mt-0">
                      <span className="fs-12 fw-semibold" style={{ color: '#6c757d' }}>
                        Platform Administrator
                      </span>
                    </div>
                  ) : (
                    !storeLoading && store?.category && (
                      <div className="mt-0">
                        <span className="fs-12 fw-semibold" style={{ color: '#6c757d' }}>
                          {store.category}
                        </span>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        )}


        {/* Main Menu Items */}
        <ul className="side-nav" style={{ paddingTop: '1rem' }}>
          {currentMenuItems.map((item) => (
            <li key={item.id} className={`side-nav-item ${item.active ? 'active' : ''}`}>
              <Link 
                to={item.href || '#'} 
                className={`side-nav-link ${item.active ? 'active' : ''}`}
                style={item.active ? {
                  borderLeft: `3px solid ${isAdminRoute ? '#1f9126' : '#6f42c1'}`,
                  borderRadius: '0',
                  backgroundColor: 'rgba(108, 117, 125, 0.1)',
                  color: '#495057'
                } : {
                  color: '#6c757d'
                }}
              >
                <span className="menu-icon" style={{ color: item.active ? '#495057' : '#6c757d' }}>{item.icon}</span>
                {shouldShowText && <span className="menu-text" style={{ color: item.active ? '#495057' : '#6c757d' }}>{item.title}</span>}
                {shouldShowText && item.badge && <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem', padding: '0.35em 0.65em', fontWeight: 'normal' }}>{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Settings Menu Items */}
        <ul className="side-nav settings-section">
          {shouldShowText && <li className="side-nav-title" style={{ color: '#495057' }}>
            {isAdminRoute ? 'Admin Settings' : 'Settings'}
          </li>}
          
          {currentSettingsItems.map((item) => (
            <li key={item.id} className={`side-nav-item ${item.active ? 'active' : ''}`}>
              <Link 
                to={item.href || '#'} 
                className={`side-nav-link ${item.active ? 'active' : ''}`}
                style={item.active ? {
                  borderLeft: `3px solid ${isAdminRoute ? '#1f9126' : '#6f42c1'}`,
                  borderRadius: '0',
                  backgroundColor: 'rgba(108, 117, 125, 0.1)',
                  color: '#495057'
                } : {
                  color: '#6c757d'
                }}
              >
                <span className="menu-icon" style={{ color: item.active ? '#495057' : '#6c757d' }}>{item.icon}</span>
                {shouldShowText && <span className="menu-text" style={{ color: item.active ? '#495057' : '#6c757d' }}>{item.title}</span>}
                {shouldShowText && item.badge && <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem', padding: '0.35em 0.65em', fontWeight: 'normal' }}>{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>


        {/* Quick Switch Section for Admin */}
        {isAdminRoute && (
          <ul className="side-nav quick-switch-section">
            {shouldShowText && <li className="side-nav-title" style={{ color: '#495057' }}>Quick Switch</li>}
            <li className="side-nav-item">
              <Link to="/dashboard" className="side-nav-link" style={{ color: '#6c757d' }}>
                <span className="menu-icon" style={{ color: '#6c757d' }}><i className="ti ti-arrow-left"></i></span>
                {shouldShowText && <span className="menu-text" style={{ color: '#6c757d' }}>Back to Store</span>}
              </Link>
            </li>
          </ul>
        )}

      </div>

      {/* Language Switcher - Bottom Fixed */}
      {shouldShowText && (
        <div className="language-switcher-section" style={{ 
          padding: '1rem', 
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e9ecef',
          flexShrink: 0
        }}>
          <LanguageSwitcher />
        </div>
      )}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
