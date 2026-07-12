"use client";

import { useFormState } from "react-dom";
import { createOrUpdateHeroBanner } from "@/actions/heroBannerActions";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { AdminInput } from "@/components/admin/AdminInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Product } from "@/types/product";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroBannerFormClientProps {
  initialBanner: any | null;
  products: Product[];
  bannerId: string;
}

const initialState = {
  error: undefined,
  message: "",
  success: false,
};

export function HeroBannerFormClient({ initialBanner, products, bannerId }: HeroBannerFormClientProps) {
  const [state, formAction] = useFormState(createOrUpdateHeroBanner, initialState);
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialBanner?.image || null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin/homepage/hero-banner?success=" + encodeURIComponent(state.message));
      router.refresh();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <form action={formAction} className="space-y-6 max-w-2xl bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
      <input type="hidden" name="bannerId" value={bannerId} />
      
      {initialBanner?.image && (
        <input
          type="hidden"
          name="currentImageUrl"
          value={initialBanner.image}
        />
      )}

      {/* Select Product */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="productSlug" className="text-sm font-semibold text-zinc-300">Link Product</Label>
        <select
          id="productSlug"
          name="productSlug"
          defaultValue={initialBanner?.ctaLink || ""}
          className="flex h-10 w-full rounded-md border border-zinc-800 bg-rich-black px-3 py-2 text-sm text-soft-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="" disabled>Select a product to link...</option>
          {products.map((product) => (
            <option key={product.slug} value={product.slug}>
              {product.name} (৳ {product.price})
            </option>
          ))}
        </select>
        <p className="text-xs text-zinc-500">The banner will automatically link to this product's detail page when clicked.</p>
      </div>

      {/* Button Text */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="ctaButtonText" className="text-sm font-semibold text-zinc-300">CTA Button Text</Label>
        <AdminInput
          id="ctaButtonText"
          name="ctaButtonText"
          defaultValue={initialBanner?.ctaButtonText || "Shop Now"}
          required
        />
      </div>

      {/* Background Image Upload */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="image" className="text-sm font-semibold text-zinc-300">Banner Background Image</Label>
        <AdminInput
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required={!initialBanner?.image}
        />
        {previewUrl && (
          <div className="mt-4 relative aspect-[21/9] w-full rounded-lg overflow-hidden border border-zinc-800">
            <Image
              src={previewUrl}
              alt="Banner background preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="pt-4 flex gap-4">
        <SubmitButton className="flex-1 bg-green-500 text-black hover:bg-green-600 font-semibold py-2.5 rounded-lg transition-colors">
          Save Hero Banner
        </SubmitButton>
        <Link href="/admin/homepage/hero-banner" className="flex-1">
          <Button type="button" variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold py-2.5 rounded-lg transition-colors">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
