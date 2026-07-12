const nextConfig = {
  images: {
    domains: ["images.ctfassets.net", "res.cloudinary.com", "aura-perfume.vercel.app", "images.unsplash.com"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache for images
    formats: ['image/avif', 'image/webp'], // Prefer modern formats
  },
  output: 'standalone',
};

module.exports = nextConfig;
