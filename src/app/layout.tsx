import './globals.css';
import { BottomNavigation } from '@/components/BottomNavigation';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';
import { QuoteTicker } from '@/components/QuoteTicker';
import { SkipLink } from '@/components/SkipLink';

export const metadata = {
  title: 'SportTrack',
  description: 'Ön tanımlı aktivitelerle günlük 10.000 puan hedefini takip et',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SportTrack',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon-192.png',
  },
  // Performance optimizations
  other: {
    'dns-prefetch': 'https://fonts.googleapis.com',
    preconnect: 'https://fonts.gstatic.com',
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0ea5e9',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className="overflow-x-hidden h-full scroll-smooth">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Prevent layout shift by setting initial dimensions */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Prevent CLS - set initial dimensions for critical elements */
            body { min-height: 100vh; }
            main { min-height: calc(100vh - 200px); }
            /* Optimize font loading */
            @font-face {
              font-family: system-ui;
              font-display: swap;
            }
          `,
          }}
        />
      </head>
      <body
        className="min-h-screen h-full bg-white dark:bg-black overflow-x-hidden safe-top safe-bottom"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Use the same key as ThemeToggle component
                  const saved = localStorage.getItem('theme');
                  const theme = saved || 'system';
                  
                  // Check system preference immediately
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
                  
                  // Apply theme before page renders to prevent flash
                  document.documentElement.classList.toggle('dark', isDark);
                  
                  // Listen for system theme changes if using system theme
                  if (theme === 'system') {
                    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    const handleChange = (e) => {
                      document.documentElement.classList.toggle('dark', e.matches);
                    };
                    // Modern browsers
                    if (mediaQuery.addEventListener) {
                      mediaQuery.addEventListener('change', handleChange);
                    } else {
                      // Fallback for older browsers
                      mediaQuery.addListener(handleChange);
                    }
                  }
                } catch (e) {
                  // Fallback: check system preference if localStorage fails
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', systemPrefersDark);
                }
              })();
            `,
          }}
        />
        <Providers>
          <SkipLink />
          <div
            id="aria-live-region"
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          />
          <Header />
          <main
            id="main-content"
            className="container py-4 sm:py-6 page-transition-wrapper"
            style={{
              paddingBottom:
                'max(1.5rem, calc(64px + 32px + 1.5rem + env(safe-area-inset-bottom, 0px)))',
            }}
            role="main"
            aria-label="Main content"
          >
            {children}
          </main>
          <ScrollToTop />
          <QuoteTicker />
          <BottomNavigation />
        </Providers>
      </body>
    </html>
  );
}
