import React, { useState, useRef } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const LogoUploadStep: React.FC = () => {
  const { data, updateLogo, previousStep, nextStep } = useOnboarding();
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, or SVG)');
      return false;
    }

    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB');
      return false;
    }

    setUploadError('');
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      updateLogo(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LogoUploadStep: handleSubmit called, moving to next step...');
    // Move to processing step instead of directly completing onboarding
    nextStep();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="step-content">
      {/* Form */}
      <form onSubmit={handleSubmit}>
            {/* Logo Upload Area */}
            <div className="mb-4">
                            
              <div className="text-center">
                {data.logoPreview ? (
                  // Logo Preview
                  <div className="logo-upload-circle has-logo" onClick={handleBrowseClick}>
                    <img 
                      src={data.logoPreview} 
                      alt="Logo preview" 
                      className="logo-image"
                    />
                    <div className="logo-overlay">
                      <i className="ti ti-edit"></i>
                      <span>Change Logo</span>
                    </div>
                  </div>
                ) : (
                  // Upload Area
                  <div
                    className="logo-upload-circle"
                    onClick={handleBrowseClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="upload-placeholder-circle">
                      <i className="ti ti-photo upload-icon-circle"></i>
                      <p className="upload-text">Click to upload</p>
                    </div>
                  </div>
                )}
                
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="d-none"
                  accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                  onChange={handleFileInputChange}
                />
                
                <div className="upload-info mt-3">
                  <small className="text-muted">
                    Supported formats: JPEG, PNG, SVG (Max: 5MB)
                  </small>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="alert alert-danger mt-3" role="alert">
                <i className="ti ti-alert-circle me-2"></i>
                {uploadError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg flex-fill"
                onClick={previousStep}
              >
                <i className="ti ti-arrow-left me-2"></i>
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg flex-fill"
                style={{ 
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
              >
                {data.logo ? 'Complete Setup' : 'Skip & Complete'}
                <i className="ti ti-arrow-right ms-2"></i>
              </button>
            </div>
          </form>
    </div>
  );
};

export default LogoUploadStep;
