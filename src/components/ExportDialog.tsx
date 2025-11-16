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
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

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
      className={`fixed inset-0 z-[10001] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-bottom`}
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
              <Button
                type="button"
                variant={exportFormat === 'csv' ? 'primary' : 'outline'}
                size={isMobile ? 'sm' : 'md'}
                onClick={() => setExportFormat('csv')}
                className="flex-1"
              >
                CSV
              </Button>
              <Button
                type="button"
                variant={exportFormat === 'pdf' ? 'primary' : 'outline'}
                size={isMobile ? 'sm' : 'md'}
                onClick={() => setExportFormat('pdf')}
                className="flex-1"
              >
                PDF
              </Button>
              <Button
                type="button"
                variant={exportFormat === 'json' ? 'primary' : 'outline'}
                size={isMobile ? 'sm' : 'md'}
                onClick={() => setExportFormat('json')}
                className="flex-1"
              >
                JSON
              </Button>
            </div>
          </div>

          {/* Date Range Selection */}
          <Select
            label={t('export.dateRange')}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            size={isMobile ? 'sm' : 'md'}
            options={[
              { value: 'all', label: t('export.allTime') },
              { value: '7days', label: t('export.last7Days') },
              { value: '30days', label: t('export.last30Days') },
              { value: 'custom', label: t('export.customRange') },
            ]}
          />

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <Input
                type="date"
                label={t('export.startDate')}
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                size={isMobile ? 'sm' : 'md'}
              />
              <Input
                type="date"
                label={t('export.endDate')}
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                max={formatDate(new Date(), 'yyyy-MM-dd')}
                size={isMobile ? 'sm' : 'md'}
              />
            </div>
          )}

          {/* Activity Filter */}
          <Select
            label={lang === 'tr' ? 'Aktivite Filtresi' : 'Activity Filter'}
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            size={isMobile ? 'sm' : 'md'}
            options={[
              { value: 'all', label: lang === 'tr' ? 'Tüm Aktiviteler' : 'All Activities' },
              ...activityKeys.map((key) => {
                const activity = activities.find((a) => a.activityKey === key);
                return {
                  value: key,
                  label: activity ? getActivityLabel(activity, lang) : key,
                };
              }),
            ]}
          />

          {/* Points Filter */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <Input
              type="number"
              label={lang === 'tr' ? 'Min Puan' : 'Min Points'}
              value={minPoints}
              onChange={(e) => setMinPoints(e.target.value)}
              placeholder={lang === 'tr' ? 'Min' : 'Min'}
              min="0"
              size={isMobile ? 'sm' : 'md'}
            />
            <Input
              type="number"
              label={lang === 'tr' ? 'Max Puan' : 'Max Points'}
              value={maxPoints}
              onChange={(e) => setMaxPoints(e.target.value)}
              placeholder={lang === 'tr' ? 'Max' : 'Max'}
              min="0"
              size={isMobile ? 'sm' : 'md'}
            />
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
            <Button
              type="button"
              variant="outline"
              size={isMobile ? 'sm' : 'md'}
              onClick={onClose}
              fullWidth={isMobile}
            >
              {t('form.cancel')}
            </Button>
            <Button
              type="button"
              variant="primary"
              size={isMobile ? 'sm' : 'md'}
              onClick={handleExport}
              disabled={isExporting}
              loading={isExporting}
              fullWidth={isMobile}
            >
              {t('export.export')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
