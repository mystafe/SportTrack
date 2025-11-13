'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'default'
}: ConfirmDialogProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onCancel]);

  if (!mounted || !open) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const dialog = (
    <div
      className={`fixed inset-0 z-[9999] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-bottom`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div className={`bg-white dark:bg-gray-900 ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-lg shadow-xl max-w-md w-full mx-4'} border border-gray-200 dark:border-gray-800 animate-scale-in`}>
        <div className={`${isMobile ? 'p-6' : 'p-6'}`}>
          <h2
            id="confirm-dialog-title"
            className={`${isMobile ? 'text-xl' : 'text-lg'} font-semibold text-gray-900 dark:text-gray-100 mb-2`}
          >
            {title}
          </h2>
          <p
            id="confirm-dialog-message"
            className={`${isMobile ? 'text-base' : 'text-sm'} text-gray-600 dark:text-gray-400 mb-6`}
          >
            {message}
          </p>
          <div className={`flex items-center ${isMobile ? 'flex-col-reverse gap-2' : 'justify-end gap-3'}`}>
            <button
              type="button"
              onClick={handleCancel}
              className={`${isMobile ? 'w-full min-h-[44px]' : 'px-4 py-2'} text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95`}
              aria-label={cancelLabel || t('form.cancel')}
            >
              {cancelLabel || t('form.cancel')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`${isMobile ? 'w-full min-h-[44px]' : 'px-4 py-2'} text-sm font-medium text-white rounded-lg transition-all duration-200 active:scale-95 hover:shadow-lg ${
                variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-brand hover:bg-brand-dark'
              }`}
              aria-label={confirmLabel || t('form.confirm')}
              autoFocus
            >
              {confirmLabel || t('form.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

