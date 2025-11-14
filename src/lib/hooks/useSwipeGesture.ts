/**
 * Swipe Gesture Hook
 * Detects swipe gestures (left/right) on touch devices
 */

import { useRef, useState, useCallback } from 'react';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface UseSwipeGestureOptions {
  threshold?: number; // Minimum distance in pixels to trigger swipe
  velocityThreshold?: number; // Minimum velocity to trigger swipe
  preventDefault?: boolean;
}

export function useSwipeGesture(handlers: SwipeHandlers, options: UseSwipeGestureOptions = {}) {
  const { threshold = 50, velocityThreshold = 0.3, preventDefault = true } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // If moved more than threshold, consider it a swipe
      if (distance > 10) {
        setIsSwiping(true);
        if (preventDefault) {
          e.preventDefault();
        }
      }
    },
    [preventDefault]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) {
        setIsSwiping(false);
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / deltaTime;

      // Check if swipe meets threshold and velocity requirements
      if (distance >= threshold && velocity >= velocityThreshold) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Determine swipe direction
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0 && handlers.onSwipeRight) {
            handlers.onSwipeRight();
          } else if (deltaX < 0 && handlers.onSwipeLeft) {
            handlers.onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && handlers.onSwipeDown) {
            handlers.onSwipeDown();
          } else if (deltaY < 0 && handlers.onSwipeUp) {
            handlers.onSwipeUp();
          }
        }
      }

      touchStartRef.current = null;
      setIsSwiping(false);
    },
    [threshold, velocityThreshold, handlers]
  );

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isSwiping,
  };
}
