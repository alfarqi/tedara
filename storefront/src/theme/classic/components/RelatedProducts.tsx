import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';
import productsData from '../data/products.json';

interface RelatedProductsProps {
  currentProduct: Product;
  categorySlug: string;
}

export function RelatedProducts({ currentProduct, categorySlug }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Get products from the same category, excluding the current product
    const categoryProducts = productsData.filter(
      product => 
        product.categorySlug === categorySlug && 
        product.id !== currentProduct.id &&
        product.available
    );
    
    // Shuffle and take up to 4 products
    const shuffled = categoryProducts.sort(() => 0.5 - Math.random());
    setRelatedProducts(shuffled.slice(0, 4));
  }, [currentProduct.id, categorySlug]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">You might also like</h2>
        <p className="text-muted-foreground">
          Other delicious items from the same category
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
