import React, { useState, useEffect } from 'react';
import { isMobile } from '../utils/mobileDebug';

interface EmergencyDebugInfoProps {
  tenant?: string;
  error?: string;
  loading?: boolean;
}

export const EmergencyDebugInfo: React.FC<EmergencyDebugInfoProps> = ({ 
  tenant, 
  error, 
  loading 
}) => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Collect debug information
    const info = {
      isMobile: isMobile(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      pathname: window.location.pathname,
      tenant,
      error,
      loading,
      timestamp: new Date().toISOString(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
    
    setDebugInfo(info);
    
    // Auto-show on mobile if there's an error
    if (isMobile() && error) {
      setIsVisible(true);
    }
  }, [tenant, error, loading]);

  // Only show on mobile devices
  if (!isMobile()) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold">📱 MOBILE DEBUG</span>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-white/20 px-2 py-1 rounded text-xs"
        >
          {isVisible ? 'HIDE' : 'SHOW'}
        </button>
      </div>
      
      {isVisible && (
        <div className="mt-2 bg-black/50 p-2 rounded text-xs space-y-1">
          <div><strong>Tenant:</strong> {tenant || 'NOT DETECTED'}</div>
          <div><strong>Error:</strong> {error || 'NONE'}</div>
          <div><strong>Loading:</strong> {loading ? 'YES' : 'NO'}</div>
          <div><strong>URL:</strong> {debugInfo.url}</div>
          <div><strong>Pathname:</strong> {debugInfo.pathname}</div>
          <div><strong>Screen:</strong> {debugInfo.screenWidth}x{debugInfo.screenHeight}</div>
          <div><strong>Viewport:</strong> {debugInfo.viewportWidth}x{debugInfo.viewportHeight}</div>
          <div><strong>Time:</strong> {debugInfo.timestamp}</div>
        </div>
      )}
    </div>
  );
};
