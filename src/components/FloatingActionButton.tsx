'use client';

import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { useGlobalDialogState } from '@/lib/globalDialogState';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';

export function FloatingActionButton() {
  const router = useRouter();
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const { hasAnyDialogOpen } = useGlobalDialogState();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Only show on mobile
  if (!isMobile) return null;

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

  // Don't show if any dialog is open (including Settings)
  if (settingsOpen || hasAnyDialogOpen) return null;

  const handleClick = () => {
    triggerHaptic('medium');
    router.push('/add');
  };

  // Calculate bottom position: above BottomNavigation (64px) + QuoteTicker height (~45px) + spacing (16px) + safe area
  const bottomPosition = `calc(64px + 45px + 16px + max(16px, env(safe-area-inset-bottom, 0px)))`;

  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      onClick={handleClick}
      className="
        fixed right-4 z-[60]
        w-14 h-14 rounded-full
        shadow-2xl
        flex items-center justify-center
        text-2xl font-bold
        active:scale-95
        transition-all duration-300
        touch-feedback mobile-press
        animate-bounce-subtle
      "
      style={{
        bottom: bottomPosition,
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        pointerEvents: 'auto',
      }}
      aria-label={t('actions.addActivity')}
      data-tour-id="add-activity"
    >
      <span className="drop-shadow-lg">➕</span>
    </Button>
  );
}
