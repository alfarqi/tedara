import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const formPanel = (
    <div className="col-lg-12 d-flex flex-column justify-content-center align-items-center px-4 px-lg-5 min-vh-100">
      <div className="auth-form-card-with-image">
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
        <div className="auth-image-side">
          <img
            src="/assets/images/crowd.png"
            alt="Authentication illustration"
            className="auth-crowd-image"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="auth-container min-vh-100 d-flex">
      {formPanel}
    </div>
  );
};

export default AuthLayout;
