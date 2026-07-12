"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for classnames

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
}: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 flex max-h-[80vh] w-full flex-col rounded-t-2xl border-t bg-background text-foreground border-border",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            "duration-300 ease-in-out"
          )}
        >
          {/* Grabber Handle */}
          <div className="mx-auto my-3 h-1.5 w-12 rounded-full bg-border" />

          {/* Header */}
          <div className="relative border-b border-border p-4 text-center">
            <Dialog.Title className="font-satoshi text-lg font-bold">
              {title}
            </Dialog.Title>
            <Dialog.Close className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-5 text-base leading-relaxed text-muted-foreground">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
