import { useState } from 'react';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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

          {/* Search */}
          <div className="app-search d-none d-xl-flex">
            <input type="search" className="form-control topbar-search" name="search" placeholder="Search for something..." />
            <i data-lucide="search" className="app-search-icon text-muted"></i>
          </div>

          {/* Mega Menu Dropdown */}
          <div className="topbar-item d-none d-md-flex">
            <div className="dropdown">
              <button className="topbar-link btn fw-medium btn-link dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,16" type="button" aria-haspopup="false" aria-expanded="false">
                Boom Boom! 😍<i className="ti ti-chevron-down ms-1"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-xxl p-0">
                <div className="h-100" style={{ maxHeight: '380px' }} data-simplebar>
                  <div className="row g-0">
                    <div className="col-12">
                      <div className="p-3 text-center bg-light bg-opacity-50">
                        <h4 className="mb-0 fs-lg fw-semibold">Welcome to <span className="text-primary">INSPINIA+</span> Admin Theme.</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Language Switcher */}
          <div className="topbar-item">
            <LanguageSwitcher />
          </div>

          {/* Messages Dropdown */}
          <div className="topbar-item">
            <div className="dropdown">
                             <button className="topbar-link dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,22" type="button" data-bs-auto-close="outside" aria-haspopup="false" aria-expanded="false">
                 <i data-lucide="mails" className="fs-xxl"></i>
                 <span className="badge text-bg-success badge-circle topbar-badge">7</span>
               </button>
              <div className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg">
                <div className="px-3 py-2 border-bottom">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="m-0 fs-md fw-semibold">Messages</h6>
                    </div>
                    <div className="col text-end">
                      <a href="#!" className="badge badge-soft-success badge-label py-1">09 Notifications</a>
                    </div>
                  </div>
                </div>
                <div style={{ maxHeight: '300px' }} data-simplebar>
                  <div className="dropdown-item notification-item py-2 text-wrap active">
                    <span className="d-flex gap-3">
                      <span className="flex-shrink-0">
                        <img src="/assets/images/users/user-1.jpg" className="avatar-md rounded-circle" alt="User Avatar" />
                      </span>
                      <span className="flex-grow-1 text-muted">
                        <span className="fw-medium text-body">Liam Carter</span> uploaded a new document
                        <br />
                        <span className="fs-xs">5 minutes ago</span>
                      </span>
                    </span>
                  </div>
                </div>
                <a href="javascript:void(0);" className="dropdown-item text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2">
                  Read All Messages
                </a>
              </div>
            </div>
          </div>

          {/* Notification Dropdown */}
          <div className="topbar-item">
            <div className="dropdown">
                             <button className="topbar-link dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,22" type="button" data-bs-auto-close="outside" aria-haspopup="false" aria-expanded="false">
                 <i data-lucide="bell" className="fs-xxl"></i>
                 <span className="badge badge-square text-bg-warning topbar-badge">14</span>
               </button>
              <div className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg">
                <div className="px-3 py-2 border-bottom">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="m-0 fs-md fw-semibold">Notifications</h6>
                    </div>
                    <div className="col text-end">
                      <a href="#!" className="badge text-bg-light badge-label py-1">14 Alerts</a>
                    </div>
                  </div>
                </div>
                <div style={{ maxHeight: '300px' }} data-simplebar>
                  <div className="dropdown-item notification-item py-2 text-wrap">
                    <span className="d-flex gap-2">
                      <span className="avatar-md flex-shrink-0">
                                                 <span className="avatar-title bg-danger-subtle text-danger rounded fs-22">
                           <i data-lucide="server-crash" className="fs-xl fill-danger"></i>
                         </span>
                      </span>
                      <span className="flex-grow-1 text-muted">
                        <span className="fw-medium text-body">Critical alert: Server crash detected</span>
                        <br />
                        <span className="fs-xs">30 minutes ago</span>
                      </span>
                    </span>
                  </div>
                </div>
                <a href="javascript:void(0);" className="dropdown-item text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2">
                  View All Alerts
                </a>
              </div>
            </div>
          </div>

          {/* Button Trigger Customizer Offcanvas */}
          <div className="topbar-item d-none d-sm-flex">
                         <button className="topbar-link" data-bs-toggle="offcanvas" data-bs-target="#theme-settings-offcanvas" type="button">
               <i data-lucide="settings" className="fs-xxl"></i>
             </button>
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
              <a className="topbar-link dropdown-toggle drop-arrow-none px-2" data-bs-toggle="dropdown" data-bs-offset="0,16" href="#!" aria-haspopup="false" aria-expanded="false">
                <img src="/assets/images/users/user-2.jpg" width="32" className="rounded-circle me-lg-2 d-flex" alt="user-image" />
                <div className="d-lg-flex align-items-center gap-1 d-none">
                  <h5 className="my-0">Damian D.</h5>
                  <i className="ti ti-chevron-down align-middle"></i>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                {/* Header */}
                <div className="dropdown-header noti-title">
                  <h6 className="text-overflow m-0">Welcome back!</h6>
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
                <a href="/logout" className="dropdown-item text-danger fw-semibold">
                  <i className="ti ti-logout-2 me-2 fs-17 align-middle"></i>
                  <span className="align-middle">Log Out</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
