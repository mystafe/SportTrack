'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error: Error | null }) {
  // Detect language from localStorage or default to Turkish
  const getLang = (): 'tr' | 'en' => {
    if (typeof window === 'undefined') return 'tr';
    try {
      const lang = localStorage.getItem('lang');
      return lang === 'en' ? 'en' : 'tr';
    } catch {
      return 'tr';
    }
  };

  // Detect mobile from window width
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const lang = getLang();

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${isMobile ? 'py-8' : 'py-12'}`}
    >
      <div
        className={`max-w-md w-full rounded-xl border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-white via-red-50/50 to-white dark:from-gray-900/95 dark:via-red-900/20 dark:to-gray-900/95 ${isMobile ? 'p-6' : 'p-8'} shadow-xl`}
      >
        <div className="text-center">
          <div
            className={`${isMobile ? 'text-5xl' : 'text-6xl'} mb-4 ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}
          >
            ⚠️
          </div>
          <h1
            className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 mb-2`}
          >
            {lang === 'tr' ? 'Bir Hata Oluştu' : 'Something Went Wrong'}
          </h1>
          <p
            className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 dark:text-gray-300 mb-6`}
          >
            {lang === 'tr'
              ? 'Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.'
              : 'Sorry, an unexpected error occurred. Please refresh the page or try again later.'}
          </p>

          {error && process.env.NODE_ENV === 'development' && (
            <div
              className={`mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-left`}
            >
              <p
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-mono text-red-800 dark:text-red-200 break-all`}
              >
                {error.message}
              </p>
            </div>
          )}

          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 justify-center`}>
            <button
              onClick={handleReload}
              className={`px-6 py-3 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg hover:from-brand-dark hover:to-brand font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl ${isMobile ? 'touch-feedback mobile-press bounce-in-mobile w-full' : 'btn-enhanced scale-on-interact'}`}
            >
              {lang === 'tr' ? 'Sayfayı Yenile' : 'Reload Page'}
            </button>
            <button
              onClick={handleReset}
              className={`px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl ${isMobile ? 'touch-feedback mobile-press bounce-in-mobile w-full' : 'btn-enhanced scale-on-interact'}`}
            >
              {lang === 'tr' ? 'Verileri Sıfırla' : 'Reset Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
