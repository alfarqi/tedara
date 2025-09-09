import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = '/auth'
}) => {
  const location = useLocation();
  
  // Safely get auth context with error handling
  let isAuthenticated, user, isLoading;
  try {
    const authContext = useAuth();
    isAuthenticated = authContext.isAuthenticated;
    user = authContext.user;
    isLoading = authContext.isLoading;
  } catch (error) {
    isAuthenticated = false;
    user = null;
    isLoading = false;
  }
  
  // Removed excessive logging to prevent performance issues

  // Show loading spinner while checking authentication
  // But not on auth pages during registration/login operations
  if (isLoading && location.pathname !== '/auth') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('Redirecting to login: requireAuth=true, isAuthenticated=false');
    // Redirect to login page with return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but shouldn't be (e.g., on login page)
  if (!requireAuth && isAuthenticated) {
    // Check if this is a new registration
    const isNewRegistration = sessionStorage.getItem('new_registration');
    console.log('ProtectedRoute: Auth page check - isNewRegistration:', isNewRegistration);
    if (isNewRegistration) {
      // Don't clear the flag here - let the onboarding route handle it
      console.log('ProtectedRoute: New registration detected, redirecting to onboarding');
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Special handling for onboarding route - check if user is new registration
  if (requireAuth && isAuthenticated && location.pathname === '/onboarding') {
    const isNewRegistration = sessionStorage.getItem('new_registration');
    console.log('ProtectedRoute: Onboarding route check - isNewRegistration:', isNewRegistration);
    if (isNewRegistration) {
      // Allow access to onboarding for new registrations
      console.log('ProtectedRoute: Allowing access to onboarding for new registration');
      // Don't clear the flag here - let onboarding completion handle it
      // This prevents race conditions with multiple ProtectedRoute calls
      return <>{children}</>;
    }
    // If not a new registration, redirect to dashboard
    console.log('ProtectedRoute: Not a new registration, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Check role-based access
  if (requireAuth && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect to unauthorized page or dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

