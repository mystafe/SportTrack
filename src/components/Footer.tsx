'use client';

import { useI18n } from '@/lib/i18n';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="container py-10 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <span>© {new Date().getFullYear()} SportTrack · {t('footer.byName')}</span>
      <span className="text-gray-400">v0.4.3 <span className="uppercase tracking-wide">beta</span></span>
    </footer>
  );
}

