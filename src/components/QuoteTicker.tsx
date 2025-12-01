'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getRandomQuote, type Quote } from '@/lib/quotes';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

interface QuoteTickerProps {
  position?: 'fixed' | 'static';
}

export function QuoteTicker({ position = 'fixed' }: QuoteTickerProps) {
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const usedQuotesRef = useRef<Set<string>>(new Set());
  const lastUpdateRef = useRef<number>(0);
  const scrollPositionRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isFixed = position === 'fixed';

  // ... existing logic ...
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

  // Ultra-simple JavaScript animation that definitely works
  useEffect(() => {
    if (!contentRef.current || quoteElements.length === 0) return;

    const contentElement = contentRef.current;
    let position = 0;
    let contentWidth = 0;
    let intervalId: NodeJS.Timeout | null = null;

    const startAnimation = () => {
      if (!contentElement) return;

      // Measure the width of first set
      const firstSet = contentElement.querySelector('[data-set="1"]') as HTMLElement;
      if (firstSet && firstSet.offsetWidth > 0) {
        contentWidth = firstSet.offsetWidth;
      } else {
        // Fallback: use scrollWidth / 3
        const totalWidth = contentElement.scrollWidth;
        if (totalWidth > 0) {
          contentWidth = totalWidth / 3;
        } else {
          // Retry if width not available
          setTimeout(startAnimation, 100);
          return;
        }
      }

      if (contentWidth === 0) {
        setTimeout(startAnimation, 100);
        return;
      }

      // Clear any existing interval
      if (intervalId) {
        clearInterval(intervalId);
      }

      // Use setInterval for guaranteed execution
      intervalId = setInterval(() => {
        if (!contentElement) return;

        // Move left by 1 pixel every frame
        position -= 1;

        // Reset when one set width is scrolled
        if (Math.abs(position) >= contentWidth) {
          position = 0;
        }

        // Apply transform - use both methods to ensure it works
        contentElement.style.transform = `translateX(${position}px)`;
        contentElement.style.webkitTransform = `translateX(${position}px)`;
        (contentElement.style as any).mozTransform = `translateX(${position}px)`;
        (contentElement.style as any).msTransform = `translateX(${position}px)`;
      }, 16); // ~60fps

      animationFrameRef.current = intervalId as any;
    };

    // Start animation with multiple attempts
    const timeout1 = setTimeout(startAnimation, 100);
    const timeout2 = setTimeout(startAnimation, 300);
    const timeout3 = setTimeout(startAnimation, 600);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      if (intervalId) {
        clearInterval(intervalId);
      }
      animationFrameRef.current = null;
    };
  }, [quoteElements.length]);

  // Prevent touch drag on QuoteTicker - track touch position to prevent upward drag
  // Only prevent upward drag, allow animation to continue
  useEffect(() => {
    if (!isFixed || !containerRef.current) return;

    const container = containerRef.current;
    let touchStartY = 0;
    let isDragging = false;
    const DRAG_THRESHOLD = 10; // Minimum pixels to consider it a drag

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      // Only track if touching the container itself, not the animated content
      if (container === target || container.contains(target)) {
        if (e.touches.length > 0) {
          touchStartY = e.touches[0].clientY;
          isDragging = true;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;

      const target = e.target as HTMLElement;
      if (container.contains(target)) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY; // Positive deltaY means upward movement

        // Only prevent if it's a significant upward drag (which causes overscroll)
        if (deltaY > DRAG_THRESHOLD) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      touchStartY = 0;
    };

    // Use passive: false only for touchmove to allow preventDefault
    // Use passive: true for touchstart/touchend to not block animation
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isFixed]);

  if (!mounted || quotes.length === 0) return null;

  // Calculate bottom position: EXACTLY on top of BottomNavigation - ZERO gap
  // BottomNavigation: h-12 (48px) + paddingBottom (safe-area + 4px)
  // QuoteTicker must sit EXACTLY at BottomNavigation's top edge with NO gap
  // So QuoteTicker bottom should be: 52px + safe-area
  const bottomPosition = isMobile
    ? 'calc(52px + env(safe-area-inset-bottom, 20px))'
    : 'max(28px, env(safe-area-inset-bottom, 0px))';

  const containerStyle = isFixed
    ? ({
        bottom: bottomPosition,
        margin: 0,
        padding: 0,
        height: isMobile ? '20px' : '24px',
        minHeight: isMobile ? '20px' : '24px',
        maxHeight: isMobile ? '20px' : '24px',
        boxSizing: 'border-box' as const,
        lineHeight: isMobile ? '20px' : '24px',
        borderTop: 'none',
        borderBottom: 'none',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'transform',
        position: 'fixed' as const,
        left: 0,
        right: 0,
        zIndex: 998,
        top: 'auto',
        marginBottom: 0,
        paddingBottom: 0,
        marginTop: 0,
        paddingTop: 0,
        overscrollBehavior: 'none',
        WebkitOverscrollBehavior: 'none' as any,
        touchAction: 'pan-x' as const,
        userSelect: 'none' as const,
        WebkitUserSelect: 'none' as any,
        pointerEvents: 'auto' as const,
      } as React.CSSProperties)
    : {
        margin: 0,
        padding: 0,
        height: isMobile ? '20px' : '24px',
        minHeight: isMobile ? '20px' : '24px',
        maxHeight: isMobile ? '20px' : '24px',
        boxSizing: 'border-box' as const,
        lineHeight: isMobile ? '20px' : '24px',
        width: '100%',
        position: 'relative' as const,
        zIndex: 1,
      };

  return (
    <div
      ref={containerRef}
      className={`${isFixed ? 'fixed left-0 right-0 z-[998]' : 'relative w-full'} glass-effect bg-gradient-to-r from-brand/20 via-brand/15 to-brand/20 dark:from-brand/30 dark:via-brand/20 dark:to-brand/30 overflow-hidden shadow-lg backdrop-blur-xl border-t border-white/10 dark:border-gray-700/30`}
      style={containerStyle}
    >
      <div
        className="relative w-full flex items-center justify-center"
        style={
          {
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
            touchAction: 'pan-x', // Allow horizontal pan but prevent vertical drag
            userSelect: 'none',
            WebkitUserSelect: 'none',
            overscrollBehavior: 'none',
            WebkitOverscrollBehavior: 'none' as any,
          } as React.CSSProperties
        }
      >
        {/* Subtle gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-brand/20 via-brand/10 to-transparent dark:from-brand/30 dark:via-brand/15 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-brand/20 via-brand/10 to-transparent dark:from-brand/30 dark:via-brand/15 z-10 pointer-events-none"></div>

        {/* Scrolling content - optimized for continuous animation */}
        <div
          ref={wrapperRef}
          className="quote-ticker-marquee flex-1 overflow-hidden"
          style={{
            pointerEvents: 'none',
            width: '100%',
            position: 'relative',
            height: '100%',
          }}
        >
          <div
            ref={contentRef}
            className="quote-ticker-content flex items-center h-full whitespace-nowrap"
            style={
              {
                pointerEvents: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: isMobile ? '10px' : '11px',
                lineHeight: isMobile ? '20px' : '24px',
                willChange: 'transform',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
              } as React.CSSProperties
            }
          >
            {/* First set of quotes */}
            <div data-set="1" className="inline-flex items-center whitespace-nowrap h-full">
              {quoteElements.map((quote, i) => (
                <span
                  key={`${quote.key}`}
                  className="inline-flex items-center whitespace-nowrap h-full"
                >
                  <span className="px-1 sm:px-2 flex items-center h-full text-gray-950 dark:text-gray-50 font-semibold drop-shadow-sm text-[10px] sm:text-[11px]">
                    {quote.text}
                  </span>
                  {i < quoteElements.length - 1 && (
                    <span className="mx-8 sm:mx-12 opacity-60 text-brand dark:text-brand-light text-[10px] sm:text-[11px] font-bold flex items-center h-full">
                      •
                    </span>
                  )}
                </span>
              ))}
            </div>
            {/* Second set for seamless loop */}
            <div data-set="2" className="inline-flex items-center whitespace-nowrap h-full">
              {quoteElements.map((quote, i) => (
                <span
                  key={`${quote.key}-dup`}
                  className="inline-flex items-center whitespace-nowrap h-full"
                >
                  <span className="px-1 sm:px-2 flex items-center h-full text-gray-950 dark:text-gray-50 font-semibold drop-shadow-sm text-[10px] sm:text-[11px]">
                    {quote.text}
                  </span>
                  <span className="mx-8 sm:mx-12 opacity-50 text-brand dark:text-brand-light text-[9px] sm:text-[10px] flex items-center h-full">
                    •
                  </span>
                </span>
              ))}
            </div>
            {/* Third set for even smoother continuous scrolling */}
            <div data-set="3" className="inline-flex items-center whitespace-nowrap h-full">
              {quoteElements.map((quote, i) => (
                <span
                  key={`${quote.key}-dup2`}
                  className="inline-flex items-center whitespace-nowrap h-full"
                >
                  <span className="px-1 sm:px-2 flex items-center h-full text-gray-950 dark:text-gray-50 font-semibold drop-shadow-sm text-[10px] sm:text-[11px]">
                    {quote.text}
                  </span>
                  <span className="mx-8 sm:mx-12 opacity-50 text-brand dark:text-brand-light text-[9px] sm:text-[10px] flex items-center h-full">
                    •
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle shine effect - reduced opacity for better readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-20 pointer-events-none"></div>
      </div>
    </div>
  );
}
