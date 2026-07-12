"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";

interface ProductInformationProps {
  product: any;
}

export function ProductInformation({ product }: ProductInformationProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState({ title: "", content: "" });

  const productDetails = [
    { title: "Description", content: product.longDescription },
    { title: "Specifications", content: product.sizingAndFit },
    { title: "Movement & Materials", content: product.materialsAndCare },
  ];

  const openSheet = (title: string, content: string) => {
    setSheetContent({ title, content });
    setIsSheetOpen(true);
  };

  return (
    <div className="mt-6">
      {/* Mobile: Clickable rows with BottomSheet */}
      <div className="lg:hidden">
        {productDetails.map((item) => (
          <button
            key={item.title}
            onClick={() => openSheet(item.title, item.content)}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <span className="font-sans font-medium text-base text-foreground/60">
              {item.title}
            </span>
            <ArrowRight
              size={20}
              strokeWidth={3}
              className="text-muted-foreground"
            />
          </button>
        ))}
        <BottomSheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          title={sheetContent.title}
        >
          <p className="font-sans whitespace-pre-line text-foreground/60">{sheetContent.content}</p>
        </BottomSheet>
      </div>

      {/* Desktop: Always visible content */}
      <div className="hidden lg:block space-y-8">
        {productDetails.map((item) => (
          <div key={item.title}>
            <h3 className="text-lg font-bold font-sans text-foreground/60">
              {item.title}
            </h3>
            <p className="mt-2 text-base font-sans text-foreground/60 whitespace-pre-line">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}