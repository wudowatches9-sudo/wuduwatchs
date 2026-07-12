import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/contentful';
import { ProductPageClient } from '@/components/products/ProductPageClient';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

interface ProductPageProps {
  params: {
    productHandle: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.productHandle);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const price = product.price ? `৳${product.price}` : '';
  const availability = product.stock > 0 ? 'in stock' : 'out of stock';

  return {
    title: product.name,
    description: product.shortDescription || `${product.name} - ${price}. ${product.longDescription?.substring(0, 150) || 'Premium luxury timepiece from Wudo Watches.'}`,
    keywords: [
      product.name,
      product.category,
      product.subcategory || '',
      'buy online',
      'Wudo Watches',
      'Bangladesh',
      'premium watches',
      'luxury timepiece',
    ].filter(Boolean),
    openGraph: {
      title: product.name,
      description: product.shortDescription || `${product.name} - Premium luxury timepiece from Wudo Watches`,
      images: [
        {
          url: product.images.main || '/logo.png',
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription || `${product.name} - Premium luxury timepiece from Wudo Watches`,
      images: [product.images.main || '/logo.png'],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    other: {
      'product:price:amount': product.price?.toString() || '',
      'product:price:currency': 'BDT',
      'product:availability': availability,
      'product:condition': 'new',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.productHandle);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}