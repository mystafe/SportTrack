'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  enabled?: boolean;
  threshold?: number; // Minimum pull distance in pixels
  resistance?: number; // Resistance factor (0-1)
}

interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
}

export function usePullToRefresh({
  onRefresh,
  enabled = true,
  threshold = 80,
  resistance = 0.5,
}: UsePullToRefreshOptions) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
  });

  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const isRefreshingRef = useRef(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    setState((prev) => ({ ...prev, isRefreshing: true, isPulling: false, pullDistance: 0 }));

    try {
      await onRefresh();
    } catch (error) {
      console.error('Pull-to-refresh error:', error);
    } finally {
      setTimeout(() => {
        isRefreshingRef.current = false;
        setState((prev) => ({ ...prev, isRefreshing: false }));
      }, 300);
    }
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only allow pull-to-refresh when scrolled to top
      // Check both element scroll and window scroll
      const scrollTop =
        element === document.documentElement
          ? window.scrollY || document.documentElement.scrollTop
          : element.scrollTop;

      if (scrollTop > 0) return;

      startY.current = e.touches[0].clientY;
      currentY.current = startY.current;
      setState((prev) => ({ ...prev, isPulling: true }));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!state.isPulling || isRefreshingRef.current) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // Only allow downward pull
      if (deltaY < 0) {
        setState((prev) => ({ ...prev, isPulling: false, pullDistance: 0 }));
        return;
      }

      // Apply resistance after threshold
      const resistanceFactor = deltaY > threshold ? resistance : 1;
      const pullDistance = deltaY * resistanceFactor;

      setState((prev) => ({
        ...prev,
        pullDistance: Math.min(pullDistance, threshold * 1.5), // Cap at 1.5x threshold
      }));
    };

    const handleTouchEnd = () => {
      if (!state.isPulling || isRefreshingRef.current) return;

      if (state.pullDistance >= threshold) {
        handleRefresh();
      } else {
        setState((prev) => ({ ...prev, isPulling: false, pullDistance: 0 }));
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, state.isPulling, state.pullDistance, threshold, resistance, handleRefresh]);

  return {
    ...state,
    elementRef,
    progress: Math.min(state.pullDistance / threshold, 1),
  };
}
