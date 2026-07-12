export function PDPSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Image Gallery Skeleton */}
          <div className="animate-pulse">
            {/* Main Image */}
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
              <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
            </div>

            {/* Thumbnail Grid */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="mt-8 animate-pulse lg:mt-0 lg:p-4">
            {/* Product Title */}
            <div className="h-10 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />

            {/* Rating */}
            <div className="mt-4 h-5 w-32 rounded bg-gray-200 dark:bg-gray-800" />

            {/* Price */}
            <div className="mt-6 h-8 w-40 rounded bg-gray-200 dark:bg-gray-800" />

            {/* Stock Status */}
            <div className="mt-6 h-6 w-24 rounded bg-gray-200 dark:bg-gray-800" />

            {/* Size Selection */}
            <div className="mt-8 space-y-3">
              <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"
                  />
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mt-6 space-y-3">
              <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"
                  />
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-8 h-14 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />

            {/* Description */}
            <div className="mt-8 space-y-2">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
