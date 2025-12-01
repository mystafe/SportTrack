'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Store error info for better error reporting
    this.setState({ errorInfo });

    // Optional: Send to error tracking service (e.g., Sentry, LogRocket)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: You could send to an error tracking service here
      // errorTrackingService.captureException(error, { extra: errorInfo });
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when children change (e.g., route change)
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: null, errorInfo: null, retryCount: 0 });
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    if (retryCount < 3) {
      this.setState((prev) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prev.retryCount + 1,
      }));
    } else {
      // After 3 retries, reload the page
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo?: React.ErrorInfo | null;
  retryCount?: number;
  onRetry?: () => void;
}

function ErrorFallback({ error, errorInfo, retryCount = 0, onRetry }: ErrorFallbackProps) {
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
        className={`glass-effect card-3d max-w-md w-full rounded-xl border-2 border-red-300/50 dark:border-red-800/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${isMobile ? 'p-6' : 'p-8'} shadow-xl hover:scale-[1.01] transition-all duration-300`}
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
            className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 dark:text-gray-300 mb-4`}
          >
            {lang === 'tr'
              ? 'Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.'
              : 'Sorry, an unexpected error occurred. Please refresh the page or try again later.'}
          </p>

          {/* Recovery suggestions */}
          <div
            className={`mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800`}
          >
            <h2
              className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-blue-900 dark:text-blue-100 mb-2`}
            >
              {lang === 'tr' ? '💡 Çözüm Önerileri:' : '💡 Recovery Suggestions:'}
            </h2>
            <ul
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside`}
            >
              <li>
                {lang === 'tr'
                  ? 'Sayfayı yenileyin (F5 veya Ctrl+R)'
                  : 'Refresh the page (F5 or Ctrl+R)'}
              </li>
              <li>
                {lang === 'tr' ? 'Tarayıcı önbelleğini temizleyin' : 'Clear your browser cache'}
              </li>
              <li>
                {lang === 'tr'
                  ? 'İnternet bağlantınızı kontrol edin'
                  : 'Check your internet connection'}
              </li>
              <li>
                {lang === 'tr'
                  ? 'Sorun devam ederse, verilerinizi yedekleyin ve uygulamayı sıfırlayın'
                  : 'If the problem persists, backup your data and reset the app'}
              </li>
            </ul>
          </div>

          {error && process.env.NODE_ENV === 'development' && (
            <div
              className={`mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-left`}
            >
              <p
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-mono text-red-800 dark:text-red-200 break-all mb-2`}
              >
                <strong>{lang === 'tr' ? 'Hata:' : 'Error:'}</strong> {error.message}
              </p>
              {errorInfo?.componentStack && (
                <details className="mt-2">
                  <summary
                    className={`${isMobile ? 'text-xs' : 'text-sm'} cursor-pointer text-red-700 dark:text-red-300`}
                  >
                    {lang === 'tr' ? 'Detaylar' : 'Details'}
                  </summary>
                  <pre
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} mt-2 overflow-auto max-h-40 text-red-800 dark:text-red-200`}
                  >
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {retryCount > 0 && retryCount < 3 && (
            <div
              className={`mb-4 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800`}
            >
              <p
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-yellow-800 dark:text-yellow-200`}
              >
                {lang === 'tr' ? `Yeniden deneme ${retryCount}/3` : `Retry attempt ${retryCount}/3`}
              </p>
            </div>
          )}

          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 justify-center`}>
            {onRetry && retryCount < 3 && (
              <Button
                type="button"
                variant="primary"
                size={isMobile ? 'md' : 'lg'}
                onClick={onRetry}
                className={`${isMobile ? 'touch-feedback mobile-press bounce-in-mobile w-full' : 'btn-enhanced scale-on-interact'}`}
              >
                {lang === 'tr' ? 'Tekrar Dene' : 'Try Again'}
              </Button>
            )}
            <Button
              type="button"
              variant={retryCount >= 3 ? 'primary' : 'secondary'}
              size={isMobile ? 'md' : 'lg'}
              onClick={handleReload}
              className={`${isMobile ? 'touch-feedback mobile-press bounce-in-mobile w-full' : 'btn-enhanced scale-on-interact'}`}
            >
              {lang === 'tr' ? 'Sayfayı Yenile' : 'Reload Page'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size={isMobile ? 'md' : 'lg'}
              onClick={handleReset}
              className={`${isMobile ? 'touch-feedback mobile-press bounce-in-mobile w-full' : 'btn-enhanced scale-on-interact'}`}
            >
              {lang === 'tr' ? 'Verileri Sıfırla' : 'Reset Data'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
