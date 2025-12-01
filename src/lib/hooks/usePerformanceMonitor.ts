/**
 * Performance Monitoring Hook
 * Tracks component render performance and provides metrics
 */

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
}

export function usePerformanceMonitor(componentName: string, enabled = true) {
  const renderStartTime = useRef<number>(0);
  const renderTimes = useRef<number[]>([]);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    renderStartTime.current = performance.now();

    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      renderTimes.current.push(renderTime);
      renderCount.current += 1;

      // Keep only last 10 render times
      if (renderTimes.current.length > 10) {
        renderTimes.current.shift();
      }

      // Log slow renders (>16ms for 60fps)
      if (renderTime > 16) {
        console.warn(
          `[Performance] ${componentName} slow render: ${renderTime.toFixed(2)}ms (target: <16ms)`
        );
      }

      // Log average every 10 renders
      if (renderCount.current % 10 === 0) {
        const average = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
        console.log(
          `[Performance] ${componentName} - Renders: ${renderCount.current}, Avg: ${average.toFixed(2)}ms`
        );
      }
    };
  });

  const metrics: PerformanceMetrics = {
    renderCount: renderCount.current,
    averageRenderTime:
      renderTimes.current.length > 0
        ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
        : 0,
    lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0,
  };

  return metrics;
}
