/**
 * Animated Counter Hook
 * Provides smooth number counting animation from 0 to target value
 */

import { useEffect, useState, useRef } from 'react';

export interface UseAnimatedCounterOptions {
  /**
   * Duration of the animation in milliseconds
   * @default 1000
   */
  duration?: number;
  /**
   * Easing function for the animation
   * @default 'easeOut'
   */
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  /**
   * Whether to start animation immediately
   * @default true
   */
  autoStart?: boolean;
  /**
   * Minimum step size for small numbers (prevents too fast counting)
   * @default 1
   */
  minStep?: number;
  /**
   * Format function to apply to the number (e.g., add commas)
   */
  formatter?: (value: number) => string;
}

/**
 * Hook that animates a number from 0 (or current value) to target value
 * @param target - Target number to animate to
 * @param options - Animation options
 * @returns Current animated value and formatted string
 */
export function useAnimatedCounter(
  target: number,
  options: UseAnimatedCounterOptions = {}
): {
  value: number;
  displayValue: string;
  isAnimating: boolean;
  start: () => void;
  reset: () => void;
} {
  const { duration = 1000, easing = 'easeOut', autoStart = true, minStep = 1, formatter } = options;

  const [value, setValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousTargetRef = useRef<number>(target);
  const startValueRef = useRef<number>(0);

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => t * (2 - t),
    easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  };

  const ease = easingFunctions[easing];

  const animate = (timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = ease(progress);

    const currentValue = Math.round(
      startValueRef.current + (target - startValueRef.current) * easedProgress
    );

    // Ensure we don't exceed target
    const finalValue = Math.min(currentValue, target);

    setValue(finalValue);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      startTimeRef.current = null;
    }
  };

  const start = () => {
    if (isAnimating) return;

    // Cancel any existing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    startValueRef.current = value;
    startTimeRef.current = null;
    setIsAnimating(true);
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setValue(0);
    setIsAnimating(false);
    startTimeRef.current = null;
    startValueRef.current = 0;
  };

  // Auto-start when target changes
  useEffect(() => {
    if (autoStart && target !== previousTargetRef.current) {
      // If target increased, animate from current value
      // If target decreased, reset and animate from 0
      if (target < previousTargetRef.current) {
        startValueRef.current = 0;
        setValue(0);
      } else {
        startValueRef.current = value;
      }
      previousTargetRef.current = target;
      start();
    } else if (!autoStart && target !== previousTargetRef.current) {
      // Just update the value without animation if autoStart is false
      setValue(target);
      previousTargetRef.current = target;
    }
  }, [target, autoStart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Format the display value
  const displayValue = formatter ? formatter(value) : value.toString();

  return {
    value,
    displayValue,
    isAnimating,
    start,
    reset,
  };
}
