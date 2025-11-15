'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePullToRefresh } from '@/lib/hooks/usePullToRefresh';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  enabled?: boolean;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  enabled = true,
  className = '',
}: PullToRefreshProps) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const { elementRef, isPulling, isRefreshing, pullDistance, progress } = usePullToRefresh({
    onRefresh,
    enabled: enabled && isMobile, // Only enable on mobile
    threshold: 80,
    resistance: 0.5,
  });

  // Use window scroll instead of container scroll for pull-to-refresh
  useEffect(() => {
    if (!isMobile || !enabled) return;

    // Set elementRef to window for pull-to-refresh detection
    if (elementRef && typeof window !== 'undefined') {
      // Create a wrapper element that represents the scrollable area
      const scrollableElement = document.documentElement;
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = scrollableElement;
    }
  }, [isMobile, enabled, elementRef]);

  const shouldShowIndicator = isPulling || isRefreshing;
  const rotation = progress * 360;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Pull-to-refresh indicator */}
      {shouldShowIndicator && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none safe-top"
          style={{
            transform: `translateY(${Math.min(pullDistance, 80)}px)`,
            opacity: Math.min(progress, 1),
            transition: isRefreshing ? 'opacity 0.3s ease-out' : 'none',
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-full p-3 shadow-lg border-2 border-gray-200 dark:border-gray-700">
            {isRefreshing ? (
              <div className="w-6 h-6 border-3 border-brand border-t-transparent rounded-full pull-refresh" />
            ) : (
              <div
                className="w-6 h-6 border-3 border-gray-400 border-t-transparent rounded-full"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            )}
          </div>
        </div>
      )}

      {/* Content wrapper */}
      <div
        style={{
          transform: shouldShowIndicator ? `translateY(${Math.min(pullDistance, 80)}px)` : 'none',
          transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
