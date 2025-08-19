import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string; remember: boolean }) => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

      {/* Remember Me and Forgot Password */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={handleInputChange}
            style={{ backgroundColor: formData.remember ? '#7754f6' : '#fff' }}
          />
          <label className="form-check-label text-muted fs-6" htmlFor="remember">
            Remember me
          </label>
        </div>
        <Link 
          to="/forgot-password" 
          className="auth-link fs-6"
        >
          Forgot Password?
        </Link>
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
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>




    </form>
  );
};

export default LoginForm;
