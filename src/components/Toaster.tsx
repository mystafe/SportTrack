'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TIMEOUTS } from '@/lib/constants';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToasterContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToasterContext = createContext<ToasterContextValue | null>(null);

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, TIMEOUTS.TOAST_DURATION);
  }, []);

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      {mounted &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            className={`fixed z-[99999] flex flex-col gap-2 ${
              isMobile ? 'left-4 right-4 safe-bottom' : 'bottom-4 right-4'
            }`}
            style={
              isMobile
                ? {
                    bottom:
                      'calc(64px + 32px + 16px + max(16px, env(safe-area-inset-bottom, 0px)))', // Above BottomNavigation + QuoteTicker + spacing + safe area
                  }
                : undefined
            }
          >
            {toasts.map((toast, index) => (
              <div
                key={toast.id}
                className={`${isMobile ? 'w-full max-w-sm' : 'max-w-md'} ${isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3 text-sm'} rounded-xl shadow-xl font-medium animate-slide-in-right transition-all duration-300 whitespace-pre-line backdrop-blur-sm border-2 ${
                  toast.type === 'success'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400/30 shadow-green-500/20'
                    : toast.type === 'error'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400/30 shadow-red-500/20'
                      : toast.type === 'warning'
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-400/30 shadow-yellow-500/20'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400/30 shadow-blue-500/20'
                }`}
                role="alert"
                aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
                aria-atomic="true"
                style={{
                  animationDelay: `${index * 50}ms`,
                  transform: `translateY(${index * -8}px)`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-xl">
                    {toast.type === 'success' && '✓'}
                    {toast.type === 'error' && '✕'}
                    {toast.type === 'warning' && '⚠'}
                    {toast.type === 'info' && 'ℹ'}
                  </div>
                  <div className="flex-1">{toast.message}</div>
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToasterContext.Provider>
  );
}

export function useToaster() {
  const ctx = useContext(ToasterContext);
  if (!ctx) {
    throw new Error('useToaster must be used within ToasterProvider');
  }
  return ctx;
}
