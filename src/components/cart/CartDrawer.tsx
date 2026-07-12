"use client";

import { useCartStore, CartItem as CartItemType } from '@/stores/cart-store';
import Image from 'next/image';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Internal CartItem component adapted from Aura's structure
interface CartItemProps {
  item: CartItemType;
  removeFromCart: (id: string, size?: string, color?: string | { name: string; hex: string }) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string | { name: string; hex: string }) => void;
}

function CartItem({ item, removeFromCart, updateQuantity }: CartItemProps) {
  // THE CRITICAL FIX: Use the specific image selected by the user
  // Priority: item.image (selected) > item.images.main (default) > fallback
  const imageUrl = item.image || item.images?.main || (item as any).image || "/logo.png";
  
  // Helper to get color name - handles both string and object
  const getColorName = (color?: string | { name: string; hex: string } | null | undefined) => {
    if (!color) return null;
    if (typeof color === 'string') return color;
    return color.name;
  };
  
  // Helper to get color hex - only works for objects
  const getColorHex = (color?: string | { name: string; hex: string } | null | undefined) => {
    if (!color || typeof color === 'string') return null;
    return color.hex;
  };
  
  const colorName = getColorName(item.color as any);
  const colorHex = getColorHex(item.color as any);

  return (
    <li key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4">
      <Image
        src={imageUrl}
        alt={item.name}
        width={64}
        height={64}
        className="rounded-md object-cover flex-shrink-0"
      />
      <div className="flex-grow">
        <p className="font-heading text-soft-white">{item.name}</p>
        {(item.size || colorName) && (
          <p className="text-xs text-soft-white/50 flex items-center gap-2">
            <span>
              {item.size && `Size: ${item.size}`}
              {item.size && colorName && ' • '}
              {colorName && `Color: ${colorName}`}
            </span>
            {colorHex && (
              <span
                className="inline-block w-5 h-5 rounded-full border border-border dark:border-zinc-800 shadow-sm flex-shrink-0"
                style={{ backgroundColor: colorHex }}
                title={colorName || ''}
              />
            )}
          </p>
        )}
        <p className="text-sm text-soft-white/60">
          ৳&nbsp;{item.price.toFixed(2)}
        </p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <div className="flex items-center bg-gray-100 border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 rounded-full">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
            className="px-3 py-1 text-lg text-foreground dark:text-soft-white"
            aria-label="Decrease"
            disabled={item.quantity === 1}
          >
            -
          </button>
          <span className="font-sans text-sm w-6 text-center text-foreground dark:text-soft-white">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
            className="px-3 py-1 text-lg text-foreground dark:text-soft-white"
            aria-label="Increase"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeFromCart(item.id, item.size, item.color)}
          className="text-xs text-muted-foreground dark:text-muted-gold transition-colors hover:text-red-500 dark:hover:text-red-500"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();
  const router = useRouter();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose(); // Close the drawer
    router.push("/checkout");
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background dark:bg-rich-black/80 backdrop-blur-xl
                    shadow-2xl z-[110] p-6 grid grid-rows-[auto_1fr_auto] gap-4
                    transition-transform duration-500 ease-in-out
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-muted-gold/20 pb-4">
          <h2 className="font-heading text-2xl dark:text-soft-white">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-soft-white/70 dark:hover:text-soft-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="overflow-y-auto pr-2">
          {cartItems.length === 0 ? (
            <p className="dark:text-soft-white/60 text-center mt-10">
              Your cart is empty.
            </p>
          ) : (
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-muted-gold/20 pt-6">
          <div className="flex justify-between items-center font-sans text-lg mb-4">
            <span className="dark:text-soft-white/80">Subtotal</span>
            <span className="font-bold dark:text-soft-white">
              ৳&nbsp;{subtotal.toFixed(2)}
            </span>
          </div>
          <button
            className="w-full bg-primary text-primary-foreground dark:bg-primary dark:text-rich-black font-bold uppercase tracking-wider font-heading
                       py-4 transition-transform hover:scale-105 disabled:opacity-50"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-[105] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
    </>
  );
}