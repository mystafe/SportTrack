'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useI18n } from '@/lib/i18n';
import { useUIState } from '@/lib/uiState';
import { useGlobalDialogState } from '@/lib/globalDialogState';
import { useState, useEffect } from 'react';

export function FloatingAddButton() {
  const isMobile = useIsMobile();
  const { t } = useI18n();
  const pathname = usePathname();
  const { hideFloatingAddButton } = useUIState();
  const { hasAnyDialogOpen } = useGlobalDialogState();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Check if Settings Dialog is open
  useEffect(() => {
    const checkSettingsOpen = () => {
      const settingsDialog = document.querySelector('[class*="z-[9999]"]');
      const isOpen = settingsDialog && window.getComputedStyle(settingsDialog).display !== 'none';
      setSettingsOpen(!!isOpen);
    };

    const observer = new MutationObserver(checkSettingsOpen);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
    checkSettingsOpen();

    const interval = setInterval(checkSettingsOpen, 100);
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Hide button on /add page, when editing/deleting, or when any dialog is open
  if (pathname === '/add' || hideFloatingAddButton || settingsOpen || hasAnyDialogOpen) {
    return null;
  }

  // Calculate position above QuoteTicker - just above scrolling text
  // BottomNavigation: 48px + safe-area + QuoteTicker: 20px + spacing: 8px
  // For iPhone 17 Pro Max: safe-area-inset-bottom is typically 34px
  const bottomOffset = isMobile
    ? `calc(48px + 20px + 8px + env(safe-area-inset-bottom, 0px))`
    : '122px';

  return (
    <div
      className={`fixed right-4 sm:right-6 z-[70] transition-all duration-500 ease-in-out flex flex-col items-center gap-2`}
      style={{
        willChange: 'opacity, transform',
        position: 'fixed',
        bottom: bottomOffset,
        zIndex: 70,
        pointerEvents: 'auto',
        opacity: 1,
        visibility: 'visible',
        display: 'flex',
        right: isMobile ? '1rem' : '1.5rem',
        // AGGRESSIVE: Force visibility
        opacity: 1,
        visibility: 'visible',
        display: 'flex',
        pointerEvents: 'auto',
      }}
    >
      {/* Add Exercise Button */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          {/* Backdrop blur effect (Apple liquid glass effect) */}
          <div className="absolute inset-0 rounded-full bg-white/30 dark:bg-gray-900/30 backdrop-blur-md backdrop-saturate-150 -z-10"></div>
          <Link
            href="/add"
            className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} rounded-full bg-gradient-to-br from-brand via-brand-dark to-brand text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center opacity-100 relative p-0 border-2 border-white/30 dark:border-white/20 z-50 ring-2 ring-brand/30`}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
            aria-label={t('actions.addActivity')}
            title={t('actions.addActivity')}
            data-tour-id="add-activity"
          >
            <span
              className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black drop-shadow-lg relative z-10 whitespace-nowrap`}
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
