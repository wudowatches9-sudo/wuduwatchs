import Image from 'next/image';
import Link from 'next/link';

export function LookbookSection({ lookbook }: { lookbook: any }) {
  if (!lookbook) {
    return null;
  }

  return (
    <section className="relative overflow-hidden lg:h-[70vh] mt-16 sm:mt-24">
      <div className="relative h-full">
        {lookbook.fields.backgroundImage && (
          <Image
            src={lookbook.fields.backgroundImage}
            alt={lookbook.fields.title || 'Lookbook background'}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-[#F0EBE3] lg:text-7xl">
            {lookbook.fields.title}
          </h2>
          <p className="mt-6 max-w-2xl font-sans text-base text-gray-100 lg:text-xl dark:text-soft-white">
            {lookbook.fields.subtitle}
          </p>
          {lookbook.fields.ctaLink && lookbook.fields.ctaButtonText && (
            <Link
              href={lookbook.fields.ctaLink}
              target="_blank"
              className="mt-8 rounded-full bg-overlay-button text-[#1A1A1A] backdrop-blur-sm px-10 py-4 font-sans text-base font-bold uppercase tracking-wide transition-transform hover:scale-105 active:scale-95"
            >
              {lookbook.fields.ctaButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
