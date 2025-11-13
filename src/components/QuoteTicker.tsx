'use client';

import { useState, useEffect, useRef } from 'react';
import { getRandomQuote, type Quote } from '@/lib/quotes';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function QuoteTicker() {
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setQuote(getRandomQuote());
    
    const interval = setInterval(() => {
      setIsGlowing(true);
      setTimeout(() => {
        setIsGlowing(false);
        setTimeout(() => {
          setQuote(getRandomQuote());
        }, 500);
      }, 2000);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !quote) return null;

  const quoteText = lang === 'tr' ? quote.tr : quote.en;

  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-brand/25 via-brand/20 to-brand/25 dark:from-brand/35 dark:via-brand/25 dark:to-brand/35 border-t-2 border-brand/60 dark:border-brand/70 ${isMobile ? 'py-3.5' : 'py-4.5'} overflow-hidden safe-bottom shadow-2xl backdrop-blur-md`}
    >
      <div className="relative w-full h-full flex items-center">
        {/* Enhanced gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-brand/25 via-brand/10 to-transparent dark:from-brand/35 dark:via-brand/15 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-brand/25 via-brand/10 to-transparent dark:from-brand/35 dark:via-brand/15 z-10 pointer-events-none"></div>
        
        {/* Decorative dots */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand/60 dark:bg-brand/80 z-10 animate-pulse"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand/60 dark:bg-brand/80 z-10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Scrolling content */}
        <div 
          ref={contentRef}
          className={`quote-ticker-marquee flex-1 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-950 dark:text-white font-black italic ${isGlowing ? 'quote-ticker-glow' : ''} drop-shadow-lg`}
        >
          <div className="quote-ticker-content">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="inline-block whitespace-nowrap">
                {quoteText}
                {i < 5 && <span className="mx-8 opacity-60 text-brand dark:text-brand-light">✦</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

