import type { Metadata } from 'next';
import { getProductsByCollection } from '@/lib/contentful';
import { CollectionPageClient } from '@/components/collections/CollectionPageClient';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

interface CollectionPageProps {
  params: {
    collectionHandle: string;
  };
}

// Category configuration for metadata
const COLLECTION_INFO: Record<string, { name: string; description: string }> = {
  all: {
    name: 'All Products',
    description: 'Browse our complete collection of premium watches. From automatic to quartz, find your perfect timepiece at Wudo Watches.',
  },
  automatic: {
    name: 'Automatic Watches',
    description: 'Discover our premium collection of automatic mechanical watches. Engineered for absolute precision with self-winding mechanics.',
  },
  quartz: {
    name: 'Quartz Watches',
    description: 'Explore our exclusive range of high-accuracy quartz watches. Reliable, battery-powered timepieces with minimal maintenance.',
  },
  chronograph: {
    name: 'Chronograph Watches',
    description: 'Shop our collection of luxury chronograph watches. Masterful stopwatch functionality paired with sophisticated multi-dial aesthetics.',
  },
  diver: {
    name: 'Diver Watches',
    description: 'Discover robust dive watches built for durability. High water resistance, rotating bezels, and luminescent markers.',
  },
  luxury: {
    name: 'Luxury Watches',
    description: 'Premium luxury watches from elite horology houses. Exemplary craftsmanship, high-end materials, and prestigious heritage.',
  },
  classic: {
    name: 'Classic Watches',
    description: 'Timeless classic and dress watches. Elegant silhouettes, minimalist dials, and perfect proportions for formal attire.',
  },
  accessories: {
    name: 'Accessories Collection',
    description: 'Complete your look with our range of watch accessories, straps and winders. Quality products to complement your style.',
  },
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const handle = params.collectionHandle;
  const info = COLLECTION_INFO[handle] || {
    name: `${handle.charAt(0).toUpperCase() + handle.slice(1)} Collection`,
    description: `Shop our exclusive collection of premium ${handle} at Wudo Watches. Online shopping in Bangladesh with cash on delivery.`,
  };

  return {
    title: info.name,
    description: info.description,
    keywords: [
      handle,
      'luxury watches',
      'Bangladesh',
      'online shopping',
      'Wudo Watches',
      'premium timepieces',
      'buy online BD',
      'cash on delivery',
    ],
    openGraph: {
      title: info.name,
      description: info.description,
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${info.name} - Wudo Watches`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: info.name,
      description: info.description,
      images: ['/logo.png'],
    },
    alternates: {
      canonical: `/collections/${handle}`,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const products = await getProductsByCollection(params.collectionHandle);

  return <CollectionPageClient products={products} collectionHandle={params.collectionHandle} />;
}
