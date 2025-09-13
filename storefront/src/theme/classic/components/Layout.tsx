import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { ProductFixedBar } from './ProductFixedBar';
import { CheckoutFixedBar } from './CheckoutFixedBar';
import { ProductProvider } from '../contexts/ProductContext';

export function Layout() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');
  const isCartPage = location.pathname === '/cart';
  const isCheckoutPage = location.pathname === '/checkout';
  const isLocationSelectionPage = location.pathname === '/location-selection';
  const isAccountPage = location.pathname === '/account';
  const isOrdersPage = location.pathname === '/orders';
  const isAddressesPage = location.pathname === '/addresses';
  const isAddAddressPage = location.pathname === '/add-address';

  if (isProductPage) {
    return (
      <ProductProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pb-20">
            <Outlet />
          </main>
          <ProductFixedBar />
        </div>
      </ProductProvider>
    );
  }

  if (isCartPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-20">
          <Outlet />
        </main>
        <CheckoutFixedBar />
      </div>
    );
  }

  if (isCheckoutPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  if (isLocationSelectionPage || isAddAddressPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

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
