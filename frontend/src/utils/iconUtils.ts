declare global {
  interface Window {
    lucide?: {
      createIcons: (options?: any) => void;
    };
  }
}

/**
 * Reinitializes Lucide icons in the current DOM
 * This is useful for React SPAs where DOM elements are recreated on navigation
 */
export const reinitializeIcons = () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  } else {
    console.warn('Lucide not available for icon reinitialization');
  }
};

/**
 * Reinitializes icons after a short delay to ensure DOM is ready
 */
export const reinitializeIconsDelayed = (delay: number = 100) => {
  setTimeout(() => {
    reinitializeIcons();
  }, delay);
};
