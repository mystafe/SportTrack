'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getRandomQuote, type Quote } from '@/lib/quotes';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function QuoteTicker() {
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const usedQuotesRef = useRef<Set<string>>(new Set());
  const lastUpdateRef = useRef<number>(0);

  // Function to get a unique random quote
  const getUniqueRandomQuote = useCallback((): Quote => {
    let newQuote = getRandomQuote();
    let attempts = 0;
    const maxAttempts = 100;

    // Try to get a quote that hasn't been used recently
    while (usedQuotesRef.current.has(newQuote.tr) && attempts < maxAttempts) {
      newQuote = getRandomQuote();
      attempts++;
    }

    // If we've used many quotes, reset the set (keep only last 20)
    if (usedQuotesRef.current.size > 50) {
      const quotesArray = Array.from(usedQuotesRef.current);
      usedQuotesRef.current = new Set(quotesArray.slice(-20));
    }

    // Add new quote to used set
    usedQuotesRef.current.add(newQuote.tr);

    return newQuote;
  }, []);

  useEffect(() => {
    setMounted(true);
    // Initialize with 6 different quotes for smoother scrolling
    const initialQuotes: Quote[] = [];
    for (let i = 0; i < 6; i++) {
      initialQuotes.push(getUniqueRandomQuote());
    }
    setQuotes(initialQuotes);
  }, [getUniqueRandomQuote]);

  useEffect(() => {
    if (!mounted || quotes.length === 0) return;

    // Add a new quote every 30 seconds to create a continuous train effect
    // Longer interval prevents animation resets and ensures smooth scrolling
    const interval = setInterval(() => {
      const now = Date.now();
      // Prevent too frequent updates
      if (now - lastUpdateRef.current < 25000) {
        return;
      }
      lastUpdateRef.current = now;

      setQuotes((currentQuotes) => {
        const newQuote = getUniqueRandomQuote();
        // Add new quote to the end, keep max 12 quotes for smoother scrolling
        // More quotes = longer content = smoother continuous animation
        const updatedQuotes = [...currentQuotes, newQuote];
        return updatedQuotes.length > 12 ? updatedQuotes.slice(1) : updatedQuotes;
      });
    }, 30000); // Add a new quote every 30 seconds

    return () => clearInterval(interval);
  }, [mounted, getUniqueRandomQuote]);

  // Memoize quote text to prevent unnecessary re-renders
  const quoteElements = useMemo(() => {
    return quotes.map((quote, i) => {
      const quoteText = lang === 'tr' ? quote.tr : quote.en;
      return { text: quoteText, key: `${quote.tr}-${i}`, id: quote.tr };
    });
  }, [quotes, lang]);

  if (!mounted || quotes.length === 0) return null;

  // Calculate bottom position: EXACTLY on top of BottomNavigation - ZERO gap
  // BottomNavigation: h-12 (48px) + paddingBottom (safe-area)
  // QuoteTicker must sit EXACTLY at BottomNavigation's top edge with NO gap
  // BottomNavigation has paddingBottom: env(safe-area-inset-bottom)
  // So QuoteTicker bottom should be: 48px (BottomNavigation content height)
  // NO safe-area-inset-bottom here - BottomNavigation handles it
  // AGGRESSIVE: Force exact position
  const bottomPosition = isMobile ? '48px' : 'max(28px, env(safe-area-inset-bottom, 0px))';

  return (
    <div
      ref={containerRef}
      className={`fixed left-0 right-0 z-[45] bg-gradient-to-r from-brand/20 via-brand/15 to-brand/20 dark:from-brand/30 dark:via-brand/20 dark:to-brand/30 overflow-hidden shadow-md backdrop-blur-md`}
      style={{
        bottom: isMobile ? '48px' : bottomPosition,
        margin: 0,
        padding: 0,
        height: isMobile ? '20px' : '24px',
        minHeight: isMobile ? '20px' : '24px',
        maxHeight: isMobile ? '20px' : '24px',
        boxSizing: 'border-box',
        lineHeight: isMobile ? '20px' : '24px',
        borderTop: 'none',
        borderBottom: 'none',
        transform: 'translateZ(0)',
        willChange: 'transform',
        position: 'fixed',
        left: 0,
        right: 0,
        zIndex: 45,
        top: 'auto',
        // AGGRESSIVE: Force no gap - sit directly on BottomNavigation
        marginBottom: 0,
        paddingBottom: 0,
        marginTop: 0,
        paddingTop: 0,
      }}
    >
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          height: isMobile ? '20px' : '24px',
          minHeight: isMobile ? '20px' : '24px',
          maxHeight: isMobile ? '20px' : '24px',
          margin: 0,
          padding: 0,
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          boxSizing: 'border-box',
          lineHeight: isMobile ? '20px' : '24px',
        }}
      >
        {/* Subtle gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-brand/20 via-brand/10 to-transparent dark:from-brand/30 dark:via-brand/15 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-brand/20 via-brand/10 to-transparent dark:from-brand/30 dark:via-brand/15 z-10 pointer-events-none"></div>

        {/* Scrolling content - optimized for continuous animation */}
        <div
          ref={contentRef}
          className={`quote-ticker-marquee flex-1 flex items-center justify-center ${isMobile ? 'text-[9px]' : 'text-xs'} text-gray-900 dark:text-gray-100 font-semibold`}
        >
          <div className="quote-ticker-content flex items-center h-full">
            {/* First set of quotes */}
            {quoteElements.map((quote, i) => (
              <span
                key={`${quote.key}`}
                className="inline-flex items-center whitespace-nowrap h-full"
              >
                <span className="px-0.5 flex items-center h-full">{quote.text}</span>
                {i < quoteElements.length - 1 && (
                  <span className="mx-16 sm:mx-24 opacity-50 text-brand dark:text-brand-light text-xs flex items-center h-full">
                    •
                  </span>
                )}
              </span>
            ))}
            {/* Second set for seamless loop */}
            {quoteElements.map((quote, i) => (
              <span
                key={`${quote.key}-dup`}
                className="inline-flex items-center whitespace-nowrap h-full"
              >
                <span className="px-0.5 flex items-center h-full">{quote.text}</span>
                <span className="mx-16 sm:mx-24 opacity-50 text-brand dark:text-brand-light text-xs flex items-center h-full">
                  •
                </span>
              </span>
            ))}
            {/* Third set for even smoother continuous scrolling */}
            {quoteElements.map((quote, i) => (
              <span
                key={`${quote.key}-dup2`}
                className="inline-flex items-center whitespace-nowrap h-full"
              >
                <span className="px-0.5 flex items-center h-full">{quote.text}</span>
                <span className="mx-16 sm:mx-24 opacity-50 text-brand dark:text-brand-light text-xs flex items-center h-full">
                  •
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30 pointer-events-none"></div>
      </div>
    </div>
  );
}
