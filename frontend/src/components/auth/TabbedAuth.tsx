import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface TabbedAuthProps {
  onLoginSubmit: (data: { email: string; password: string; remember: boolean }) => void;
  onRegisterSubmit: (data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    phone: string;
    password: string; 
    agreeToTerms: boolean;
  }) => void;
  loginLoading?: boolean;
  registerLoading?: boolean;
  defaultTab?: 'login' | 'register';
}

const TabbedAuth: React.FC<TabbedAuthProps> = ({ 
  onLoginSubmit, 
  onRegisterSubmit, 
  loginLoading = false, 
  registerLoading = false,
  defaultTab = 'login'
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);

  return (
    <div className="w-100">
      {/* Tab Navigation */}
      <div className="auth-tabs mb-4">
        <nav className="nav nav-pills nav-justified auth-nav-pills">
          <button
            className={`nav-link auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
            type="button"
          >
            <i className="ti ti-login me-2"></i>
            Sign In
          </button>
          <button
            className={`nav-link auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
            type="button"
          >
            <i className="ti ti-user-plus me-2"></i>
            Create Account
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="auth-tab-content">
        {activeTab === 'login' ? (
          <div className="auth-tab-pane">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold text-dark mb-2">Welcome Back!</h1>
              <p className="text-muted fs-6 mb-0">Enter your credentials to access your account</p>
            </div>
            <LoginForm onSubmit={onLoginSubmit} loading={loginLoading} />
            <div className="text-center mt-3">
              <span className="text-muted fs-6">Don't have an account? </span>
              <button 
                type="button"
                className="btn btn-link p-0 auth-link fw-medium"
                onClick={() => setActiveTab('register')}
              >
                Create one here
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-tab-pane">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold text-dark mb-2">Create New Account</h1>
              <p className="text-muted fs-6 mb-0">Join Salla platform and discover the world of e-commerce</p>
            </div>
            <RegisterForm onSubmit={onRegisterSubmit} loading={registerLoading} />
            <div className="text-center mt-3">
              <span className="text-muted fs-6">Already have an account? </span>
              <button 
                type="button"
                className="btn btn-link p-0 auth-link fw-medium"
                onClick={() => setActiveTab('login')}
              >
                Sign in here
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabbedAuth;
