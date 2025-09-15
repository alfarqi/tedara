import React from 'react';
import { useLogout } from '../../utils/authUtils';

interface LogoutButtonProps {
  variant?: 'button' | 'link' | 'icon';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'button',
  className = '',
  children,
  showIcon = true,
  size = 'md'
}) => {
  const handleLogout = useLogout();

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const iconElement = showIcon && (
    <i className="ti ti-logout-2 me-2 fs-17 align-middle"></i>
  );

  if (variant === 'link') {
    return (
      <button
        onClick={handleLogout}
        className={`dropdown-item text-danger fw-semibold border-0 bg-transparent w-100 text-start ${className}`}
      >
        {iconElement}
        <span className="align-middle">{children || 'Log Out'}</span>
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        className={`btn btn-link text-danger p-0 ${className}`}
        title="Logout"
      >
        <i className="ti ti-logout-2 fs-18"></i>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`btn btn-danger ${sizeClasses[size]} ${className}`}
    >
      {iconElement}
      {children || 'Logout'}
    </button>
  );
};

export default LogoutButton;


















