import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import whatsappIcon from '../../../assets/whatsapp.svg';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { FulfillmentModal } from '../components/FulfillmentModal';
import { ProductGrid } from '../components/ProductGrid';
import { DeliveryLocation } from '../components/DeliveryLocation';
import { useTenant } from '../../../hooks/useTenant';
import { usePage } from '../hooks/usePage';
import type { Product } from '../types';
import productsData from '../data/products.json';

export function Home() {
  const location = useLocation();
  const tenant = useTenant();
  const { loading, error } = usePage(tenant || '', 'home');
  const [isFulfillmentModalOpen, setIsFulfillmentModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('Capital');

  useEffect(() => {
    // Load products from JSON data
    setProducts(productsData);
  }, []);

  // Handle location selection from location selection page
  useEffect(() => {
    if (location.state?.selectedLocation) {
      setSelectedLocation(location.state.selectedLocation);
    }
  }, [location.state]);


  // Get products for display
  const displayProducts = products.slice(0, 8); // Show first 8 products in grid

  // Show loading state while fetching page data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <section className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="relative h-64 md:h-80 overflow-hidden">
              <Skeleton className="w-full h-full" />
              <div className="absolute inset-0 bg-black/60" />
              
              {/* Mobile: Centered Logo and Company Name Skeleton */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:hidden">
                <Skeleton className="h-16 w-16 rounded-full mb-4 bg-white/20" />
                <Skeleton className="h-8 w-48 mb-2 bg-white/20" />
                <Skeleton className="h-4 w-32 bg-white/20" />
              </div>
              
              {/* Desktop: Left-aligned Logo and Company Name Skeleton */}
              <div className="absolute inset-0 hidden md:flex items-center text-white">
                <div className="ml-8 lg:ml-16">
                  <Skeleton className="h-20 w-20 rounded-full mb-4 bg-white/20" />
                  <Skeleton className="h-10 w-64 mb-3 bg-white/20" />
                  <Skeleton className="h-5 w-48 bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Featured Products Skeleton */}
        <section className="px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    );
  }

  // Show error state if page fetch failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image Section */}
      <section className="relative">
        <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src="/pexels-fotios-photos-1279330.jpg"
              alt="Delicious Food"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            
            {/* Mobile: Centered Logo and Company Name */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:hidden">
              {/* Circle Logo */}
              <div className="h-20 w-20 rounded-full bg-white/90 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-primary font-bold text-2xl">Y</span>
              </div>
              
              {/* Company Name */}
              <h1 className="text-2xl font-bold text-center mb-2 drop-shadow-lg">
                Yummylicious
              </h1>
              <p className="text-sm text-center opacity-90 drop-shadow-md mb-4">
                Delicious food delivered fresh to your doorstep
              </p>
              
              {/* Social Media Buttons */}
              <div className="flex items-center space-x-4">
                {/* Instagram Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open('https://instagram.com/yummylicious', '_blank')}
                  className="text-white bg-white/40 hover:bg-white/50"
                >
                  <Instagram className="h-6 w-6" />
                </Button>
                
                {/* WhatsApp Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                  className="text-white bg-white/40 hover:bg-white/50"
                >
                  <img src={whatsappIcon} alt="WhatsApp" className="h-6 w-6 brightness-0 invert" />
                </Button>
              </div>
            </div>

            {/* Desktop: Bottom Left Text */}
            <div className="absolute bottom-4 left-4 text-white hidden md:block">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to Yummylicious</h2>
              <p className="text-sm opacity-90">Delicious food delivered fresh to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Location Section */}
      <DeliveryLocation currentLocation={selectedLocation} />

      {/* Product Grid Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          {displayProducts.length > 0 ? (
            <ProductGrid products={displayProducts} />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">No products available</h3>
              <p className="text-muted-foreground">We're working on adding delicious items to our menu.</p>
            </div>
          )}

        </div>
      </section>

      <FulfillmentModal 
        isOpen={isFulfillmentModalOpen}
        onClose={() => setIsFulfillmentModalOpen(false)}
      />
    </div>
  );
}
