import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/', '/account/'],
    },
    sitemap: 'https://wuduwatchs.vercel.app/sitemap.xml',
  };
}
