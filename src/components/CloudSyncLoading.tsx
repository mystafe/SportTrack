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
    const interval = setInterval(checkSyncStatus, 500); // Reduced frequency

    // Force close after 10 seconds to prevent infinite loading
    const timeout = setTimeout(() => {
      if (showLoading) {
        console.warn('Sync loading timed out, forcing close');
        setShowLoading(false);
        // Force clear the stuck flag
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sporttrack_sync_in_progress');
        }
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAuthenticated, isConfigured, lang, showLoading]);

  if (!showLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md">
      <div className="glass-effect card-3d flex flex-col items-center gap-4 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-8 shadow-2xl border-2 border-white/20 dark:border-gray-700/50">
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
