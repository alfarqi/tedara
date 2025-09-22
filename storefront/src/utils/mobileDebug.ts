// Mobile debugging utilities
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const logMobileDebug = (message: string, data?: any) => {
  if (isMobile()) {
    console.log(`📱 [MOBILE DEBUG] ${message}`, data || '');
  } else {
    console.log(`🖥️ [DESKTOP DEBUG] ${message}`, data || '');
  }
};

export const getMobileInfo = () => {
  return {
    userAgent: navigator.userAgent,
    isMobile: isMobile(),
    url: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    timestamp: new Date().toISOString(),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
};

export const logMobileError = (error: Error, context?: string) => {
  const mobileInfo = getMobileInfo();
  console.error(`📱 [MOBILE ERROR] ${context || 'Unknown context'}:`, {
    error: error.message,
    stack: error.stack,
    mobileInfo,
  });
};
