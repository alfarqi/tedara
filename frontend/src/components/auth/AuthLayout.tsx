import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  swapSides?: boolean; // When true, purple panel goes on right
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, swapSides = false }) => {
  const imagePanel = (
    <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center position-relative auth-image-panel">
      <div className="auth-image-container">
        <img 
          src="/assets/images/geeks.png" 
          alt="Authentication illustration" 
          className="auth-geeks-image"
        />
      </div>
    </div>
  );

  const formPanel = (
    <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center px-4 px-lg-5 min-vh-100">
      <div className="auth-form-card">
        <div className="auth-form-container w-100">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-dark mb-2">{title}</h1>
            {subtitle && (
              <p className="text-muted fs-6 mb-0">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="auth-container min-vh-100 d-flex">
      {swapSides ? (
        <>
          {imagePanel}
          {formPanel}
        </>
      ) : (
        <>
          {formPanel}
          {imagePanel}
        </>
      )}
    </div>
  );
};

export default AuthLayout;
