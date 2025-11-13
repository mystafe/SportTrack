'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

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

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-8 right-8'} z-50 ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-brand text-white shadow-lg hover:bg-brand-dark transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${isMobile ? 'touch-feedback mobile-press' : ''}`}
      aria-label="Scroll to top"
    >
      <span className={`${isMobile ? 'text-lg' : 'text-xl'}`}>↑</span>
    </button>
  );
}

