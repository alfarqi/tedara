import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '../hooks/use-toast';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      className: "bg-purple-600 text-white border-purple-700",
    });
  };

  return (
    <Card className="group transition-all duration-200 overflow-hidden">
      <Link to={`/product/${product.categorySlug}/${product.slug}`}>
        <div className="aspect-w-16 aspect-h-12 bg-muted rounded-t-lg overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-56 bg-muted flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Product Name */}
          <CardTitle className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
            <Link to={`/product/${product.categorySlug}/${product.slug}`}>
              {product.name}
            </Link>
          </CardTitle>
          
          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">
              {product.price.toFixed(3)} BD
            </span>
            <Button 
              onClick={handleAddToCart}
              variant="outline"
              className="add-to-cart-btn h-5 w-5 p-0 rounded-full border-gray-300 hover:border-gray-400"
              disabled={!product.available}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
