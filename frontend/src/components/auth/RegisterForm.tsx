import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PhoneInput from '../common/PhoneInput';
import PasswordStrength from '../common/PasswordStrength';

interface RegisterFormProps {
  onSubmit: (data: { 
    fullName: string; 
    email: string; 
    phone: string;
    password: string; 
    agreeToTerms: boolean;
  }) => void;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Debug state changes
  useEffect(() => {
    console.log('🟡 RegisterForm: formData changed:', formData);
  }, [formData]);

  useEffect(() => {
    console.log('🟡 RegisterForm: errors changed:', errors);
  }, [errors]);

  useEffect(() => {
    console.log('🟡 RegisterForm: loading prop changed:', loading);
    // Prevent component unmounting due to loading state changes
    return () => {
      console.log('🟡 RegisterForm: Loading effect cleanup');
    };
  }, [loading]);

  // Add comprehensive debugging and page refresh detection
  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log('🔴 RegisterForm: Component mounted/re-mounted at', timestamp);
    console.log('🔴 RegisterForm: Window location:', window.location.href);
    console.log('🔴 RegisterForm: Document readyState:', document.readyState);
    
    // Add beforeunload listener to detect page refresh attempts
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log('🚨 RegisterForm: Page is about to refresh/unload!');
      console.log('🚨 RegisterForm: Event:', e);
      console.log('🚨 RegisterForm: Stack trace:', new Error().stack);
      
      // Don't prevent the event, just log it for debugging
      // The issue is likely not a real page refresh but React dev mode behavior
    };

    // Add unload listener to detect actual page unload
    const handleUnload = (e: Event) => {
      console.log('🚨 RegisterForm: Page is unloading!');
      console.log('🚨 RegisterForm: Unload event:', e);
    };

    // Add popstate listener to detect back/forward navigation
    const handlePopState = (e: PopStateEvent) => {
      console.log('🚨 RegisterForm: PopState event (back/forward navigation):', e);
    };

    // Add hashchange listener
    const handleHashChange = (e: HashChangeEvent) => {
      console.log('🚨 RegisterForm: Hash change event:', e);
    };

    // Add error listeners to catch any unhandled errors
    const handleError = (e: ErrorEvent) => {
      console.log('🚨 RegisterForm: Unhandled JavaScript error:', e);
      console.log('🚨 RegisterForm: Error message:', e.message);
      console.log('🚨 RegisterForm: Error filename:', e.filename);
      console.log('🚨 RegisterForm: Error line:', e.lineno);
      console.log('🚨 RegisterForm: Error stack:', e.error?.stack);
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      console.log('🚨 RegisterForm: Unhandled promise rejection:', e);
      console.log('🚨 RegisterForm: Rejection reason:', e.reason);
      console.log('🚨 RegisterForm: Promise:', e.promise);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.log('🔴 RegisterForm: Component unmounting at', new Date().toISOString());
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const validateAndSubmit = () => {
    console.log('🟡 RegisterForm: validateAndSubmit called');
    console.log('🟡 RegisterForm: Current form data:', formData);
    console.log('🟡 RegisterForm: Loading state:', loading);
    console.log('🟡 RegisterForm: Window location before validation:', window.location.href);
    
    // Basic validation
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+\d{1,4}\d{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    console.log('🟡 RegisterForm: Validation errors found:', newErrors);
    console.log('🟡 RegisterForm: Setting errors in state');
    setErrors(newErrors);
    console.log('🟡 RegisterForm: Errors set, checking if validation passed');

    if (Object.keys(newErrors).length === 0) {
      console.log('🟢 RegisterForm: Validation passed, calling onSubmit');
      console.log('🟢 RegisterForm: Window location before onSubmit:', window.location.href);
      
      try {
        // Wrap onSubmit in try-catch to prevent any errors from causing page refresh
        console.log('🟢 RegisterForm: About to call onSubmit with data:', formData);
        onSubmit(formData);
        console.log('🟢 RegisterForm: onSubmit called successfully');
        console.log('🟢 RegisterForm: Window location after onSubmit:', window.location.href);
      } catch (error) {
        console.error('🔥 RegisterForm: Error in onSubmit:', error);
        console.error('🔥 RegisterForm: Error stack:', error instanceof Error ? error.stack : 'No stack');
        console.log('🔥 RegisterForm: Window location after error:', window.location.href);
        // Don't re-throw the error to prevent page refresh
      }
    } else {
      console.log('🔴 RegisterForm: Validation failed with errors:', newErrors);
      console.log('🔴 RegisterForm: Window location after validation failure:', window.location.href);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('RegisterForm: Enter key pressed in input field');
      e.preventDefault();
      e.stopPropagation();
      
      // Only submit if not loading
      if (!loading) {
        console.log('RegisterForm: Triggering form submission via Enter key');
        handleFormSubmit(e as any);
      } else {
        console.log('RegisterForm: Ignoring Enter key - form is loading');
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log('🔵 RegisterForm: handleFormSubmit called');
    console.log('🔵 RegisterForm: Event type:', e.type);
    console.log('🔵 RegisterForm: Event target:', e.target);
    console.log('🔵 RegisterForm: Event current target:', e.currentTarget);
    console.log('🔵 RegisterForm: Window location before event prevention:', window.location.href);
    console.log('🔵 RegisterForm: Document readyState:', document.readyState);
    
    // Aggressively prevent all form submission behavior
    console.log('🔵 RegisterForm: Calling e.preventDefault()');
    e.preventDefault();
    console.log('🔵 RegisterForm: Calling e.stopPropagation()');
    e.stopPropagation();
    
    if ('stopImmediatePropagation' in e) {
      console.log('🔵 RegisterForm: Calling e.stopImmediatePropagation()');
      (e as any).stopImmediatePropagation();
    }
    
    // Prevent any potential navigation
    if (e.target) {
      console.log('🔵 RegisterForm: Clearing form action and method');
      (e.target as HTMLFormElement).action = '';
      (e.target as HTMLFormElement).method = '';
    }
    
    console.log('🔵 RegisterForm: All event prevention applied');
    console.log('🔵 RegisterForm: Window location after event prevention:', window.location.href);
    
    // Call validation in a try-catch to prevent any errors from bubbling
    try {
      console.log('🔵 RegisterForm: About to call validateAndSubmit');
      validateAndSubmit();
      console.log('🔵 RegisterForm: validateAndSubmit completed');
    } catch (error) {
      console.error('🔥 RegisterForm: Error in validateAndSubmit:', error);
      console.error('🔥 RegisterForm: Error stack:', error instanceof Error ? error.stack : 'No stack');
      console.log('🔥 RegisterForm: Window location after validateAndSubmit error:', window.location.href);
    }
    
    console.log('🔵 RegisterForm: handleFormSubmit returning false');
    console.log('🔵 RegisterForm: Window location at end of handleFormSubmit:', window.location.href);
    return false;
  };

  return (
    <form 
      onSubmit={handleFormSubmit} 
      className="w-100" 
      noValidate
      action=""
      method=""
      onReset={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('RegisterForm: Form reset prevented');
        return false;
      }}
    >
      {/* Full Name Field */}
      <div className="mb-3">
        <label htmlFor="fullName" className="form-label fw-medium text-dark">
          Full Name
        </label>
        <div className="input-group">
          <span className="input-group-text auth-input-group-text border-end-0">
            <i className="ti ti-user fs-5"></i>
          </span>
          <input
            type="text"
            className={`form-control border-start-0 auth-input ${errors.fullName ? 'is-invalid' : ''}`}
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your full name"
          />
        </div>
        {errors.fullName && (
          <div className="invalid-feedback d-block">
            <small className="text-danger">{errors.fullName}</small>
          </div>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-medium text-dark">
          Email Address
        </label>
        <div className="input-group">
          <span className="input-group-text auth-input-group-text border-end-0">
            <i className="ti ti-mail fs-5"></i>
          </span>
          <input
            type="email"
            className={`form-control border-start-0 auth-input ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your email address"
          />
        </div>
        {errors.email && (
          <div className="invalid-feedback d-block">
            <small className="text-danger">{errors.email}</small>
          </div>
        )}
      </div>

      {/* Phone Field */}
      <div className="mb-3">
        <label htmlFor="phone" className="form-label fw-medium text-dark">
          Phone Number
        </label>
        <PhoneInput
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          error={errors.phone}
          placeholder="Enter your phone number"
        />
      </div>

      {/* Password Field */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label fw-medium text-dark">
          Password
        </label>
        
        {/* Password Strength Indicator */}
        <PasswordStrength password={formData.password} />
        
        <div className="input-group">
          <span className="input-group-text auth-input-group-text border-end-0">
            <i className="ti ti-lock fs-5"></i>
          </span>
          <input
            type="password"
            className={`form-control border-start-0 auth-input ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your password"
          />
        </div>
        {errors.password && (
          <div className="invalid-feedback d-block">
            <small className="text-danger">{errors.password}</small>
          </div>
        )}
      </div>



      {/* Terms and Conditions */}
      <div className="mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            style={{ backgroundColor: formData.agreeToTerms ? '#7754f6' : '#fff' }}
          />
          <label className="form-check-label text-muted fs-6" htmlFor="agreeToTerms">
            I agree to the{' '}
            <Link to="/terms" className="auth-link">
              Terms and Conditions
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="auth-link">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.agreeToTerms && (
          <div className="invalid-feedback d-block">
            <small className="text-danger">{errors.agreeToTerms}</small>
          </div>
        )}
      </div>



      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn auth-btn-primary w-100"
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>




    </form>
  );
};

export default RegisterForm;
