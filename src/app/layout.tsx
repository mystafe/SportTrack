import './globals.css';
import { BottomNavigation } from '@/components/BottomNavigation';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { QuoteTicker } from '@/components/QuoteTicker';
import { SkipLink } from '@/components/SkipLink';
import { ScrollHandler } from '@/components/ScrollHandler';

export const metadata = {
  title: {
    default: 'SportTrack - Fitness Activity Tracker',
    template: '%s | SportTrack',
  },
  description:
    'Track your daily fitness activities with SportTrack. Set goals, earn badges, complete challenges, and stay motivated on your fitness journey.',
  keywords: [
    'fitness',
    'activity tracker',
    'sports',
    'health',
    'wellness',
    'exercise',
    'workout',
    'PWA',
  ],
  authors: [{ name: 'SportTrack Team' }],
  creator: 'SportTrack',
  publisher: 'SportTrack',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sporttrack.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    url: '/',
    siteName: 'SportTrack',
    title: 'SportTrack - Fitness Activity Tracker',
    description:
      'Track your daily fitness activities with SportTrack. Set goals, earn badges, complete challenges, and stay motivated.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'SportTrack Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportTrack - Fitness Activity Tracker',
    description:
      'Track your daily fitness activities with SportTrack. Set goals, earn badges, complete challenges, and stay motivated.',
    images: ['/icon-512.png'],
    creator: '@sporttrack',
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
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'SportTrack',
              description:
                'Track your daily fitness activities with SportTrack. Set goals, earn badges, complete challenges, and stay motivated on your fitness journey.',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sporttrack.app',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Activity Tracking',
                'Goal Setting',
                'Badge System',
                'Challenge System',
                'Statistics & Analytics',
                'Offline Support',
                'PWA Support',
              ],
            }),
          }}
        />
        {/* Prevent layout shift by setting initial dimensions */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Prevent CLS - set initial dimensions for critical elements */
            body { min-height: 100vh; }
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
        data-lpignore="true"
        data-1p-ignore="true"
        style={{
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check if localStorage is available
                  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
                    return;
                  }
                  
                  // Function to read theme from localStorage
                  function readTheme() {
                    try {
                      // Try to get theme from theme key first (fastest, always available)
                      let theme = null;
                      const themeFromKey = localStorage.getItem('theme');
                      if (themeFromKey && (themeFromKey === 'light' || themeFromKey === 'dark' || themeFromKey === 'system')) {
                        theme = themeFromKey;
                      }
                      
                      // If theme key doesn't have a value, try settings store
                      if (!theme) {
                        try {
                          const settingsRaw = localStorage.getItem('sporttrack.settings.v1');
                          if (settingsRaw && typeof settingsRaw === 'string') {
                            const settings = JSON.parse(settingsRaw);
                            if (settings && typeof settings === 'object' && settings.theme && (settings.theme === 'light' || settings.theme === 'dark' || settings.theme === 'system')) {
                              theme = settings.theme;
                              // Also write to theme key for faster access next time
                              localStorage.setItem('theme', settings.theme);
                            }
                          }
                        } catch (e) {
                          // Settings parse failed, use system
                        }
                      }
                      
                      // Default to system if nothing found
                      if (!theme) {
                        theme = 'system';
                      }
                      
                      return theme;
                    } catch (e) {
                      return 'system';
                    }
                  }
                  
                  // Read theme immediately
                  let theme = readTheme();
                  
                  // Function to apply theme
                  function applyTheme(themeValue) {
                    try {
                      if (typeof window === 'undefined' || !document || !document.documentElement) {
                        return;
                      }
                      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                      const isDark = themeValue === 'dark' || (themeValue === 'system' && systemPrefersDark);
                      document.documentElement.classList.toggle('dark', isDark);
                      // Also set data attribute for CSS selectors
                      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                    } catch (e) {
                      // Ignore errors
                    }
                  }
                  
                  // Apply theme immediately before page renders to prevent flash
                  if (theme) {
                    applyTheme(theme);
                  }
                  
                  // Listen for system theme changes if using system theme
                  if (theme === 'system') {
                    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    const handleChange = (e) => {
                      applyTheme('system');
                    };
                    // Modern browsers
                    if (mediaQuery.addEventListener) {
                      mediaQuery.addEventListener('change', handleChange);
                    } else {
                      // Fallback for older browsers
                      mediaQuery.addListener(handleChange);
                    }
                  }
                  
                  // Listen for theme changes from other tabs/windows and same-tab updates
                  function handleThemeChange() {
                    // Re-read theme from localStorage using the same function
                    const newTheme = readTheme();
                    if (newTheme && newTheme !== theme) {
                      theme = newTheme;
                      applyTheme(theme);
                    }
                  }
                  
                  // Listen for storage events (cross-tab)
                  window.addEventListener('storage', function(e) {
                    if (e.key === 'theme' || e.key === 'sporttrack.settings.v1') {
                      handleThemeChange();
                    }
                  });
                  
                  // Also listen for custom events (same-tab updates)
                  window.addEventListener('sporttrack:theme-changed', handleThemeChange);
                  
                  // Poll for theme changes periodically (in case settings store loads after script)
                  // This ensures theme is applied even if settings store loads after page load
                  let pollCount = 0;
                  const maxPolls = 10; // Poll for 2 seconds (10 * 200ms)
                  const pollInterval = setInterval(function() {
                    pollCount++;
                    const currentTheme = readTheme();
                    if (currentTheme !== theme) {
                      theme = currentTheme;
                      applyTheme(theme);
                    }
                    if (pollCount >= maxPolls) {
                      clearInterval(pollInterval);
                    }
                  }, 200);
                } catch (e) {
                  // Fallback: check system preference if localStorage fails
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', systemPrefersDark);
                  document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
                }
              })();
            `,
          }}
        />
        <Providers>
          <SkipLink />
          <ScrollHandler />
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
            className="mobile-scroll-area outline-none"
            tabIndex={-1}
            style={{
              paddingTop: 'calc(56px + 2px)',
              paddingBottom: 'calc(76px + env(safe-area-inset-bottom))', // Safe area + BottomNav + QuoteTicker
              paddingLeft: '1rem',
              paddingRight: '1rem',
              marginBottom: 0,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: '100vh', // Ensure full height for background
              touchAction: 'pan-y',
              WebkitOverflowScrolling: 'touch',
            }}
            role="main"
            aria-label="Main content"
            data-lpignore="true"
            data-1p-ignore="true"
          >
            {children}
          </main>
          <FloatingAddButton />
          <BottomNavigation />
        </Providers>
      </body>
    </html>
  );
}
