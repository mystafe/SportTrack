/**
 * Swipe Gesture Hook
 * Detects swipe gestures (left, right, up, down) on touch and mouse events
 */

import { useRef, useCallback, useState } from 'react';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface SwipeGestureOptions {
  /**
   * Minimum distance in pixels to trigger a swipe
   * @default 50
   */
  threshold?: number;
  /**
   * Maximum time in milliseconds to complete a swipe
   * @default 300
   */
  timeout?: number;
  /**
   * Callback when swipe is detected
   */
  onSwipe?: (direction: SwipeDirection) => void;
  /**
   * Prevent default touch behavior
   * @default true
   */
  preventDefault?: boolean;
}

export interface SwipeGestureResult {
  /**
   * Ref to attach to the element
   */
  ref: React.RefObject<HTMLElement>;
  /**
   * Current swipe progress (0-1)
   */
  progress: number;
  /**
   * Whether a swipe is in progress
   */
  isSwiping: boolean;
}

export function useSwipeGesture(options: SwipeGestureOptions = {}): SwipeGestureResult {
  const { threshold = 50, timeout = 300, onSwipe, preventDefault = true } = options;

  const elementRef = useRef<HTMLElement>(null);
  const startPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startPosRef.current = { x: clientX, y: clientY, time: Date.now() };
    setIsSwiping(true);
    setProgress(0);
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!startPosRef.current) return;

      const deltaX = clientX - startPosRef.current.x;
      const deltaY = clientY - startPosRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = threshold * 2; // Progress based on 2x threshold
      const currentProgress = Math.min(1, distance / maxDistance);

      setProgress(currentProgress);
    },
    [threshold]
  );

  const handleEnd = useCallback(
    (clientX: number, clientY: number) => {
      if (!startPosRef.current) {
        setIsSwiping(false);
        setProgress(0);
        return;
      }

      const deltaX = clientX - startPosRef.current.x;
      const deltaY = clientY - startPosRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const elapsed = Date.now() - startPosRef.current.time;

      // Check if swipe meets criteria
      if (distance >= threshold && elapsed <= timeout) {
        // Determine direction
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        let direction: SwipeDirection;
        if (absX > absY) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }

        onSwipe?.(direction);
      }

      startPosRef.current = null;
      setIsSwiping(false);
      setProgress(0);
    },
    [threshold, timeout, onSwipe]
  );

  // Touch events
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    [handleStart, preventDefault]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove, preventDefault]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();
      if (!startPosRef.current) return;
      const touch = e.changedTouches[0];
      handleEnd(touch.clientX, touch.clientY);
    },
    [handleEnd, preventDefault]
  );

  // Mouse events (for desktop testing)
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (preventDefault) e.preventDefault();
      handleStart(e.clientX, e.clientY);
    },
    [handleStart, preventDefault]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!startPosRef.current) return;
      if (preventDefault) e.preventDefault();
      handleMove(e.clientX, e.clientY);
    },
    [handleMove, preventDefault]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!startPosRef.current) return;
      if (preventDefault) e.preventDefault();
      handleEnd(e.clientX, e.clientY);
    },
    [handleEnd, preventDefault]
  );

  // Attach event listeners
  const attachListeners = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault });

    // Mouse events
    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    preventDefault,
  ]);

  // Initialize listeners when ref is set
  if (elementRef.current && typeof window !== 'undefined') {
    attachListeners();
  }

  return {
    ref: elementRef as React.RefObject<HTMLElement>,
    progress,
    isSwiping,
  };
}
