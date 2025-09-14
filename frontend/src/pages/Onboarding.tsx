import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../contexts/OnboardingContext';

import ShopNameStep from '../components/onboarding/ShopNameStep';
import BusinessTypeStep from '../components/onboarding/BusinessTypeStep';
import LogoUploadStep from '../components/onboarding/LogoUploadStep';
import ProcessingStep from '../components/onboarding/ProcessingStep';

const Onboarding: React.FC = () => {
  const { data, error } = useOnboarding();
  // const navigate = useNavigate();

  const renderCurrentStep = () => {
    switch (data.step) {
      case 1:
        return <ShopNameStep />;
      case 2:
        return <BusinessTypeStep />;
      case 3:
        return <LogoUploadStep />;
      case 4:
        return <ProcessingStep />;
      default:
        return <ShopNameStep />;
    }
  };

  return (
    <div className="onboarding-page min-vh-100">
      {/* Main Content */}
      <div className="onboarding-content-container">
        {/* Left Panel - Dynamic Content Based on Step */}
        <div className="onboarding-left-panel">
          <div className="brand-info">
            {data.step === 1 && (
              <>
                <h2 className="brand-title">STORE NAME</h2>
                <p className="brand-description">
                  Choose a memorable name that represents your brand. You can always change this later.
                </p>
              </>
            )}
            {data.step === 2 && (
              <>
                <h2 className="brand-title">BUSINESS TYPE</h2>
                <p className="brand-description">
                  Select the category that best describes your products or services.
                </p>
              </>
            )}
            {data.step === 3 && (
              <>
                <h2 className="brand-title">STORE LOGO</h2>
                <p className="brand-description">
                  Add your brand logo to personalize your store and build trust with customers.
                </p>
              </>
            )}
            {data.step === 4 && (
              <>
                <h2 className="brand-title">CREATING STORE</h2>
                <p className="brand-description">
                  We're setting up your store with all the information you've provided. This will only take a moment.
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Right Panel - Form Content */}
        <div className="onboarding-right-panel">
          {/* Current Step Content */}
          <div className="onboarding-content">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="ti ti-alert-circle me-2"></i>
                {error}
              </div>
            )}
            
            {renderCurrentStep()}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Onboarding;
