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

  // Calculate position above QuoteTicker
  // QuoteTicker height: ~50-60px (mobile) or ~60-70px (desktop) + safe-bottom
  const bottomOffset = isMobile ? 'bottom-28' : 'bottom-24';

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${bottomOffset} right-4 sm:right-6 z-[100] ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} rounded-full bg-gradient-to-br from-brand via-brand-dark to-brand text-white shadow-2xl hover:shadow-brand/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${isMobile ? 'touch-feedback mobile-press' : ''} border-4 border-white/30 dark:border-white/20 animate-bounce-subtle ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
      aria-label={t('scrollToTop') || 'Scroll to top'}
      title={t('scrollToTop') || 'Scroll to top'}
      style={{ transition: 'opacity 0.3s ease-in-out' }}
    >
      <span className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-extrabold drop-shadow-lg`}>↑</span>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-brand/40 blur-lg -z-10 animate-pulse"></div>
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full border-2 border-brand/50 animate-ping opacity-75"></div>
    </button>
  );
}

