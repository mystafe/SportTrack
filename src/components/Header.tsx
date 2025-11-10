'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useI18n } from '@/lib/i18n';

export function Header() {
  const { t } = useI18n();
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 backdrop-blur sticky top-0 z-40">
      <nav className="container flex items-center justify-between h-11 sm:h-12">
        <Link href="/" className="font-semibold text-base sm:text-lg">
          SportTrack
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm">
          <Link href="/activities" className="hover:text-brand hidden sm:inline">
            {t('nav.activities')}
          </Link>
          <SettingsDialog />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

