'use client';

import { useRef, useCallback, useEffect } from 'react';

interface UseLongPressOptions {
  onLongPress: (e: TouchEvent | MouseEvent) => void;
  onClick?: (e: TouchEvent | MouseEvent) => void;
  delay?: number; // Delay in milliseconds before long press is triggered
  threshold?: number; // Maximum movement allowed in pixels
}

export function useLongPress({
  onLongPress,
  onClick,
  delay = 500,
  threshold = 10,
}: UseLongPressOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressRef = useRef(false);
  const hasMovedRef = useRef(false);

  const start = useCallback(
    (e: TouchEvent | MouseEvent) => {
      // Get initial position
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      startPosRef.current = { x: clientX, y: clientY };
      isLongPressRef.current = false;
      hasMovedRef.current = false;

      timeoutRef.current = setTimeout(() => {
        if (!hasMovedRef.current && startPosRef.current) {
          isLongPressRef.current = true;
          onLongPress(e);

          // Trigger haptic feedback if available
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(50);
          }
        }
      }, delay);
    },
    [onLongPress, delay]
  );

  const move = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!startPosRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = Math.abs(clientX - startPosRef.current.x);
      const deltaY = Math.abs(clientY - startPosRef.current.y);

      if (deltaX > threshold || deltaY > threshold) {
        hasMovedRef.current = true;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    },
    [threshold]
  );

  const end = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Only trigger onClick if it wasn't a long press and didn't move too much
      if (!isLongPressRef.current && !hasMovedRef.current && onClick) {
        onClick(e);
      }

      // Reset state
      isLongPressRef.current = false;
      hasMovedRef.current = false;
      startPosRef.current = null;
    },
    [onClick]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isLongPressRef.current = false;
    hasMovedRef.current = false;
    startPosRef.current = null;
  }, []);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      start(e.nativeEvent as TouchEvent);
    },
    onTouchMove: (e: React.TouchEvent) => {
      move(e.nativeEvent as TouchEvent);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      end(e.nativeEvent as TouchEvent);
    },
    onTouchCancel: cancel,
    onMouseDown: (e: React.MouseEvent) => {
      start(e.nativeEvent as MouseEvent);
    },
    onMouseMove: (e: React.MouseEvent) => {
      move(e.nativeEvent as MouseEvent);
    },
    onMouseUp: (e: React.MouseEvent) => {
      end(e.nativeEvent as MouseEvent);
    },
    onMouseLeave: cancel,
  };
}
