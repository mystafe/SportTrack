'use client';

import { useState, useEffect } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useI18n } from '@/lib/i18n';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { Button } from '@/components/ui/Button';

export function ScrollToTop() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useI18n();
  const router = useRouter();
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    // Check if settings dialog is open
    const checkSettingsOpen = () => {
      const settingsDialog = document.querySelector('[class*="z-[10000]"]');
      setSettingsOpen(!!settingsDialog);
    };

    // Use MutationObserver to detect settings dialog
    const observer = new MutationObserver(checkSettingsOpen);
    observer.observe(document.body, { childList: true, subtree: true });
    checkSettingsOpen();

    return () => observer.disconnect();
  }, []);

  const scrollToTop = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    triggerHaptic('light');

    // Use smooth scroll behavior for better UX
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Fallback for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
      const scrollToTop = () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(scrollToTop);
          window.scrollTo(0, currentScroll - currentScroll / 8);
        } else {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      };
      scrollToTop();
    }
  };

  const handleAddActivity = (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('medium');

    // Smooth page transition with fade effect
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
      mainElement.style.opacity = '0.9';
      mainElement.style.transform = 'translateY(-4px)';
    }

    setTimeout(() => {
      router.push('/add');
      // Reset after navigation
      setTimeout(() => {
        if (mainElement) {
          mainElement.style.opacity = '1';
          mainElement.style.transform = 'translateY(0)';
        }
      }, 100);
    }, 150);
  };

  const handleAddActivityTouch = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddActivity(e);
  };

  // Calculate position above QuoteTicker - just above scrolling text
  // QuoteTicker height: ~24px + BottomNavigation: 52px + safe-bottom
  // Position button just above QuoteTicker with small gap
  // Use calc() to ensure fixed position regardless of scroll
  const bottomOffset = isMobile ? `calc(76px + env(safe-area-inset-bottom, 0px))` : '76px';

  return (
    <div
      className={`fixed right-4 sm:right-6 z-[9999] flex flex-col items-center gap-2`}
      style={
        {
          willChange: 'opacity, transform',
          position: 'fixed',
          bottom: bottomOffset,
          right: isMobile ? '1rem' : '1.5rem',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          overscrollBehavior: 'none',
          WebkitOverscrollBehavior: 'none',
          touchAction: 'pan-x pan-up',
        } as React.CSSProperties
      }
    >
      {/* Add Exercise Button - Above Top Button */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          {/* Enhanced Apple liquid glass effect */}
          <div className="absolute inset-0 rounded-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl backdrop-saturate-150 -z-10 shadow-2xl"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-white/10 dark:from-gray-800/20 dark:via-transparent dark:to-gray-800/10 -z-10"></div>
          <Button
            onClick={handleAddActivity}
            onTouchStart={handleAddActivityTouch}
            type="button"
            variant="ghost"
            size={isMobile ? 'sm' : 'md'}
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full glass-effect card-3d bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl text-brand dark:text-brand-light shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 ${isMobile ? 'touch-feedback mobile-press touch-manipulation' : ''} opacity-100 relative p-0 border-2 border-white/30 dark:border-gray-700/40 z-50 pulse-glow hover:pulse-glow`}
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
            aria-label={t('actions.addActivity')}
            title={t('actions.addActivity')}
            data-tour-id="add-activity"
          >
            <span
              className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black drop-shadow-lg relative z-10 whitespace-nowrap icon-bounce`}
            >
              𓂃🪶
            </span>
          </Button>
        </div>
        <span
          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap`}
        >
          {t('actions.addActivity')}
        </span>
      </div>

      {/* Scroll To Top Button - Hide if settings is open */}
      {!settingsOpen && (
        <Button
          onClick={scrollToTop}
          type="button"
          variant="primary"
          size={isMobile ? 'sm' : 'md'}
          className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full glass-effect card-3d bg-gradient-to-br from-brand via-brand-dark to-brand text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isMobile ? 'touch-feedback mobile-press' : ''} border-2 border-white/30 dark:border-white/20 opacity-40 hover:opacity-100 relative overflow-visible p-0 animate-gradient pulse-glow hover:pulse-glow`}
          aria-label={t('scrollToTop') || 'Scroll to top'}
          title={t('scrollToTop') || 'Scroll to top'}
        >
          <span
            className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black drop-shadow-lg relative z-10 icon-bounce`}
          >
            ↑
          </span>
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 rounded-full bg-brand/30 blur-md -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50"></div>
        </Button>
      )}
    </div>
  );
}
