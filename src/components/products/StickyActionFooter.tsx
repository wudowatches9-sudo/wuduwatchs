'use client';

import AnimatedButton from '@/components/ui/AnimatedButton';
import { useCartDrawerStore } from '@/stores/cart-drawer-store';
import { useCartStore } from '@/stores/cart-store';
import { useProductPageStore } from '@/stores/product-page-store';

interface StickyActionFooterProps {
  product: any;
  stock: number;
  selectedImage: string;
}

export function StickyActionFooter({ product, stock, selectedImage }: StickyActionFooterProps) {
  const { selectedSize, selectedColor } = useProductPageStore();
  const addToCart = useCartStore((state) => state.addToCart);

  // Type guard to check if selectedColor is a swatch object
  const isSwatchObject = (color: any): color is { name: string; hex: string } => {
    return color && typeof color === 'object' && 'name' in color && 'hex' in color;
  };

  const handleAddToCart = () => {
    // Only add to cart if size is selected (and color if product has colorSwatches)
    if (!selectedSize) return;
    if (product.colorSwatches && product.colorSwatches.length > 0 && !selectedColor) return;



    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor, // Pass the full object, not just the name
      image: selectedImage, // THE CRITICAL FIX: Use the currently displayed image
      quantity: 1,
    });
    useCartDrawerStore.getState().open();
  };

  // Check if button should be disabled
  const isDisabled = !selectedSize || (product.colorSwatches && product.colorSwatches.length > 0 && !selectedColor) || stock <= 0;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 z-10">
      <AnimatedButton
        onClick={handleAddToCart}
        disabled={isDisabled}
        className="w-full font-sans text-lg font-bold uppercase tracking-wider h-12 bg-primary text-primary-foreground dark:bg-primary dark:text-rich-black rounded-md border-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add to Cart
      </AnimatedButton>
      {isDisabled && (
        <p className="text-center text-xs text-red-500 mt-2">
          {stock <= 0 ? 'This product is out of stock' : 'Please choose case size and color'}
        </p>
      )}
    </div>
  );
}