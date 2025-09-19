import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useCartStore } from '../stores/cartStore';
import { useFulfillmentStore } from '../stores/fulfillmentStore';
import { useTenant } from '../../../hooks/useTenant';

export function CheckoutFixedBar() {
  const navigate = useNavigate();
  const tenant = useTenant();
  const { items, getSubtotal } = useCartStore();
  const { getDeliveryFee } = useFulfillmentStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    navigate(`/${tenant}/auth`);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Total Cost */}
          <div className="flex flex-col">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-lg font-bold text-primary">
              {total.toFixed(3)} BD
            </div>
          </div>

          {/* Proceed to Checkout Button */}
          <Button
            onClick={handleProceedToCheckout}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
            size="lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
