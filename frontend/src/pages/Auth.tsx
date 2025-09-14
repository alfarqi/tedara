import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import TabbedAuth from '../components/auth/TabbedAuth';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Auth: React.FC = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, isAuthenticated, error, clearError } = useAuth();
  const { showError, showSuccess } = useToast();

  // Check if there's a tab parameter in URL (e.g., /auth?tab=register)
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  
  // Clear error when switching tabs
  const handleTabChange = (_tab: 'login' | 'register') => {
    clearError();
  };

  // Let ProtectedRoute handle all redirects - don't interfere here
  // This allows ProtectedRoute to properly handle new registration -> onboarding flow

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, []); // Remove clearError from dependencies

  const handleLogin = async (data: { email: string; password: string; remember: boolean }) => {
    setLoginLoading(true);
    clearError();
    
    try {
      await login({
        email: data.email,
        password: data.password,
        remember: data.remember,
      });
      
      // Show success toast
      showSuccess('Login Successful', 'Welcome back! Redirecting to dashboard...', 3000);
      
      // Add a small delay before navigation to ensure toast is visible
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      // Show error toast instead of console logging
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      showError('Login Failed', errorMessage, 5000);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (data: { 
    fullName: string; 
    email: string; 
    phone: string;
    password: string; 
    agreeToTerms: boolean;
  }) => {
    setRegisterLoading(true);
    
    clearError();
    
    try {
      const result = await register({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password,
        // You can add role selection here if needed
        role: 'store_owner', // Default role
      });
      
      if (result.success) {
        // Show success toast
        showSuccess('Registration Successful', 'Account created successfully!', 2000);
        
        // Set a flag to indicate this is a new registration (session-only)
        sessionStorage.setItem('new_registration', 'true');
        
        // ProtectedRoute will handle the redirect to onboarding automatically
        // No need for manual navigation here - let ProtectedRoute detect the flag and redirect
      } else {
        // Show error toast
        showError('Registration Failed', result.error || 'Registration failed', 5000);
      }
      
    } catch (error) {
      // Show error toast
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      
      showError('Registration Failed', errorMessage, 5000);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="" // Empty title since TabbedAuth handles its own titles
      subtitle=""
    >
      <TabbedAuth
        onLoginSubmit={handleLogin}
        onRegisterSubmit={handleRegister}
        loginLoading={loginLoading}
        registerLoading={registerLoading}
        defaultTab={defaultTab}
        error={error}
        onTabChange={handleTabChange}
      />
    </AuthLayout>
  );
};

export default Auth;
