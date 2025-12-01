'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useEffect, useState } from 'react';

export function OnlineStatusIndicator() {
  const { isOffline, isOnline } = useOnlineStatus();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const [showOffline, setShowOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);

  // Show offline indicator after a brief delay
  useEffect(() => {
    if (isOffline) {
      const timer = setTimeout(() => setShowOffline(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowOffline(false);
    }
  }, [isOffline]);

  // Show online indicator briefly when connection is restored
  useEffect(() => {
    if (isOnline && showOffline) {
      setShowOnline(true);
      const timer = setTimeout(() => setShowOnline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOffline]);

  return (
    <>
      {/* Offline Indicator */}
      {showOffline && (
        <div
          className={`glass-effect fixed top-0 left-0 right-0 z-[10000] bg-red-500/95 dark:bg-red-600/95 backdrop-blur-md text-white text-center border-b-2 border-red-400/30 ${isMobile ? 'py-2 px-4 text-xs' : 'py-2.5 px-6 text-sm'} font-semibold shadow-lg animate-slide-in-down safe-top pointer-events-none`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center justify-center gap-2 pointer-events-auto">
            <span className="text-base">⚠️</span>
            <span>
              {lang === 'tr'
                ? 'İnternet bağlantısı yok. Offline modda çalışıyorsunuz.'
                : 'No internet connection. You are working offline.'}
            </span>
          </div>
        </div>
      )}

      {/* Online Indicator (brief notification when connection restored) */}
      {showOnline && (
        <div
          className={`glass-effect fixed top-0 left-0 right-0 z-[10000] bg-green-500/95 dark:bg-green-600/95 backdrop-blur-md text-white text-center border-b-2 border-green-400/30 ${isMobile ? 'py-2 px-4 text-xs' : 'py-2.5 px-6 text-sm'} font-semibold shadow-lg animate-slide-in-down safe-top pointer-events-none`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-center gap-2 pointer-events-auto">
            <span className="text-base">✅</span>
            <span>
              {lang === 'tr'
                ? 'İnternet bağlantısı yeniden kuruldu.'
                : 'Internet connection restored.'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
