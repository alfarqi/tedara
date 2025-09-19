import { BrowserRouter, Routes, Route, useParams, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/theme/classic/components/ui/toaster';
import { getTheme } from '@/theme/registry';
import { ErrorBoundary } from '@/theme/classic/components/ErrorBoundary';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';

// Get the classic theme components
const classicTheme = getTheme('classic');
const Layout = classicTheme.Layout;
const Home = classicTheme.pages.home;
const Product = classicTheme.pages.product;
const Cart = classicTheme.pages.cart;
const Checkout = classicTheme.pages.checkout;
const LocationSelection = classicTheme.pages.locationSelection;
const Orders = classicTheme.pages.orders;
const Account = classicTheme.pages.account;
const Addresses = classicTheme.pages.addresses;
const AddAddress = classicTheme.pages.addAddress;
const Category = classicTheme.pages.category;
const Order = classicTheme.pages.order;
const Contact = classicTheme.pages.contact;
const Auth = classicTheme.pages.auth;
const OrderConfirmation = classicTheme.pages.orderConfirmation;

// Component to handle redirects for common routes without tenant
function RedirectHandler() {
  const location = useLocation();
  const pathname = location.pathname;
  
  // List of common routes that should redirect to a default tenant
  const commonRoutes = ['/orders', '/cart', '/checkout', '/account', '/addresses', '/contact'];
  
  if (commonRoutes.includes(pathname)) {
    // Redirect to a default tenant (you can change this to any tenant)
    return <Navigate to="/ahlam" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
        <p className="text-sm text-gray-500">
          Please access your store using: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5173/your-store-handle</code>
        </p>
      </div>
    </div>
  );
}

// Tenant-aware wrapper component
function TenantRoutes() {
  const { tenant } = useParams<{ tenant: string }>();
  
  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Tedara Storefront</h1>
          <p className="text-gray-600 mb-4">Please access your store using the format:</p>
          <code className="bg-gray-100 px-3 py-1 rounded">http://localhost:5173/your-store-handle</code>
        </div>
      </div>
    );
  }

  return (
    <CustomerAuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="category/:categorySlug" element={<Category />} />
            <Route path="product/:categorySlug/:productSlug" element={<Product />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="location-selection" element={<LocationSelection />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<Order />} />
            <Route path="account" element={<Account />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="add-address" element={<AddAddress />} />
          <Route path="contact" element={<Contact />} />
          <Route path="auth" element={<Auth />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
        </Route>
        </Routes>
        <Toaster />
      </div>
    </CustomerAuthProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Root route - show welcome message */}
          <Route path="/" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Tedara Storefront</h1>
                <p className="text-gray-600 mb-4">Please access your store using the format:</p>
                <code className="bg-gray-100 px-3 py-1 rounded">http://localhost:5173/your-store-handle</code>
                <div className="mt-6">
                  <p className="text-sm text-gray-500">Example URLs:</p>
                  <ul className="text-sm text-gray-500 mt-2">
                    <li>• http://localhost:5173/feras</li>
                    <li>• http://localhost:5173/faisan</li>
                    <li>• http://localhost:5173/demo-store</li>
                  </ul>
                </div>
              </div>
            </div>
          } />
          
          {/* Redirect common routes without tenant to default tenant */}
          <Route path="/orders" element={<RedirectHandler />} />
          <Route path="/cart" element={<RedirectHandler />} />
          <Route path="/checkout" element={<RedirectHandler />} />
          <Route path="/account" element={<RedirectHandler />} />
          <Route path="/addresses" element={<RedirectHandler />} />
          <Route path="/contact" element={<RedirectHandler />} />
          
          {/* Tenant-specific routes */}
          <Route path="/:tenant/*" element={<TenantRoutes />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;