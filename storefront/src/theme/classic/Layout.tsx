import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { CheckoutFixedBar } from './components/CheckoutFixedBar';
import { Skeleton } from './components/ui/skeleton';
import { ProductProvider } from './contexts/ProductContext';
import { useTenant } from '../../hooks/useTenant';
import { useTheme } from './hooks/useTheme';

interface LayoutProps {
  children?: React.ReactNode;
  theme?: {
    settings: {
      primary_color?: string;
      secondary_color?: string;
      font_family?: string;
      header_style?: string;
      footer_style?: string;
      logo_url?: string;
      store_name?: string;
      contact_email?: string;
      contact_phone?: string;
      social_links?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
      };
    };
  };
}

export const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();
  const tenant = useTenant();
  const { loading, error } = useTheme(tenant || '');
  
  // Check if current page should have custom layout
  const isLocationSelectionPage = location.pathname.endsWith('/location-selection');
  const isAddAddressPage = location.pathname.endsWith('/add-address');
  const isAccountPage = location.pathname.endsWith('/account');
  const isOrdersPage = location.pathname.endsWith('/orders') || location.pathname.includes('/orders/');
  const isAddressesPage = location.pathname.endsWith('/addresses');
  const isCartPage = location.pathname.endsWith('/cart');
  const isCheckoutPage = location.pathname.endsWith('/checkout');

  // Show loading state while fetching theme
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="px-4 py-6 space-y-6">
          {/* Hero Section Skeleton */}
          <Skeleton className="h-64 w-full rounded-2xl" />
          


          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state if theme fetch failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            The store "{tenant}" could not be found. Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  // For location selection and add address pages, render without header and bottom nav
  if (isLocationSelectionPage || isAddAddressPage) {
    return (
      <ProductProvider>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </ProductProvider>
    );
  }

  // For cart page, render with header and checkout button
  if (isCartPage) {
    return (
      <ProductProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pb-20 md:pb-0">
            <Outlet />
          </main>
          <CheckoutFixedBar />
        </div>
      </ProductProvider>
    );
  }

  // For checkout page, render with header only (no bottom nav or checkout button)
  if (isCheckoutPage) {
    return (
      <ProductProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </ProductProvider>
    );
  }

  // For account, orders, and addresses pages, render with header and bottom nav
  if (isAccountPage || isOrdersPage || isAddressesPage) {
    return (
      <ProductProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pb-16 md:pb-0">
            <Outlet />
          </main>
          <BottomNavigation />
        </div>
      </ProductProvider>
    );
  }

  // Default layout for all other pages
  return (
    <ProductProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </ProductProvider>
  );
};
