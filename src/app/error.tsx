'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className={`${isMobile ? 'w-full' : 'max-w-md'} rounded-xl border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-white via-red-50/50 to-white dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900 p-6 shadow-lg`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1
            className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white mb-2`}
          >
            {lang === 'tr' ? 'Bir Hata Oluştu' : 'Something Went Wrong'}
          </h1>
          <p
            className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 dark:text-gray-400 mb-6`}
          >
            {lang === 'tr'
              ? 'Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.'
              : 'Sorry, something went wrong. Please try again.'}
          </p>
          {error.message && (
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg font-mono break-all`}
            >
              {error.message}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300`}
            >
              {lang === 'tr' ? 'Tekrar Dene' : 'Try Again'}
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-300`}
            >
              {lang === 'tr' ? 'Ana Sayfa' : 'Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
