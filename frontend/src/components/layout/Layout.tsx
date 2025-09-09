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
    const initialSize = (saved as 'default' | 'condensed' | 'compact' | 'offcanvas') || 'default';
    return initialSize;
  });
  
  // Initialize icons whenever layout mounts
  useIconInitialization();

  // Handle responsive behavior - only on initial load and respect user preference
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const savedSize = localStorage.getItem('sidebar-size') as 'default' | 'condensed' | 'compact' | 'offcanvas';
      
      
      if (width <= 767.98) {
        // On mobile, always use offcanvas
        setSidebarSize('offcanvas');
        localStorage.setItem('sidebar-size', 'offcanvas');
      } else {
        // On desktop, use saved preference (default or condensed)
        if (savedSize === 'offcanvas') {
          // If coming from mobile, default to 'default' state
          setSidebarSize('default');
          localStorage.setItem('sidebar-size', 'default');
        } else if (savedSize && (savedSize === 'default' || savedSize === 'condensed')) {
          // Respect user's manual choice between default and condensed
          setSidebarSize(savedSize);
        } else {
          // Fallback to default
          setSidebarSize('default');
          localStorage.setItem('sidebar-size', 'default');
        }
      }
    };

    handleResize(); // Initial check only
    
    // Add resize listener to handle responsive behavior
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
