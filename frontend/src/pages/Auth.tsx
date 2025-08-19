import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import TabbedAuth from '../components/auth/TabbedAuth';

const Auth: React.FC = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if there's a tab parameter in URL (e.g., /auth?tab=register)
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const handleLogin = async (data: { email: string; password: string; remember: boolean }) => {
    setLoginLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to authenticate the user
      console.log('Login data:', data);
      
      // For demonstration, we'll just navigate to dashboard
      // In a real app, you'd validate credentials and set authentication state
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (show toast, etc.)
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    phone: string;
    password: string; 
    agreeToTerms: boolean;
  }) => {
    setRegisterLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to register the user
      console.log('Register data:', data);
      
      // For demonstration, we'll just navigate to dashboard
      // In a real app, you might want to:
      // 1. Show success message
      // 2. Send verification email
      // 3. Navigate to verification page or auto-login
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error (show toast, etc.)
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
      />
    </AuthLayout>
  );
};

export default Auth;
