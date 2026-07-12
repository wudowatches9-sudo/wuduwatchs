"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import Image from "next/image";

import { placeOrder } from "@/actions/orderActions";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { CheckoutSubmitButton } from "@/components/checkout/CheckoutSubmitButton";
import { CheckoutPageLayout } from "@/components/checkout/CheckoutPageLayout";

type ShippingInfo = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  district: string;
  upazila: string;
};

export default function CheckoutPage() {
  const { cartItems: cart } = useCartStore();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    upazila: "",
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [id]: value }));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 150;
  const total = subtotal + shippingCost;

  // Prepare cart details for server action
  const cartDetails = {
    items: cart,
    subtotal: subtotal,
    shippingCost: shippingCost,
    totalAmount: total,
  };

  // Bind cart details to the server action
  const placeOrderWithCart = placeOrder.bind(null, cartDetails);

  const CheckoutContent = (
    <main className="min-h-screen bg-background text-foreground pt-10 sm:pt-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left Column: Shipping, Payment, Place Order */}
        <div className="lg:pr-8">
          <h1 className="font-heading text-3xl dark:text-soft-white mb-8">
            Shipping Information
          </h1>
          <form action={placeOrderWithCart} className="space-y-6">
            {/* Form fields remain the same */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-sans dark:text-soft-white mb-2"
                >
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  placeholder="Email address (optional)"
                  className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-sans dark:text-soft-white mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-sans dark:text-soft-white mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={shippingInfo.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-sans dark:text-soft-white mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={shippingInfo.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-sans dark:text-soft-white mb-2"
              >
                Street Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                placeholder="House no. / street / area"
                required
                className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="upazila"
                  className="block text-sm font-sans dark:text-soft-white mb-2"
                >
                  Upazila / Thana
                </label>
                <input
                  type="text"
                  id="upazila"
                  name="upazila"
                  value={shippingInfo.upazila}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
                />
              </div>
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-sans dark:text-soft-white mb-2"
                >
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={shippingInfo.district}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
                />
              </div>

            </div>
            <div className="mt-12">
              <h2 className="font-heading text-2xl dark:text-soft-white mb-6">
                Payment Method
              </h2>
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
              <PaymentMethodSelector onPaymentMethodChange={setPaymentMethod} />
            </div>

            <div className="mt-12">
              <CheckoutSubmitButton
                className="w-full bg-primary text-primary-foreground dark:bg-primary dark:text-rich-black font-bold uppercase tracking-wider font-heading py-4 rounded-lg transition-transform hover:scale-105 disabled:opacity-50"
                disabled={cart.length === 0}
              >
                Place Order
              </CheckoutSubmitButton>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-white/10 border border-muted-gold/20 rounded-2xl p-8 h-fit">
          <h2 className="font-heading text-2xl dark:text-soft-white mb-6">
            Order Summary
          </h2>
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Your cart is empty.
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
                              className="inline-block w-5 h-5 rounded-full border border-border dark:border-zinc-800 shadow-sm flex-shrink-0"
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
      </div>
      <div className="h-20" />
    </main>
  );

  if (isDesktop) {
    return CheckoutContent;
  }

  return <CheckoutPageLayout>{CheckoutContent}</CheckoutPageLayout>;
}