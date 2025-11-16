'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Button } from '@/components/ui/Button';

interface ImportProgressDialogProps {
  open: boolean;
  processed: number;
  total: number;
  percentage: number;
  currentItem?: string;
  errors?: string[];
  warnings?: string[];
  summary?: {
    exercisesImported: number;
    exercisesRemoved: number;
    badgesImported: number;
    badgesRemoved: number;
    challengesImported: number;
    challengesRemoved: number;
    activitiesImported: number;
    activitiesRemoved: number;
  };
  onCancel?: () => void;
  onClose?: () => void;
}

export function ImportProgressDialog({
  open,
  processed,
  total,
  percentage,
  currentItem,
  errors = [],
  warnings = [],
  summary,
  onCancel,
  onClose,
}: ImportProgressDialogProps) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();

  // Auto-close after completion if no errors
  useEffect(() => {
    if (open && percentage === 100 && errors.length === 0) {
      const timer = setTimeout(() => {
        // Dialog will be closed by parent component
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [open, percentage, errors.length]);

  if (!open) return null;

  const dialog = (
    <div
      className={`fixed inset-0 z-[10001] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-bottom`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-progress-title"
      aria-busy={percentage < 100}
    >
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-md w-full mx-4'} border-2 border-gray-200 dark:border-gray-700 animate-scale-in`}
      >
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          {/* Header */}
          <div className="mb-4">
            <h2
              id="import-progress-title"
              className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-950 dark:text-white mb-2 flex items-center gap-2`}
            >
              <span className={percentage < 100 ? 'animate-spin' : ''}>⏳</span>
              {lang === 'tr' ? 'Import İşleniyor...' : 'Importing...'}
            </h2>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
              {percentage < 100
                ? lang === 'tr'
                  ? 'Lütfen bekleyin, verileriniz import ediliyor...'
                  : 'Please wait, your data is being imported...'
                : lang === 'tr'
                  ? 'Import tamamlandı!'
                  : 'Import completed!'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 dark:text-gray-300`}
              >
                {processed.toLocaleString()} / {total.toLocaleString()}
              </span>
              <span
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-brand dark:text-brand-light`}
              >
                {percentage}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-brand-dark transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          {/* Current Item */}
          {currentItem && percentage < 100 && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 mb-1`}
              >
                {lang === 'tr' ? 'İşleniyor:' : 'Processing:'}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-gray-100 truncate`}
              >
                {currentItem}
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700 max-h-32 overflow-y-auto">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-red-900 dark:text-red-100 mb-2`}
              >
                ⚠️ {lang === 'tr' ? 'Hatalar' : 'Errors'} ({errors.length})
              </div>
              <div className="space-y-1">
                {errors.slice(0, 5).map((error, idx) => (
                  <div
                    key={idx}
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-800 dark:text-red-200`}
                  >
                    • {error}
                  </div>
                ))}
                {errors.length > 5 && (
                  <div
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-700 dark:text-red-300 italic`}
                  >
                    {lang === 'tr'
                      ? `... ve ${errors.length - 5} hata daha`
                      : `... and ${errors.length - 5} more errors`}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700 max-h-32 overflow-y-auto">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-yellow-900 dark:text-yellow-100 mb-2`}
              >
                ⚠️ {lang === 'tr' ? 'Uyarılar' : 'Warnings'} ({warnings.length})
              </div>
              <div className="space-y-1">
                {warnings.slice(0, 5).map((warning, idx) => (
                  <div
                    key={idx}
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-yellow-800 dark:text-yellow-200`}
                  >
                    • {warning}
                  </div>
                ))}
                {warnings.length > 5 && (
                  <div
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-yellow-700 dark:text-yellow-300 italic`}
                  >
                    {lang === 'tr'
                      ? `... ve ${warnings.length - 5} uyarı daha`
                      : `... and ${warnings.length - 5} more warnings`}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {percentage === 100 && summary && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-blue-900 dark:text-blue-100 mb-2`}
              >
                📊 {lang === 'tr' ? 'Import Özeti' : 'Import Summary'}
              </div>
              <div
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-blue-800 dark:text-blue-200 space-y-1`}
              >
                {summary.exercisesImported > 0 && (
                  <div>
                    ✅ {lang === 'tr' ? 'Egzersizler' : 'Exercises'}: {summary.exercisesImported}{' '}
                    {lang === 'tr' ? 'import edildi' : 'imported'}
                    {summary.exercisesRemoved > 0 &&
                      `, ${summary.exercisesRemoved} ${lang === 'tr' ? 'kaldırıldı' : 'removed'}`}
                  </div>
                )}
                {summary.badgesImported > 0 && (
                  <div>
                    ✅ {lang === 'tr' ? 'Rozetler' : 'Badges'}: {summary.badgesImported}{' '}
                    {lang === 'tr' ? 'import edildi' : 'imported'}
                    {summary.badgesRemoved > 0 &&
                      `, ${summary.badgesRemoved} ${lang === 'tr' ? 'kaldırıldı' : 'removed'}`}
                  </div>
                )}
                {summary.challengesImported > 0 && (
                  <div>
                    ✅ {lang === 'tr' ? 'Hedefler' : 'Challenges'}: {summary.challengesImported}{' '}
                    {lang === 'tr' ? 'import edildi' : 'imported'}
                    {summary.challengesRemoved > 0 &&
                      `, ${summary.challengesRemoved} ${lang === 'tr' ? 'kaldırıldı' : 'removed'}`}
                  </div>
                )}
                {summary.activitiesImported > 0 && (
                  <div>
                    ✅ {lang === 'tr' ? 'Aktivite Tanımları' : 'Activity Definitions'}:{' '}
                    {summary.activitiesImported} {lang === 'tr' ? 'import edildi' : 'imported'}
                    {summary.activitiesRemoved > 0 &&
                      `, ${summary.activitiesRemoved} ${lang === 'tr' ? 'kaldırıldı' : 'removed'}`}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Message */}
          {percentage === 100 && errors.length === 0 && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-green-900 dark:text-green-100 flex items-center gap-2`}
              >
                <span>✅</span>
                {lang === 'tr' ? 'Import başarıyla tamamlandı!' : 'Import completed successfully!'}
              </div>
            </div>
          )}

          {/* Partial Success Message */}
          {percentage === 100 && errors.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-yellow-900 dark:text-yellow-100 flex items-center gap-2`}
              >
                <span>⚠️</span>
                {lang === 'tr'
                  ? 'Import tamamlandı, ancak bazı hatalar var. Detaylar için yukarıdaki hata listesine bakın.'
                  : 'Import completed, but some errors occurred. See the error list above for details.'}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            {percentage < 100 && onCancel && (
              <Button
                type="button"
                variant="outline"
                size={isMobile ? 'md' : 'md'}
                onClick={onCancel}
                fullWidth={isMobile}
                className={isMobile ? 'min-h-[44px]' : ''}
              >
                {lang === 'tr' ? 'İptal' : 'Cancel'}
              </Button>
            )}
            {percentage === 100 && onClose && (
              <Button
                type="button"
                variant="primary"
                size={isMobile ? 'md' : 'md'}
                onClick={onClose}
                fullWidth={isMobile}
                className={isMobile ? 'min-h-[44px]' : ''}
              >
                {lang === 'tr' ? 'Kapat' : 'Close'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
