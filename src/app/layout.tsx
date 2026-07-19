import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
});

const siteUrl = 'https://wuduwatchs.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Wudo Watches',
    default: 'Wudo Watches | Premium Luxury Timepieces & Watches in Bangladesh',
  },
  description: 'Discover authentic, premium quality luxury watches at Wudo Watches. Shop automatic, quartz, and chronograph timepieces online in Bangladesh. Cash on delivery available.',
  keywords: ['online shopping Bangladesh', 'watch collector BD', 'luxury watches', 'Wudo Watches', 'buy watches online', 'automatic watch price BD', 'chronograph watches', 'premium timepieces', 'mens watches Bangladesh', 'horology BD'],
  authors: [{ name: 'Wudo Watches' }],
  creator: 'Wudo Watches',
  publisher: 'Wudo Watches',
  openGraph: {
    title: 'Wudo Watches | Premium Authentic Watches',
    description: 'The new standard for luxury timepieces in Bangladesh.',
    url: siteUrl,
    siteName: 'Wudo Watches',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Wudo Watches Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wudo Watches | Premium Authentic Watches',
    description: 'The new standard for luxury timepieces in Bangladesh.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'OfC4YqWL8D2j3b-KUEOKeQkVbazla9bHZVSTG5MG0xQ',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2F0QKSRYJK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2F0QKSRYJK');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${satoshi.variable}`}>
        <RootLayoutClient>{children}</RootLayoutClient>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Wudo Watches',
              url: 'https://wuduwatchs.vercel.app',
            }),
          }}
        />
      </body>
    </html>
  );
}