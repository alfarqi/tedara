import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { EmptyState } from '../components/EmptyState';
import { useCartStore } from '../stores/cartStore';
import { useFulfillmentStore } from '../stores/fulfillmentStore';
import { useTenant } from '../../../hooks/useTenant';

export function Cart() {
  const { items, clearCart, getSubtotal, updateQuantity, removeItem } = useCartStore();
  const { getDeliveryFee, getMinimumOrder, selectedBranch } = useFulfillmentStore();
  const tenant = useTenant();
  
  const deliveryFee = getDeliveryFee();
  const minimumOrder = getMinimumOrder();
  const subtotal = getSubtotal();
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <EmptyState
              icon={<ShoppingBag className="h-12 w-12" />}
              title="Your cart is empty"
              description="Add some delicious items to get started with your order."
              action={{
                label: "Browse Menu",
                onClick: () => window.location.href = `/${tenant}/`
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 space-y-4">
        
        {/* Cart Items Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cart Items</h3>
                  <p className="text-sm text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="h-8 px-3 rounded-lg border-gray-300 hover:bg-gray-100 text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                {/* Item Image */}
                <div className="w-16 h-16 bg-white rounded-2xl flex-shrink-0 shadow-sm overflow-hidden">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{item.product.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.product.price.toFixed(3)} BD each
                  </p>
                  
                  {/* Customizations */}
                  {Object.keys(item.customizations).length > 0 && (
                    <div className="mt-1">
                      {Object.entries(item.customizations).map(([key, value]) => (
                        <div key={key} className="text-xs text-gray-500">
                          {key}: {Array.isArray(value) ? value.join(', ') : value}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <div className="text-xs text-gray-500 mt-1 bg-white px-2 py-1 rounded-lg">
                      Note: {item.notes}
                    </div>
                  )}
                </div>

                {/* Quantity Controls and Price */}
                <div className="flex flex-col items-end space-y-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="quantity-btn h-[25px] w-[25px] md:h-[30px] md:w-[30px] rounded-full border-gray-300 hover:bg-gray-100 min-h-[25px] min-w-[25px] md:min-h-[30px] md:min-w-[30px]"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="quantity-btn h-[25px] w-[25px] md:h-[30px] md:w-[30px] rounded-full border-gray-300 hover:bg-gray-100 min-h-[25px] min-w-[25px] md:min-h-[30px] md:min-w-[30px]"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Price and Remove */}
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {(item.product.price * item.quantity).toFixed(3)} BD
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Order Summary</h3>
                <p className="text-sm text-gray-500">Review your order details</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Branch Info */}
            {selectedBranch && (
              <div className="p-3 bg-gray-50 rounded-2xl">
                <div className="text-sm font-medium text-gray-900">{selectedBranch.name}</div>
                <div className="text-xs text-gray-500">
                  {selectedBranch.address}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{subtotal.toFixed(3)} BD</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">{deliveryFee.toFixed(3)} BD</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-purple-600">{total.toFixed(3)} BD</span>
              </div>
            </div>

            {/* Minimum Order Warning */}
            {subtotal < minimumOrder && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <div className="text-sm text-yellow-800">
                  <div className="font-medium">Minimum order not met</div>
                  <div className="text-xs">
                    Add {(minimumOrder - subtotal).toFixed(3)} BD more to proceed
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
