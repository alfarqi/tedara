import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import whatsappIcon from '../../../assets/whatsapp.svg';
import { Button } from '../components/ui/button';
import { FulfillmentModal } from '../components/FulfillmentModal';
import { ProductGrid } from '../components/ProductGrid';
import { DeliveryLocation } from '../components/DeliveryLocation';
import type { Product } from '../types';
import productsData from '../data/products.json';

export function Home() {
  const location = useLocation();
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
