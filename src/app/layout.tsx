import './globals.css';
import { BottomNavigation } from '@/components/BottomNavigation';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { FloatingAddButton } from '@/components/FloatingAddButton';
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
        style={{
          overflowY: 'hidden',
          height: '100vh',
        }}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Function to read theme from localStorage
                  function readTheme() {
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
                        if (settingsRaw) {
                          const settings = JSON.parse(settingsRaw);
                          if (settings && settings.theme && (settings.theme === 'light' || settings.theme === 'dark' || settings.theme === 'system')) {
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
                  }
                  
                  // Read theme immediately
                  let theme = readTheme();
                  
                  // Function to apply theme
                  function applyTheme(themeValue) {
                    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const isDark = themeValue === 'dark' || (themeValue === 'system' && systemPrefersDark);
                    document.documentElement.classList.toggle('dark', isDark);
                    // Also set data attribute for CSS selectors
                    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                  }
                  
                  // Apply theme immediately before page renders to prevent flash
                  applyTheme(theme);
                  
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
            className="container py-4 sm:py-6 mobile-scroll-area"
            style={{
              paddingTop: 'calc(64px + 2px + 1rem)',
              paddingBottom:
                'max(1.5rem, calc(56px + 32px + 1.5rem + env(safe-area-inset-bottom, 0px)))',
            }}
            role="main"
            aria-label="Main content"
          >
            {children}
          </main>
          <FloatingAddButton />
          <QuoteTicker />
          <BottomNavigation />
        </Providers>
      </body>
    </html>
  );
}
