import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ToggleSwitch } from '../components/common';
import './StoreSettings.css';

const StoreSettings: React.FC = () => {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'AR'>('EN');
  const [maintenanceContent, setMaintenanceContent] = useState({
    EN: {
      title: 'Store Under Maintenance',
      message: 'Sorry dear customer, the store is currently under maintenance and we will resume work shortly.'
    },
    AR: {
      title: 'المتجر قيد الصيانة',
      message: 'عذراً عزيزي العميل، المتجر حالياً قيد الصيانة وسنعاود العمل خلال فترة وجيزة'
    }
  });

  const handleMaintenanceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMaintenanceModal(true);
  };

  const handleSaveMaintenanceSettings = () => {
    // TODO: Implement save functionality
    console.log('Saving maintenance settings...', {
      maintenanceMode,
      maintenanceContent
    });
    setShowMaintenanceModal(false);
  };

  const handleLanguageChange = (language: 'EN' | 'AR') => {
    setSelectedLanguage(language);
  };

  const handleTitleChange = (title: string) => {
    setMaintenanceContent(prev => ({
      ...prev,
      [selectedLanguage]: {
        ...prev[selectedLanguage],
        title
      }
    }));
  };

  const handleMessageChange = (message: string) => {
    setMaintenanceContent(prev => ({
      ...prev,
      [selectedLanguage]: {
        ...prev[selectedLanguage],
        message
      }
    }));
  };

     const tabs = [
     { id: 'general', label: 'General Settings', icon: 'ti ti-settings', description: 'Basic store configuration and regional settings', href: '/store-settings/general' },
     { id: 'store', label: 'Store Information', icon: 'ti ti-building-store', description: 'Business details and contact information', href: '/store-settings/store' },
     { id: 'payment', label: 'Payment Methods', icon: 'ti ti-credit-card', description: 'Configure payment gateways and methods', href: '/store-settings/payment' },
     { id: 'shipping', label: 'Shipping & Delivery', icon: 'ti ti-truck-delivery', description: 'Set up shipping zones and delivery options', href: '/store-settings/shipping' },
     { id: 'notifications', label: 'Notifications', icon: 'ti ti-bell', description: 'Email and SMS notification preferences', href: '/store-settings/notifications' },
     { id: 'security', label: 'Security', icon: 'ti ti-shield-lock', description: 'Password, 2FA, and security settings', href: '/store-settings/security' },
     { id: 'products', label: 'Products', icon: 'ti ti-package', description: 'Product display and behavior settings', href: '/store-settings/products' },
     { id: 'maintenance', label: 'Maintenance', icon: 'ti ti-settings', description: 'Maintenance and downtime management', href: '/store-settings/advanced', isModal: true },
     { id: 'invoice', label: 'Invoice', icon: 'ti ti-file-invoice', description: 'Customize invoice appearance and content', href: '/store-settings/invoice' }
   ];





  return (
    <Layout>
      <div className="container-fluid">
        {/* Page Title */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">Store Settings</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Store Settings</li>
            </ol>
          </div>
        </div>

         {/* Settings Navigation Cards */}
         <div className="row g-2 mb-4">
                 {tabs.map((tab) => (
             <div key={tab.id} className="col-lg-3 col-md-6 col-sm-12">
               {tab.isModal ? (
                 <div 
                   className="card h-100 settings-card text-decoration-none border-light position-relative"
                   style={{ 
                     cursor: 'pointer',
                     transition: 'all 0.3s ease',
                     border: '1px solid #e9ecef'
                   }}
                   onClick={handleMaintenanceClick}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'translateY(-2px)';
                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(111, 66, 193, 0.15)';
                     const iconWrapper = e.currentTarget.querySelector('.icon-wrapper') as HTMLElement;
                     const icon = e.currentTarget.querySelector('i') as HTMLElement;
                     if (iconWrapper) {
                       iconWrapper.style.backgroundColor = '#6f42c1';
                     }
                     if (icon) {
                       icon.style.color = '#ffffff';
                     }
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = 'none';
                     const iconWrapper = e.currentTarget.querySelector('.icon-wrapper') as HTMLElement;
                     const icon = e.currentTarget.querySelector('i') as HTMLElement;
                     if (iconWrapper) {
                       iconWrapper.style.backgroundColor = '#f3f0ff';
                     }
                     if (icon) {
                       icon.style.color = '#6f42c1';
                     }
                   }}
                 >
                   <div className="card-body text-center p-3 d-flex flex-column justify-content-between" style={{ minHeight: '120px' }}>
                     <div>
                       <div 
                         className="icon-wrapper mb-2"
                         style={{
                           width: '45px',
                           height: '45px',
                           margin: '0 auto',
                           borderRadius: '8px',
                           backgroundColor: '#f3f0ff',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           transition: 'all 0.3s ease'
                         }}
                       >
                          <i
                            className={tab.icon}
                            style={{
                              fontSize: '24px',
                              color: '#6f42c1'
                            }}
                          ></i>
                       </div>
                       <h5 
                         className="card-title mb-1"
                         style={{
                           fontSize: '1rem',
                           fontWeight: '600',
                           color: '#343a40'
                         }}
                       >
                         {tab.label}
                       </h5>
                       <p 
                         className="card-text"
                         style={{
                           fontSize: '0.8rem',
                           color: '#6c757d',
                           lineHeight: '1.3',
                           margin: 0
                         }}
                       >
                         {tab.description}
                       </p>
                     </div>
                   </div>
                   {/* Red Alert Icon when maintenance is enabled */}
                   {maintenanceMode && (
                     <i 
                       className="ti ti-alert-triangle" 
                       style={{
                         position: 'absolute',
                         top: '8px',
                         right: '8px',
                         color: '#dc3545',
                         backgroundColor: 'rgba(255, 255, 255, 0.9)',
                         borderRadius: '4px',
                         padding: '2px',
                         fontSize: '18px'
                       }}
                     ></i>
                   )}
                 </div>
               ) : (
                 <Link 
                   to={tab.href}
                   className="card h-100 settings-card text-decoration-none border-light"
                   style={{ 
                     cursor: 'pointer',
                     transition: 'all 0.3s ease',
                     border: '1px solid #e9ecef'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'translateY(-2px)';
                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(111, 66, 193, 0.15)';
                     const iconWrapper = e.currentTarget.querySelector('.icon-wrapper') as HTMLElement;
                     const icon = e.currentTarget.querySelector('i') as HTMLElement;
                     if (iconWrapper) {
                       iconWrapper.style.backgroundColor = '#6f42c1';
                     }
                     if (icon) {
                       icon.style.color = '#ffffff';
                     }
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = 'none';
                     const iconWrapper = e.currentTarget.querySelector('.icon-wrapper') as HTMLElement;
                     const icon = e.currentTarget.querySelector('i') as HTMLElement;
                     if (iconWrapper) {
                       iconWrapper.style.backgroundColor = '#f3f0ff';
                     }
                     if (icon) {
                       icon.style.color = '#6f42c1';
                     }
                   }}
                 >
                   <div className="card-body text-center p-3 d-flex flex-column justify-content-between" style={{ minHeight: '120px' }}>
                     <div>
                       <div 
                         className="icon-wrapper mb-2"
                         style={{
                           width: '45px',
                           height: '45px',
                           margin: '0 auto',
                           borderRadius: '8px',
                           backgroundColor: '#f3f0ff',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           transition: 'all 0.3s ease'
                         }}
                       >
                          <i
                            className={tab.icon}
                            style={{
                              fontSize: '24px',
                              color: '#6f42c1'
                            }}
                          ></i>
                       </div>
                       <h5 
                         className="card-title mb-1"
                         style={{
                           fontSize: '1rem',
                           fontWeight: '600',
                           color: '#343a40'
                         }}
                       >
                         {tab.label}
                       </h5>
                       <p 
                         className="card-text"
                         style={{
                           fontSize: '0.8rem',
                           color: '#6c757d',
                           lineHeight: '1.3',
                           margin: 0
                         }}
                       >
                         {tab.description}
                       </p>
                     </div>
                   </div>
                 </Link>
               )}
             </div>
           ))}
        </div>

        {/* Maintenance Mode Modal */}
        {showMaintenanceModal && (
          <>
            {/* Backdrop */}
            <div 
              className="modal-backdrop fade show" 
              style={{ zIndex: 1054 }}
              onClick={() => setShowMaintenanceModal(false)}
            ></div>
            
            {/* Modal */}
            <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                    <h5 className="modal-title">
                      <i className="ti ti-wrench me-2"></i>
                      Maintenance Mode
                    </h5>
                    <button 
                      type="button" 
                      className="btn-close btn-close-white" 
                      onClick={() => setShowMaintenanceModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-0">
                    <div className="p-4">
                      {/* Maintenance Mode Toggle - First */}
                      <div className="mb-4">
                        <div className="d-flex align-items-start justify-content-between mb-3">
                          <div className="flex-grow-1 me-3">
                            <h5 className="mb-2" style={{ fontSize: '18px', fontWeight: '600' }}>Maintenance Mode</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                              Once maintenance mode is activated, only you can access the store for preparation, 
                              while customers will see a maintenance page. We recommend logging out from the control panel 
                              or using another browser to view the maintenance page.
                            </p>
                          </div>
                          <div className="flex-shrink-0" style={{ marginTop: '2px' }}>
                            <ToggleSwitch
                              checked={maintenanceMode}
                              onChange={(checked) => setMaintenanceMode(checked)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Language Selector */}
                      <div className="mb-4">
                        <label className="form-label fw-medium">Language</label>
                        <select 
                          className="form-select"
                          value={selectedLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value as 'EN' | 'AR')}
                        >
                          <option value="EN">English</option>
                          <option value="AR">العربية</option>
                        </select>
                      </div>

                      {/* Maintenance Title */}
                      <div className="mb-4">
                        <label className="form-label fw-medium">Maintenance Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={selectedLanguage === 'EN' ? 'Store Under Maintenance' : 'المتجر قيد الصيانة'}
                          value={maintenanceContent[selectedLanguage].title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                        />
                      </div>

                      {/* Maintenance Message */}
                      <div className="mb-4">
                        <label className="form-label fw-medium">Maintenance Message</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          placeholder={selectedLanguage === 'EN' ? 'Sorry dear customer, the store is currently under maintenance and we will resume work shortly.' : 'عذراً عزيزي العميل، المتجر حالياً قيد الصيانة وسنعاود العمل خلال فترة وجيزة'}
                          value={maintenanceContent[selectedLanguage].message}
                          onChange={(e) => handleMessageChange(e.target.value)}
                        ></textarea>
                      </div>

                    </div>
                  </div>
                  
                  {/* Modal Footer with Buttons */}
                  <div className="modal-footer" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6', borderRadius: '0 0 8px 8px', padding: '15px 20px' }}>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowMaintenanceModal(false)}
                    >
                      <i className="ti ti-x me-2"></i>
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={handleSaveMaintenanceSettings}
                    >
                      <i className="ti ti-check me-2"></i>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </>
      )}
      </div>
    </Layout>
  );
};

export default StoreSettings;
