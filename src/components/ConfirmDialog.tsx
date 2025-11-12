'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleCancel();
      }
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, handleCancel]);

  const dialog = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800 animate-scale-in">
        <div className="p-6">
          <h2
            id="confirm-dialog-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
          >
            {title}
          </h2>
          <p
            id="confirm-dialog-message"
            className="text-sm text-gray-600 dark:text-gray-400 mb-6"
          >
            {message}
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={cancelLabel || t('form.cancel')}
            >
              {cancelLabel || t('form.cancel')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg ${
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

