/**
 * Ripple Effect Hook
 * Provides ripple effect for interactive elements (buttons, cards, etc.)
 */

import { useCallback, useRef } from 'react';

export interface RippleOptions {
  /**
   * Ripple color (default: brand color with opacity)
   */
  color?: string;

  /**
   * Ripple duration in milliseconds (default: 600ms)
   */
  duration?: number;

  /**
   * Ripple size multiplier (default: 2)
   */
  size?: number;
}

export function useRipple(options: RippleOptions = {}) {
  const rippleRef = useRef<HTMLSpanElement | null>(null);

  const { color = 'rgba(14, 165, 233, 0.4)', duration = 600, size = 2 } = options;

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${color};
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      transform: scale(0);
      animation: ripple ${duration}ms cubic-bezier(0.4, 0, 0.2, 1);
    `;

      // Add animation keyframes if not already added
      if (!document.getElementById('ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(${size});
            opacity: 0;
          }
        }
      `;
        document.head.appendChild(style);
      }

      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, duration);
    },
    [color, duration, size]
  );

  return { createRipple, rippleRef };
}
