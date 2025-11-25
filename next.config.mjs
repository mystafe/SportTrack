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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Optimize production builds
  swcMinify: true,
  // Reduce JavaScript bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

// Disable PWA/Service Worker for Firebase deployments to prevent navigation issues
const pwaConfig = withPWA({
  dest: 'public',
  register: process.env.FIREBASE_DEPLOY !== 'true', // Disable SW for Firebase
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development' || process.env.FIREBASE_DEPLOY === 'true',
  runtimeCaching: [
    {
      // Don't cache navigation requests - always use network
      urlPattern: /^https?:\/\/.*\/$/,
      handler: 'NetworkOnly',
    },
    {
      // Don't cache page routes - always use network
      urlPattern: /^https?:\/\/.*\/(activities|stats|achievements|challenges|add)(\/.*)?$/,
      handler: 'NetworkOnly',
    },
    {
      // Cache static assets
      urlPattern: /^https?.*\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 31536000, // 1 year
        },
      },
    },
    {
      // Cache other resources with NetworkFirst
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

