import withPWA from 'next-pwa';

const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export for Firebase Hosting
  output: process.env.FIREBASE_DEPLOY === 'true' ? 'export' : undefined,
  // Disable image optimization for static export
  images: process.env.FIREBASE_DEPLOY === 'true' ? {
    unoptimized: true,
  } : {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

export default withBundleAnalyzer(pwaConfig(nextConfig));

