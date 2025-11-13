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
      <nav className="container flex items-center justify-between h-16 sm:h-12 min-w-0" role="navigation" aria-label={t('nav.main')}>
        <Link href="/" className="font-semibold text-xl sm:text-lg flex-shrink-0" aria-label={t('nav.home')}>
          {isMobile ? 'ST' : 'SportTrack'}
        </Link>
        <div className="flex items-center gap-1 sm:gap-1.5 sm:gap-2 text-xs sm:text-sm min-w-0 flex-1 justify-end">
          {/* Navigation Icons - Elegant and minimal */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Link 
              href="/activities" 
              className="min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-lg sm:text-xl transition-all duration-300 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:scale-105 active:scale-95 group" 
              aria-label={t('nav.activities')}
            >
              <span className="group-hover:scale-110 transition-transform duration-300">📋</span>
            </Link>
            <Link 
              href="/stats" 
              className="min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-lg sm:text-xl transition-all duration-300 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:scale-105 active:scale-95 group" 
              aria-label={t('nav.stats')}
            >
              <span className="group-hover:scale-110 transition-transform duration-300">📊</span>
            </Link>
            <Link 
              href="/achievements" 
              className="min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-lg sm:text-xl transition-all duration-300 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:scale-105 active:scale-95 group"
              aria-label={t('nav.achievements')}
            >
              <span className="group-hover:scale-110 transition-transform duration-300">🏆</span>
            </Link>
            <Link 
              href="/challenges" 
              className="min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-lg sm:text-xl transition-all duration-300 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:scale-105 active:scale-95 group"
              aria-label={t('nav.challenges')}
            >
              <span className="group-hover:scale-110 transition-transform duration-300">🎯</span>
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

