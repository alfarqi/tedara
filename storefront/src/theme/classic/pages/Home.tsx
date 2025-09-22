import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import whatsappIcon from '../../../assets/whatsapp.svg';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { FulfillmentModal } from '../components/FulfillmentModal';
import { ProductGrid } from '../components/ProductGrid';
import { DeliveryLocation } from '../components/DeliveryLocation';
import { MobileDebugPanel } from '../../../components/MobileDebugPanel';
import { useTenant } from '../../../hooks/useTenant';
import { usePage } from '../hooks/usePage';
import { useTheme } from '../hooks/useTheme';
import { productService, type Product } from '../services/productService';
import { ASSETS } from '../../../utils/assets';
import '../../../utils/testMobileDebug';

export function Home() {
  const location = useLocation();
  const tenant = useTenant();
  const { loading, error } = usePage(tenant || '', 'home');
  const { theme, store } = useTheme(tenant || '');
  const [isFulfillmentModalOpen, setIsFulfillmentModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('Capital');
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      if (!tenant) return;
      
      setProductsLoading(true);
      try {
        const fetchedProducts = await productService.getProducts(tenant);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [tenant]);

  // Handle location selection from location selection page
  useEffect(() => {
    if (location.state?.selectedLocation) {
      setSelectedLocation(location.state.selectedLocation);
    }
  }, [location.state]);


  // Get products for display
  const displayProducts = products.slice(0, 8); // Show first 8 products in grid
  
  // Get store information from theme/API
  const storeName = store?.name || theme?.settings?.store_name || '';
  const storeLogo = store?.logo || theme?.settings?.logo_url;
  const storeBanner = theme?.settings?.banner_url;
  const storeSlogan = store?.description || theme?.settings?.store_slogan || '';
  const socialLinks = theme?.settings?.social_links;

  // Show loading state while fetching page data or products
  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <section className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="relative h-[50vh] sm:h-[60vh] md:h-96 lg:h-[32rem] overflow-hidden">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
            <p className="text-gray-600 mb-4">
              {error.includes('tenant') ? 'Unable to load store information.' : error}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Debug Information:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Tenant:</strong> {tenant || 'Not detected'}</p>
              <p><strong>URL:</strong> {window.location.href}</p>
              <p><strong>User Agent:</strong> {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <a 
              href="/" 
              className="block w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to Home
            </a>
        </div>
      </div>
      
      {/* Mobile Debug Panel */}
      <MobileDebugPanel 
        isVisible={showDebugPanel} 
        onToggle={() => setShowDebugPanel(!showDebugPanel)} 
      />
    </div>
  );
}

  return (
    <div className="min-h-screen">
      {/* Hero Image Section - Mobile: 50vh, Small: 60vh, Medium: 384px, Large: 512px */}
      <section className="relative">
        <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="relative h-[50vh] sm:h-[60vh] md:h-96 lg:h-[32rem] overflow-hidden">
            <img
              src={storeBanner || ASSETS.DEFAULT_BANNER}
              alt={storeName || "Store Banner"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            
            {/* Mobile: Centered Logo and Company Name */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:hidden">
              {/* Circle Logo - Only show if logo exists */}
              {storeLogo && (
                <div className="h-20 w-20 rounded-full bg-white/90 flex items-center justify-center mb-4 shadow-lg">
                  <img 
                    src={storeLogo} 
                    alt={storeName || 'Store Logo'}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                </div>
              )}
              
              {/* Company Name - Only show if name exists */}
              {storeName && (
                <h1 className="text-2xl font-bold text-center mb-2 drop-shadow-lg">
                  {storeName}
                </h1>
              )}
              
              {/* Slogan - Only show if slogan exists */}
              {storeSlogan && (
                <p className="text-sm text-center opacity-90 drop-shadow-md mb-4">
                  {storeSlogan}
                </p>
              )}
              
              {/* Social Media Buttons */}
              <div className="flex items-center space-x-4">
                {/* Instagram Button */}
                {socialLinks?.instagram && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(socialLinks.instagram, '_blank')}
                    className="text-white bg-white/40 hover:bg-white/50"
                  >
                    <Instagram className="h-6 w-6" />
                  </Button>
                )}
                
                {/* WhatsApp Button */}
                {socialLinks?.whatsapp && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(socialLinks.whatsapp, '_blank')}
                    className="text-white bg-white/40 hover:bg-white/50"
                  >
                    <img src={whatsappIcon} alt="WhatsApp" className="h-6 w-6 brightness-0 invert" />
                  </Button>
                )}
                
                {/* Facebook Button */}
                {socialLinks?.facebook && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(socialLinks.facebook, '_blank')}
                    className="text-white bg-white/40 hover:bg-white/50"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                )}
              </div>
            </div>

            {/* Desktop: Centered Logo and Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white hidden md:flex">
              {/* Circle Logo - Only show if logo exists */}
              {storeLogo && (
                <div className="h-24 w-24 rounded-full bg-white/90 flex items-center justify-center mb-6 shadow-lg">
                  <img 
                    src={storeLogo} 
                    alt={storeName || 'Store Logo'}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
              )}
              
              {/* Company Name - Only show if name exists */}
              {storeName && (
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 drop-shadow-lg">
                  {storeName}
                </h1>
              )}
              
              {/* Slogan - Only show if slogan exists */}
              {storeSlogan && (
                <p className="text-lg text-center opacity-90 drop-shadow-md mb-6">
                  {storeSlogan}
                </p>
              )}
              
              {/* Social Media Buttons */}
              <div className="flex items-center space-x-4">
                {/* Instagram Button */}
                {socialLinks?.instagram && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(socialLinks.instagram, '_blank')}
                    className="text-white bg-white/40 hover:bg-white/50"
                  >
                    <Instagram className="h-6 w-6" />
                  </Button>
                )}
                
                {/* WhatsApp Button */}
                {socialLinks?.whatsapp && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(socialLinks.whatsapp, '_blank')}
                    className="text-white bg-white/40 hover:bg-white/50"
                  >
                    <img src={whatsappIcon} alt="WhatsApp" className="h-6 w-6 brightness-0 invert" />
                  </Button>
                )}
                
                {/* Facebook Button */}
                {socialLinks?.facebook && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(socialLinks.facebook, '_blank')}
                    className="text-white bg-white/40 hover:bg-white/50"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                )}
              </div>
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
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold mb-2">No products available</h3>
              <p className="text-muted-foreground">We're working on adding amazing products to our store.</p>
            </div>
          )}

        </div>
      </section>

      <FulfillmentModal 
        isOpen={isFulfillmentModalOpen}
        onClose={() => setIsFulfillmentModalOpen(false)}
      />
      
      {/* Mobile Debug Panel */}
      <MobileDebugPanel 
        isVisible={showDebugPanel} 
        onToggle={() => setShowDebugPanel(!showDebugPanel)} 
      />
    </div>
  );
}
