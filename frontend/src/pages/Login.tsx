import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string; remember: boolean }) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to authenticate the user
      console.log('Login data:', data);
      
      // For demonstration, we'll just navigate to dashboard
      // In a real app, you'd validate credentials and set authentication state
      navigate('/');
      
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Sign In" 
      subtitle="Welcome back! Enter your credentials to access your account"
    >
      <LoginForm onSubmit={handleLogin} loading={loading} />
    </AuthLayout>
  );
};

export default Login;
