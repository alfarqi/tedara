import { useState } from 'react';
import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useIconInitialization } from '../../hooks/useIconInitialization';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize icons whenever layout mounts
  useIconInitialization();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`wrapper ${!isSidebarOpen ? 'sidenav-collapsed' : ''}`}>
      {/* Sidenav Menu Start */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
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
