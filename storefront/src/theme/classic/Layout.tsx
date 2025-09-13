import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';

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
  
  // Check if current page should have custom layout
  const isLocationSelectionPage = location.pathname === '/location-selection';
  const isAddAddressPage = location.pathname === '/add-address';
  const isAccountPage = location.pathname === '/account';
  const isOrdersPage = location.pathname === '/orders';
  const isAddressesPage = location.pathname === '/addresses';

  // For location selection and add address pages, render without header and bottom nav
  if (isLocationSelectionPage || isAddAddressPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  // For account, orders, and addresses pages, render with header and bottom nav
  if (isAccountPage || isOrdersPage || isAddressesPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    );
  }

  // Default layout for all other pages
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};
