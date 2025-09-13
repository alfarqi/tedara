import { Clock, Star } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { useProductContext } from '../contexts/ProductContext';
import type { Product } from '../types';

interface ProductInfoPanelProps {
  product: Product;
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const { notes, setNotes } = useProductContext();

  return (
    <div className="p-4 space-y-4">
      {/* Product Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            {product.featured && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {product.preparationTime}
        </div>
        <div className="flex items-center">
          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
          {product.calories} calories
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between py-3 border-t border-gray-100">
        <span className="text-lg font-semibold text-gray-900">Price</span>
        <span className="text-2xl font-bold text-purple-600">
          {product.price.toFixed(3)} BD
        </span>
      </div>

      {/* Special Instructions */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Special Requests</h3>
          <p className="text-xs text-gray-500 mb-3">Any special requests or modifications?</p>
        </div>
        <Textarea
          placeholder="e.g., No onions, extra spicy, well done..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
