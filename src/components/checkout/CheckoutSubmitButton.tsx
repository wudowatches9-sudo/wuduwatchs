"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

interface CheckoutSubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean; // Add this line
}

export function CheckoutSubmitButton({
  children,
  className,
  disabled,
}: CheckoutSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} className={className}>
      {pending ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Placing Order...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
