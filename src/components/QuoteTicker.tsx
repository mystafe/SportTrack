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
      className={`fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-brand/30 via-brand/25 to-brand/30 dark:from-brand/40 dark:via-brand/30 dark:to-brand/40 border-t-2 border-brand/70 dark:border-brand/80 ${isMobile ? 'py-2.5' : 'py-3'} overflow-hidden safe-bottom shadow-2xl backdrop-blur-lg`}
    >
      <div className="relative w-full h-full flex items-center justify-center min-h-[2.5rem] sm:min-h-[2.75rem]">
        {/* Enhanced gradient fade edges - wider and smoother */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-brand/30 via-brand/15 to-transparent dark:from-brand/40 dark:via-brand/20 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-brand/30 via-brand/15 to-transparent dark:from-brand/40 dark:via-brand/20 z-10 pointer-events-none"></div>
        
        {/* Decorative dots - larger and more visible */}
        <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand/80 dark:bg-brand/90 z-10 animate-pulse shadow-lg"></div>
        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand/80 dark:bg-brand/90 z-10 animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Scrolling content - better centered */}
        <div 
          ref={contentRef}
          className={`quote-ticker-marquee flex-1 flex items-center justify-center ${isMobile ? 'text-xs' : 'text-base'} text-gray-950 dark:text-white font-black italic ${isGlowing ? 'quote-ticker-glow' : ''} drop-shadow-lg`}
        >
          <div className="quote-ticker-content flex items-center h-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="inline-flex items-center whitespace-nowrap h-full">
                <span className="px-1 flex items-center h-full">{quoteText}</span>
                {i < 5 && <span className="mx-6 sm:mx-8 opacity-70 text-brand dark:text-brand-light text-lg flex items-center h-full">✦</span>}
              </span>
            ))}
          </div>
        </div>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none"></div>
      </div>
    </div>
  );
}

