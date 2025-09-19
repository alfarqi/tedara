import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, customizations?: { [key: string]: string | string[] }, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  clearInvalidProducts: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: (deliveryFee?: number) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, customizations = {}, notes = '') => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          item => 
            item.product.id === product.id && 
            JSON.stringify(item.customizations) === JSON.stringify(customizations)
        );

        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            product,
            quantity: 1,
            customizations,
            notes,
            price: product.price,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter(item => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        const items = get().items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items });
      },

      updateNotes: (itemId, notes) => {
        const items = get().items.map(item =>
          item.id === itemId ? { ...item, notes } : item
        );
        set({ items });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotal: (deliveryFee = 0) => {
        return get().getSubtotal() + deliveryFee;
      },

      clearInvalidProducts: () => {
        const items = get().items;
        const validItems = items.filter(item => item.product && item.product.id && item.product.id > 0);
        if (validItems.length !== items.length) {
          console.warn('Removed invalid products from cart');
          set({ items: validItems });
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
