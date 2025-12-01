'use client';

import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';
import { useI18n } from '@/lib/i18n';
import { useEffect, useState } from 'react';

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const { lang } = useI18n();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (wasOffline && isOnline) {
      // Show "Back online" message when coming back online
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [wasOffline, isOnline]);

  if (isOnline && !showMessage) {
    return null;
  }

  return (
    <div
      className={`glass-effect fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 backdrop-blur-md ${
        isOnline
          ? 'bg-green-500/95 text-white border-b-2 border-green-400/30'
          : 'bg-orange-500/95 dark:bg-orange-600/95 text-white border-b-2 border-orange-400/30'
      } ${showMessage || !isOnline ? 'translate-y-0' : '-translate-y-full'} shadow-lg`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
        {isOnline ? (
          <>
            <span>✅</span>
            <span>
              {lang === 'tr'
                ? 'İnternet bağlantısı yeniden kuruldu. Veriler senkronize ediliyor...'
                : 'Connection restored. Syncing data...'}
            </span>
          </>
        ) : (
          <>
            <span>⚠️</span>
            <span>
              {lang === 'tr'
                ? 'İnternet bağlantısı yok. Çevrimdışı moddasın.'
                : 'No internet connection. You are offline.'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
