import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import type { CartItem, Branch } from '../types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  minimumOrder: number;
  selectedBranch: Branch | null;
}

export function OrderSummary({ 
  items, 
  subtotal, 
  deliveryFee, 
  minimumOrder, 
  selectedBranch 
}: OrderSummaryProps) {
  const total = subtotal + deliveryFee;
  const meetsMinimumOrder = subtotal >= minimumOrder;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Branch Info */}
        {selectedBranch && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium">{selectedBranch.name}</div>
            <div className="text-xs text-muted-foreground">
              {selectedBranch.address}
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(3)} BD</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{deliveryFee.toFixed(3)} BD</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base border-t pt-2">
            <span>Total</span>
            <span>{total.toFixed(3)} BD</span>
          </div>
        </div>

        {/* Minimum Order Warning */}
        {!meetsMinimumOrder && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <div className="font-medium">Minimum order not met</div>
              <div className="text-xs">
                Add {(minimumOrder - subtotal).toFixed(3)} BD more to proceed
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
