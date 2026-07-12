import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-1/3 mb-8" /> {/* For "My Account" title */}

      <section className="mb-12">
        <Skeleton className="h-8 w-1/4 mb-4" /> {/* For "Account Details" title */}
        <div className="bg-card p-6 rounded-lg shadow-md dark:bg-card dark:border-muted-gold">
          <Skeleton className="h-6 w-1/2 mb-2" /> {/* For Email */}
          <Skeleton className="h-6 w-1/3 mb-4" /> {/* For Name */}
          <Skeleton className="h-10 w-32" /> {/* For Sign Out button */}
        </div>
      </section>

      <section>
        <Skeleton className="h-8 w-1/4 mb-4" /> {/* For "Order History" title */}
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" /> {/* For OrderSummaryCard 1 */}
          <Skeleton className="h-32 w-full" /> {/* For OrderSummaryCard 2 */}
          <Skeleton className="h-32 w-full" /> {/* For OrderSummaryCard 3 */}
        </div>
      </section>
    </div>
  );
}
