/**
 * Input Focus Hook
 * Handles input focus behavior on mobile (scroll to input, prevent keyboard overlap)
 */

import { useEffect, useRef } from 'react';
import { useIsMobile } from './useIsMobile';

export interface UseInputFocusOptions {
  /**
   * Scroll offset from top when input is focused
   * @default 100
   */
  scrollOffset?: number;

  /**
   * Enable scroll to input on focus
   * @default true
   */
  scrollOnFocus?: boolean;

  /**
   * Prevent keyboard overlap
   * @default true
   */
  preventKeyboardOverlap?: boolean;
}

export function useInputFocus(options: UseInputFocusOptions = {}) {
  const { scrollOffset = 100, scrollOnFocus = true, preventKeyboardOverlap = true } = options;

  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isMobile || !inputRef.current) return;

    const input = inputRef.current;

    const handleFocus = () => {
      if (!scrollOnFocus) return;

      // Scroll to input with offset
      const inputRect = input.getBoundingClientRect();
      const scrollY = window.scrollY + inputRect.top - scrollOffset;

      window.scrollTo({
        top: Math.max(0, scrollY),
        behavior: 'smooth',
      });

      // Prevent keyboard overlap (iOS Safari)
      if (preventKeyboardOverlap && 'visualViewport' in window) {
        const viewport = window.visualViewport;
        if (viewport) {
          const inputBottom = inputRect.bottom;
          const viewportHeight = viewport.height;
          const viewportTop = viewport.offsetTop;

          if (inputBottom > viewportHeight + viewportTop) {
            const scrollAmount = inputBottom - (viewportHeight + viewportTop) + scrollOffset;
            window.scrollBy({
              top: scrollAmount,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    input.addEventListener('focus', handleFocus);
    return () => input.removeEventListener('focus', handleFocus);
  }, [isMobile, scrollOffset, scrollOnFocus, preventKeyboardOverlap]);

  return { inputRef };
}
