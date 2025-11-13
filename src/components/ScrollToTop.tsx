'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useI18n } from '@/lib/i18n';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollY > 300);
    };

    // Initial check
    handleScroll();

    // Listen to scroll events with multiple methods
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [mounted]);

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!mounted) return null;

  // Calculate position above QuoteTicker
  // QuoteTicker height: ~50-60px (mobile) or ~60-70px (desktop) + safe-bottom
  // Use larger offset to ensure visibility
  const bottomOffset = isMobile ? 'bottom-36' : 'bottom-32';

  return (
    <div
      className={`fixed ${bottomOffset} right-4 sm:right-6 z-[99999] transition-all duration-500 ease-in-out ${!isVisible ? 'opacity-0 pointer-events-none translate-y-4 scale-90' : 'opacity-100 pointer-events-auto translate-y-0 scale-100'}`}
      style={{ 
        willChange: 'opacity, transform',
      }}
    >
      <button
        onClick={scrollToTop}
        className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full bg-gradient-to-br from-brand via-brand-dark to-brand text-white shadow-2xl hover:shadow-brand/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${isMobile ? 'touch-feedback mobile-press' : ''} border-4 border-white/40 dark:border-white/30 animate-bounce-subtle relative overflow-visible`}
        aria-label={t('scrollToTop') || 'Scroll to top'}
        title={t('scrollToTop') || 'Scroll to top'}
      >
        <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-black drop-shadow-2xl relative z-10`}>↑</span>
        {/* Multiple glow effects */}
        <div className="absolute inset-0 rounded-full bg-brand/50 blur-xl -z-10 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-brand/30 blur-2xl -z-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full border-4 border-brand/60 animate-ping opacity-50 -z-30"></div>
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50"></div>
      </button>
    </div>
  );
}

