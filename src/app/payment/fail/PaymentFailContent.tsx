'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export default function PaymentFailContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 border border-muted-gold/20 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="font-heading text-3xl dark:text-soft-white mb-4">
          Order Placement Failed
        </h1>
        {error && (
          <p className="text-muted-foreground mb-6">
            Error: <span className="font-bold text-foreground">{decodeURIComponent(error)}</span>
          </p>
        )}
        <p className="text-muted-foreground mb-6">
          There was an issue processing your order. Please try again.
        </p>
        <Link href="/checkout">
          <button className="w-full bg-primary text-primary-foreground dark:bg-primary dark:text-rich-black font-bold uppercase tracking-wider font-heading py-4 rounded-lg transition-transform hover:scale-105">
            Return to Checkout
          </button>
        </Link>
      </div>
    </main>
  );
}
