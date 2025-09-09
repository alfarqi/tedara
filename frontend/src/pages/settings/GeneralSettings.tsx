import Layout from '../../components/layout/Layout';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../hooks/useUserStore';
import { storeService } from '../../services/storeService';
import { useAuth } from '../../contexts/AuthContext';

const GeneralSettings: React.FC = () => {
  const { store, loading, error, refetch } = useUserStore();
  const { token } = useAuth();
  
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Social Media Accounts
  const [socialAccounts, setSocialAccounts] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    whatsapp: '',
    telegram: ''
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setStoreLogo(file.name);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setStoreLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSocialAccountChange = (platform: string, value: string) => {
    setSocialAccounts(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  // Populate form fields when store data is loaded
  useEffect(() => {
    if (store) {
      setStoreName(store.name || '');
      setStoreUrl(store.domain ? `tedara.com/${store.domain}` : '');
      setStoreLocation(store.category || '');
      setStoreDescription(store.description || '');
      setStoreEmail(store.owner?.email || '');
      setStorePhone(''); // Phone not in current store model
      setStoreLogo(store.logo || null);
      setLogoPreview(store.logo || null);
      
      // Set social media accounts from store settings if available
      if (store.settings) {
        setSocialAccounts({
          facebook: store.settings.facebook || '',
          twitter: store.settings.twitter || '',
          instagram: store.settings.instagram || '',
          linkedin: store.settings.linkedin || '',
          youtube: store.settings.youtube || '',
          tiktok: store.settings.tiktok || '',
          whatsapp: store.settings.whatsapp || '',
          telegram: store.settings.telegram || ''
        });
      }
    }
  }, [store]);

  const handleSaveSettings = async () => {
    if (!store || !token) {
      setSaveError('Store data or authentication token not available');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Prepare update data
      const updateData = {
        name: storeName,
        description: storeDescription,
        category: storeLocation,
        logo: storeLogo,
        settings: {
          ...store.settings,
          facebook: socialAccounts.facebook,
          twitter: socialAccounts.twitter,
          instagram: socialAccounts.instagram,
          linkedin: socialAccounts.linkedin,
          youtube: socialAccounts.youtube,
          tiktok: socialAccounts.tiktok,
          whatsapp: socialAccounts.whatsapp,
          telegram: socialAccounts.telegram
        }
      };

      // Update store via API
      await storeService.updateStore(store.id, updateData, token);
      
      // Refresh store data
      await refetch();
      
      // Hide saving state first
      setIsSaving(false);
      
      // Then show success state after a brief delay
      setTimeout(() => {
        setIsSaved(true);
        
        // Hide success state after 2 seconds
        setTimeout(() => {
          setIsSaved(false);
        }, 2000);
      }, 100);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save settings');
      setIsSaving(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="container-fluid">
          <div className="page-title-head d-flex align-items-center">
            <div className="flex-grow-1">
              <h4 className="fs-sm text-uppercase fw-bold m-0">General Settings</h4>
            </div>
            <div className="text-end">
              <ol className="breadcrumb m-0 py-0">
                <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                <li className="breadcrumb-item"><Link to="/store-settings">Store Settings</Link></li>
                <li className="breadcrumb-item active">General Settings</li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading store data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">General Settings</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/store-settings">Store Settings</Link></li>
              <li className="breadcrumb-item active">General Settings</li>
            </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="ti ti-alert-circle fs-48 text-danger mb-3"></i>
                  <h5 className="text-danger">Error Loading Store Data</h5>
                  <p className="text-muted">{error}</p>
                  <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    <i className="ti ti-refresh me-2"></i>
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* CSS Animation for Checkmark */}
      <style>
        {`
          @keyframes checkmark {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      
      {/* Saving/Success Overlay */}
      {(isSaving || isSaved) && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              minWidth: '200px'
            }}
          >
            {isSaving ? (
              <>
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="mb-0">Saving...</h5>
                <p className="text-muted mt-2 mb-0">Please wait while we save your changes</p>
              </>
            ) : (
              <>
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#28a745',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                    animation: 'checkmark 0.6s ease-in-out'
                  }}
                >
                  <i className="ti ti-check text-white" style={{ fontSize: '24px' }}></i>
                </div>
                <h5 className="mb-0 text-success">Saved!</h5>
                <p className="text-muted mt-2 mb-0">Your settings have been saved successfully</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="container-fluid">
        {/* Page Title */}
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">Store Settings</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/store-settings">Store Settings</Link></li>
              <li className="breadcrumb-item active">General Settings</li>
            </ol>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex gap-2">
                  <Link
                    to="/store-settings/general"
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-settings"></i>
                    General Settings
                  </Link>
                  <Link
                    to="/store-settings/store"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-building-store"></i>
                    Store Information
                  </Link>
                  <Link
                    to="/store-settings/payment"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-credit-card"></i>
                    Payment Methods
                  </Link>
                  <Link
                    to="/store-settings/shipping"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-truck-delivery"></i>
                    Shipping & Delivery
                  </Link>
                  <Link
                    to="/store-settings/notifications"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-bell"></i>
                    Notifications
                  </Link>
                  <Link
                    to="/store-settings/security"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-shield-lock"></i>
                    Security
                  </Link>
                  <Link
                    to="/store-settings/products"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-package"></i>
                    Products
                  </Link>
                  <Link
                    to="/store-settings/invoice"
                    className="btn btn-outline-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: 0
                    }}
                  >
                    <i className="ti ti-file-invoice"></i>
                    Invoice
                  </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {/* Store Logo Section */}
            <div className="card mb-4">
               <div className="card-header">
                 <div className="d-flex align-items-center">
                   <i className="ti ti-photo me-3 fs-1 text-muted"></i>
                   <div className="flex-grow-1">
                     <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Store Logo</h4>
                     <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Upload your store logo to represent your brand</p>
                   </div>
                 </div>
               </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2 d-flex justify-content-center align-items-center">
                    <div className="logo-upload-area d-flex justify-content-center align-items-center">
                      {logoPreview ? (
                        <div className="logo-preview-container">
                          <img 
                            src={logoPreview} 
                            alt="Store Logo Preview" 
                            className="logo-preview"
                            style={{
                              width: '150px',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '50%',
                              border: '2px dashed #dee2e6'
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mt-2"
                            onClick={handleRemoveLogo}
                          >
                            <i className="ti ti-trash me-1"></i>
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="logo-upload-placeholder"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            width: '150px',
                            height: '150px',
                            border: '2px dashed #dee2e6',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backgroundColor: '#f8f9fa'
                          }}
                        >
                          <i className="ti ti-cloud-upload fs-24 text-muted mb-2"></i>
                          <small className="text-muted text-center">Click to upload</small>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="upload-info">
                      <h6 className="mb-2">Logo Requirements</h6>
                      <ul className="list-unstyled text-muted mb-3">
                        <li><i className="ti ti-check text-success me-2"></i>Recommended size: 200x200 pixels</li>
                        <li><i className="ti ti-check text-success me-2"></i>Maximum file size: 5MB</li>
                        <li><i className="ti ti-check text-success me-2"></i>Supported formats: JPG, PNG, GIF</li>
                        <li><i className="ti ti-check text-success me-2"></i>Square format works best</li>
                      </ul>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <i className="ti ti-upload me-2"></i>
                        Choose Logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Store Information Section */}
            <div className="card mb-4">
               <div className="card-header">
                 <div className="d-flex align-items-center">
                   <i className="ti ti-building-store me-3 fs-1 text-muted"></i>
                   <div className="flex-grow-1">
                     <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Store Information</h4>
                     <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Basic information about your store</p>
                   </div>
                 </div>
                </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="storeName" className="form-label fw-medium">
                      Store Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-building-store"></i>
                      </span>
                  <input
                    type="text"
                        id="storeName"
                    className="form-control"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Enter your store name"
                  />
                </div>
              </div>
              
                  <div className="col-md-6 mb-3">
                    <label htmlFor="storeUrl" className="form-label fw-medium">
                      Store URL <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-link"></i>
                      </span>
                      <input
                        type="text"
                        id="storeUrl"
                        className="form-control"
                        value={storeUrl}
                        readOnly
                        disabled
                        style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}
                        placeholder="tedara.com/yourstore"
                      />
                    </div>
                    <small className="text-muted">This is your store's web address (cannot be changed)</small>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="storeLocation" className="form-label fw-medium">
                      Store Location <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-map-pin"></i>
                      </span>
                      <input
                        type="text"
                        id="storeLocation"
                        className="form-control"
                        value={storeLocation}
                        onChange={(e) => setStoreLocation(e.target.value)}
                        placeholder="Enter your store location"
                      />
                    </div>
                </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="storeEmail" className="form-label fw-medium">
                      Store Email <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-mail"></i>
                      </span>
                  <input
                    type="email"
                        id="storeEmail"
                    className="form-control"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                        placeholder="contact@yourstore.com"
                  />
                </div>
              </div>
              
                  <div className="col-md-6 mb-3">
                    <label htmlFor="storePhone" className="form-label fw-medium">
                      Store Phone
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-phone"></i>
                      </span>
                      <input
                        type="tel"
                        id="storePhone"
                        className="form-control"
                        value={storePhone}
                        onChange={(e) => setStorePhone(e.target.value)}
                        placeholder="+966 50 123 4567"
                      />
                    </div>
                </div>
                  
                  <div className="col-12 mb-3">
                    <label htmlFor="storeDescription" className="form-label fw-medium">
                      Store Description
                    </label>
                    <div className="input-group">
                      <span className="input-group-text align-items-start pt-3">
                        <i className="ti ti-file-text"></i>
                      </span>
                  <textarea
                        id="storeDescription"
                    className="form-control"
                        rows={4}
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                        placeholder="Describe your store and what makes it special..."
                  />
                    </div>
                    <small className="text-muted">This description will appear on your store page and in search results</small>
                </div>
              </div>
            </div>
          </div>

            {/* Social Media Accounts Section */}
            <div className="card mb-4">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <i className="ti ti-brand-facebook me-3 fs-1 text-muted"></i>
                  <div className="flex-grow-1">
                    <h4 className="card-title mb-1" style={{ fontSize: '16px', lineHeight: '1' }}>Social Media Accounts</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '12px', fontWeight: '500', fontStyle: 'italic', lineHeight: '1' }}>Connect your social media accounts to increase your store's visibility</p>
                  </div>
            </div>
                </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="facebook" className="form-label fw-medium">
                      <i className="ti ti-brand-facebook text-primary me-2"></i>
                      Facebook
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-brand-facebook"></i>
                      </span>
                      <input
                        type="url"
                        id="facebook"
                        className="form-control"
                        value={socialAccounts.facebook}
                        onChange={(e) => handleSocialAccountChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/yourstore"
                      />
                </div>
              </div>
              
                  <div className="col-md-6 mb-3">
                    <label htmlFor="twitter" className="form-label fw-medium">
                      <i className="ti ti-brand-twitter text-info me-2"></i>
                      Twitter
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-brand-twitter"></i>
                      </span>
                      <input
                        type="url"
                        id="twitter"
                        className="form-control"
                        value={socialAccounts.twitter}
                        onChange={(e) => handleSocialAccountChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/yourstore"
                      />
                </div>
              </div>
              
                  <div className="col-md-6 mb-3">
                    <label htmlFor="instagram" className="form-label fw-medium">
                      <i className="ti ti-brand-instagram text-danger me-2"></i>
                      Instagram
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-brand-instagram"></i>
                      </span>
                      <input
                        type="url"
                        id="instagram"
                        className="form-control"
                        value={socialAccounts.instagram}
                        onChange={(e) => handleSocialAccountChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/yourstore"
                      />
                </div>
              </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="linkedin" className="form-label fw-medium">
                      <i className="ti ti-brand-linkedin text-primary me-2"></i>
                      LinkedIn
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-brand-linkedin"></i>
                      </span>
                      <input
                        type="url"
                        id="linkedin"
                        className="form-control"
                        value={socialAccounts.linkedin}
                        onChange={(e) => handleSocialAccountChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/company/yourstore"
                      />
            </div>
          </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="youtube" className="form-label fw-medium">
                      <i className="ti ti-brand-youtube text-danger me-2"></i>
                      YouTube
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-brand-youtube"></i>
                      </span>
                      <input
                        type="url"
                        id="youtube"
                        className="form-control"
                        value={socialAccounts.youtube}
                        onChange={(e) => handleSocialAccountChange('youtube', e.target.value)}
                        placeholder="https://youtube.com/c/yourstore"
                      />
                    </div>
            </div>
            
                  <div className="col-md-6 mb-3">
                    <label htmlFor="tiktok" className="form-label fw-medium">
                      <i className="ti ti-brand-tiktok text-dark me-2"></i>
                      TikTok
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-brand-tiktok"></i>
                      </span>
                    <input
                        type="url"
                        id="tiktok"
                        className="form-control"
                        value={socialAccounts.tiktok}
                        onChange={(e) => handleSocialAccountChange('tiktok', e.target.value)}
                        placeholder="https://tiktok.com/@yourstore"
                      />
                </div>
              </div>
              
                  <div className="col-md-6 mb-3">
                    <label htmlFor="whatsapp" className="form-label fw-medium">
                      <i className="ti ti-brand-whatsapp text-success me-2"></i>
                      WhatsApp
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-brand-whatsapp"></i>
                      </span>
                      <input
                        type="tel"
                        id="whatsapp"
                        className="form-control"
                        value={socialAccounts.whatsapp}
                        onChange={(e) => handleSocialAccountChange('whatsapp', e.target.value)}
                        placeholder="+966 50 123 4567"
                      />
                    </div>
                    <small className="text-muted">Enter your WhatsApp business number</small>
                </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="telegram" className="form-label fw-medium">
                      <i className="ti ti-brand-telegram text-info me-2"></i>
                      Telegram
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-brand-telegram"></i>
                      </span>
                    <input
                        type="text"
                        id="telegram"
                        className="form-control"
                        value={socialAccounts.telegram}
                        onChange={(e) => handleSocialAccountChange('telegram', e.target.value)}
                        placeholder="@yourstore"
                      />
                  </div>
                    <small className="text-muted">Enter your Telegram username</small>
                </div>
              </div>
                
                <div className="alert alert-info mt-3">
                  <i className="ti ti-info-circle me-2"></i>
                  <strong>Tip:</strong> Adding your social media accounts helps customers find and connect with your store on different platforms. This can increase your store's visibility and customer engagement.
            </div>
          </div>
        </div>

            {/* Error Display */}
            {saveError && (
              <div className="card mb-4">
                <div className="card-body">
                  <div className="alert alert-danger mb-0">
                    <i className="ti ti-alert-circle me-2"></i>
                    {saveError}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    disabled={isSaving}
                  >
                    <i className="ti ti-x me-2"></i>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-device-floppy me-2"></i>
                        Save Changes
                      </>
                    )}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GeneralSettings;





