/**
 * Sticky Header Hook
 * Provides sticky header behavior with scroll detection
 */

import { useEffect, useState } from 'react';

export interface UseStickyHeaderOptions {
  /**
   * Threshold in pixels before header becomes sticky
   * @default 0
   */
  threshold?: number;

  /**
   * Enable collapsible header on scroll down
   * @default false
   */
  collapsible?: boolean;

  /**
   * Scroll threshold for collapsing header
   * @default 100
   */
  collapseThreshold?: number;
}

export interface UseStickyHeaderReturn {
  /**
   * Whether header should be sticky
   */
  isSticky: boolean;

  /**
   * Whether header should be collapsed (hidden)
   */
  isCollapsed: boolean;

  /**
   * Current scroll position
   */
  scrollY: number;
}

export function useStickyHeader(options: UseStickyHeaderOptions = {}): UseStickyHeaderReturn {
  const { threshold = 0, collapsible = false, collapseThreshold = 100 } = options;

  const [isSticky, setIsSticky] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Sticky behavior
      setIsSticky(currentScrollY > threshold);

      // Collapsible behavior
      if (collapsible) {
        if (currentScrollY > collapseThreshold) {
          // Scrolling down
          if (currentScrollY > lastScrollY) {
            setIsCollapsed(true);
          } else {
            // Scrolling up
            setIsCollapsed(false);
          }
        } else {
          setIsCollapsed(false);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, collapsible, collapseThreshold, lastScrollY]);

  return { isSticky, isCollapsed, scrollY };
}
