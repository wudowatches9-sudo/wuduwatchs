'use client';

import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/Sheet';
import { Package, User, MapPin, CreditCard, DollarSign } from 'lucide-react';

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string | { name: string; hex: string };
  images?: {
    main: string;
  };
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  customer_city: string;
  ordered_products: OrderProduct[];
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  order_number: number;
}

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent size="lg" className="overflow-y-auto w-[95%] sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold font-heading">Order Details</SheetTitle>
          <SheetDescription className="font-heading">
            Order #{order.order_number}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg font-heading">Customer Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium font-heading">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium font-heading">{order.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium font-heading">{order.customer_email}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg font-heading">Shipping Address</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">City:</span>
                <span className="font-medium font-heading">{order.customer_city}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Address:</span>
                <p className="font-medium font-heading mt-1">{order.customer_address}</p>
              </div>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg font-heading">Ordered Products</h3>
            </div>
            <div className="space-y-3">
              {order.ordered_products.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-md"
                >
                  <Image
                    src={item.images?.main || '/logo.png'}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium font-heading text-sm">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 font-heading">
                        <span>
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${typeof item.color === 'string' ? item.color : (item.color?.name || 'N/A')}`}
                        </span>
                        {item.color && typeof item.color === 'object' && item.color !== null && item.color.hex && (
                          <span
                            className="inline-block w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: item.color.hex }}
                            title={item.color.name}
                          />
                        )}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 font-heading">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right font-heading">
                    <p className="font-semibold">৳&nbsp;{(item.price ?? 0).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      Total: ৳&nbsp;{((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg font-heading">Payment Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium font-heading uppercase">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className={`font-medium font-heading capitalize ${
                  order.payment_status === 'paid' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg font-heading">Pricing Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium font-heading">৳&nbsp;{(order.subtotal ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Cost:</span>
                <span className="font-medium font-heading">৳&nbsp;{(order.shipping_cost ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="font-semibold text-base font-heading">Total Amount:</span>
                <span className="font-bold text-lg text-primary font-heading">
                  ৳&nbsp;{(order.total_amount ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Status:</span>
                <span className={`font-medium font-heading capitalize px-3 py-1 rounded-full text-xs ${
                  order.order_status === 'delivered' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : order.order_status === 'shipped'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : order.order_status === 'processing'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {order.order_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium font-heading">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
