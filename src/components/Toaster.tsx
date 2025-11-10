'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info';

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      {mounted &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 ${
                  toast.type === 'success'
                    ? 'bg-green-500 text-white'
                    : toast.type === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {toast.message}
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

