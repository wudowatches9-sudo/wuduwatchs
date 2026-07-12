"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { getOptimizedCloudinaryUrl } from "@/lib/utils";
import { Star } from "lucide-react";

interface HeroSectionProps {
  offers: any[];
  heroBanners: any[] | null;
}

export function HeroSection({ offers, heroBanners }: HeroSectionProps) {
  // Mobile Carousel (loop + autoplay)
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  // Desktop Carousel (loop + autoplay)
  const [emblaDesktopRef, emblaDesktopApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onSelect = React.useCallback(() => {
    if (!emblaDesktopApi) return;
    setSelectedIndex(emblaDesktopApi.selectedScrollSnap());
  }, [emblaDesktopApi]);

  React.useEffect(() => {
    if (!emblaDesktopApi) return;
    onSelect();
    setScrollSnaps(emblaDesktopApi.scrollSnapList());
    emblaDesktopApi.on("select", onSelect);
    emblaDesktopApi.on("reInit", onSelect);
  }, [emblaDesktopApi, onSelect]);

  const renderOfferCard = (offer: any, index: number) => {
    const product = offer.product;
    const redirectUrl = product ? `/products/${product.slug}` : (offer.ctaLink || "#");

    return (
      <div key={index} className="flex-grow-0 flex-shrink-0 basis-4/5 ml-4 bg-zinc-950/40 rounded-2xl overflow-hidden border border-zinc-900/60 group">
        <Link href={redirectUrl}>
          <div className="relative aspect-[4/3] rounded-t-2xl overflow-hidden">
            <Image
              src={getOptimizedCloudinaryUrl(offer.image, { width: 600 })}
              alt={offer.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product && product.salePercentage && product.salePercentage > 0 && (
              <div className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-black z-10">
                -{product.salePercentage}%
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col justify-between min-h-[130px] text-left">
            <div>
              <h3 className="font-bold font-heading text-lg text-[#F0EBE3] line-clamp-1">
                {product ? product.name : offer.title}
              </h3>
              {product && (
                <div className="mt-1 flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          product.rating && i < Math.round(product.rating)
                            ? "fill-primary text-primary"
                            : "fill-none text-muted-foreground"
                        }
                      />
                    ))}
                  </div>
                  {product.reviewCount > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                {product ? (
                  <div className="flex flex-col">
                    <span className="font-sans text-base font-bold text-foreground">
                      ৳ {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ৳ {product.originalPrice}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Special Offer</span>
                )}
              </div>
              <div className="inline-block bg-overlay-button text-[#1A1A1A] backdrop-blur-sm text-[10px] font-bold font-sans px-3 py-1.5 rounded-full transition-colors uppercase tracking-wider">
                {offer.ctaButtonText || "Shop Now"}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const renderDesktopSlide = (banner: any, index: number) => {
    const product = banner.product;
    const redirectUrl = product ? `/products/${product.slug}` : (banner.ctaLink || "#");

    return (
      <div key={index} className="flex-grow-0 flex-shrink-0 basis-full min-w-0 relative h-[65vh] w-full group cursor-pointer">
        <Link href={redirectUrl}>
          <Image
            src={banner.image}
            alt={product ? product.name : banner.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            priority={index === 0}
          />
        </Link>
      </div>
    );
  };

  const renderSkeletonCard = (index: number) => (
    <div key={index} className="flex-grow-0 flex-shrink-0 basis-4/5 ml-4 animate-pulse">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-300 dark:bg-gray-700">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  const renderSkeletonDesktopSlide = (index: number) => (
    <div key={index} className="flex-grow-0 flex-shrink-0 basis-full min-w-0 relative h-[65vh] w-full bg-zinc-950/40 animate-pulse border border-zinc-900 rounded-3xl" />
  );

  return (
    <>
      {/* Mobile View (lg:hidden) */}
      <div className="lg:hidden overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {offers && offers.length > 0
            ? offers.map(renderOfferCard)
            : Array.from({ length: 3 }).map((_, i) => renderSkeletonCard(i))}
        </div>
      </div>

      {/* Desktop View (hidden lg:block) - Autoplay Banner Carousel */}
      <div className="hidden lg:block relative group overflow-hidden rounded-3xl border border-zinc-900">
        <div className="overflow-hidden" ref={emblaDesktopRef}>
          <div className="flex">
            {heroBanners && heroBanners.length > 0
              ? heroBanners.map(renderDesktopSlide)
              : Array.from({ length: 3 }).map((_, i) => renderSkeletonDesktopSlide(i))}
          </div>
        </div>

        {/* Navigation Dots */}
        {scrollSnaps.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaDesktopApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "w-6 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
