import { Button } from '../components/ui/button';
import { useCartStore } from '../stores/cartStore';
import { useFulfillmentStore } from '../stores/fulfillmentStore';
import { useCheckoutContext } from '../contexts/CheckoutContext';

export function PlaceOrderFixedBar() {
  const { getSubtotal } = useCartStore();
  const { getDeliveryFee } = useFulfillmentStore();
  const { handlePlaceOrder, canProceedToPayment } = useCheckoutContext();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Price Summary */}
          <div className="flex flex-col">
            <div className="text-sm text-muted-foreground">Subtotal: {subtotal.toFixed(3)} BD</div>
            <div className="text-lg font-bold text-purple-600">
              Total: {total.toFixed(3)} BD
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            onClick={handlePlaceOrder}
            disabled={!canProceedToPayment}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
            size="lg"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
