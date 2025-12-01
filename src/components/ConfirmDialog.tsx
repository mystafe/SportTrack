'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { Button } from '@/components/ui/Button';

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
  variant = 'default',
}: ConfirmDialogProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const dialogRef = useFocusTrap(open);

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
      className={`fixed inset-0 z-[9999] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 dark:bg-black/60 backdrop-blur-md ${isMobile ? 'backdrop-fade' : 'animate-fade-in'} safe-bottom`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div
        ref={dialogRef}
        className={`glass-effect card-3d bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${isMobile ? 'rounded-t-2xl w-full max-h-[90vh] overflow-y-auto slide-up-bottom' : 'rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in'} border-2 border-white/20 dark:border-gray-700/50`}
      >
        <div className={`${isMobile ? 'p-6' : 'p-6'}`}>
          <div className="flex items-start gap-3 mb-4">
            {variant === 'danger' ? (
              <span className="text-3xl icon-bounce">⚠️</span>
            ) : (
              <span className="text-3xl icon-bounce">❓</span>
            )}
            <div className="flex-1">
              <h2
                id="confirm-dialog-title"
                className={`${isMobile ? 'text-xl' : 'text-lg'} font-bold text-gray-950 dark:text-white mb-2 ${variant === 'danger' ? 'neon-glow-red' : 'neon-glow-brand'}`}
              >
                {title}
              </h2>
            </div>
          </div>
          <p
            id="confirm-dialog-message"
            className={`${isMobile ? 'text-base' : 'text-sm'} font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed`}
          >
            {message}
          </p>
          <div
            className={`flex items-center ${isMobile ? 'flex-col-reverse gap-2' : 'justify-end gap-3'}`}
          >
            <Button
              variant="secondary"
              size={isMobile ? 'md' : 'md'}
              fullWidth={isMobile}
              onClick={handleCancel}
              aria-label={cancelLabel || t('form.cancel')}
              className="btn-enhanced hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {cancelLabel || t('form.cancel')}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              size={isMobile ? 'md' : 'md'}
              fullWidth={isMobile}
              onClick={handleConfirm}
              aria-label={confirmLabel || t('form.confirm')}
              autoFocus
              className={`btn-enhanced animate-gradient hover:scale-105 active:scale-95 transition-all duration-200 ${variant === 'danger' ? 'shadow-lg hover:shadow-xl shadow-red-500/30' : 'shadow-lg hover:shadow-xl shadow-brand/30'}`}
            >
              {confirmLabel || t('form.confirm')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
