'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useI18n } from '@/lib/i18n';
import { useUIState } from '@/lib/uiState';
import { useGlobalDialogState } from '@/lib/globalDialogState';

export function FloatingAddButton() {
  const isMobile = useIsMobile();
  const { t } = useI18n();
  const pathname = usePathname();
  const { hideFloatingAddButton } = useUIState();
  const { hasAnyDialogOpen } = useGlobalDialogState();
  // SettingsDialog manual check removed

  // Hide button on /add page, when editing/deleting, or when any dialog is open
  if (pathname === '/add' || hideFloatingAddButton || hasAnyDialogOpen) {
    return null;
  }

  // Calculate position above QuoteTicker - just above scrolling text
  // BottomNavigation (52px + safe-area) + QuoteTicker (24px) + spacing (8px)
  // Total bottom offset: 84px + safe-area
  // Use calc() to ensure fixed position regardless of scroll
  const bottomOffset = isMobile ? `calc(84px + env(safe-area-inset-bottom, 0px))` : '84px';

  return (
    <div
      className={`fixed right-4 sm:right-6 z-[10001] flex flex-col items-center gap-2`}
      style={
        {
          willChange: 'opacity, transform',
          position: 'fixed',
          bottom: bottomOffset,
          zIndex: 10001, // Increased to stay above BottomNavigation (9999) and possibly Dialogs
          pointerEvents: 'auto',
          opacity: 1,
          visibility: 'visible',
          display: 'flex',
          right: isMobile ? '1rem' : '1.5rem',
          touchAction: 'pan-x pan-up',
          WebkitTapHighlightColor: 'transparent',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          overscrollBehavior: 'none',
          WebkitOverscrollBehavior: 'none',
        } as React.CSSProperties
      }
    >
      {/* Add Exercise Button */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          {/* Apple liquid glass effect - multiple layers */}
          <div className="absolute inset-0 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-xl backdrop-saturate-150 -z-10 blur-sm"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 via-white/30 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent backdrop-blur-md -z-10"></div>
          <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent -z-10"></div>
          <Link
            href="/add"
            className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} rounded-full bg-gradient-to-br from-brand/90 via-brand-dark/90 to-brand/90 dark:from-brand/80 dark:via-brand-dark/80 dark:to-brand/80 backdrop-blur-xl backdrop-saturate-150 text-white shadow-2xl dark:shadow-[0_8px_32px_rgba(14,165,233,0.3)] hover:shadow-[0_12px_40px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_12px_40px_rgba(14,165,233,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center relative border border-white/40 dark:border-white/20 ring-1 ring-white/30 dark:ring-white/10`}
            style={{
              WebkitTapHighlightColor: 'transparent',
              boxShadow:
                '0 8px 32px rgba(14, 165, 233, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
            }}
            aria-label={t('actions.addActivity')}
            title={t('actions.addActivity')}
            data-tour-id="add-activity"
          >
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
            <span
              className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black drop-shadow-lg relative z-10 whitespace-nowrap filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}
            >
              𓂃🪶
            </span>
          </Link>
        </div>
        <span
          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap drop-shadow-md ${
            isMobile ? 'text-shadow-glow' : ''
          }`}
          style={{
            textShadow: isMobile
              ? '0 0 8px rgba(14, 165, 233, 0.4), 0 0 4px rgba(14, 165, 233, 0.3)'
              : '0 0 6px rgba(14, 165, 233, 0.3), 0 0 3px rgba(14, 165, 233, 0.2)',
          }}
        >
          {t('actions.addActivity')}
        </span>
      </div>
    </div>
  );
}
