import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { GuestCheckoutForm } from '../components/auth/GuestCheckoutForm';
import { useCustomerAuth } from '../../../contexts/CustomerAuthContext';
import { useTenant } from '../../../hooks/useTenant';
import { useTheme } from '../hooks/useTheme';

type AuthMode = 'login' | 'register' | 'guest';

export function Auth() {
  const [mode, setMode] = useState<AuthMode>('guest');
  const navigate = useNavigate();
  const location = useLocation();
  const { customer } = useCustomerAuth();
  const tenant = useTenant();
  const { store, loading: themeLoading } = useTheme(tenant || '');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (customer && tenant) {
      navigate(`/${tenant}/checkout`);
    }
  }, [customer, navigate, tenant]);

  // Show loading state while fetching theme
  if (themeLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    if (tenant) {
      navigate(`/${tenant}/checkout`);
    }
  };

  const handleGuestSuccess = (guestCustomer: any) => {
    // Store guest customer info in session storage for checkout
    sessionStorage.setItem('guest_customer', JSON.stringify(guestCustomer));
    if (tenant) {
      navigate(`/${tenant}/checkout`);
    }
  };

  const handleClose = () => {
    // Check if user came from side menu
    const fromSideMenu = location.state?.fromSideMenu;
    if (fromSideMenu) {
      // From side menu, go to home and open menu
      navigate(`/${tenant}/`, { state: { openMenu: true } });
    } else {
      // From other sources, go to cart (where user came from)
      navigate(`/${tenant}/cart`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center pt-2 pb-12 px-4 sm:px-6 lg:px-8 z-[100]">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute top-4 right-4 h-10 w-10 z-[101]"
      >
        <X className="h-5 w-5" />
      </Button>
      
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setMode('register')}
          />
        )}
        
        {mode === 'register' && (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode('login')}
            storeId={store?.id}
          />
        )}
        
        {mode === 'guest' && (
          <GuestCheckoutForm
            onSuccess={handleGuestSuccess}
            onSwitchToLogin={() => setMode('login')}
            onSwitchToRegister={() => setMode('register')}
          />
        )}
        </div>
    </div>
  );
}
