export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  categoryId: number;
  categorySlug: string;
  images: string[];
  featured: boolean;
  available: boolean;
  preparationTime: string;
  calories: number;
  allergens: string[];
  ingredients: string[];
  customizations?: ProductCustomization[];
}

export interface ProductCustomization {
  name: string;
  options: string[];
  default: string | string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  featured: boolean;
  order: number;
}

export interface Branch {
  id: number;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: {
    [key: string]: string;
  };
  services: string[];
  deliveryRadius: number;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: string;
  estimatedPickupTime: string;
  featured: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customizations: { [key: string]: string | string[] };
  notes?: string;
  price: number;
}

export interface FulfillmentOption {
  type: 'delivery' | 'pickup';
  branchId?: number;
  branch?: Branch;
  address?: string;
  phone?: string;
  estimatedTime?: string;
  fee?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  fulfillment: FulfillmentOption;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface AddressInfo {
  street: string;
  building: string;
  floor?: string;
  apartment?: string;
  area: string;
  city: string;
  additionalInstructions?: string;
}
