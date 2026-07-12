'use client';

import { useCartDrawerStore } from '@/stores/cart-drawer-store';
import { CartDrawer } from './CartDrawer';

export function CartController() {
  const { isOpen, close } = useCartDrawerStore();

  return <CartDrawer isOpen={isOpen} onClose={close} />;
}
