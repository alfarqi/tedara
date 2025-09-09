import React, { useState, useEffect, useCallback } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { storeService } from '../../services/storeService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const ShopNameStep: React.FC = () => {
  const { data, updateShopName, updateStoreLink, nextStep } = useOnboarding();
  const { token } = useAuth();
  const { showError } = useToast();
  const [shopName, setShopName] = useState(data.shopName);
  const [storeLink, setStoreLink] = useState(data.storeLink || '');
  const [isValid, setIsValid] = useState(false);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'idle' | 'available' | 'taken' | 'invalid'>('idle');
  const [domainMessage, setDomainMessage] = useState('');

  // Debounced domain availability check
  const checkDomainAvailability = useCallback(
    async (domain: string) => {
      if (!domain || domain.length < 3) {
        setDomainStatus('invalid');
        setDomainMessage('Domain must be at least 3 characters long');
        return;
      }

      // Check if domain contains only valid characters
      if (!/^[a-z0-9\-]+$/.test(domain)) {
        setDomainStatus('invalid');
        setDomainMessage('Domain can only contain lowercase letters, numbers, and hyphens');
        return;
      }

      setIsCheckingDomain(true);
      try {
        const response = await storeService.checkDomainAvailability(domain, token);
        if (response.data?.available) {
          setDomainStatus('available');
          setDomainMessage('✓ Domain is available');
        } else {
          setDomainStatus('taken');
          setDomainMessage('✗ Domain is already taken');
        }
      } catch (error) {
        setDomainStatus('invalid');
        setDomainMessage('Error checking domain availability');
      } finally {
        setIsCheckingDomain(false);
      }
    },
    [token]
  );

  // Debounce domain checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (storeLink.trim()) {
        checkDomainAvailability(storeLink.trim());
      } else {
        setDomainStatus('idle');
        setDomainMessage('');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [storeLink, checkDomainAvailability]);

  useEffect(() => {
    const isShopNameValid = shopName.trim().length >= 3;
    const isStoreLinkValid = storeLink.trim().length >= 3 && domainStatus === 'available';
    setIsValid(isShopNameValid && isStoreLinkValid);
  }, [shopName, storeLink, domainStatus]);

  // Sync storeLink when shopName changes
  useEffect(() => {
    if (shopName.trim().length > 0) {
      const sanitized = storeService.sanitizeDomain(shopName.trim());
      setStoreLink(sanitized);
    }
  }, [shopName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      // Save both shop name and store link
      updateShopName(shopName.trim());
      updateStoreLink(storeLink.trim());
      nextStep();
    }
  };

  return (
    <div className="step-content">
      {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="shopName" className="form-label fw-semibold">
                Shop Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control form-control-lg ${isValid ? 'is-valid' : shopName.length > 0 ? 'is-invalid' : ''}`}
                id="shopName"
                placeholder="Enter your shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                autoFocus
              />
              <div className="form-text">
                <i className="ti ti-info-circle me-1"></i>
                Use 3-50 characters. Avoid special characters except hyphens and apostrophes.
              </div>
            </div>

            {/* Store Link Field */}
            <div className="mb-4">
              <label htmlFor="storeLink" className="form-label fw-semibold">
                Store Link <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">http://www.tedara.com/</span>
                <input
                  type="text"
                  className={`form-control ${
                    domainStatus === 'available' ? 'is-valid' : 
                    domainStatus === 'taken' || domainStatus === 'invalid' ? 'is-invalid' : ''
                  }`}
                  id="storeLink"
                  placeholder="store-name"
                  value={storeLink}
                  onChange={(e) => setStoreLink(e.target.value)}
                />
                {isCheckingDomain && (
                  <span className="input-group-text">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Checking...</span>
                    </div>
                  </span>
                )}
              </div>
              <div className={`form-text ${
                domainStatus === 'available' ? 'text-success' : 
                domainStatus === 'taken' || domainStatus === 'invalid' ? 'text-danger' : 'text-muted'
              }`}>
                <i className={`ti ${
                  domainStatus === 'available' ? 'ti-check-circle' : 
                  domainStatus === 'taken' || domainStatus === 'invalid' ? 'ti-alert-circle' : 'ti-link'
                } me-1`}></i>
                {domainMessage || 'This will be your store\'s unique URL. Use 3-50 characters, lowercase letters, numbers, and hyphens only. No spaces allowed.'}
              </div>
              
              {/* Store URL Preview - Temporarily disabled */}
              {/* {storeLink.trim().length > 0 && (
                <div className="store-url-preview mt-2">
                  <small className="text-muted">Your store will be available at:</small>
                  <div className="url-display">
                    <span className="url-prefix">http://www.tedara.com/</span>
                    <span className="url-storename">{storeLink.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')}</span>
                  </div>
                </div>
              )} */}
              
              {shopName.length > 0 && !isValid && (
                <div className="invalid-feedback d-block">
                  Shop name must be at least 3 characters long.
                </div>
              )}
            </div>



            {/* Action Buttons */}
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!isValid}
              >
                Next
                <i className="ti ti-arrow-right ms-2"></i>
              </button>
            </div>
          </form>
    </div>
  );
};

export default ShopNameStep;
