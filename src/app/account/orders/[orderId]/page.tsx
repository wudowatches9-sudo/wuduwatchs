import { getUserOrderById } from "@/actions/orderActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mapStatusToCustomerFriendlyText } from "@/lib/utils";

export const dynamic = 'force-dynamic';

interface OrderDetailPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = await getUserOrderById(params.orderId);

  if (!order) {
    notFound();
  }

  // Format date
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl font-heading">
      {/* Back Button */}
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Orders
      </Link>

      {/* Order Header */}
      <div className="mb-8">
        <div className="flex flex-row items-center justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold font-heading">Order Details</h1>
          <Badge className="dark:bg-primary dark:text-rich-black font-bold py-2 px-4 rounded-lg text-sm w-fit capitalize">
            {mapStatusToCustomerFriendlyText(order.order_status)}
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
          <span>Order #{order.order_number}</span>
          <span className="hidden sm:inline">•</span>
          <span>Placed on {orderDate}</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items Summary */}
        <div className="lg:col-span-2 space-y-4 bg-white/10 border border-muted-gold/20 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold font-heading mb-4">Items Ordered</h2>
          
          <div className="space-y-4">
            {order.ordered_products.map((item: any, index: number) => (
              <div
                key={index}
                className="flex gap-4 p-4 border border-border rounded-lg bg-card"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  {item.images?.main ? (
                    <Image
                      src={item.images.main}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  {item.size && (
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size}
                    </p>
                  )}
                  {item.color && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>
                        Color: {typeof item.color === 'string' ? item.color : item.color.name}
                      </span>
                      {typeof item.color === 'object' && item.color.hex && (
                        <span
                          className="inline-block w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: item.color.hex }}
                          title={item.color.name}
                        />
                      )}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-foreground">
                    ৳&nbsp;{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ৳&nbsp;{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Shipping & Total */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 border border-muted-gold/20 rounded-lg p-6 backdrop-blur-sm sticky top-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Shipping Address</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">{order.customer_name}</p>
                  <p>{order.customer_address}</p>
                  <p>{order.customer_city}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Contact Information</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{order.customer_email}</p>
                  <p>{order.customer_phone}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold text-foreground mb-3">Payment Method</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {order.payment_method}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Status: <span className="capitalize">{order.payment_status}</span>
              </p>
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-4 space-y-2">
              <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">৳&nbsp;{order.subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {order.shipping_cost === 0 ? "Free" : `৳&nbsp;${order.shipping_cost.toLocaleString()}`}
                </span>
              </div>
              
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">৳&nbsp;{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
