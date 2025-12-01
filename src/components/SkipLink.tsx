'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

/**
 * SkipLink Component
 * Provides a skip link for keyboard navigation to skip to main content
 * WCAG 2.1 AA compliance requirement
 */
export function SkipLink() {
  const { lang } = useI18n();

  return (
    <Link
      href="#main-content"
      className="absolute -left-[9999px] w-px h-px overflow-hidden focus:left-4 focus:top-4 focus:w-auto focus:h-auto focus:z-[9999] focus:px-4 focus:py-2 glass-effect card-3d focus:bg-brand/95 focus:text-white focus:rounded-lg focus:shadow-xl focus:backdrop-blur-xl focus:border-2 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:font-semibold transition-all duration-200 focus:hover:scale-105"
      aria-label={lang === 'tr' ? 'Ana içeriğe geç' : 'Skip to main content'}
      onClick={(e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }}
    >
      {lang === 'tr' ? 'Ana içeriğe geç' : 'Skip to main content'}
    </Link>
  );
}
