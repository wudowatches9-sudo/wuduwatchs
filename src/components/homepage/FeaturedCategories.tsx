import Link from "next/link";
import Image from "next/image";
import React from "react";

// This is our hardcoded data. Later, this will come from a CMS.
// Ensure you have images at these paths in your /public folder.
const categories = [
  {
    id: 1,
    name: "AUTOMATIC",
    slug: "automatic",
    imageUrl: "/images/placeholder.png",
  },
  {
    id: 2,
    name: "QUARTZ",
    slug: "quartz",
    imageUrl: "/images/placeholder.png",
  },
  {
    id: 3,
    name: "CHRONOGRAPH",
    slug: "chronograph",
    imageUrl: "/images/placeholder.png",
  },
  {
    id: 4,
    name: "DIVER",
    slug: "diver",
    imageUrl: "/images/placeholder.png",
  },
];

const FeaturedCategories = () => {
  return (
    <section>
      <div className="lg:hidden mt-8">
        <div className="px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold font-heading text-foreground dark:text-foreground sm:text-4xl text-left">
              Categories
            </h2>
            <Link
              href="/collections/all"
              className="text-sm font-sans text-muted-foreground transition-colors hover:text-foreground dark:text-foreground/60"
            >
              See all
            </Link>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collections/${category.slug}`}
                className="block whitespace-nowrap rounded-full border border-border dark:border-border bg-background px-4 py-2 text-sm font-medium font-sans text-foreground dark:text-foreground/60 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-heading text-foreground sm:text-4xl">
            Shop by Collection
          </h2>
          <p className="mt-4 font-sans text-base text-muted-foreground">
            Explore our curated collections, designed with purpose and passion.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={category.imageUrl}
                  alt={`Image for ${category.name} category`}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-xl font-bold font-heading text-white">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
