import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';

export function SelectedItems() {
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Order Summary</h3>
            <p className="text-sm text-gray-500">Review your selected items</p>
          </div>
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
                {item.product.price.toFixed(3)} BD × {item.quantity}
              </p>
              {item.notes && (
                <p className="text-xs text-gray-500 mt-1 bg-white px-2 py-1 rounded-lg">Note: {item.notes}</p>
              )}
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="font-bold text-gray-900">
                {(item.product.price * item.quantity).toFixed(3)} BD
              </p>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No items in your cart</p>
          </div>
        )}

        {/* Order Total */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Subtotal</span>
              <span className="font-bold text-lg text-gray-900">{subtotal.toFixed(3)} BD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
