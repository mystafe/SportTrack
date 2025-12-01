'use client';

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

/**
 * LazyLoad Component
 * Only renders children when they enter the viewport
 * Useful for performance optimization with large lists
 */
export function LazyLoad({
  children,
  fallback = null,
  threshold = 0.1,
  rootMargin = '100px',
  className,
}: LazyLoadProps) {
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={className}>
      {isIntersecting ? children : fallback}
    </div>
  );
}
