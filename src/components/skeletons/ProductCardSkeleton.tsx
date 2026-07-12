export function ProductCardSkeleton() {
  return (
    <div className="group relative animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
        <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
      </div>

      {/* Content Skeleton */}
      <div className="mt-4 space-y-2">
        {/* Product Name */}
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        
        {/* Price */}
        <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}
