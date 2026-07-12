"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { cn, getOptimizedCloudinaryUrl } from '@/lib/utils';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  product: any;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product, selectedImage, setSelectedImage }) => {
  const { main: mainImage, gallery: galleryImages } = product.images;
  const allImages = [mainImage, ...(galleryImages || [])].filter(Boolean);
  const productName = product.name;

  // Remove autoplay for user-controlled experience
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Carousel only controls its own index for mobile dots
  // It does NOT control selectedImage - that's controlled by user clicks
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Sync selectedImage to carousel when user clicks mobile carousel
  const handleMobileImageClick = (index: number) => {
    setSelectedImage(allImages[index]);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="relative">
      {/* Mobile Carousel */}
      <div className="lg:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {allImages.map((src: string, index: number) => (
              <div 
                className="relative flex-[0_0_100%] aspect-[4/3] cursor-zoom-in group" 
                key={index}
                onClick={() => handleMobileImageClick(index)}
              >
                <Image
                  src={getOptimizedCloudinaryUrl(src, { width: 800 })}
                  alt={`${productName} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {allImages.map((_: string, index: number) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 w-2 rounded-full ${selectedIndex === index ? 'bg-white' : 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Gallery */}
      <div className="hidden lg:flex flex-col gap-4">
        <div 
          className="relative aspect-[4/3] w-full overflow-hidden rounded-lg cursor-zoom-in group"
          onClick={() => {
            const index = allImages.indexOf(selectedImage);
            setLightboxIndex(index);
            setIsLightboxOpen(true);
          }}
        >
          <Image
            src={getOptimizedCloudinaryUrl(selectedImage, { width: 800 })}
            alt={`Featured image of ${productName}`}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={48} />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {allImages.map((src: string, index: number) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(src);
              }}
              className={cn(
                'relative aspect-square w-full overflow-hidden rounded-md transition-all',
                'ring-offset-2 ring-offset-background',
                selectedImage === src ? 'ring-2 ring-primary' : 'hover:opacity-90'
              )}
            >
              <Image
                src={getOptimizedCloudinaryUrl(src, { width: 200 })}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="8vw"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={lightboxIndex}
        slides={allImages.map((src: string) => ({ src: getOptimizedCloudinaryUrl(src, { width: 1200 }) }))}
        on={{
          view: ({ index }) => setLightboxIndex(index),
        }}
      />
    </div>
  );
};