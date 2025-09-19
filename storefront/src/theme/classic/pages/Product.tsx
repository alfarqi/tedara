import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGallery } from '../components/ProductGallery';
import { ProductInfoPanel } from '../components/ProductInfoPanel';
import { ProductFixedBar } from '../components/ProductFixedBar';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/ui/skeleton';
import { useTenant } from '../../../hooks/useTenant';
import { productService, type Product as ProductType } from '../services/productService';

export function Product() {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();
  const tenant = useTenant();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!tenant || !categorySlug || !productSlug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const foundProduct = await productService.findProductBySlug(tenant, categorySlug, productSlug);
        setProduct(foundProduct);
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [tenant, categorySlug, productSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="px-4 py-6 space-y-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="px-4 py-6">
          <EmptyState
            title="Product not found"
            description="The product you're looking for doesn't exist."
            action={{
              label: "Go back to menu",
              onClick: () => window.history.back()
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 py-6 space-y-4">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Menu', href: '/' },
            { label: product.categorySlug, href: `/category/${product.categorySlug}` },
            { label: product.name, href: '#' }
          ]}
        />

        {/* Product Gallery */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ProductInfoPanel product={product} />
        </div>
      </div>
      
      {/* Add to Cart Fixed Bar */}
      <ProductFixedBar />
    </div>
  );
}
