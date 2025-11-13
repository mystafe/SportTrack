'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { exportToCSV, exportToPDF, ExportFormat } from '@/lib/exportUtils';
import { useToaster } from '@/components/Toaster';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { format as formatDate, startOfDay, endOfDay, subDays } from 'date-fns';

type ExportDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ExportDialog({ open, onClose }: ExportDialogProps) {
  const { activities } = useActivities();
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const isMobile = useIsMobile();
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | 'custom'>('all');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  if (!open) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let dateRangeOption: { start: Date; end: Date } | undefined;

      if (dateRange === 'custom') {
        if (!customStart || !customEnd) {
          showToast(t('export.dateRangeRequired'), 'error');
          setIsExporting(false);
          return;
        }
        dateRangeOption = {
          start: startOfDay(new Date(customStart)),
          end: endOfDay(new Date(customEnd))
        };
      } else if (dateRange === '7days') {
        dateRangeOption = {
          start: startOfDay(subDays(new Date(), 7)),
          end: endOfDay(new Date())
        };
      } else if (dateRange === '30days') {
        dateRangeOption = {
          start: startOfDay(subDays(new Date(), 30)),
          end: endOfDay(new Date())
        };
      }

      const options = {
        format: exportFormat,
        dateRange: dateRangeOption,
        language: lang as 'tr' | 'en'
      };

      if (exportFormat === 'csv') {
        exportToCSV(activities, settings, options);
        showToast(t('export.csvSuccess'), 'success');
      } else {
        await exportToPDF(activities, settings, options);
        showToast(t('export.pdfSuccess'), 'success');
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      showToast(t('export.failed'), 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const dialog = (
    <div
      className={`fixed inset-0 z-[9999] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-bottom`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
    >
      <div className={`bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-md w-full mx-4'} border-2 border-gray-200 dark:border-gray-700 animate-scale-in`}>
        <div className={`${isMobile ? 'p-6' : 'p-6'}`}>
          <h2
            id="export-dialog-title"
            className={`${isMobile ? 'text-xl' : 'text-lg'} font-bold text-gray-950 dark:text-white mb-4`}
          >
            {t('export.title')}
          </h2>

          {/* Format Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {t('export.format')}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 ${
                  exportFormat === 'csv'
                    ? 'bg-gradient-to-r from-brand to-brand-dark text-white border-brand shadow-md'
                    : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                }`}
              >
                CSV
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 ${
                  exportFormat === 'pdf'
                    ? 'bg-gradient-to-r from-brand to-brand-dark text-white border-brand shadow-md'
                    : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                }`}
              >
                PDF
              </button>
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {t('export.dateRange')}
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-sm input-enhanced"
            >
              <option value="all">{t('export.allTime')}</option>
              <option value="7days">{t('export.last7Days')}</option>
              <option value="30days">{t('export.last30Days')}</option>
              <option value="custom">{t('export.customRange')}</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {t('export.startDate')}
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-sm input-enhanced"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {t('export.endDate')}
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  max={formatDate(new Date(), 'yyyy-MM-dd')}
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-sm input-enhanced"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={`flex items-center ${isMobile ? 'flex-col-reverse gap-2' : 'justify-end gap-3'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`${isMobile ? 'w-full min-h-[44px]' : 'px-4 py-2'} text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 active:scale-95`}
            >
              {t('form.cancel')}
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className={`${isMobile ? 'w-full min-h-[44px]' : 'px-4 py-2'} text-sm font-semibold text-white rounded-lg transition-all duration-300 active:scale-95 hover:shadow-xl bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand disabled:opacity-50 disabled:hover:scale-100 shadow-md`}
            >
              {isExporting ? '...' : t('export.export')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

