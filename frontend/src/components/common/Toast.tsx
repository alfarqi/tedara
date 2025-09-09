import React, { useEffect, useState } from 'react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'ti ti-check-circle';
      case 'error':
        return 'ti ti-alert-circle';
      case 'warning':
        return 'ti ti-alert-triangle';
      case 'info':
        return 'ti ti-info-circle';
      default:
        return 'ti ti-info-circle';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning';
      case 'info':
        return 'bg-info';
      default:
        return 'bg-info';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-white';
      case 'error':
        return 'text-white';
      case 'warning':
        return 'text-dark';
      case 'info':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  return (
    <div 
      className={`toast show ${isVisible ? 'fade-in' : 'fade-out'}`}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: 'none',
        borderRadius: '8px',
        animation: isVisible ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-in'
      }}
    >
      <div className={`toast-header ${getBgColor()} ${getTextColor()}`}>
        <i className={`${getIcon()} me-2`}></i>
        <strong className="me-auto">{title}</strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default Toast;


