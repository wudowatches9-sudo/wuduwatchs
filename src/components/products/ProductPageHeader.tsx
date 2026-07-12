
"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartDrawerStore } from "@/stores/cart-drawer-store";
import { useCartStore } from "@/stores/cart-store";

export function ProductPageHeader() {
  const { open } = useCartDrawerStore();
  const { cartItems } = useCartStore();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-background px-4 py-2">
      <Link
        href="/"
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
        aria-label="Go back"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </Link>
      <button
        onClick={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
        aria-label="View cart"
      >
        <ShoppingBag size={20} strokeWidth={2} />
        {totalItems > 0 && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
            {totalItems}
          </div>
        )}
      </button>
    </header>
  );
}
