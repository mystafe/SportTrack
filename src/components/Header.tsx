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
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 backdrop-blur sticky top-0 z-40 safe-top">
      <nav className="container flex items-center justify-between h-16 sm:h-12" role="navigation" aria-label={t('nav.main')}>
        <Link href="/" className="font-semibold text-2xl sm:text-lg" aria-label={t('nav.home')}>
          SportTrack
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          {/* Navigation Icons - Always visible, beautifully aligned */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg bg-gray-100/50 dark:bg-gray-800/50">
            <Link 
              href="/activities" 
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-xl sm:text-2xl hover:scale-110 active:scale-95 transition-all duration-200 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50" 
              aria-label={t('nav.activities')}
            >
              📝
            </Link>
            <Link 
              href="/stats" 
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-xl sm:text-2xl hover:scale-110 active:scale-95 transition-all duration-200 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50" 
              aria-label={t('nav.stats')}
            >
              📊
            </Link>
            <Link 
              href="/achievements" 
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-xl sm:text-2xl hover:scale-110 active:scale-95 transition-all duration-200 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50"
              aria-label={t('nav.achievements')}
            >
              🏆
            </Link>
            <Link 
              href="/challenges" 
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-xl sm:text-2xl hover:scale-110 active:scale-95 transition-all duration-200 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50"
              aria-label={t('nav.challenges')}
            >
              🎯
            </Link>
          </div>
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

