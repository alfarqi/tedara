// Utility function to get correct asset paths for storefront
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Return relative path that works with the storefront base path
  return `./${cleanPath}`;
};

// Common asset paths for storefront
export const ASSETS = {
  // Default banner image
  DEFAULT_BANNER: getAssetPath('/pexels-fotios-photos-1279330.jpg'),
  
  // Other common assets can be added here as needed
};
