import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import AddOrder from './pages/AddOrder';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import QuestionsRatings from './pages/QuestionsRatings';
import Pages from './pages/Pages';
import CustomerDetails from './pages/CustomerDetails';
import InvoiceDetails from './pages/InvoiceDetails';
import StoreSettings from './pages/StoreSettings';
import Login from './pages/Login';
import Register from './pages/Register';
import Auth from './pages/Auth';

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

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppRoutes />
      </Router>
    </LanguageProvider>
  );
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
  // Initialize icons on route changes
  useRouteIconInitialization();
  
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Dashboard Routes */}
      <Route path="/" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/new" element={<AddOrder />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customers/:id" element={<CustomerDetails />} />
      <Route path="/invoice/:id" element={<InvoiceDetails />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/questions-ratings" element={<QuestionsRatings />} />
      <Route path="/pages" element={<Pages />} />
      <Route path="/store-settings" element={<StoreSettings />} />
      
      {/* Admin Routes - Wrapped with AdminWrapper */}
      <Route path="/admin" element={<AdminWrapper><AdminDashboard /></AdminWrapper>} />
      <Route path="/admin/stores" element={<AdminWrapper><Stores /></AdminWrapper>} />
      <Route path="/admin/stores/details" element={<AdminWrapper><StoreDetails /></AdminWrapper>} />
      <Route path="/admin/users" element={<AdminWrapper><Users /></AdminWrapper>} />
      <Route path="/admin/analytics" element={<AdminWrapper><AdminAnalytics /></AdminWrapper>} />
      <Route path="/admin/settings" element={<AdminWrapper><SystemSettings /></AdminWrapper>} />
      <Route path="/admin/roles" element={<AdminWrapper><AdminRoles /></AdminWrapper>} />
      <Route path="/admin/audit-logs" element={<AdminWrapper><AuditLogs /></AdminWrapper>} />
      <Route path="/admin/domains" element={<AdminWrapper><Domains /></AdminWrapper>} />
      <Route path="/admin/support" element={<AdminWrapper><Support /></AdminWrapper>} />
    </Routes>
  );
}

export default App;
