"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { HeroBannerListItem } from "./HeroBannerListItem";

interface HeroBannerClientListProps {
  banners: any[];
}

export function HeroBannerClientList({ banners }: HeroBannerClientListProps) {
  const searchParams = useSearchParams();

  // Show toast notifications from URL params
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success(success);
      window.history.replaceState({}, "", "/admin/homepage/hero-banner");
    }
    if (error) {
      toast.error(error);
      window.history.replaceState({}, "", "/admin/homepage/hero-banner");
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Desktop Hero Banners</h1>
        <Link href="/admin/homepage/hero-banner/new">
          <Button className="bg-green-500 text-black hover:bg-green-600">
            Create New Banner
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {banners.length > 0 ? (
          banners.map((banner) => (
            <HeroBannerListItem key={banner.id} banner={banner} />
          ))
        ) : (
          <div className="p-8 border border-dashed rounded text-center text-muted-foreground bg-zinc-950/20">
            No hero banners found. Click the button above to create one.
          </div>
        )}
      </div>
    </div>
  );
}
