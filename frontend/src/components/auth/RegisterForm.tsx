import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface RegisterFormProps {
  onSubmit: (data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    phone: string;
    password: string; 
    agreeToTerms: boolean;
  }) => void;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+966|966|0)?[5][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    

    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
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

  return (
    <form onSubmit={handleSubmit} className="w-100">
      {/* Name Fields */}
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="firstName" className="form-label fw-medium text-dark">
            First Name
          </label>
          <input
            type="text"
            className={`form-control auth-input ${errors.firstName ? 'is-invalid' : ''}`}
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name"

          />
          {errors.firstName && (
            <div className="invalid-feedback d-block">
              <small className="text-danger">{errors.firstName}</small>
            </div>
          )}
        </div>
        <div className="col-6">
          <label htmlFor="lastName" className="form-label fw-medium text-dark">
            Last Name
          </label>
          <input
            type="text"
            className={`form-control auth-input ${errors.lastName ? 'is-invalid' : ''}`}
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name"

          />
          {errors.lastName && (
            <div className="invalid-feedback d-block">
              <small className="text-danger">{errors.lastName}</small>
            </div>
          )}
        </div>
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
        <div className="input-group">
          <span className="input-group-text auth-input-group-text">
            +966
          </span>
          <input
            type="tel"
            className={`form-control auth-input ${errors.phone ? 'is-invalid' : ''}`}
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"

          />
        </div>
        {errors.phone && (
          <div className="invalid-feedback d-block">
            <small className="text-danger">{errors.phone}</small>
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label fw-medium text-dark">
          Password
        </label>
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
