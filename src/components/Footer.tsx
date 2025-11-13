'use client';

import { useI18n } from '@/lib/i18n';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="container py-10 safe-bottom text-sm text-gray-500 flex flex-row items-center justify-between gap-2">
      <span>© {new Date().getFullYear()} SportTrack · {t('footer.byName')}</span>
      <span>v0.11.1 <span className="uppercase tracking-wide">beta</span></span>
    </footer>
  );
}

