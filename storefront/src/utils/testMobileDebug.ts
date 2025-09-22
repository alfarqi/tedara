// Test script for mobile debugging
import { logMobileDebug, logMobileError, isMobile, getMobileInfo } from './mobileDebug';

export const testMobileDebug = () => {
  console.log('🧪 Testing Mobile Debug System...');
  
  // Test mobile detection
  logMobileDebug('Mobile device detection', { isMobile: isMobile() });
  
  // Test device info
  const deviceInfo = getMobileInfo();
  logMobileDebug('Device information', deviceInfo);
  
  // Test different log levels
  logMobileDebug('This is an info message', { test: 'data' });
  logMobileError(new Error('This is a test error'), 'Test context');
  
  // Test tenant detection
  logMobileDebug('Testing tenant detection', { 
    currentUrl: window.location.href,
    pathname: window.location.pathname 
  });
  
  // Test API calls
  logMobileDebug('Testing API configuration', {
    baseUrl: window.location.origin,
    isProduction: window.location.hostname !== 'localhost'
  });
  
  console.log('✅ Mobile debug test completed!');
};

// Auto-run test if on mobile
if (isMobile()) {
  console.log('📱 Mobile device detected - running debug test...');
  setTimeout(testMobileDebug, 1000); // Run after 1 second
}
