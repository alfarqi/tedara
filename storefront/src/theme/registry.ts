import { Layout as ClassicLayout } from './classic/Layout';
import { Hero as ClassicHero } from './classic/sections/Hero';
import { ProductGrid as ClassicProductGrid } from './classic/sections/ProductGrid';
import { RichText as ClassicRichText } from './classic/sections/RichText';

// Import classic theme pages
import { Home as ClassicHome } from './classic/pages/Home';
import { Cart as ClassicCart } from './classic/pages/Cart';
import { Product as ClassicProduct } from './classic/pages/Product';
import { Checkout as ClassicCheckout } from './classic/pages/Checkout';
import { Account as ClassicAccount } from './classic/pages/Account';
import { Orders as ClassicOrders } from './classic/pages/Orders';
import { Addresses as ClassicAddresses } from './classic/pages/Addresses';
import { AddAddress as ClassicAddAddress } from './classic/pages/AddAddress';
import { LocationSelection as ClassicLocationSelection } from './classic/pages/LocationSelection';
import { Category as ClassicCategory } from './classic/pages/Category';
import { Order as ClassicOrder } from './classic/pages/Order';
import { Contact as ClassicContact } from './classic/pages/Contact';
import { Auth as ClassicAuth } from './classic/pages/Auth';
import { OrderConfirmation as ClassicOrderConfirmation } from './classic/pages/OrderConfirmation';

// Import classic theme components
import { Header as ClassicHeader } from './classic/components/Header';
import { BottomNavigation as ClassicBottomNavigation } from './classic/components/BottomNavigation';
import { ProductFixedBar as ClassicProductFixedBar } from './classic/components/ProductFixedBar';
import { CheckoutFixedBar as ClassicCheckoutFixedBar } from './classic/components/CheckoutFixedBar';
import { PlaceOrderFixedBar as ClassicPlaceOrderFixedBar } from './classic/components/PlaceOrderFixedBar';

export interface ThemeComponents {
  Layout: React.ComponentType<any>;
  sections: {
    [key: string]: React.ComponentType<any>;
  };
  pages: {
    [key: string]: React.ComponentType<any>;
  };
  components: {
    [key: string]: React.ComponentType<any>;
  };
}

export const themeRegistry: Record<string, ThemeComponents> = {
  classic: {
    Layout: ClassicLayout,
    sections: {
      hero: ClassicHero,
      product_grid: ClassicProductGrid,
      featured_products: ClassicProductGrid,
      content: ClassicRichText,
      rich_text: ClassicRichText,
    },
    pages: {
      home: ClassicHome,
      cart: ClassicCart,
      product: ClassicProduct,
      checkout: ClassicCheckout,
      account: ClassicAccount,
      orders: ClassicOrders,
      addresses: ClassicAddresses,
      addAddress: ClassicAddAddress,
      locationSelection: ClassicLocationSelection,
      category: ClassicCategory,
      order: ClassicOrder,
      contact: ClassicContact,
      auth: ClassicAuth,
      orderConfirmation: ClassicOrderConfirmation,
    },
    components: {
      header: ClassicHeader,
      bottomNavigation: ClassicBottomNavigation,
      productFixedBar: ClassicProductFixedBar,
      checkoutFixedBar: ClassicCheckoutFixedBar,
      placeOrderFixedBar: ClassicPlaceOrderFixedBar,
    },
  },
  modern: {
    Layout: ClassicLayout, // Fallback to classic for now
    sections: {
      hero: ClassicHero,
      product_grid: ClassicProductGrid,
      featured_products: ClassicProductGrid,
      content: ClassicRichText,
      rich_text: ClassicRichText,
    },
    pages: {
      home: ClassicHome,
      cart: ClassicCart,
      product: ClassicProduct,
      checkout: ClassicCheckout,
      account: ClassicAccount,
      orders: ClassicOrders,
      addresses: ClassicAddresses,
      addAddress: ClassicAddAddress,
      locationSelection: ClassicLocationSelection,
      category: ClassicCategory,
      order: ClassicOrder,
      contact: ClassicContact,
      auth: ClassicAuth,
      orderConfirmation: ClassicOrderConfirmation,
    },
    components: {
      header: ClassicHeader,
      bottomNavigation: ClassicBottomNavigation,
      productFixedBar: ClassicProductFixedBar,
      checkoutFixedBar: ClassicCheckoutFixedBar,
      placeOrderFixedBar: ClassicPlaceOrderFixedBar,
    },
  },
};

export function getTheme(themeKey: string): ThemeComponents {
  return themeRegistry[themeKey] || themeRegistry.classic;
}

