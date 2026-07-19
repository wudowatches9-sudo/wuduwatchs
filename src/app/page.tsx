import type { Metadata } from 'next';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

const siteUrl = 'https://wuduwatchs.vercel.app';

export const metadata: Metadata = {
  title: 'Wudo Watches | Premium Luxury Timepieces & Watches in Bangladesh',
  description: 'Discover authentic, premium quality luxury watches at Wudo Watches. Shop automatic, quartz, and chronograph timepieces online in Bangladesh. Cash on delivery available.',
  openGraph: {
    title: 'Wudo Watches | Premium Luxury Timepieces & Watches in Bangladesh',
    description: 'The new standard for luxury watches in Bangladesh. Shop our latest collection of premium timepieces.',
    images: [
      {
        url: `${siteUrl}/logo.png`, // Absolute URL
        width: 1200,
        height: 630,
        alt: 'Wudo Watches Logo',
      },
    ],
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wudo Watches | Premium Luxury Timepieces & Watches in Bangladesh',
    description: 'The new standard for luxury watches in Bangladesh. Shop our latest collection of premium timepieces.',
    images: [`${siteUrl}/logo.png`], // Absolute URL
  },
};

import { Suspense } from 'react';
import { 
  getFeaturedProducts, 
  getAllFeaturedOffers, 
  getLookbookData, 
  getJustForYouProducts, 
  getAllSocialPosts,
  getAllHeroBanners,
  getProductBySlug
} from '@/lib/contentful';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturedOffers } from '@/components/homepage/FeaturedOffers';
import FeaturedCategories from '@/components/homepage/FeaturedCategories';
import { LookbookSection } from '@/components/homepage/LookbookSection';
import { TrendingProducts } from '@/components/homepage/TrendingProducts';
import { JustForYouSection } from '@/components/homepage/JustForYouSection';
import { SocialProofSection } from '@/components/homepage/SocialProofSection';
import { HomepageSkeleton } from '@/components/skeletons/HomepageSkeleton';

async function HomeContent() {
  // Data is fetched ONCE on the server in parallel when the page is requested
  const [
    featuredProducts, 
    featuredOffers, 
    lookbookData, 
    justForYouProducts, 
    socialPosts,
    heroBanners
  ] = await Promise.all([
    getFeaturedProducts(),
    getAllFeaturedOffers(),
    getLookbookData(),
    getJustForYouProducts(),
    getAllSocialPosts(),
    getAllHeroBanners(),
  ]);

  // Resolve linked product details for all hero banners in parallel
  const resolvedHeroBanners = await Promise.all(
    heroBanners.map(async (banner) => {
      if (banner && banner.ctaLink) {
        const product = await getProductBySlug(banner.ctaLink);
        return { ...banner, product };
      }
      return { ...banner, product: null };
    })
  );

  // Resolve linked product details for each mobile offer in parallel
  const resolvedOffers = await Promise.all(
    featuredOffers.map(async (offer) => {
      if (offer && offer.ctaLink) {
        const product = await getProductBySlug(offer.ctaLink);
        return { ...offer, product };
      }
      return { ...offer, product: null };
    })
  );

  return (
    <>
      <HeroSection offers={resolvedOffers} heroBanners={resolvedHeroBanners} />
      <FeaturedOffers offers={resolvedOffers} />
      <div className="md:hidden">
        <FeaturedCategories />
      </div>
      <TrendingProducts products={featuredProducts} />
      <JustForYouSection products={justForYouProducts} />
      <LookbookSection lookbook={lookbookData} />
      <SocialProofSection socialPosts={socialPosts} />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<HomepageSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
