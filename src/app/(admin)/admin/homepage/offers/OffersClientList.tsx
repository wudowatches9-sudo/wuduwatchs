"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { OfferListItem } from "./OfferListItem";

interface OffersClientListProps {
  offers: any[];
}

export function OffersClientList({ offers }: OffersClientListProps) {
  const searchParams = useSearchParams();

  // Show toast notifications from URL params
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success(success);
      window.history.replaceState({}, "", "/admin/homepage/offers");
    }
    if (error) {
      toast.error(error);
      window.history.replaceState({}, "", "/admin/homepage/offers");
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Featured Offers</h1>
        <Link href="/admin/homepage/offers/new">
          <Button className="bg-green-500 text-black hover:bg-green-600">
            Create New Offer
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <OfferListItem key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
