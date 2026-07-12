import { Suspense } from 'react';
import PaymentFailContent from './PaymentFailContent';

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailContent />
    </Suspense>
  );
}