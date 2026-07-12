import { mapStatusToCustomerFriendlyText } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  order_status: string;
  ordered_products: any[];
  order_number: number;
}

interface OrderHistoryCardProps {
  order: Order;
}

export function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  // Format date
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  // Count total items
  const totalItems = order.ordered_products.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <Link href={`/account/orders/${order.id}`} className="block bg-white/10 border border-muted-gold/20 rounded-lg p-4 backdrop-blur-sm h-fit font-heading hover:shadow-md transition-shadow">
      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Order Placed</p>
          <p className="font-medium text-foreground">{orderDate}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-semibold text-foreground text-lg">
            ৳&nbsp;{order.total_amount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              ORDER #{order.order_number}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="dark:bg-primary dark:text-rich-black font-bold py-2 px-4 rounded-lg text-sm">
            {mapStatusToCustomerFriendlyText(order.order_status)}
          </Badge>
        </div>
      </div>
    </Link>
  );
}