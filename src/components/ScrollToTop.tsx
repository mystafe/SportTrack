'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useI18n } from '@/lib/i18n';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useI18n();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  // Calculate position above QuoteTicker
  // QuoteTicker height: ~40-50px (mobile) or ~50-60px (desktop) + safe-bottom
  const bottomOffset = isMobile ? 'bottom-24' : 'bottom-20';

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${bottomOffset} right-4 sm:right-6 z-[60] ${isMobile ? 'w-12 h-12' : 'w-14 h-14'} rounded-full bg-gradient-to-br from-brand via-brand to-brand-dark text-white shadow-2xl hover:shadow-brand/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${isMobile ? 'touch-feedback mobile-press' : ''} border-2 border-white/20 dark:border-white/10 animate-bounce-subtle`}
      aria-label={t('scrollToTop') || 'Scroll to top'}
      title={t('scrollToTop') || 'Scroll to top'}
    >
      <span className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold drop-shadow-lg`}>↑</span>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-brand/30 blur-md -z-10 animate-pulse"></div>
    </button>
  );
}

