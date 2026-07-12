"use client";

import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';
import { AdminTableSkeleton } from '@/components/skeletons/AdminTableSkeleton';

export default function ProductsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<AdminTableSkeleton />}>
        <ProductsPageContent />
      </Suspense>
    </div>
  );
}