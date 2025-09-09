import React, { useEffect, useState } from 'react';
import { useUserStore } from '../hooks/useUserStore';

const MobilePreview: React.FC = () => {
  const { store } = useUserStore();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mobile-preview-page">
      {/* Mobile Status Bar */}
      <div className="mobile-status-bar">
        <span className="mobile-time">{currentTime || '9:41'}</span>
        <div className="mobile-indicators">
          <i className="ti ti-signal-4g"></i>
          <i className="ti ti-wifi"></i>
          <i className="ti ti-battery-3"></i>
        </div>
      </div>

      {/* Store Header */}
      <div className="mobile-store-header">
        <div className="store-logo">
          {store?.logo ? (
            <img src={store.logo} alt="Store Logo" className="logo-image" />
          ) : (
            <div className="logo-placeholder">
              <i className="ti ti-store"></i>
            </div>
          )}
        </div>
        <h1 className="store-name">{store?.name || 'Your Store Name'}</h1>
        <p className="store-description">{store?.description || 'Add your store description to see it here...'}</p>
      </div>

      {/* Featured Products */}
      <div className="featured-products">
        <h3>Products</h3>
        <div className="products-grid">
          <div className="product-placeholder">
            <div className="product-image">
              <i className="ti ti-package"></i>
            </div>
            <p>Your Products</p>
          </div>
          <div className="product-placeholder">
            <div className="product-image">
              <i className="ti ti-package"></i>
            </div>
            <p>Will Show Here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;
