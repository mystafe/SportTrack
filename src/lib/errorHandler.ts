/**
 * Global Error Handler
 * Centralized error handling and logging
 */

export type ErrorType = 'storage' | 'network' | 'validation' | 'parse' | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  originalError?: unknown;
  timestamp: string;
  context?: Record<string, unknown>;
}

/**
 * Create a standardized error object
 */
export function createError(
  type: ErrorType,
  message: string,
  options?: {
    code?: string;
    originalError?: unknown;
    context?: Record<string, unknown>;
  }
): AppError {
  return {
    type,
    message,
    code: options?.code,
    originalError: options?.originalError,
    timestamp: new Date().toISOString(),
    context: options?.context,
  };
}

/**
 * Check if error is a storage quota error
 */
export function isQuotaError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'QuotaExceededError';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout')
    );
  }
  return false;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError, lang: 'tr' | 'en' = 'tr'): string {
  const messages: Record<ErrorType, { tr: string; en: string }> = {
    storage: {
      tr: 'Depolama hatası. Lütfen tarayıcı ayarlarınızı kontrol edin.',
      en: 'Storage error. Please check your browser settings.',
    },
    network: {
      tr: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
      en: 'Network connection error. Please check your internet connection.',
    },
    validation: {
      tr: 'Geçersiz veri. Lütfen girdiğiniz bilgileri kontrol edin.',
      en: 'Invalid data. Please check your input.',
    },
    parse: {
      tr: 'Veri okuma hatası. Dosya bozuk olabilir.',
      en: 'Data reading error. The file may be corrupted.',
    },
    unknown: {
      tr: 'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.',
      en: 'An unexpected error occurred. Please refresh the page.',
    },
  };

  return messages[error.type]?.[lang] || messages.unknown[lang];
}

/**
 * Log error (console + optional analytics)
 */
export function logError(error: AppError): void {
  console.error('[SportTrack Error]', {
    type: error.type,
    message: error.message,
    code: error.code,
    timestamp: error.timestamp,
    context: error.context,
    originalError: error.originalError,
  });

  // TODO: Add analytics integration if needed
  // analytics.track('error', error);
}

/**
 * Handle error and return user-friendly message
 */
export function handleError(
  error: unknown,
  lang: 'tr' | 'en' = 'tr',
  context?: Record<string, unknown>
): string {
  let appError: AppError;

  if (isQuotaError(error)) {
    appError = createError('storage', 'Storage quota exceeded', {
      code: 'QUOTA_EXCEEDED',
      originalError: error,
      context,
    });
  } else if (isNetworkError(error)) {
    appError = createError('network', 'Network error', {
      code: 'NETWORK_ERROR',
      originalError: error,
      context,
    });
  } else if (error instanceof Error) {
    appError = createError('unknown', error.message, {
      originalError: error,
      context,
    });
  } else {
    appError = createError('unknown', 'Unknown error', {
      originalError: error,
      context,
    });
  }

  logError(appError);
  return getUserFriendlyMessage(appError, lang);
}
