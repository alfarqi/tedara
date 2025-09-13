import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '../hooks/use-toast';
import { useProductContext } from '../contexts/ProductContext';
import type { Product } from '../types';
import productsData from '../data/products.json';

export function ProductFixedBar() {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { notes } = useProductContext();
  const { addItem } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    const foundProduct = productsData.find(
      prod => prod.categorySlug === categorySlug && prod.slug === productSlug
    );
    setProduct(foundProduct || null);
  }, [categorySlug, productSlug]);

  const handleAddToCart = () => {
    if (product) {
      // Add multiple quantities with notes
      for (let i = 0; i < quantity; i++) {
        addItem(product, {}, notes);
      }
      
      toast({
        title: "Added to cart",
        description: `${quantity}x ${product.name} has been added to your cart.`,
        className: "bg-purple-600 text-white border-purple-700",
      });
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Quantity Selector - Left Side */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-full text-xs border-gray-300 hover:bg-gray-100"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="text-sm font-medium w-6 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-full text-xs border-gray-300 hover:bg-gray-100"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>

          {/* Add to Cart Button - Right Side */}
          <Button
            onClick={handleAddToCart}
            className="flex items-center justify-between px-4 py-3 text-sm flex-1 rounded-xl bg-primary hover:bg-primary/90"
            disabled={!product.available}
          >
            <span className="font-medium">Add to Cart</span>
            <div className="text-xs opacity-90 font-medium">
              {(product.price * quantity).toFixed(3)} BD
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
