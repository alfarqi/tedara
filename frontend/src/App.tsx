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

import { useRouteIconInitialization } from './hooks/useRouteIconInitialization';
import './styles/vendors.css';
import './styles/layout.css';
import './styles/rtl.css';
import './styles/topbar-fix.css';
import './styles/sidebar.css';
import './styles/auth.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppRoutes />
      </Router>
    </LanguageProvider>
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
                    <Route path="/" element={<Dashboard />} />
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
      
    </Routes>
  );
}

export default App;
