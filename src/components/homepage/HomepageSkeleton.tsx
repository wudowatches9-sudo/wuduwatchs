import { Skeleton } from "@/components/ui/skeleton";

export function HomepageSkeleton() {
  return (
    <div className="space-y-8 bg-gray-100 dark:bg-gray-800 p-4">
      {/* Hero Section Skeleton */}
      <Skeleton className="h-[500px] w-full" />

      {/* Featured Offers Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>

      {/* Trending Products Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lookbook Section Skeleton */}
      <Skeleton className="h-[400px] w-full" />

      {/* Social Proof Section Skeleton */}
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}
