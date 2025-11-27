'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { SettingsDialog } from '@/components/SettingsDialog';
import { Logo } from '@/components/Logo';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export const Header = memo(function Header() {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <header className="border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 backdrop-blur sticky top-0 z-40 safe-top">
      <nav
        className="container flex items-center justify-between h-16 sm:h-12 min-w-0"
        role="navigation"
        aria-label={t('nav.main')}
      >
        <Link href="/" className="flex-shrink-0 flex items-center" aria-label={t('nav.home')}>
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-2 text-xs sm:text-sm min-w-0 flex-1 justify-end">
          {/* Navigation Icons - Hidden on mobile (BottomNavigation handles this) */}
          {!isMobile && (
            <div className="flex items-center gap-0.5 sm:gap-0.5 flex-shrink-0">
              <Link
                href="/activities"
                className={`nav-icon nav-icon-activities min-h-[44px] min-w-[44px] flex items-center justify-center text-lg sm:text-xl transition-all duration-500 rounded-full relative overflow-hidden group`}
                aria-label={t('nav.activities')}
                data-tour-id="activities"
              >
                <span
                  className={`relative z-10 group-hover:scale-125 group-active:scale-95 transition-transform duration-300 filter drop-shadow-sm`}
                >
                  🏃
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-600/20 dark:from-blue-400/30 dark:via-cyan-400/30 dark:to-blue-500/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-full blur-sm"></div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/50 dark:group-hover:border-blue-400/70 group-active:border-blue-400/70 dark:group-active:border-blue-400/80 rounded-full transition-all duration-500"></div>
              </Link>
              <span className="text-brand text-[8px] sm:text-[9px] font-light mx-0 sm:mx-0.5 h-4 sm:h-5 flex items-center leading-none">
                |
              </span>
              <Link
                href="/stats"
                className={`nav-icon nav-icon-stats min-h-[44px] min-w-[44px] flex items-center justify-center text-lg sm:text-xl transition-all duration-500 rounded-full relative overflow-hidden group`}
                aria-label={t('nav.stats')}
                data-tour-id="stats"
              >
                <span
                  className={`relative z-10 group-hover:scale-125 group-active:scale-95 transition-transform duration-300 filter drop-shadow-sm`}
                >
                  📊
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-600/20 dark:from-green-400/30 dark:via-emerald-400/30 dark:to-green-500/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-full blur-sm"></div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-400/50 dark:group-hover:border-green-400/70 group-active:border-green-400/70 dark:group-active:border-green-400/80 rounded-full transition-all duration-500"></div>
              </Link>
              <span className="text-brand text-[8px] sm:text-[9px] font-light mx-0 sm:mx-0.5 h-4 sm:h-5 flex items-center leading-none">
                |
              </span>
              <Link
                href="/achievements"
                className={`nav-icon nav-icon-achievements min-h-[44px] min-w-[44px] flex items-center justify-center text-lg sm:text-xl transition-all duration-500 rounded-full relative overflow-hidden group`}
                aria-label={t('nav.achievements')}
                data-tour-id="achievements"
              >
                <span
                  className={`relative z-10 group-hover:scale-125 group-active:scale-95 transition-transform duration-300 filter drop-shadow-sm`}
                >
                  🏆
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-amber-500/20 to-yellow-600/20 dark:from-yellow-400/30 dark:via-amber-400/30 dark:to-yellow-500/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-full blur-sm"></div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 dark:group-hover:border-yellow-400/70 group-active:border-yellow-400/70 dark:group-active:border-yellow-400/80 rounded-full transition-all duration-500"></div>
              </Link>
              <span className="text-brand text-[8px] sm:text-[9px] font-light mx-0 sm:mx-0.5 h-4 sm:h-5 flex items-center leading-none">
                |
              </span>
              <Link
                href="/challenges"
                className={`nav-icon nav-icon-challenges min-h-[44px] min-w-[44px] flex items-center justify-center text-lg sm:text-xl transition-all duration-500 rounded-full relative overflow-hidden group`}
                aria-label={t('nav.challenges')}
                data-tour-id="challenges"
              >
                <span
                  className={`relative z-10 group-hover:scale-125 group-active:scale-95 transition-transform duration-300 filter drop-shadow-sm`}
                >
                  🎯
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-rose-500/20 to-red-600/20 dark:from-red-400/30 dark:via-rose-400/30 dark:to-red-500/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-full blur-sm"></div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-400/50 dark:group-hover:border-red-400/70 group-active:border-red-400/70 dark:group-active:border-red-400/80 rounded-full transition-all duration-500"></div>
              </Link>
            </div>
          )}
          {mounted && <SettingsDialog />}
        </div>
      </nav>
    </header>
  );
});
