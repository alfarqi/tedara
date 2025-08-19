import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    phone: string;
    password: string; 
    agreeToTerms: boolean;
  }) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to register the user
      console.log('Register data:', data);
      
      // For demonstration, we'll just navigate to login
      // In a real app, you might want to:
      // 1. Show success message
      // 2. Send verification email
      // 3. Navigate to verification page or auto-login
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create New Account" 
      subtitle="Join Salla platform and discover the world of e-commerce"
    >
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </AuthLayout>
  );
};

export default Register;
