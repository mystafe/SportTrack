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
      className={`fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-brand/20 via-brand/15 to-brand/20 dark:from-brand/30 dark:via-brand/20 dark:to-brand/30 border-t-2 border-brand/50 dark:border-brand/60 ${isMobile ? 'py-3' : 'py-4'} overflow-hidden safe-bottom shadow-2xl backdrop-blur-sm`}
    >
      <div className="relative w-full h-full">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand/20 via-transparent to-transparent dark:from-brand/30 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand/20 via-transparent to-transparent dark:from-brand/30 z-10 pointer-events-none"></div>
        
        {/* Scrolling content */}
        <div 
          ref={contentRef}
          className={`quote-ticker-marquee ${isMobile ? 'text-xs' : 'text-sm'} text-gray-950 dark:text-white font-black italic ${isGlowing ? 'quote-ticker-glow' : ''} drop-shadow-lg`}
        >
          <div className="quote-ticker-content">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="inline-block whitespace-nowrap">
                {quoteText}
                {i < 4 && <span className="mx-6 opacity-50">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

