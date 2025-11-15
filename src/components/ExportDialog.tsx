'use client';

import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useSettings, useActivityDefinitions } from '@/lib/settingsStore';
import { exportToCSV, exportToPDF, exportToJSON, ExportFormat } from '@/lib/exportUtils';
import { useToaster } from '@/components/Toaster';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { format as formatDate, startOfDay, endOfDay, subDays, parseISO } from 'date-fns';
import { getActivityLabel } from '@/lib/activityUtils';

type ExportDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ExportDialog({ open, onClose }: ExportDialogProps) {
  const { activities } = useActivities();
  const { settings } = useSettings();
  const activityDefinitions = useActivityDefinitions();
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const isMobile = useIsMobile();
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | 'custom'>('all');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [activityFilter, setActivityFilter] = useState<string>('all'); // 'all' or activityKey
  const [minPoints, setMinPoints] = useState<string>('');
  const [maxPoints, setMaxPoints] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Get unique activity keys for filter
  const activityKeys = useMemo(() => {
    const keys = new Set(activities.map((a) => a.activityKey));
    return Array.from(keys).sort();
  }, [activities]);

  // Calculate filtered activities for preview
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Date range filter
    if (dateRange === 'custom' && customStart && customEnd) {
      const start = startOfDay(new Date(customStart));
      const end = endOfDay(new Date(customEnd));
      filtered = filtered.filter((activity) => {
        const activityDate = parseISO(activity.performedAt);
        return activityDate >= start && activityDate <= end;
      });
    } else if (dateRange === '7days') {
      const start = startOfDay(subDays(new Date(), 7));
      const end = endOfDay(new Date());
      filtered = filtered.filter((activity) => {
        const activityDate = parseISO(activity.performedAt);
        return activityDate >= start && activityDate <= end;
      });
    } else if (dateRange === '30days') {
      const start = startOfDay(subDays(new Date(), 30));
      const end = endOfDay(new Date());
      filtered = filtered.filter((activity) => {
        const activityDate = parseISO(activity.performedAt);
        return activityDate >= start && activityDate <= end;
      });
    }

    // Activity filter
    if (activityFilter !== 'all') {
      filtered = filtered.filter((activity) => activity.activityKey === activityFilter);
    }

    // Points filter
    if (minPoints) {
      const min = Number(minPoints);
      if (!isNaN(min)) {
        filtered = filtered.filter((activity) => activity.points >= min);
      }
    }
    if (maxPoints) {
      const max = Number(maxPoints);
      if (!isNaN(max)) {
        filtered = filtered.filter((activity) => activity.points <= max);
      }
    }

    return filtered;
  }, [activities, dateRange, customStart, customEnd, activityFilter, minPoints, maxPoints]);

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
          end: endOfDay(new Date(customEnd)),
        };
      } else if (dateRange === '7days') {
        dateRangeOption = {
          start: startOfDay(subDays(new Date(), 7)),
          end: endOfDay(new Date()),
        };
      } else if (dateRange === '30days') {
        dateRangeOption = {
          start: startOfDay(subDays(new Date(), 30)),
          end: endOfDay(new Date()),
        };
      }

      const options = {
        format: exportFormat,
        dateRange: dateRangeOption,
        language: lang as 'tr' | 'en',
      };

      // Use filtered activities for export
      if (exportFormat === 'csv') {
        exportToCSV(filteredActivities, settings, options);
        showToast(
          lang === 'tr'
            ? `${filteredActivities.length} aktivite CSV olarak export edildi`
            : `${filteredActivities.length} activities exported as CSV`,
          'success'
        );
      } else if (exportFormat === 'pdf') {
        await exportToPDF(filteredActivities, settings, options);
        showToast(
          lang === 'tr'
            ? `${filteredActivities.length} aktivite PDF olarak export edildi`
            : `${filteredActivities.length} activities exported as PDF`,
          'success'
        );
      } else if (exportFormat === 'json') {
        exportToJSON(filteredActivities, settings, options, activityDefinitions);
        showToast(
          lang === 'tr'
            ? `${filteredActivities.length} aktivite JSON olarak export edildi`
            : `${filteredActivities.length} activities exported as JSON`,
          'success'
        );
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
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-md w-full mx-4'} border-2 border-gray-200 dark:border-gray-700 animate-scale-in`}
      >
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
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
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
              <button
                type="button"
                onClick={() => setExportFormat('json')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 ${
                  exportFormat === 'json'
                    ? 'bg-gradient-to-r from-brand to-brand-dark text-white border-brand shadow-md'
                    : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                }`}
              >
                JSON
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

          {/* Activity Filter */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {lang === 'tr' ? 'Aktivite Filtresi' : 'Activity Filter'}
            </label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-sm input-enhanced"
            >
              <option value="all">{lang === 'tr' ? 'Tüm Aktiviteler' : 'All Activities'}</option>
              {activityKeys.map((key) => {
                const activity = activities.find((a) => a.activityKey === key);
                return (
                  <option key={key} value={key}>
                    {activity ? getActivityLabel(activity, lang) : key}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Points Filter */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {lang === 'tr' ? 'Min Puan' : 'Min Points'}
              </label>
              <input
                type="number"
                value={minPoints}
                onChange={(e) => setMinPoints(e.target.value)}
                placeholder={lang === 'tr' ? 'Min' : 'Min'}
                min="0"
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-sm input-enhanced"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {lang === 'tr' ? 'Max Puan' : 'Max Points'}
              </label>
              <input
                type="number"
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
                placeholder={lang === 'tr' ? 'Max' : 'Max'}
                min="0"
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-sm input-enhanced"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-blue-900 dark:text-blue-100`}
              >
                📊 {lang === 'tr' ? 'Export Önizlemesi' : 'Export Preview'}
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200`}
              >
                {showPreview ? '▼' : '▶'}
              </button>
            </div>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-800 dark:text-blue-200`}>
              {lang === 'tr'
                ? `${filteredActivities.length} aktivite export edilecek`
                : `${filteredActivities.length} activities will be exported`}
              {filteredActivities.length > 0 && (
                <div className="mt-1">
                  {lang === 'tr' ? 'Toplam Puan:' : 'Total Points:'}{' '}
                  <span className="font-bold">
                    {filteredActivities.reduce((sum, a) => sum + a.points, 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            {showPreview && filteredActivities.length > 0 && (
              <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                {filteredActivities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-blue-700 dark:text-blue-300`}
                  >
                    •{' '}
                    {formatDate(
                      parseISO(activity.performedAt),
                      lang === 'tr' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'
                    )}{' '}
                    - {getActivityLabel(activity, lang)} - {activity.points}{' '}
                    {lang === 'tr' ? 'puan' : 'points'}
                  </div>
                ))}
                {filteredActivities.length > 5 && (
                  <div
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-blue-600 dark:text-blue-400 italic`}
                  >
                    {lang === 'tr'
                      ? `... ve ${filteredActivities.length - 5} aktivite daha`
                      : `... and ${filteredActivities.length - 5} more activities`}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className={`flex items-center ${isMobile ? 'flex-col-reverse gap-2' : 'justify-end gap-3'}`}
          >
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
