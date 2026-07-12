'use client';

import { useEffect } from 'react';
import { ProductPageLayout } from "@/components/products/ProductPageLayout";
import { useProductPageStore } from '@/stores/product-page-store';
import { Product } from '@/types/product';

interface ProductPageClientProps {
  product: Product;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { reset } = useProductPageStore();

  useEffect(() => {
    // Reset store when component unmounts (user navigates away)
    return () => {
      reset();
    };
  }, [reset]);

  return <ProductPageLayout product={product} />;
}
