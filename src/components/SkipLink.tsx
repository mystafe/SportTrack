'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

/**
 * SkipLink Component
 * Provides a skip link for keyboard navigation to skip to main content
 * WCAG 2.1 AA compliance requirement
 */
export function SkipLink() {
  const { t } = useI18n();

  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
      aria-label="Skip to main content"
    >
      <span className="sr-only">Skip to main content</span>
    </Link>
  );
}
