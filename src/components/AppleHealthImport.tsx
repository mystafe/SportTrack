'use client';

import { useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { useToaster } from '@/components/Toaster';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { parseAppleHealthFile, type AppleHealthStepData, type ParseProgress } from '@/lib/appleHealthParser';
import { BASE_ACTIVITY_MAP } from '@/lib/activityConfig';
import { startOfDay } from 'date-fns';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function AppleHealthImport() {
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const { activities, addActivity, deleteActivity } = useActivities();
  const definitions = useActivityDefinitions();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [parseProgress, setParseProgress] = useState<ParseProgress | null>(null);
  const [parseResult, setParseResult] = useState<{
    data: AppleHealthStepData[];
    totalRecords: number;
    dateRange: { start: string; end: string } | null;
    errors: string[];
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const walkingDefinition = definitions.find(d => d.key === 'WALKING') || BASE_ACTIVITY_MAP['WALKING'];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isValidType = fileName.endsWith('.csv') || 
                        fileName.endsWith('.xml') || 
                        fileName.endsWith('.xml.gz') ||
                        file.type === 'text/csv' ||
                        file.type === 'application/csv' ||
                        file.type === 'text/xml' ||
                        file.type === 'application/xml' ||
                        file.type === 'application/gzip' ||
                        file.type === ''; // Some mobile browsers don't set MIME type

    if (!isValidType) {
      showToast(
        `Invalid file type: ${file.name}. Please select a CSV or XML file.`,
        'error'
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 100) {
      const proceed = window.confirm(
        t('appleHealth.largeFileWarning', {
          size: Math.round(sizeMB).toString()
        })
      );
      if (!proceed) {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }

    setIsImporting(true);
    setParseProgress({ processed: 0, total: 0, percentage: 0 });

    try {
      const result = await parseAppleHealthFile(
        file,
        (progress) => {
          setParseProgress(progress);
        }
      );

      setParseProgress(null);

      if (!result.success || result.data.length === 0) {
        const errorMessage = result.errors.length > 0 
          ? result.errors.slice(0, 3).join(', ')
          : 'No step data found in file';
        
        showToast(
          t('appleHealth.parseFailed', { errors: errorMessage }) || `Failed to parse file: ${errorMessage}`,
          'error'
        );
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setParseResult({
        data: result.data,
        totalRecords: result.totalRecords,
        dateRange: result.dateRange,
        errors: result.errors
      });
      setShowConfirm(true);
      setIsImporting(false);
    } catch (error) {
      console.error('Failed to parse Apple Health file:', error);
      setParseProgress(null);
      showToast(
        t('appleHealth.parseFailed', {
          errors: error instanceof Error ? error.message : 'Unknown error'
        }),
        'error'
      );
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImport = () => {
    if (!parseResult || !walkingDefinition) return;

    try {
      // Find existing WALKING activities and delete them
      const existingWalkingActivities = activities.filter(a => a.activityKey === 'WALKING');
      
      existingWalkingActivities.forEach(activity => {
        deleteActivity(activity.id);
      });

      // Add new step data as WALKING activities
      parseResult.data.forEach((stepData) => {
        // Create activity for each day with step count
        // Use start of day for consistent date handling
        const date = new Date(stepData.date);
        const performedAt = startOfDay(date).toISOString();

        addActivity({
          definition: walkingDefinition,
          amount: stepData.steps,
          performedAt: performedAt,
          note: stepData.sourceName ? `Apple Health (${stepData.sourceName})` : 'Apple Health'
        });
      });

      showToast(
        t('appleHealth.importSuccess', {
          count: String(parseResult.data.length),
          replaced: String(existingWalkingActivities.length)
        }),
        'success'
      );

      setParseResult(null);
      setShowConfirm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to import Apple Health data:', error);
      showToast(t('appleHealth.importFailed'), 'error');
    }
  };

  const handleCancel = () => {
    setParseResult(null);
    setShowConfirm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <label className={`px-2 py-1 ${isMobile ? 'min-h-[36px] min-w-[80px]' : ''} text-[10px] sm:text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 cursor-pointer touch-feedback mobile-press flex items-center justify-center`}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xml,.xml.gz,text/csv,application/csv,application/xml,text/xml,application/gzip"
          onChange={handleFileSelect}
          disabled={isImporting}
          className="hidden"
          aria-label={t('appleHealth.importLabel')}
        />
        <span className="flex items-center gap-1">
          {isImporting ? '⏳' : '📱'} 
          <span className={isMobile ? 'text-[9px]' : ''}>{t('appleHealth.import')}</span>
        </span>
      </label>
      
      {isImporting && parseProgress && parseProgress.total > 0 && (
        <div className="mt-2 space-y-1">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {t('appleHealth.processing', {
              processed: String(parseProgress.processed),
              total: String(parseProgress.total),
              percentage: String(parseProgress.percentage)
            })}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-brand h-2 rounded-full transition-all duration-300"
              style={{ width: `${parseProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showConfirm && !!parseResult}
        title={t('appleHealth.confirmTitle')}
        message={
          parseResult
            ? t('appleHealth.confirmMessage', {
                count: String(parseResult.data.length),
                start: parseResult.dateRange?.start || '',
                end: parseResult.dateRange?.end || '',
                existing: String(activities.filter(a => a.activityKey === 'WALKING').length)
              })
            : ''
        }
        variant="default"
        confirmLabel={t('appleHealth.confirmImport')}
        onConfirm={handleImport}
        onCancel={handleCancel}
      />
    </>
  );
}

