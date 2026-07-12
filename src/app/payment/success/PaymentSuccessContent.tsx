'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { CartItem, useCartStore } from '@/stores/cart-store';
import { useEffect, useState } from 'react';
import { getOrderDetails } from '@/actions/orderActions';

interface OrderData {
  cart: CartItem[];
  total: number;
  order_number: number;
}

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear the cart when the success page loads
    clearCart();

    if (orderId) {
      getOrderDetails(orderId)
        .then((data) => {
          setOrderData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch order details:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId, clearCart]);

  const cart = orderData?.cart || [];
  const total = orderData?.total || 0;
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = total - subtotal;

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 border border-muted-gold/20 rounded-2xl p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-amber-500" />
          </div>
          <h1 className="font-heading text-3xl dark:text-soft-white mb-2">
            Thank You! Your Order is Received.
          </h1>
          <p className="text-muted-gold/80 font-sans text-base mb-4">
            Your order is <span className="text-amber-400 font-semibold">awaiting confirmation</span>. Our representative will call you shortly to verify and confirm your order.
          </p>
          <p className="text-muted-foreground/70 text-sm font-sans">
            Thank you for your patience! 🙏
          </p>
          {orderData?.order_number && (
            <p className="text-muted-foreground mt-4">
              Your Order Number: <span className="font-bold text-foreground text-xl">#{orderData.order_number}</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center">Loading order details...</div>
        ) : (
          <div className="bg-white/10 border border-muted-gold/20 rounded-2xl p-8 mt-8">
            <h2 className="font-heading text-2xl dark:text-soft-white mb-6">
              Order Summary
            </h2>
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No items in the order.
              </p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.images?.main || (item as any).image || "/logo.png"}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className="text-foreground font-sans">{item.name}</p>
                          <p className="text-sm text-muted-foreground font-sans flex items-center gap-2">
                            <span>
                              {item.size && `Size: ${item.size}`}
                              {item.color && `, Color: ${typeof item.color === 'string' ? item.color : item.color.name}`}
                            </span>
                            {typeof item.color === 'object' && item.color?.hex && (
                              <span
                                className="inline-block w-5 h-5 rounded-full border-2 border-foreground shadow-sm flex-shrink-0"
                                style={{ backgroundColor: item.color.hex }}
                                title={item.color.name}
                              />
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground font-sans">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-foreground font-sans">
                        ৳&nbsp;{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t dark:border-zinc-700 pt-6 space-y-2">
                  <div className="flex justify-between text-muted-foreground font-sans">
                    <p>Subtotal</p>
                    <p>৳&nbsp;{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-sans">
                    <p>Shipping</p>
                    <p>৳&nbsp;{shippingCost.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-lg font-bold dark:text-soft-white mt-2 font-sans">
                    <p>Total</p>
                    <p>৳&nbsp;{total.toFixed(2)}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
          <Link href="/collections/all">
            <button className="w-full sm:w-auto px-6 py-4 bg-primary text-white dark:bg-primary dark:text-rich-black font-bold uppercase tracking-wider font-heading rounded-lg transition-transform hover:scale-105">
              Continue Shopping
            </button>
          </Link>
          <Link href="/account">
            <button className="w-full sm:w-auto px-6 py-4 bg-primary text-white dark:bg-primary dark:text-rich-black font-bold uppercase tracking-wider font-heading rounded-lg transition-transform hover:scale-105">
              View My Orders
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
