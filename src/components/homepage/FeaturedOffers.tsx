"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { getOptimizedCloudinaryUrl } from "@/lib/utils";

interface FeaturedOffersProps {
  offers: any[];
}

export function FeaturedOffers({ offers }: FeaturedOffersProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const renderOfferCard = (offer: any, index: number) => (
    <div key={index} className="flex-grow-0 flex-shrink-0 basis-1/3 p-4">
      <Link href={offer.ctaLink || "#"}>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src={getOptimizedCloudinaryUrl(offer.image, { width: 500 })}
            alt={offer.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <h2 className="font-bold font-heading text-2xl md:text-3xl text-[#F0EBE3]">
              {offer.title}
            </h2>
            <div className="mt-2 inline-block self-start bg-overlay-button text-[#1A1A1A] backdrop-blur-sm text-sm font-semibold font-sans px-4 py-2 rounded-full ">
              {offer.ctaButtonText}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  const renderSkeletonCard = (index: number) => (
    <div key={index} className="flex-grow-0 flex-shrink-0 basis-1/3 p-4 animate-pulse">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-300 dark:bg-gray-700">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="hidden lg:block py-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold font-heading text-center sm:text-4xl mb-8">Exclusive Timepiece Releases</h2>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -m-4"> {/* Negative margin to offset padding in cards */}
            {offers && offers.length > 0
              ? offers.map(renderOfferCard)
              : Array.from({ length: 3 }).map((_, i) => renderSkeletonCard(i))}
          </div>
        </div>
      </div>
    </section>
  );
}