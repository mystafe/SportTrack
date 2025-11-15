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

  // Calculate bottom position: above BottomNavigation (64px) + safe area
  // QuoteTicker height is now ~32px (reduced from ~45px)
  // Slightly lower position (reduced by 4px)
  const bottomPosition = isMobile
    ? 'calc(64px + max(4px, env(safe-area-inset-bottom, 0px)))'
    : 'max(4px, env(safe-area-inset-bottom, 0px))';

  return (
    <div
      ref={containerRef}
      className={`fixed left-0 right-0 z-45 bg-gradient-to-r from-brand/20 via-brand/15 to-brand/20 dark:from-brand/30 dark:via-brand/20 dark:to-brand/30 border-t border-brand/50 dark:border-brand/60 ${isMobile ? 'py-1' : 'py-1.5'} overflow-hidden shadow-lg backdrop-blur-md`}
      style={{ bottom: bottomPosition }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ minHeight: isMobile ? '2rem' : '2.25rem' }}
      >
        {/* Subtle gradient fade edges - more compact */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-brand/20 via-brand/10 to-transparent dark:from-brand/30 dark:via-brand/15 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-brand/20 via-brand/10 to-transparent dark:from-brand/30 dark:via-brand/15 z-10 pointer-events-none"></div>

        {/* Minimal decorative dots */}
        <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand/60 dark:bg-brand/70 z-10 animate-pulse"></div>
        <div
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand/60 dark:bg-brand/70 z-10 animate-pulse"
          style={{ animationDelay: '0.5s' }}
        ></div>

        {/* Scrolling content - compact and elegant */}
        <div
          ref={contentRef}
          className={`quote-ticker-marquee flex-1 flex items-center justify-center ${isMobile ? 'text-[10px]' : 'text-sm'} text-gray-900 dark:text-gray-100 font-semibold ${isGlowing ? 'quote-ticker-glow' : ''}`}
        >
          <div className="quote-ticker-content flex items-center h-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="inline-flex items-center whitespace-nowrap h-full">
                <span className="px-0.5 flex items-center h-full">{quoteText}</span>
                {i < 3 && (
                  <span className="mx-3 sm:mx-4 opacity-50 text-brand dark:text-brand-light text-xs flex items-center h-full">
                    •
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Subtle shine effect - more refined */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30 pointer-events-none"></div>
      </div>
    </div>
  );
}
