'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, HandCoins } from 'lucide-react';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', disabled: false },
  { id: 'bkash', name: 'bKash', disabled: true },
  { id: 'nagad', name: 'Nagad', disabled: true },
];

interface PaymentMethodSelectorProps {
  onPaymentMethodChange: (methodId: string) => void;
}

export function PaymentMethodSelector({ onPaymentMethodChange }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState('cod');

  useEffect(() => {
    onPaymentMethodChange(selectedMethod);
  }, [selectedMethod, onPaymentMethodChange]);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-3 gap-4">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const isDisabled = method.disabled;

          const buttonElement = (
            <button
              onClick={() => !isDisabled && setSelectedMethod(method.id)}
              disabled={isDisabled}
              className={cn(
                'flex flex-col items-center justify-center p-6 rounded-lg border transition-all duration-300',
                'bg-white/10 backdrop-blur-sm dark:text-foreground',
                isDisabled && 'opacity-50 cursor-not-allowed',
                isSelected && !isDisabled
                  ? 'border-primary bg-primary/10 dark:border-primary dark:bg-primary/10'
                  : !isDisabled && 'border-border dark:border-zinc-700 hover:border-primary/50 dark:hover:border-primary/50'
              )}
            >
              {isSelected && !isDisabled ? (
                <CheckCircle2 className="w-8 h-8 mb-2 text-primary" />
              ) : (
                <>
                  {method.id === 'bkash' ? (
                    <Image src="/icons/bkash.png" alt="bKash" width={32} height={32} className="mb-2" />
                  ) : method.id === 'nagad' ? (
                    <Image src="/icons/nagod.png" alt="Nagad" width={32} height={32} className="mb-2 mix-blend-multiply dark:mix-blend-normal" />
                  ) : method.id === 'cod' ? (
                    <HandCoins className="w-8 h-8 mb-2 text-muted-foreground" />
                  ) : (
                    <Circle className="w-8 h-8 mb-2 text-muted-foreground" />
                  )}
                </>
              )}
              <span className="font-sans font-semibold text-sm">{method.name}</span>
            </button>
          );

          if (isDisabled) {
            return (
              <Tooltip key={method.id}>
                <TooltipTrigger asChild>
                  {buttonElement}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <div key={method.id}>
              {buttonElement}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
