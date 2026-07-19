"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { OfferListItem } from "./OfferListItem";
import { Plus } from "lucide-react";

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
    <div className="font-sans text-soft-white min-h-screen">
      {/* Title Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Featured Offers</h1>
        <Link href="/admin/homepage/offers/new">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95">
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Offer</span>
          </button>
        </Link>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-16 bg-[#12131a]/40 rounded-xl border border-zinc-800/40">
          <p className="text-zinc-400 mb-4 font-sans text-sm">
            No featured offers created yet.
          </p>
          <Link href="/admin/homepage/offers/new">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-lg text-sm font-semibold transition-all shadow-md mx-auto">
              <Plus size={16} strokeWidth={2.5} />
              <span>Create Your First Offer</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <OfferListItem key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
