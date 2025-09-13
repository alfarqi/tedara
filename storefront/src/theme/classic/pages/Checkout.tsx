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

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCartStore();
  
  // State for checkout form
  const [deliveryTime, setDeliveryTime] = useState<string>('');
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('Capital');
  
  // Mock customer data - in real app this would come from user profile
  const customerInfo = {
    name: 'John Doe',
    phone: '+973 1234 5678',
    email: 'john.doe@example.com'
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
    // Navigate to customer details editing
    console.log('Edit details clicked');
  };

  const handlePlaceOrder = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    // Generate mock order ID
    const orderId = `ORD-${Date.now()}`;
    
    // Clear cart and show success
    clearCart();
    alert(`Order placed successfully! Order ID: ${orderId}`);
    
    // Navigate to confirmation or home
    navigate('/');
  };

  // Determine if user can proceed to payment
  const canProceedToPayment = !!(deliveryTime && selectedPaymentMethod);

  if (items.length === 0) {
    navigate('/cart');
    return null;
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
