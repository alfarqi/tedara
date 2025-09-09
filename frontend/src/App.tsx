import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import AddOrder from './pages/AddOrder';
import OrderDetails from './pages/OrderDetails';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import QuestionsRatings from './pages/QuestionsRatings';
import Pages from './pages/Pages';
import ThemeDesign from './pages/ThemeDesign';
import CustomerDetails from './pages/CustomerDetails';
import InvoiceDetails from './pages/InvoiceDetails';
import StoreSettings from './pages/StoreSettings';
import GeneralSettings from './pages/settings/GeneralSettings';
import StoreInformation from './pages/settings/StoreInformation';
import PaymentMethods from './pages/settings/PaymentMethods';
import ShippingDelivery from './pages/settings/ShippingDelivery';
import Notifications from './pages/settings/Notifications';
import Security from './pages/settings/Security';
import ProductSettings from './pages/settings/Products';
import InvoiceSettings from './pages/settings/InvoiceSettings';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import Auth from './pages/Auth';
import MobilePreview from './pages/MobilePreview';

// Admin imports
import AdminDashboard from './pages/admin/AdminDashboard';
import Stores from './pages/admin/Stores';
import StoreDetails from './pages/admin/StoreDetails';
import Users from './pages/admin/Users';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import SystemSettings from './pages/admin/SystemSettings';
import AdminRoles from './pages/admin/AdminRoles';
import AuditLogs from './pages/admin/AuditLogs';
import Domains from './pages/admin/Domains';
import Support from './pages/admin/Support';

import { useRouteIconInitialization } from './hooks/useRouteIconInitialization';
import './styles/vendors.css';
import './styles/layout.css';
import './styles/rtl.css';
import './styles/topbar-fix.css';
import './styles/sidebar.css';
import './styles/auth.css';
import './styles/admin.css';
import './styles/onboarding.css';
import './styles/mobile-preview.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <OnboardingProvider>
          <LanguageProvider>
            <Router>
              <AppRoutes />
              <IconInitializer />
            </Router>
          </LanguageProvider>
        </OnboardingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

// Component to initialize icons within provider context
function IconInitializer() {
  useRouteIconInitialization();
  return null;
}

// Wrapper component to apply admin styling
function AdminWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-page">
      {children}
    </div>
  );
}

// Separate component to use React Router hooks
function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/auth" element={
        <ProtectedRoute requireAuth={false}>
          <Auth />
        </ProtectedRoute>
      } />
      <Route path="/login" element={
        <ProtectedRoute requireAuth={false}>
          <Login />
        </ProtectedRoute>
      } />
      <Route path="/register" element={
        <ProtectedRoute requireAuth={false}>
          <Register />
        </ProtectedRoute>
      } />
      
      {/* Onboarding Route */}
      <Route path="/onboarding" element={
        <ProtectedRoute requireAuth={true}>
          <Onboarding />
        </ProtectedRoute>
      } />
      
      {/* Mobile Preview Route */}
      <Route path="/mobile-preview" element={<MobilePreview />} />
      
      
      {/* Protected Dashboard Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Auth />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/orders/new" element={
        <ProtectedRoute>
          <AddOrder />
        </ProtectedRoute>
      } />
      <Route path="/orders/:orderId" element={
        <ProtectedRoute>
          <OrderDetails />
        </ProtectedRoute>
      } />
      <Route path="/customers" element={
        <ProtectedRoute>
          <Customers />
        </ProtectedRoute>
      } />
      <Route path="/customers/:id" element={
        <ProtectedRoute>
          <CustomerDetails />
        </ProtectedRoute>
      } />
      <Route path="/invoice/:id" element={<InvoiceDetails />} />
      <Route path="/public/invoice/:id" element={<InvoiceDetails />} />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/questions-ratings" element={
        <ProtectedRoute>
          <QuestionsRatings />
        </ProtectedRoute>
      } />
      <Route path="/pages" element={
        <ProtectedRoute>
          <Pages />
        </ProtectedRoute>
      } />
      <Route path="/theme-design" element={
        <ProtectedRoute>
          <ThemeDesign />
        </ProtectedRoute>
      } />
      <Route path="/store-settings" element={
        <ProtectedRoute>
          <StoreSettings />
        </ProtectedRoute>
      } />
      <Route path="/store-settings/general" element={
        <ProtectedRoute>
          <GeneralSettings />
        </ProtectedRoute>
      } />
      <Route path="/store-settings/store" element={
        <ProtectedRoute>
          <StoreInformation />
        </ProtectedRoute>
      } />
      <Route path="/store-settings/payment" element={
        <ProtectedRoute>
          <PaymentMethods />
        </ProtectedRoute>
      } />
      <Route path="/store-settings/shipping" element={
        <ProtectedRoute>
          <ShippingDelivery />
        </ProtectedRoute>
      } />
      <Route path="/store-settings/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
      <Route path="/store-settings/security" element={
        <ProtectedRoute>
          <Security />
        </ProtectedRoute>
      } />
      <Route path="/store-settings/products" element={
        <ProtectedRoute>
          <ProductSettings />
        </ProtectedRoute>
      } />
      <Route path="/store-settings/invoice" element={
        <ProtectedRoute>
          <InvoiceSettings />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes - Super Admin Only */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><AdminDashboard /></AdminWrapper>
        </ProtectedRoute>
      } />
      <Route path="/admin/stores" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><Stores /></AdminWrapper>
        </ProtectedRoute>
      } />
      <Route path="/admin/stores/details" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><StoreDetails /></AdminWrapper>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><Users /></AdminWrapper>
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><AdminAnalytics /></AdminWrapper>
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><SystemSettings /></AdminWrapper>
        </ProtectedRoute>
      } />
      <Route path="/admin/roles" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><AdminRoles /></AdminWrapper>
        </ProtectedRoute>
      } />
      <Route path="/admin/audit-logs" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><AuditLogs /></AdminWrapper>
        </ProtectedRoute>
      } />
      <Route path="/admin/domains" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><Domains /></AdminWrapper>
        </ProtectedRoute>
      } />
      <Route path="/admin/support" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminWrapper><Support /></AdminWrapper>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
