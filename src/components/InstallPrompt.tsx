'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallPrompt() {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if dismissed within the last hour before showing
    const checkDismissed = () => {
      const dismissedTime = localStorage.getItem('pwa-install-dismissed');
      if (dismissedTime) {
        const dismissTimestamp = parseInt(dismissedTime, 10);
        const now = Date.now();
        // If dismissed time is in the future (still within 1 hour), don't show
        if (dismissTimestamp > now) {
          return false;
        } else {
          // 1 hour has passed, clear the dismissed flag
          localStorage.removeItem('pwa-install-dismissed');
        }
      }
      return true;
    };

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay to not interrupt user, but only if not dismissed
      if (checkDismissed()) {
        setTimeout(() => {
          // Check again before showing (in case user dismissed during delay)
          if (checkDismissed()) {
            setShowPrompt(true);
          }
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 1 hour (3600000 ms)
    const dismissTime = Date.now() + 3600000; // 1 hour from now
    localStorage.setItem('pwa-install-dismissed', String(dismissTime));
  };

  // Don't show if dismissed within the last hour
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (dismissedTime) {
      const dismissTimestamp = parseInt(dismissedTime, 10);
      const now = Date.now();
      // If dismissed time is in the future (still within 1 hour), don't show
      if (dismissTimestamp > now) {
        setShowPrompt(false);
        setDeferredPrompt(null); // Also clear deferred prompt
      } else {
        // 1 hour has passed, clear the dismissed flag
        localStorage.removeItem('pwa-install-dismissed');
      }
    }
  }, []);

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[10001] safe-bottom animate-slide-in-right flex justify-center">
      <div className="w-full max-w-md mx-auto">
        <Card
          variant="default"
          size="md"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 text-gray-950 dark:text-white">
              {t('pwa.installTitle')}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('pwa.installDescription')}
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="flex-1 sm:flex-none"
            >
              {t('pwa.dismiss')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleInstall}
              className="flex-1 sm:flex-none"
            >
              {t('pwa.install')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
