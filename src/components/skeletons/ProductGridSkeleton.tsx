import { ProductCardSkeleton } from './ProductCardSkeleton';

export function ProductGridSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title Skeleton */}
      <div className="mb-8 h-10 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
