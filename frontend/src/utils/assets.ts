// Utility function to get correct asset paths for admin dashboard
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Return relative path that works with the /admin base path
  return `./${cleanPath}`;
};

// Common asset paths
export const ASSETS = {
  LOGO: getAssetPath('/assets/images/logo.png'),
  LOGO_SM: getAssetPath('/assets/images/logo-sm.png'),
  LOGO_BLACK: getAssetPath('/assets/images/logo-black.png'),
  CROWD: getAssetPath('/assets/images/crowd.png'),
  USER_1: getAssetPath('/assets/images/users/user-1.jpg'),
  USER_2: getAssetPath('/assets/images/users/user-2.jpg'),
  USER_3: getAssetPath('/assets/images/users/user-3.jpg'),
  USER_4: getAssetPath('/assets/images/users/user-4.jpg'),
  USER_5: getAssetPath('/assets/images/users/user-5.jpg'),
  USER_6: getAssetPath('/assets/images/users/user-6.jpg'),
  SELLER_3: getAssetPath('/assets/images/sellers/3.png'),
  SELLER_4: getAssetPath('/assets/images/sellers/4.png'),
  SELLER_5: getAssetPath('/assets/images/sellers/5.png'),
  SELLER_6: getAssetPath('/assets/images/sellers/6.png'),
  SELLER_7: getAssetPath('/assets/images/sellers/7.png'),
  SELLER_8: getAssetPath('/assets/images/sellers/8.png'),
  PRODUCT_1: getAssetPath('/assets/images/products/1.png'),
  PRODUCT_2: getAssetPath('/assets/images/products/2.png'),
  PRODUCT_3: getAssetPath('/assets/images/products/3.png'),
  PRODUCT_4: getAssetPath('/assets/images/products/4.png'),
  PRODUCT_5: getAssetPath('/assets/images/products/5.png'),
  FLAG_US: getAssetPath('/assets/images/flags/us.svg'),
  FLAG_GB: getAssetPath('/assets/images/flags/gb.svg'),
  FLAG_CA: getAssetPath('/assets/images/flags/ca.svg'),
  FLAG_AU: getAssetPath('/assets/images/flags/au.svg'),
  FLAG_DE: getAssetPath('/assets/images/flags/de.svg'),
  FLAG_FR: getAssetPath('/assets/images/flags/fr.svg'),
};
