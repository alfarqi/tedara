import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for logout functionality
 * @returns logout function
 */
export const useLogout = () => {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return handleLogout;
};

/**
 * Utility function to check if user is authenticated
 * @param token - The authentication token
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (token: string | null): boolean => {
  return !!token;
};

/**
 * Utility function to get user role
 * @param user - The user object
 * @returns user role or 'guest' if no user
 */
export const getUserRole = (user: any): string => {
  return user?.role || 'guest';
};

/**
 * Utility function to check if user has specific role
 * @param user - The user object
 * @param role - The role to check
 * @returns boolean indicating if user has the role
 */
export const hasRole = (user: any, role: string): boolean => {
  return getUserRole(user) === role;
};

/**
 * Utility function to check if user has any of the specified roles
 * @param user - The user object
 * @param roles - Array of roles to check
 * @returns boolean indicating if user has any of the roles
 */
export const hasAnyRole = (user: any, roles: string[]): boolean => {
  const userRole = getUserRole(user);
  return roles.includes(userRole);
};

/**
 * Utility function to get user display name
 * @param user - The user object
 * @returns user display name or 'Guest'
 */
export const getUserDisplayName = (user: any): string => {
  return user?.name || user?.email || 'Guest';
};

/**
 * Utility function to get user avatar
 * @param user - The user object
 * @param defaultAvatar - Default avatar URL
 * @returns user avatar URL or default
 */
export const getUserAvatar = (user: any, defaultAvatar: string = '/assets/images/users/default-avatar.jpg'): string => {
  return user?.avatar || defaultAvatar;
};




























