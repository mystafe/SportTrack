'use client';

import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useI18n } from '@/lib/i18n';

export function ScrollToTop() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToTop = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    // Use multiple methods to ensure scrolling works
    // Method 1: Smooth scroll
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Method 2: Direct scroll (fallback)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Method 3: Window scroll (additional fallback)
    window.scrollTo(0, 0);

    // Method 4: Scroll main element if exists
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
  };

  if (!mounted) return null;

  // Calculate position above QuoteTicker - much lower
  // QuoteTicker height: ~50-60px (mobile) or ~60-70px (desktop) + safe-bottom
  // Position button much lower
  const bottomOffset = isMobile ? 'bottom-32' : 'bottom-28';

  return (
    <div
      className={`fixed ${bottomOffset} right-4 sm:right-6 z-[99999] transition-all duration-500 ease-in-out`}
      style={{
        willChange: 'opacity, transform',
        position: 'fixed',
      }}
    >
      <button
        onClick={scrollToTop}
        type="button"
        className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-gradient-to-br from-brand via-brand-dark to-brand text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${isMobile ? 'touch-feedback mobile-press' : ''} border-2 border-white/20 dark:border-white/15 opacity-60 hover:opacity-100 relative overflow-visible`}
        aria-label={t('scrollToTop') || 'Scroll to top'}
        title={t('scrollToTop') || 'Scroll to top'}
      >
        <span
          className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black drop-shadow-md relative z-10`}
        >
          ↑
        </span>
        {/* Subtle glow effect - only on hover */}
        <div className="absolute inset-0 rounded-full bg-brand/20 blur-sm -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  );
}
