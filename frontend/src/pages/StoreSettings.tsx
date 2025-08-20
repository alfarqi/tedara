import Layout from '../components/layout/Layout';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './StoreSettings.css';

const StoreSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [storeName, setStoreName] = useState('Tedara Store');
  const [storeDescription, setStoreDescription] = useState('Your one-stop shop for quality products');
  const [storeEmail, setStoreEmail] = useState('contact@tedara.com');

  const [currency, setCurrency] = useState('SAR');
  const [language, setLanguage] = useState('ar');
  const [timezone, setTimezone] = useState('Asia/Riyadh');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

     const tabs = [
     { id: 'general', label: 'General Settings', icon: 'ti ti-settings' },
     { id: 'store', label: 'Store Information', icon: 'ti ti-building-store' },
     { id: 'payment', label: 'Payment Methods', icon: 'ti ti-credit-card' },
     { id: 'shipping', label: 'Shipping & Delivery', icon: 'ti ti-truck-delivery' },
     { id: 'notifications', label: 'Notifications', icon: 'ti ti-bell' },
     { id: 'security', label: 'Security', icon: 'ti ti-shield-lock' },
     { id: 'integrations', label: 'Integrations', icon: 'ti ti-plug' },
     { id: 'products', label: 'Products', icon: 'ti ti-package' },
     { id: 'advanced', label: 'Advanced', icon: 'ti ti-tools' }
   ];

  const currencies = [
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ];

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const timezones = [
    { value: 'Asia/Riyadh', label: 'Riyadh (GMT+3)' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
    { value: 'Europe/London', label: 'London (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' }
  ];

  const paymentMethods = [
    { id: 'mada', name: 'Mada', enabled: true, icon: '💳' },
    { id: 'visa', name: 'Visa', enabled: true, icon: '💳' },
    { id: 'mastercard', name: 'Mastercard', enabled: true, icon: '💳' },
    { id: 'paypal', name: 'PayPal', enabled: false, icon: '💳' },
    { id: 'apple-pay', name: 'Apple Pay', enabled: false, icon: '🍎' },
    { id: 'google-pay', name: 'Google Pay', enabled: false, icon: '🤖' }
  ];

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', enabled: true, price: '15.00', days: '3-5' },
    { id: 'express', name: 'Express Shipping', enabled: true, price: '25.00', days: '1-2' },
    { id: 'overnight', name: 'Overnight Delivery', enabled: false, price: '50.00', days: '1' },
    { id: 'pickup', name: 'Store Pickup', enabled: true, price: '0.00', days: 'Same day' }
  ];

     const integrations = [
     { id: 'google-analytics', name: 'Google Analytics', enabled: true, icon: '📊' },
     { id: 'facebook-pixel', name: 'Facebook Pixel', enabled: false, icon: '📱' },
     { id: 'mailchimp', name: 'Mailchimp', enabled: false, icon: '📧' },
     { id: 'zapier', name: 'Zapier', enabled: false, icon: '🔗' }
   ];

   const productSettings = [
     { id: 'duplicate-cart', name: 'Ability to duplicate products in the cart', enabled: true, description: 'Allow customers to add the same product multiple times to their cart' },
     { id: 'purchase-times', name: 'Customize product purchase display times', enabled: true, description: 'Show how many times a product has been purchased' },
     { id: 'out-of-stock-end', name: 'Display out-of-stock products at the end of pages', enabled: true, description: 'Show out-of-stock products at the bottom of product listings' },
     { id: 'more-details-button', name: 'Show more details button for product description', enabled: true, description: 'Display a "Show More" button for long product descriptions' },
     { id: 'zero-price-label', name: 'Show label when product price is zero', enabled: false, description: 'Display a special label for free products' },
     { id: 'related-products', name: 'Show products you might like on the product page', enabled: true, description: 'Display related product recommendations' },
     { id: 'price-range', name: 'Enable price range display on the product', enabled: true, description: 'Show price range for products with variable pricing' },
     { id: 'digital-protection', name: 'Enable digital product protection for PDF files', enabled: false, description: 'Add protection to downloadable PDF products', hasInfo: true },
     { id: 'display-weight', name: 'Display weight in product details, cart page, and invoices', enabled: true, description: 'Show product weight in various locations' },
     { id: 'display-sku', name: 'Display SKU in product and order details', enabled: true, description: 'Show Stock Keeping Unit in product information' },
     { id: 'hs-code', name: 'Show HS Code field within product data', enabled: true, description: 'Display Harmonized System code for international shipping' },
     { id: 'default-weight', name: 'Default weight for each product when sending the order to the shipping company', enabled: true, description: 'Set default weight for shipping calculations', hasInput: true, inputValue: '0.1', inputUnit: 'kg' }
   ];

  const handleSaveSettings = () => {
    // Handle saving settings
    console.log('Saving settings...');
  };

     const renderGeneralSettings = () => (
     <div className="settings-sections">
       <div className="settings-section">
         <div className="section-header">
           <h3 className="section-title">Store Information</h3>
           <p className="section-description">Configure your store's basic information and contact details.</p>
         </div>
         
         <div className="setting-group">
           <div className="setting-item">
             <div className="setting-info">
               <h4 className="setting-title">Store Name</h4>
               <p className="setting-description">The name of your store that will be displayed to customers.</p>
             </div>
             <div className="setting-control">
               <input
                 type="text"
                 className="form-control"
                 value={storeName}
                 onChange={(e) => setStoreName(e.target.value)}
                 placeholder="Enter store name"
               />
             </div>
           </div>
           
           <div className="setting-item">
             <div className="setting-info">
               <h4 className="setting-title">Store Email</h4>
               <p className="setting-description">Primary email address for store communications and notifications.</p>
             </div>
             <div className="setting-control">
               <input
                 type="email"
                 className="form-control"
                 value={storeEmail}
                 onChange={(e) => setStoreEmail(e.target.value)}
                 placeholder="Enter store email"
               />
             </div>
           </div>
           
           <div className="setting-item">
             <div className="setting-info">
               <h4 className="setting-title">Store Description</h4>
               <p className="setting-description">Brief description of your store that appears in search results and store pages.</p>
             </div>
             <div className="setting-control">
               <textarea
                 className="form-control"
                 rows={3}
                 value={storeDescription}
                 onChange={(e) => setStoreDescription(e.target.value)}
                 placeholder="Enter store description"
               />
             </div>
           </div>
         </div>
       </div>

       <div className="settings-section">
         <div className="section-header">
           <h3 className="section-title">Regional Settings</h3>
           <p className="section-description">Configure your store's regional preferences and localization.</p>
         </div>
         
         <div className="setting-group">
           <div className="setting-item">
             <div className="setting-info">
               <h4 className="setting-title">Currency</h4>
               <p className="setting-description">Select the primary currency for your store transactions.</p>
             </div>
             <div className="setting-control">
               <select
                 className="form-select"
                 value={currency}
                 onChange={(e) => setCurrency(e.target.value)}
               >
                 {currencies.map((curr) => (
                   <option key={curr.code} value={curr.code}>
                     {curr.symbol} {curr.name} ({curr.code})
                   </option>
                 ))}
               </select>
             </div>
           </div>
           
           <div className="setting-item">
             <div className="setting-info">
               <h4 className="setting-title">Language</h4>
               <p className="setting-description">Choose the primary language for your store interface.</p>
             </div>
             <div className="setting-control">
               <select
                 className="form-select"
                 value={language}
                 onChange={(e) => setLanguage(e.target.value)}
               >
                 {languages.map((lang) => (
                   <option key={lang.code} value={lang.code}>
                     {lang.flag} {lang.name}
                   </option>
                 ))}
               </select>
             </div>
           </div>
           
           <div className="setting-item">
             <div className="setting-info">
               <h4 className="setting-title">Timezone</h4>
               <p className="setting-description">Set your store's timezone for accurate time displays and scheduling.</p>
             </div>
             <div className="setting-control">
               <select
                 className="form-select"
                 value={timezone}
                 onChange={(e) => setTimezone(e.target.value)}
               >
                 {timezones.map((tz) => (
                   <option key={tz.value} value={tz.value}>
                     {tz.label}
                   </option>
                 ))}
               </select>
             </div>
           </div>
         </div>
       </div>

       <div className="settings-section">
         <div className="section-header">
           <h3 className="section-title">Store Status</h3>
           <p className="section-description">Control your store's availability and maintenance settings.</p>
         </div>
         
         <div className="setting-group">
           <div className="setting-item">
             <div className="setting-info">
               <h4 className="setting-title">Maintenance Mode</h4>
               <p className="setting-description">Enable maintenance mode to temporarily close your store for updates or maintenance.</p>
             </div>
             <div className="setting-control">
               <div className="form-check">
                 <input
                   className="form-check-input"
                   type="checkbox"
                   id="maintenanceMode"
                   checked={maintenanceMode}
                   onChange={(e) => setMaintenanceMode(e.target.checked)}
                 />
                 <label className="form-check-label" htmlFor="maintenanceMode">
                   Enable Maintenance Mode
                 </label>
               </div>
             </div>
           </div>
           
           <div className="setting-item">
             <div className="setting-info">
               <h4 className="setting-title">Automatic Backups</h4>
               <p className="setting-description">Automatically backup your store data daily to prevent data loss.</p>
             </div>
             <div className="setting-control">
               <div className="form-check">
                 <input
                   className="form-check-input"
                   type="checkbox"
                   id="autoBackup"
                   checked={autoBackup}
                   onChange={(e) => setAutoBackup(e.target.checked)}
                 />
                 <label className="form-check-label" htmlFor="autoBackup">
                   Enable Automatic Backups
                 </label>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );

  const renderStoreInformation = () => (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Store Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Business Name</label>
                <input type="text" className="form-control" placeholder="Enter business name" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tax ID</label>
                <input type="text" className="form-control" placeholder="Enter tax ID" />
              </div>
              <div className="col-12">
                <label className="form-label">Business Description</label>
                <textarea className="form-control" rows={4} placeholder="Describe your business"></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label">Business Hours</label>
                <input type="text" className="form-control" placeholder="e.g., 9:00 AM - 6:00 PM" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Website</label>
                <input type="url" className="form-control" placeholder="https://yourwebsite.com" />
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header">
            <h5 className="card-title mb-0">Social Media</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Facebook</label>
                <input type="url" className="form-control" placeholder="Facebook page URL" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Instagram</label>
                <input type="url" className="form-control" placeholder="Instagram profile URL" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Twitter</label>
                <input type="url" className="form-control" placeholder="Twitter profile URL" />
              </div>
              <div className="col-md-6">
                <label className="form-label">LinkedIn</label>
                <input type="url" className="form-control" placeholder="LinkedIn profile URL" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Store Statistics</h5>
          </div>
          <div className="card-body">
                         <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#6366f1' }}>
                   <i className="ti ti-shopping-cart text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Total Orders</h6>
                 <span className="text-muted">1,234</span>
               </div>
             </div>
             <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#10b981' }}>
                   <i className="ti ti-users text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Customers</h6>
                 <span className="text-muted">567</span>
               </div>
             </div>
             <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#f59e0b' }}>
                   <i className="ti ti-package text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Products</h6>
                 <span className="text-muted">89</span>
               </div>
             </div>
             <div className="d-flex align-items-center">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#06b6d4' }}>
                   <i className="ti ti-currency-dollar text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Revenue</h6>
                 <span className="text-muted">SAR 45,678</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Payment Methods</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="col-md-6">
                  <div className="card border">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="fs-4 me-3">{method.icon}</span>
                          <div>
                            <h6 className="mb-0" style={{ fontSize: '0.9rem', fontWeight: '600' }}>{method.name}</h6>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Payment method</small>
                          </div>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={method.enabled}
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header">
            <h5 className="card-title mb-0">Payment Settings</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Minimum Order Amount</label>
                <input type="number" className="form-control" placeholder="0.00" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Maximum Order Amount</label>
                <input type="number" className="form-control" placeholder="10000.00" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Due Days</label>
                <input type="number" className="form-control" placeholder="30" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Auto-capture Payments</label>
                <select className="form-select">
                  <option>Immediately</option>
                  <option>After 24 hours</option>
                  <option>After 48 hours</option>
                  <option>Manual</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Payment Analytics</h5>
          </div>
          <div className="card-body">
                         <div className="mb-3">
               <h6>Payment Methods Usage</h6>
               <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
                 <div className="progress-bar" style={{ width: '45%', backgroundColor: '#6366f1' }}></div>
               </div>
               <small className="text-muted">Mada (45%)</small>
             </div>
             <div className="mb-3">
               <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
                 <div className="progress-bar" style={{ width: '30%', backgroundColor: '#10b981' }}></div>
               </div>
               <small className="text-muted">Visa (30%)</small>
             </div>
             <div className="mb-3">
               <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
                 <div className="progress-bar" style={{ width: '25%', backgroundColor: '#f59e0b' }}></div>
               </div>
               <small className="text-muted">Mastercard (25%)</small>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShippingMethods = () => (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Shipping Methods</h5>
          </div>
          <div className="card-body">
            {shippingMethods.map((method) => (
              <div key={method.id} className="card border mb-3">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="d-flex align-items-center">
                        <div className="form-check form-switch me-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={method.enabled}
                            onChange={() => {}}
                          />
                        </div>
                        <div>
                          <h6 className="mb-0">{method.name}</h6>
                          <small className="text-muted">{method.days} days</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <span className="fw-bold">SAR {method.price}</span>
                    </div>
                    <div className="col-md-3">
                      <span className="badge bg-secondary">{method.enabled ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-sm btn-outline-primary">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header">
            <h5 className="card-title mb-0">Shipping Zones</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Default Shipping Zone</label>
                <select className="form-select">
                  <option>Saudi Arabia</option>
                  <option>GCC Countries</option>
                  <option>International</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Free Shipping Threshold</label>
                <input type="number" className="form-control" placeholder="200.00" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Shipping Analytics</h5>
          </div>
          <div className="card-body">
                         <div className="text-center mb-3">
               <h4 style={{ color: '#6366f1' }}>SAR 1,234</h4>
               <small className="text-muted">Total Shipping Revenue</small>
             </div>
             <div className="text-center mb-3">
               <h4 style={{ color: '#10b981' }}>89%</h4>
               <small className="text-muted">On-time Delivery Rate</small>
             </div>
             <div className="text-center">
               <h4 style={{ color: '#f59e0b' }}>2.3 days</h4>
               <small className="text-muted">Average Delivery Time</small>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Notification Settings</h5>
          </div>
          <div className="card-body">
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="emailNotifications"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="emailNotifications">
                Email Notifications
              </label>
              <small className="form-text text-muted d-block">
                Receive notifications via email for orders, customers, and system updates
              </small>
            </div>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="smsNotifications"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="smsNotifications">
                SMS Notifications
              </label>
              <small className="form-text text-muted d-block">
                Receive notifications via SMS for important updates
              </small>
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header">
            <h5 className="card-title mb-0">Notification Types</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="newOrders" defaultChecked />
                  <label className="form-check-label" htmlFor="newOrders">
                    New Orders
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="lowStock" defaultChecked />
                  <label className="form-check-label" htmlFor="lowStock">
                    Low Stock Alerts
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="customerReviews" />
                  <label className="form-check-label" htmlFor="customerReviews">
                    Customer Reviews
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="systemUpdates" defaultChecked />
                  <label className="form-check-label" htmlFor="systemUpdates">
                    System Updates
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Notification History</h5>
          </div>
          <div className="card-body">
                         <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#10b981' }}>
                   <i className="ti ti-check text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">New Order #1234</h6>
                 <small className="text-muted">2 minutes ago</small>
               </div>
             </div>
             <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#f59e0b' }}>
                   <i className="ti ti-alert-triangle text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Low Stock Alert</h6>
                 <small className="text-muted">1 hour ago</small>
               </div>
             </div>
             <div className="d-flex align-items-center">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#06b6d4' }}>
                   <i className="ti ti-star text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">New Review</h6>
                 <small className="text-muted">3 hours ago</small>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Security Settings</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" placeholder="Enter current password" />
              </div>
              <div className="col-md-6">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" placeholder="Enter new password" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-control" placeholder="Confirm new password" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Two-Factor Authentication</label>
                <select className="form-select">
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header">
            <h5 className="card-title mb-0">Login Sessions</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead className="bg-light">
                  <tr>
                    <th>Device</th>
                    <th>Location</th>
                    <th>Last Activity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Chrome on Windows</td>
                    <td>Riyadh, Saudi Arabia</td>
                    <td>Active now</td>
                                         <td><span className="badge" style={{ backgroundColor: '#10b981' }}>Current</span></td>
                   </tr>
                   <tr>
                     <td>Safari on iPhone</td>
                     <td>Jeddah, Saudi Arabia</td>
                     <td>2 hours ago</td>
                     <td><button className="btn btn-sm btn-outline-danger">Revoke</button></td>
                   </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Security Status</h5>
          </div>
          <div className="card-body">
                         <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#10b981' }}>
                   <i className="ti ti-shield-check text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Strong Password</h6>
                 <small className="text-muted">Your password is secure</small>
               </div>
             </div>
             <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#10b981' }}>
                   <i className="ti ti-lock text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">2FA Enabled</h6>
                 <small className="text-muted">Two-factor authentication active</small>
               </div>
             </div>
             <div className="d-flex align-items-center">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#f59e0b' }}>
                   <i className="ti ti-alert-circle text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">SSL Certificate</h6>
                 <small className="text-muted">Expires in 30 days</small>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

     const renderIntegrations = () => (
     <div className="row">
       <div className="col-lg-8">
         <div className="card">
           <div className="card-header">
             <h5 className="card-title mb-0">Third-Party Integrations</h5>
           </div>
           <div className="card-body">
             <div className="row g-3">
               {integrations.map((integration) => (
                 <div key={integration.id} className="col-md-6">
                   <div className="card border">
                     <div className="card-body">
                       <div className="d-flex align-items-center justify-content-between">
                         <div className="d-flex align-items-center">
                           <span className="fs-4 me-3">{integration.icon}</span>
                           <div>
                             <h6 className="mb-0">{integration.name}</h6>
                             <small className="text-muted">Integration</small>
                           </div>
                         </div>
                         <div className="form-check form-switch">
                           <input
                             className="form-check-input"
                             type="checkbox"
                             checked={integration.enabled}
                             onChange={() => {}}
                           />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>

       <div className="col-lg-4">
         <div className="card">
           <div className="card-header">
             <h5 className="card-title mb-0">API Keys</h5>
           </div>
           <div className="card-body">
             <div className="mb-3">
               <label className="form-label">Google Analytics API Key</label>
               <input type="text" className="form-control" placeholder="Enter API key" />
             </div>
             <div className="mb-3">
               <label className="form-label">Facebook Pixel ID</label>
               <input type="text" className="form-control" placeholder="Enter Pixel ID" />
             </div>
             <div className="mb-3">
               <label className="form-label">Mailchimp API Key</label>
               <input type="text" className="form-control" placeholder="Enter API key" />
             </div>
           </div>
         </div>
       </div>
     </div>
   );

   const renderProducts = () => (
     <div className="row">
       <div className="col-lg-8">
         <div className="card">
           <div className="card-header">
             <h5 className="card-title mb-0">
               <i className="ti ti-package me-2"></i>
               Products
             </h5>
             <p className="card-subtitle mb-0">Product display and behavior settings</p>
           </div>
           <div className="card-body">
             <div className="row">
               {productSettings.map((setting) => (
                 <div key={setting.id} className="col-12 mb-3">
                   <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                     <div className="d-flex align-items-center flex-grow-1">
                       <div className="flex-grow-1">
                         <div className="d-flex align-items-center">
                           <h6 className="mb-0 me-2" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                             {setting.name}
                           </h6>
                           {setting.hasInfo && (
                             <i className="ti ti-info-circle text-muted" style={{ fontSize: '0.85rem' }}></i>
                           )}
                         </div>
                         <small className="text-muted d-block mt-1" style={{ fontSize: '0.8rem' }}>{setting.description}</small>
                         {setting.hasInput && (
                           <div className="d-flex align-items-center mt-2">
                             <input
                               type="number"
                               className="form-control form-control-sm me-2"
                               style={{ width: '80px' }}
                               defaultValue={setting.inputValue}
                             />
                             <select className="form-select form-select-sm" style={{ width: '80px' }}>
                               <option>{setting.inputUnit}</option>
                               <option>kg</option>
                               <option>g</option>
                               <option>lb</option>
                             </select>
                             <i className="ti ti-weight ms-2 text-muted"></i>
                           </div>
                         )}
                       </div>
                     </div>
                     <div className="form-check form-switch ms-3">
                       <input
                         className="form-check-input"
                         type="checkbox"
                         checked={setting.enabled}
                         onChange={() => {}}
                       />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>

         <div className="card mt-3">
           <div className="card-header">
             <h5 className="card-title mb-0">Product Display Settings</h5>
           </div>
           <div className="card-body">
             <div className="row g-3">
               <div className="col-md-6">
                 <label className="form-label">Products per Page</label>
                 <select className="form-select">
                   <option>12</option>
                   <option>24</option>
                   <option>36</option>
                   <option>48</option>
                 </select>
               </div>
               <div className="col-md-6">
                 <label className="form-label">Default Sort Order</label>
                 <select className="form-select">
                   <option>Newest First</option>
                   <option>Oldest First</option>
                   <option>Price: Low to High</option>
                   <option>Price: High to Low</option>
                   <option>Name: A to Z</option>
                   <option>Name: Z to A</option>
                 </select>
               </div>
               <div className="col-md-6">
                 <label className="form-label">Image Quality</label>
                 <select className="form-select">
                   <option>High Quality</option>
                   <option>Medium Quality</option>
                   <option>Low Quality</option>
                 </select>
               </div>
               <div className="col-md-6">
                 <label className="form-label">Lazy Loading</label>
                 <select className="form-select">
                   <option>Enabled</option>
                   <option>Disabled</option>
                 </select>
               </div>
             </div>
           </div>
         </div>
       </div>

       <div className="col-lg-4">
         <div className="card">
           <div className="card-header">
             <h5 className="card-title mb-0">Product Statistics</h5>
           </div>
           <div className="card-body">
             <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#6366f1' }}>
                   <i className="ti ti-package text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Total Products</h6>
                 <span className="text-muted">1,234</span>
               </div>
             </div>
             <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#10b981' }}>
                   <i className="ti ti-check text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Active Products</h6>
                 <span className="text-muted">1,156</span>
               </div>
             </div>
             <div className="d-flex align-items-center mb-3">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#f59e0b' }}>
                   <i className="ti ti-alert-triangle text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Low Stock</h6>
                 <span className="text-muted">23</span>
               </div>
             </div>
             <div className="d-flex align-items-center">
               <div className="flex-shrink-0">
                 <div className="avatar avatar-sm rounded" style={{ backgroundColor: '#ef4444' }}>
                   <i className="ti ti-x text-white"></i>
                 </div>
               </div>
               <div className="flex-grow-1 ms-3">
                 <h6 className="mb-0">Out of Stock</h6>
                 <span className="text-muted">55</span>
               </div>
             </div>
           </div>
         </div>

         <div className="card mt-3">
           <div className="card-header">
             <h5 className="card-title mb-0">Quick Actions</h5>
           </div>
           <div className="card-body">
             <div className="d-grid gap-2">
               <button className="btn btn-outline-primary btn-sm">
                 <i className="ti ti-plus me-2"></i>Add New Product
               </button>
               <button className="btn btn-outline-success btn-sm">
                 <i className="ti ti-download me-2"></i>Export Products
               </button>
               <button className="btn btn-outline-info btn-sm">
                 <i className="ti ti-upload me-2"></i>Import Products
               </button>
               <button className="btn btn-outline-warning btn-sm">
                 <i className="ti ti-refresh me-2"></i>Update Inventory
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
   );

  const renderAdvanced = () => (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Advanced Settings</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Cache Duration</label>
                <select className="form-select">
                  <option>1 hour</option>
                  <option>6 hours</option>
                  <option>12 hours</option>
                  <option>24 hours</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Session Timeout</label>
                <select className="form-select">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Max Upload Size</label>
                <select className="form-select">
                  <option>2 MB</option>
                  <option>5 MB</option>
                  <option>10 MB</option>
                  <option>20 MB</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Database Backup Frequency</label>
                <select className="form-select">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header">
            <h5 className="card-title mb-0">System Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">PHP Version</label>
                <input type="text" className="form-control" value="8.1.0" readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label">Database Version</label>
                <input type="text" className="form-control" value="MySQL 8.0" readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label">Server Uptime</label>
                <input type="text" className="form-control" value="15 days, 3 hours" readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Backup</label>
                <input type="text" className="form-control" value="2 hours ago" readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">System Health</h5>
          </div>
          <div className="card-body">
                         <div className="mb-3">
               <div className="d-flex justify-content-between mb-1">
                 <span>CPU Usage</span>
                 <span>45%</span>
               </div>
               <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
                 <div className="progress-bar" style={{ width: '45%', backgroundColor: '#10b981' }}></div>
               </div>
             </div>
             <div className="mb-3">
               <div className="d-flex justify-content-between mb-1">
                 <span>Memory Usage</span>
                 <span>67%</span>
               </div>
               <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
                 <div className="progress-bar" style={{ width: '67%', backgroundColor: '#f59e0b' }}></div>
               </div>
             </div>
             <div className="mb-3">
               <div className="d-flex justify-content-between mb-1">
                 <span>Disk Usage</span>
                 <span>23%</span>
               </div>
               <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
                 <div className="progress-bar" style={{ width: '23%', backgroundColor: '#06b6d4' }}></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

     const renderTabContent = () => {
     switch (activeTab) {
       case 'general':
         return renderGeneralSettings();
       case 'store':
         return renderStoreInformation();
       case 'payment':
         return renderPaymentMethods();
       case 'shipping':
         return renderShippingMethods();
       case 'notifications':
         return renderNotifications();
       case 'security':
         return renderSecurity();
       case 'integrations':
         return renderIntegrations();
       case 'products':
         return renderProducts();
       case 'advanced':
         return renderAdvanced();
       default:
         return renderGeneralSettings();
     }
   };

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

                          {/* Salient-Style Settings Panel */}
         <div className="salient-settings-container">
           {/* Top Header Bar */}
           <div className="settings-header">
             <div className="header-left">
               <i className="ti ti-settings"></i>
               <span>Tedara Store</span>
             </div>
             <div className="header-right">
               Settings Panel
             </div>
           </div>

           {/* Main Settings Layout */}
           <div className="settings-layout">
             {/* Left Sidebar Navigation */}
             <div className="settings-sidebar">
               <div className="sidebar-nav">
                 {tabs.map((tab) => (
                   <button
                     key={tab.id}
                     className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                     onClick={() => setActiveTab(tab.id)}
                     type="button"
                   >
                     <div className="nav-item-content">
                       <i className={tab.icon}></i>
                       <span className="nav-label">{tab.label}</span>
                     </div>
                   </button>
                 ))}
               </div>
             </div>

             {/* Main Content Area */}
             <div className="settings-content">
               <div className="content-header">
                 <h1 className="content-title">{tabs.find(tab => tab.id === activeTab)?.label}</h1>
                 <p className="content-subtitle">All {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} options are listed here.</p>
               </div>
               <div className="content-body">
                 {renderTabContent()}
               </div>
             </div>
           </div>
         </div>

        {/* Save Button */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-end">
                                 <button className="btn btn-secondary me-2">Cancel</button>
                 <button className="btn" style={{ backgroundColor: '#6366f1', borderColor: '#6366f1', color: 'white' }} onClick={handleSaveSettings}>
                   <i className="ti ti-device-floppy me-2"></i>Save Changes
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoreSettings;
