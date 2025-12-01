'use client';

import { useState, useEffect, memo, useRef } from 'react';
import Link from 'next/link';
import { SettingsDialog } from '@/components/SettingsDialog';
import { Logo } from '@/components/Logo';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export const Header = memo(function Header() {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent pull-to-refresh and overscroll on header
  useEffect(() => {
    if (!headerRef.current) return;

    const header = headerRef.current;
    let touchStartY = 0;
    let touchStartX = 0;
    let isDragging = false;
    let isOnHeader = false;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (header.contains(target) && e.touches.length > 0) {
        isOnHeader = true;
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        // Prevent body scroll when touching header
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;

      const target = e.target as HTMLElement;
      if (header.contains(target) || isOnHeader) {
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const deltaY = touchY - touchStartY; // Positive deltaY means downward movement
        const deltaX = Math.abs(touchX - touchStartX);

        // Prevent ALL downward drag on header (pull-to-refresh)
        // Allow horizontal movement for navigation
        if (deltaY > 0 && deltaX < 20) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      }
    };

    const handleTouchEnd = () => {
      if (isOnHeader) {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
      isDragging = false;
      isOnHeader = false;
      touchStartY = 0;
      touchStartX = 0;
    };

    const handleTouchCancel = () => {
      if (isOnHeader) {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
      isDragging = false;
      isOnHeader = false;
      touchStartY = 0;
      touchStartX = 0;
    };

    // Use capture phase to catch events before they reach body
    header.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    header.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    header.addEventListener('touchend', handleTouchEnd, { passive: false, capture: true });
    header.addEventListener('touchcancel', handleTouchCancel, { passive: false, capture: true });

    return () => {
      // Cleanup: restore body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';

      header.removeEventListener('touchstart', handleTouchStart, { capture: true } as any);
      header.removeEventListener('touchmove', handleTouchMove, { capture: true } as any);
      header.removeEventListener('touchend', handleTouchEnd, { capture: true } as any);
      header.removeEventListener('touchcancel', handleTouchCancel, { capture: true } as any);
    };
  }, []);
  return (
    <header
      ref={headerRef}
      className="border-b-2 border-white/20 dark:border-gray-700/50 glass-effect bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl sticky top-0 z-[60] safe-top shadow-sm"
      style={
        {
          zIndex: 60,
          overscrollBehavior: 'none',
          WebkitOverscrollBehavior: 'none',
          touchAction: 'pan-x',
          WebkitTouchCallout: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          position: 'sticky',
          top: 0,
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        } as React.CSSProperties
      }
    >
      <nav
        className="container flex items-center justify-between h-14 sm:h-10 min-w-0"
        role="navigation"
        aria-label={t('nav.main')}
        style={
          {
            overscrollBehavior: 'none',
            WebkitOverscrollBehavior: 'none',
            touchAction: 'pan-x',
            pointerEvents: 'auto',
          } as React.CSSProperties
        }
      >
        <Link
          href="/"
          className="flex-shrink-0 flex items-center no-underline hover:no-underline transition-transform duration-300 hover:scale-110 active:scale-95"
          aria-label={t('nav.home')}
        >
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
                  className={`relative z-10 group-hover:scale-125 group-active:scale-95 transition-transform duration-300 filter drop-shadow-sm icon-bounce`}
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
                  className={`relative z-10 group-hover:scale-125 group-active:scale-95 transition-transform duration-300 filter drop-shadow-sm icon-bounce`}
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
                  className={`relative z-10 group-hover:scale-125 group-active:scale-95 transition-transform duration-300 filter drop-shadow-sm icon-bounce`}
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
                  className={`relative z-10 group-hover:scale-125 group-active:scale-95 transition-transform duration-300 filter drop-shadow-sm icon-bounce`}
                >
                  🎯
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-rose-500/20 to-red-600/20 dark:from-red-400/30 dark:via-rose-400/30 dark:to-red-500/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-full blur-sm"></div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-400/50 dark:group-hover:border-red-400/70 group-active:border-red-400/70 dark:group-active:border-red-400/80 rounded-full transition-all duration-500"></div>
              </Link>
            </div>
          )}
          {mounted && (
            <div
              style={{
                touchAction: 'manipulation',
                pointerEvents: 'auto',
                zIndex: 9999,
                position: 'relative',
              }}
            >
              <SettingsDialog />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
});
