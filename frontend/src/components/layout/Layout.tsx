import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useIconInitialization } from '../../hooks/useIconInitialization';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Use localStorage to persist sidebar state across route changes
  const [sidebarSize, setSidebarSize] = useState<'default' | 'condensed' | 'compact' | 'offcanvas'>(() => {
    const saved = localStorage.getItem('sidebar-size');
    return (saved as 'default' | 'condensed' | 'compact' | 'offcanvas') || 'default';
  });
  
  // Initialize icons whenever layout mounts
  useIconInitialization();

  // Handle responsive behavior - only on initial load
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newSize = width <= 767.98 ? 'offcanvas' : 'default';
      setSidebarSize(newSize);
      localStorage.setItem('sidebar-size', newSize);
    };

    handleResize(); // Initial check only
  }, []); // Empty dependency array - only run once



  const toggleSidebar = () => {
    // Simple toggle between default and condensed
    const newSize = sidebarSize === 'default' ? 'condensed' : 'default';
    setSidebarSize(newSize);
    localStorage.setItem('sidebar-size', newSize);
  };

  const getWrapperClasses = () => {
    const baseClasses = ['wrapper'];
    
    if (sidebarSize === 'offcanvas') {
      baseClasses.push('sidebar-enable');
    }
    
    return baseClasses.join(' ');
  };

  return (
    <div className={getWrapperClasses()} data-sidenav-size={sidebarSize}>
      {/* Sidenav Menu Start */}
      <Sidebar size={sidebarSize} onToggle={toggleSidebar} />
      {/* Sidenav Menu End */}

      {/* Topbar Start */}
      <Header onSidebarToggle={toggleSidebar} />
      {/* Topbar End */}

      {/* ============================================================== */}
      {/* Start Main Content */}
      {/* ============================================================== */}
      <div className="content-page">
        <div className="container-fluid">
          {children}
        </div>
        {/* container */}

        {/* Footer Start */}
        <Footer />
        {/* end Footer */}
      </div>
      {/* ============================================================== */}
      {/* End of Main Content */}
      {/* ============================================================== */}
    </div>
  );
};

export default Layout;
