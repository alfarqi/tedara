import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCartStore } from '../stores/cartStore';
import type { CartItem } from '../types';

interface LineItemProps {
  item: CartItem;
}

export function LineItem({ item }: LineItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      {/* Product Image */}
      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
        {item.product.images[0] && (
          <img 
            src={item.product.images[0]} 
            alt={item.product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2">
          {item.product.name}
        </h3>
        <p className="text-muted-foreground text-xs">
          {item.product.price.toFixed(3)} BD each
        </p>
        
        {/* Customizations */}
        {Object.keys(item.customizations).length > 0 && (
          <div className="mt-1">
            {Object.entries(item.customizations).map(([key, value]) => (
              <div key={key} className="text-xs text-muted-foreground">
                {key}: {Array.isArray(value) ? value.join(', ') : value}
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="text-xs text-muted-foreground mt-1">
            Note: {item.notes}
          </div>
        )}
      </div>

      {/* Quantity and Price */}
      <div className="flex flex-col items-end space-y-2">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleQuantityChange(item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-6 text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <div className="text-sm font-medium">
            {(item.price * item.quantity).toFixed(3)} BD
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
