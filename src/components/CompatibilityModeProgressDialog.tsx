'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Button } from '@/components/ui/Button';

type CompatibilityStep =
  | 'preparing'
  | 'migrating-badges'
  | 'migrating-challenges'
  | 'migrating-activities'
  | 'completed'
  | 'error';

interface ConversionLog {
  type: 'badge' | 'challenge' | 'activity';
  action: string;
  count: number;
}

interface CompatibilityModeProgressDialogProps {
  open: boolean;
  step: CompatibilityStep;
  percentage: number;
  error?: string | null;
  conversionLogs?: ConversionLog[];
  onClose?: () => void;
}

export function CompatibilityModeProgressDialog({
  open,
  step,
  percentage,
  error,
  conversionLogs = [],
  onClose,
}: CompatibilityModeProgressDialogProps) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close after completion if successful
  useEffect(() => {
    if (open && step === 'completed' && !error) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, step, error, onClose]);

  // Prevent body scroll when dialog is open
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

  const getStepLabel = (): string => {
    switch (step) {
      case 'preparing':
        return lang === 'tr' ? 'Veriler analiz ediliyor...' : 'Analyzing data...';
      case 'migrating-badges':
        return lang === 'tr' ? 'Başarılar güncelleniyor...' : 'Updating badges...';
      case 'migrating-challenges':
        return lang === 'tr' ? 'Hedefler güncelleniyor...' : 'Updating challenges...';
      case 'migrating-activities':
        return lang === 'tr' ? 'Egzersizler güncelleniyor...' : 'Updating activities...';
      case 'completed':
        return lang === 'tr' ? 'Uyumluluk modu tamamlandı!' : 'Compatibility mode completed!';
      case 'error':
        return lang === 'tr' ? 'Uyumluluk hatası' : 'Compatibility error';
      default:
        return lang === 'tr' ? 'İşleniyor...' : 'Processing...';
    }
  };

  const getStepIcon = (): string => {
    switch (step) {
      case 'preparing':
        return '🔍';
      case 'migrating-badges':
        return '🏆';
      case 'migrating-challenges':
        return '🎯';
      case 'migrating-activities':
        return '🏃';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const dialog = (
    <div
      className={`fixed inset-0 z-[10061] flex items-center justify-center bg-black/40 dark:bg-black/60 ${isMobile ? '' : 'backdrop-blur-md'} animate-fade-in safe-bottom p-4`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compatibility-progress-title"
      aria-busy={step !== 'completed' && step !== 'error'}
    >
      <div
        className={`glass-effect card-3d bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] max-w-lg w-full mx-4'} border-2 ${error ? 'border-red-300/50 dark:border-red-700/50' : step === 'completed' ? 'border-green-300/50 dark:border-green-700/50' : 'border-white/20 dark:border-gray-700/50'} animate-scale-in`}
      >
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          {/* Header */}
          <div className="mb-4">
            <h2
              id="compatibility-progress-title"
              className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold ${error ? 'text-red-600 dark:text-red-400' : step === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-gray-950 dark:text-white'} mb-2 flex items-center gap-2`}
            >
              <span className={step !== 'completed' && step !== 'error' ? 'animate-pulse' : ''}>
                {getStepIcon()}
              </span>
              {getStepLabel()}
            </h2>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
              {error
                ? error
                : step === 'completed'
                  ? lang === 'tr'
                    ? 'Tüm verileriniz yeni formata başarıyla dönüştürüldü!'
                    : 'All your data has been successfully converted to the new format!'
                  : lang === 'tr'
                    ? 'Lütfen bekleyin, verileriniz yeni formata dönüştürülüyor...'
                    : 'Please wait, your data is being converted to the new format...'}
            </p>
          </div>

          {/* Progress Bar */}
          {step !== 'error' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 dark:text-gray-300`}
                >
                  {step === 'completed' ? '100%' : `${Math.round(percentage)}%`}
                </span>
              </div>
              <div className="w-full glass-effect bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-white/10 dark:border-gray-700/30">
                <div
                  className={`h-full transition-all duration-300 ease-out rounded-full ${
                    step === 'completed'
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-brand to-brand-dark'
                  }`}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-700 dark:text-red-300`}>
                {error}
              </p>
            </div>
          )}

          {/* Conversion Logs */}
          {conversionLogs.length > 0 && (
            <div className="mb-4 max-h-48 overflow-y-auto">
              <h3
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 dark:text-gray-300 mb-2`}
              >
                {lang === 'tr' ? 'Dönüşüm Detayları:' : 'Conversion Details:'}
              </h3>
              <div className="space-y-1">
                {conversionLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 dark:text-gray-400 flex items-center gap-2`}
                  >
                    <span>
                      {log.type === 'badge' ? '🏆' : log.type === 'challenge' ? '🎯' : '🏃'}
                    </span>
                    <span>
                      {log.action}: {log.count} {lang === 'tr' ? 'adet' : 'items'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps Indicator */}
          {!error && (
            <div className="mb-4 space-y-2">
              {[
                { key: 'preparing', label: lang === 'tr' ? 'Analiz' : 'Analysis' },
                { key: 'migrating-badges', label: lang === 'tr' ? 'Başarılar' : 'Badges' },
                { key: 'migrating-challenges', label: lang === 'tr' ? 'Hedefler' : 'Challenges' },
                {
                  key: 'migrating-activities',
                  label: lang === 'tr' ? 'Egzersizler' : 'Activities',
                },
              ].map((stepItem, index) => {
                const stepIndex = [
                  'preparing',
                  'migrating-badges',
                  'migrating-challenges',
                  'migrating-activities',
                ].indexOf(step);
                const isCompleted = index < stepIndex;
                const isCurrent = index === stepIndex;
                const isPending = index > stepIndex;

                return (
                  <div
                    key={stepItem.key}
                    className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} ${
                      isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : isCurrent
                          ? 'text-brand dark:text-brand-light font-semibold'
                          : 'text-gray-400 dark:text-gray-600'
                    }`}
                  >
                    <span>{isCompleted ? '✅' : isCurrent ? '⏳' : '○'}</span>
                    <span>{stepItem.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Close Button */}
          {(step === 'completed' || step === 'error') && (
            <div className="flex justify-end">
              <Button
                variant={error ? 'danger' : 'primary'}
                size={isMobile ? 'sm' : 'md'}
                onClick={onClose}
                className="w-full"
              >
                {lang === 'tr' ? 'Kapat' : 'Close'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
