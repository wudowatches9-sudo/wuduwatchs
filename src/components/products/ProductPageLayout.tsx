"use client";

import { useState } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { StickyActionFooter } from "./StickyActionFooter";
import { ProductPageContent } from "./ProductPageContent";
import { useCartDrawerStore } from "@/stores/cart-drawer-store";
import { useCartStore } from "@/stores/cart-store";

/**
 * Product Page Layout Component
 * 
 * Dedicated layout for PDP that replaces main site header/footer
 * Provides mobile-focused header and sticky action footer
 */

interface ProductPageLayoutProps {
  product: any;
}

export function ProductPageLayout({ product }: ProductPageLayoutProps) {
  const { open } = useCartDrawerStore();
  const { cartItems } = useCartStore();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Single source of truth for the currently displayed image
  const [selectedImage, setSelectedImage] = useState(product.images?.main || product.images?.gallery?.[0] || '/logo.png');

  return (
    <div className="min-h-screen bg-background shadow-lg">
      {/* Mobile-Only Focused Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-background px-4 py-2 lg:hidden">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground"
          aria-label="Go back"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </Link>
        <button
          onClick={open}
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground"
          aria-label="View cart"
        >
          <ShoppingCart size={20} strokeWidth={2} />
          {totalItems > 0 && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
              {totalItems}
            </div>
          )}
        </button>
      </div>

      {/* Page Content */}
      <ProductPageContent 
        product={product}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      {/* Mobile-Only Sticky Action Footer */}
      <StickyActionFooter 
        product={product} 
        stock={product.stock}
        selectedImage={selectedImage}
      />
    </div>
  );
}