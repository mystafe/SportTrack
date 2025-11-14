'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function OnlineStatusIndicator() {
  const { isOffline } = useOnlineStatus();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();

  if (!isOffline) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[10000] bg-red-500 dark:bg-red-600 text-white text-center ${isMobile ? 'py-2 px-4 text-xs' : 'py-2.5 px-6 text-sm'} font-semibold shadow-lg animate-slide-in-down`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-base">⚠️</span>
        <span>
          {lang === 'tr'
            ? 'İnternet bağlantısı yok. Offline modda çalışıyorsunuz.'
            : 'No internet connection. You are working offline.'}
        </span>
      </div>
    </div>
  );
}
