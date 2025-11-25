'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';

export function CloudSyncLoading() {
  const { t, lang } = useI18n();
  const { isAuthenticated, isConfigured } = useAuth();
  const [showLoading, setShowLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isConfigured) {
      setShowLoading(false);
      return;
    }

    // Check if initial sync is in progress
    const checkSyncStatus = () => {
      const syncInProgress =
        typeof window !== 'undefined' &&
        localStorage.getItem('sporttrack_sync_in_progress') === 'true';
      const initialSyncComplete =
        typeof window !== 'undefined' &&
        localStorage.getItem('sporttrack_initial_sync_complete') === 'true';

      if (syncInProgress && !initialSyncComplete) {
        setShowLoading(true);
        setLoadingText(
          lang === 'tr'
            ? 'Giriş yapılıyor ve veriler indiriliyor...'
            : 'Logging in and downloading data...'
        );
      } else {
        setShowLoading(false);
      }
    };

    // Check immediately
    checkSyncStatus();

    // Check periodically
    const interval = setInterval(checkSyncStatus, 100);

    return () => clearInterval(interval);
  }, [isAuthenticated, isConfigured, lang]);

  if (!showLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400"></div>
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{loadingText}</p>
        <div className="flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400"></div>
        </div>
      </div>
    </div>
  );
}
