'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { SettingsDialog } from '@/components/SettingsDialog';
import { DataExportImport } from '@/components/DataExportImport';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function Header() {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 backdrop-blur sticky top-0 z-40">
      <nav className="container flex items-center justify-between h-16 sm:h-12" role="navigation" aria-label={t('nav.main')}>
        <Link href="/" className="font-semibold text-2xl sm:text-lg" aria-label={t('nav.home')}>
          SportTrack
        </Link>
        <div className="flex items-center gap-1 sm:gap-3 text-[11px] sm:text-sm">
          <Link href="/activities" className="hover:text-brand hidden sm:inline">
            {t('nav.activities')}
          </Link>
          <Link href="/stats" className={`hover:text-brand ${isMobile ? 'inline' : 'hidden sm:inline'}`}>
            {t('nav.stats')}
          </Link>
          {!isMobile && (
            <>
              <DataExportImport />
              <LanguageToggle />
              <ThemeToggle />
            </>
          )}
          <SettingsDialog />
        </div>
      </nav>
    </header>
  );
}

