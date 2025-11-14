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

    const checkVisibility = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      // More aggressive: Show if page is scrollable and user has scrolled at least 30px
      // OR if content is significantly taller than viewport (more than 150px difference)
      const canScroll = documentHeight > viewportHeight + 50;
      const hasScrolled = scrollY > 30;
      const isLongPage = documentHeight > viewportHeight + 150;
      
      // Show button if page is scrollable and (user scrolled OR it's a long page)
      const shouldShow = canScroll && (hasScrolled || isLongPage);
      setIsVisible(shouldShow);
    };

    // Initial check immediately
    checkVisibility();

    // Listen to scroll events
    window.addEventListener('scroll', checkVisibility, { passive: true, capture: true });
    window.addEventListener('wheel', checkVisibility, { passive: true });
    window.addEventListener('touchmove', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    
    // Check multiple times to catch dynamic content
    const timeouts = [
      setTimeout(checkVisibility, 100),
      setTimeout(checkVisibility, 500),
      setTimeout(checkVisibility, 1000),
      setTimeout(checkVisibility, 2000),
    ];
    
    return () => {
      window.removeEventListener('scroll', checkVisibility, true);
      window.removeEventListener('wheel', checkVisibility);
      window.removeEventListener('touchmove', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      timeouts.forEach(timeout => clearTimeout(timeout));
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
  // Position button higher to ensure visibility - moved up by 20px
  const bottomOffset = isMobile ? 'bottom-52' : 'bottom-48';

  return (
    <div
      className={`fixed ${bottomOffset} right-4 sm:right-6 z-[99999] transition-all duration-500 ease-in-out ${!isVisible ? 'opacity-0 pointer-events-none translate-y-4 scale-90' : 'opacity-100 pointer-events-auto translate-y-0 scale-100'}`}
      style={{ 
        willChange: 'opacity, transform',
        position: 'fixed',
        visibility: isVisible ? 'visible' : 'hidden',
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

