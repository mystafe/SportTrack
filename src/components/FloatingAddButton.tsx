'use client';

import { useState, useEffect } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useI18n } from '@/lib/i18n';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { Button } from '@/components/ui/Button';

export function FloatingAddButton() {
  const isMobile = useIsMobile();
  const { t } = useI18n();
  const router = useRouter();
  const { triggerHaptic } = useHapticFeedback();

  const handleAddActivity = (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent double-trigger
    const target = e.currentTarget;
    if (target.hasAttribute('data-processing')) {
      return;
    }
    target.setAttribute('data-processing', 'true');

    triggerHaptic('medium');

    // Navigate without any animations or transitions
    router.push('/add');

    // Reset after a short delay
    setTimeout(() => {
      target.removeAttribute('data-processing');
    }, 300);
  };

  const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
    // Prevent double-tap zoom
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddActivity(e);
  };

  // Calculate position above QuoteTicker - just above scrolling text
  // QuoteTicker height: ~32px + BottomNavigation: 64px + safe-bottom
  // Position button just above QuoteTicker with small gap
  const bottomOffset = isMobile
    ? `calc(112px + max(0px, env(safe-area-inset-bottom, 0px)))`
    : '104px';

  return (
    <div
      className={`fixed right-4 sm:right-6 z-[9999] transition-all duration-500 ease-in-out flex flex-col items-center gap-2`}
      style={{
        willChange: 'opacity, transform',
        position: 'fixed',
        bottom: bottomOffset,
      }}
    >
      {/* Add Exercise Button */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          {/* Backdrop blur effect (Apple liquid glass effect) */}
          <div className="absolute inset-0 rounded-full bg-white/30 dark:bg-gray-900/30 backdrop-blur-md backdrop-saturate-150 -z-10"></div>
          <Button
            onClick={handleAddActivity}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            type="button"
            variant="primary"
            size={isMobile ? 'sm' : 'md'}
            className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} rounded-full bg-gradient-to-br from-brand via-brand-dark to-brand text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${isMobile ? 'touch-feedback mobile-press touch-manipulation' : ''} opacity-100 relative p-0 border-2 border-white/30 dark:border-white/20 z-50 ring-2 ring-brand/30`}
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
              className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black drop-shadow-lg relative z-10 whitespace-nowrap`}
            >
              𓂃🪶
            </span>
          </Button>
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
