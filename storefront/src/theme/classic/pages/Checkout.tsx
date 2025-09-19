import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { CheckoutProvider } from '../contexts/CheckoutContext';
import { PlaceOrderFixedBar } from '../components/PlaceOrderFixedBar';
import { DeliveryTimeModal } from '../components/checkout/DeliveryTimeModal';
import { DeliveryMap } from '../components/checkout/DeliveryMap';
import { CustomerDetails } from '../components/checkout/CustomerDetails';
import { SelectedItems } from '../components/checkout/SelectedItems';
import { PaymentMethod } from '../components/checkout/PaymentMethod';
import { useCartStore } from '../stores/cartStore';
import { useCustomerAuth } from '../../../contexts/CustomerAuthContext';
import { useTenant } from '../../../hooks/useTenant';

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart, clearInvalidProducts } = useCartStore();
  const { customer, isLoading } = useCustomerAuth();
  const tenant = useTenant();
  
  // State for checkout form
  const [deliveryTime, setDeliveryTime] = useState<string>('');
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('Capital');
  
  // Get customer info from authentication or guest checkout
  const [guestCustomer, setGuestCustomer] = useState<any>(null);
  
  // Check for guest customer in session storage
  useEffect(() => {
    const storedGuestCustomer = sessionStorage.getItem('guest_customer');
    if (storedGuestCustomer) {
      setGuestCustomer(JSON.parse(storedGuestCustomer));
    }
  }, []);

  // Redirect to auth if no customer and no guest customer
  useEffect(() => {
    if (!isLoading && !customer && !guestCustomer) {
      const tenant = window.location.pathname.split('/')[1];
      if (tenant) {
        navigate(`/${tenant}/auth`);
      }
    }
  }, [isLoading, customer, guestCustomer, navigate]);

  // Clear invalid products when component mounts
  useEffect(() => {
    clearInvalidProducts();
  }, [clearInvalidProducts]);

  // Determine customer info to display
  const customerInfo = customer || guestCustomer || {
    name: '',
    phone: '',
    email: ''
  };
  
  // Update delivery address based on selected location
  const deliveryAddress = `123 Main Street, ${selectedLocation}, Bahrain`;

  // Handle location selection from location selection page
  useEffect(() => {
    if (location.state?.selectedLocation) {
      setSelectedLocation(location.state.selectedLocation);
    }
  }, [location.state]);

  const handleTimeSelect = (time: string) => {
    setDeliveryTime(time);
  };

  const handleEditAddress = () => {
    // Navigate to address selection/editing
    console.log('Edit address clicked');
  };

  const handleEditDetails = () => {
    // Navigate to authentication page to update details
    const tenant = window.location.pathname.split('/')[1];
    if (tenant) {
      navigate(`/${tenant}/auth`);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    if (!tenant) {
      alert('Store not found. Please access the storefront using the correct URL format: http://localhost:5173/your-store-handle');
      return;
    }

    try {
      // Debug customer data
      console.log('Customer data:', customer);
      console.log('Guest customer data:', guestCustomer);
      console.log('Customer info:', customerInfo);
      
      // Debug cart items and product IDs
      console.log('Cart items:', items);
      console.log('Product IDs being sent:', items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_data: item.product
      })));
      
      // Clear invalid products from cart
      clearInvalidProducts();
      
      // Validate that all products have valid IDs
      const invalidProducts = items.filter(item => !item.product.id || item.product.id <= 0);
      if (invalidProducts.length > 0) {
        console.error('Invalid products found:', invalidProducts);
        alert('Some products in your cart have invalid data. Please remove them and try again.');
        return;
      }
      
      // Check if cart is empty
      if (items.length === 0) {
        alert('Your cart is empty. Please add some items before placing an order.');
        return;
      }
      
      // Prepare order data - use guest customer if no authenticated customer
      // Check if customer exists and has valid ID
      const isAuthenticatedCustomer = customer && customer.id && customer.id > 0;
      
      // If we have a customer but no valid ID, treat as guest
      if (customer && (!customer.id || customer.id <= 0)) {
        console.warn('Customer object exists but has invalid ID, treating as guest');
      }
      const orderData = {
        customer_id: isAuthenticatedCustomer ? customer.id : null,
        guest_customer: !isAuthenticatedCustomer ? {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone
        } : null,
        payment_method: selectedPaymentMethod,
        delivery_time: deliveryTime,
        delivery_address: deliveryAddress,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        delivery_fee: 2.000, // Fixed delivery fee
        total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) + 2.000
      };

      // Create order via API
      console.log('Creating order with data:', orderData);
      const response = await fetch(`http://localhost:8000/api/storefront/${tenant}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customer && { 'Authorization': `Bearer ${localStorage.getItem('customer_token')}` })
        },
        body: JSON.stringify(orderData)
      });

      console.log('Order creation response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Order creation failed:', errorData);
        
        // Show specific validation errors if available
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          alert(`Validation failed:\n${errorMessages.join('\n')}`);
        } else {
          alert(`Failed to create order: ${errorData.message || 'Unknown error'}`);
        }
        throw new Error(`Failed to create order: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Order creation successful:', result);
      
      // Navigate to confirmation page with order data FIRST
      console.log('Navigating to order confirmation page with data:', result.order);
      navigate(`/${tenant}/order-confirmation`, { 
        state: { orderData: result.order } 
      });
      
      // Clear cart AFTER navigation
      setTimeout(() => {
        clearCart();
      }, 100);
      
    } catch (error) {
      console.error('Order creation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to place order: ${errorMessage}. Please try again.`);
    }
  };

  // Determine if user can proceed to payment
  const canProceedToPayment = !!(deliveryTime && selectedPaymentMethod);

  if (items.length === 0) {
    const tenant = window.location.pathname.split('/')[1];
    if (tenant) {
      navigate(`/${tenant}/cart`);
    }
    return null;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated and no guest customer
  if (!customer && !guestCustomer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in or continue as guest to proceed with checkout.</p>
          <Button onClick={() => {
            const tenant = window.location.pathname.split('/')[1];
            if (tenant) {
              navigate(`/${tenant}/auth`);
            }
          }}>
            Go to Authentication
          </Button>
        </div>
      </div>
    );
  }

  return (
    <CheckoutProvider 
      handlePlaceOrder={handlePlaceOrder}
      canProceedToPayment={canProceedToPayment}
    >
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="px-4 py-6 space-y-4">
          
          {/* Delivery Time Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery Time</h3>
                  <p className="text-sm text-gray-500">When would you like your order delivered?</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <Button 
                variant="outline" 
                onClick={() => setIsTimeModalOpen(true)}
                className="w-full justify-start h-12 text-left border-gray-200 hover:border-purple-300 hover:bg-purple-50"
              >
                <Clock className="h-4 w-4 mr-3 text-gray-400" />
                {deliveryTime || 'Select delivery time'}
              </Button>
            </div>
          </div>

          {/* Map and Address Section */}
          <DeliveryMap 
            address={deliveryAddress}
            onEditAddress={handleEditAddress}
          />

          {/* Customer Details Section */}
          <CustomerDetails 
            customerInfo={customerInfo}
            onEditDetails={handleEditDetails}
          />

          {/* Selected Items Section */}
          <SelectedItems />

          {/* Payment Method Section */}
          <PaymentMethod 
            selectedMethod={selectedPaymentMethod}
            onSelectMethod={setSelectedPaymentMethod}
          />
        </div>
      </div>
      
      {/* Delivery Time Modal */}
      <DeliveryTimeModal 
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onSelectTime={(time) => handleTimeSelect(time)}
      />
      
      {/* Fixed Bottom Bar for Mobile */}
      <PlaceOrderFixedBar />
    </CheckoutProvider>
  );
}
