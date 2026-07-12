import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string | { name: string; hex: string };
  image?: string; // The specific image selected by the user
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string | { name: string; hex: string }) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string | { name: string; hex: string }) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) => {
        set((state) => {
          // Helper to compare colors
          const isSameColor = (color1?: string | { name: string; hex: string }, color2?: string | { name: string; hex: string }) => {
            if (!color1 && !color2) return true;
            if (!color1 || !color2) return false;
            if (typeof color1 === 'string' && typeof color2 === 'string') return color1 === color2;
            if (typeof color1 === 'object' && typeof color2 === 'object') return color1.name === color2.name;
            return false;
          };

          // Check if item with same id, size, color, AND image already exists
          // Different images should create separate cart items!
          const existingItem = state.cartItems.find(
            (cartItem) =>
              cartItem.id === item.id &&
              cartItem.size === item.size &&
              isSameColor(cartItem.color, item.color) &&
              cartItem.image === item.image // ✅ THE FIX: Also compare images
          );
          
          if (existingItem) {
            // Increment quantity of existing item (same product, size, color, AND image)
            const updatedCart = state.cartItems.map((cartItem) =>
              cartItem.id === item.id &&
              cartItem.size === item.size &&
              isSameColor(cartItem.color, item.color) &&
              cartItem.image === item.image // ✅ THE FIX: Also compare images
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
            return { cartItems: updatedCart };
          } else {
            // Add new item with quantity 1
            return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
          }
        });
      },
      removeFromCart: (productId, size, color) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) =>
              !(item.id === productId && item.size === size && item.color === color)
          ),
        })),
      updateQuantity: (productId, quantity, size, color) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'wudu-watches-cart',
    }
  )
);
