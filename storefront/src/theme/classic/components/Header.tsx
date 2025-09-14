import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Package, ShoppingBag, User, MapPin, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useCartStore } from '../stores/cartStore';
import { useTenant } from '../../../hooks/useTenant';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const tenant = useTenant();
  const { getItemCount } = useCartStore();
  
  const itemCount = getItemCount();
  const isProductPage = location.pathname.includes('/product/');
  const isCartPage = location.pathname.endsWith('/cart');
  const isCheckoutPage = location.pathname.endsWith('/checkout');
  const isAccountPage = location.pathname.endsWith('/account');
  const isOrdersPage = location.pathname.endsWith('/orders') || location.pathname.includes('/orders/');
  const isAddressesPage = location.pathname.endsWith('/addresses');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInstagramClick = () => {
    // Open Instagram account in new tab
    window.open('https://instagram.com/yummylicious', '_blank');
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleMyOrders = () => {
    setIsMenuOpen(false);
    navigate(`/${tenant}/orders`);
  };

  const handleMyCart = () => {
    setIsMenuOpen(false);
    navigate(`/${tenant}/cart`);
  };

  const handleSavedAddresses = () => {
    setIsMenuOpen(false);
    navigate(`/${tenant}/addresses`);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    // Add logout logic here
    console.log('Logout clicked');
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate(`/${tenant}/login`);
  };

  const handleRegister = () => {
    setIsMenuOpen(false);
    navigate(`/${tenant}/register`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Menu, Back Button, or Cart Back Button */}
            <div className="flex items-center">
              {isAccountPage || isOrdersPage || isAddressesPage ? (
                <div className="h-10 w-10"></div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isProductPage || isCartPage || isCheckoutPage ? handleBackClick : handleMenuClick}
                  className="relative h-10 w-10"
                >
                  {isProductPage || isCartPage || isCheckoutPage ? (
                    <ArrowLeft className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>

            {/* Center - Logo or Page Title */}
            {isCartPage ? (
              <div className="flex items-center">
                <h1 className="font-bold text-lg md:text-xl">My Cart</h1>
              </div>
            ) : isCheckoutPage ? (
              <div className="flex items-center">
                <h1 className="font-bold text-lg md:text-xl">Checkout</h1>
              </div>
            ) : isAccountPage ? (
              <div className="flex items-center">
                <h1 className="font-bold text-lg md:text-xl">My Account</h1>
              </div>
            ) : isOrdersPage ? (
              <div className="flex items-center">
                <h1 className="font-bold text-lg md:text-xl">My Orders</h1>
              </div>
            ) : isAddressesPage ? (
              <div className="flex items-center">
                <h1 className="font-bold text-lg md:text-xl">Saved Addresses</h1>
              </div>
            ) : (
              <div className={`flex items-center transition-opacity duration-300 ${
                isScrolled ? 'opacity-100' : 'opacity-0'
              }`}>
                <Link to={`/${tenant}/`} className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">Y</span>
                  </div>
                  <span className="font-bold text-lg md:text-xl">Yummylicious</span>
                </Link>
              </div>
            )}

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Arabic Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleInstagramClick}
                className="relative"
              >
                <span className="text-sm font-bold">AR</span>
              </Button>

              {/* Cart Button - Hidden on cart, checkout, account, orders, and addresses pages */}
              {!isCartPage && !isCheckoutPage && !isAccountPage && !isOrdersPage && !isAddressesPage && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/${tenant}/cart`)}
                  className="relative"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {itemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Side Menu */}
        <div className={`absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-end h-16 px-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* User Section */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center space-x-3 mb-4">
              {/* User Avatar */}
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">Welcome!</p>
                <p className="text-xs text-muted-foreground">Sign in to your account</p>
              </div>
            </div>
            
            {/* Login/Register Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={handleRegister}
              >
                Register
              </Button>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="p-4">
            <div className="space-y-2">
              {/* My Orders */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={handleMyOrders}
              >
                <Package className="h-5 w-5 mr-3" />
                My Orders
              </Button>
              
              {/* My Cart */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={handleMyCart}
              >
                <ShoppingBag className="h-5 w-5 mr-3" />
                My Cart
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* Saved Addresses */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={handleSavedAddresses}
              >
                <MapPin className="h-5 w-5 mr-3" />
                Saved Addresses
              </Button>

              {/* Logout */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
