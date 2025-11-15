'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error to console
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="tr">
      <body className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black">
        <div className="max-w-md w-full rounded-xl border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-white via-red-50/50 to-white dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900 p-6 shadow-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Critical Error
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
              A critical error occurred. Please refresh the page.
            </p>
            {error.message && (
              <div className="text-sm text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg font-mono break-all">
                {error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 text-base rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-3 text-base rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-300"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
