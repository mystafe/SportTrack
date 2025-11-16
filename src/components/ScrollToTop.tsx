'use client';

import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useI18n } from '@/lib/i18n';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { Button } from '@/components/ui/Button';

export function ScrollToTop() {
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useI18n();
  const router = useRouter();
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    setMounted(true);

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

  // Don't show if settings is open
  if (settingsOpen) return null;

  const scrollToTop = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    triggerHaptic('light');

    // Try multiple scroll methods for better compatibility
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
  };

  const handleAddActivity = (e: MouseEvent<HTMLButtonElement>) => {
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

  if (!mounted) return null;

  // Calculate position above QuoteTicker - just above scrolling text
  // QuoteTicker height: ~32px + BottomNavigation: 64px + safe-bottom
  // Position button just above QuoteTicker with small gap
  const bottomOffset = isMobile ? 'bottom-[112px]' : 'bottom-[104px]';

  return (
    <div
      className={`fixed ${bottomOffset} right-4 sm:right-6 z-[99999] transition-all duration-500 ease-in-out flex flex-col items-center gap-2`}
      style={{
        willChange: 'opacity, transform',
        position: 'fixed',
      }}
    >
      {/* Add Exercise Button - Above Top Button */}
      <Button
        onClick={handleAddActivity}
        type="button"
        variant="ghost"
        size={isMobile ? 'sm' : 'md'}
        className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-transparent text-brand dark:text-brand-light shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${isMobile ? 'touch-feedback mobile-press' : ''} opacity-100 relative p-0`}
        aria-label={t('actions.addActivity')}
        title={t('actions.addActivity')}
      >
        <span
          className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black drop-shadow-lg relative z-10 whitespace-nowrap`}
        >
          𓂃🪶
        </span>
      </Button>

      {/* Scroll To Top Button */}
      <Button
        onClick={scrollToTop}
        type="button"
        variant="primary"
        size={isMobile ? 'sm' : 'md'}
        className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-gradient-to-br from-brand via-brand-dark to-brand text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${isMobile ? 'touch-feedback mobile-press' : ''} border-2 border-white/20 dark:border-white/15 opacity-30 hover:opacity-60 relative overflow-visible p-0`}
        aria-label={t('scrollToTop') || 'Scroll to top'}
        title={t('scrollToTop') || 'Scroll to top'}
      >
        <span
          className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black drop-shadow-md relative z-10`}
        >
          ↑
        </span>
        {/* Subtle glow effect - only on hover */}
        <div className="absolute inset-0 rounded-full bg-brand/20 blur-sm -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </Button>
    </div>
  );
}
