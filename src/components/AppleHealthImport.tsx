'use client';

import { useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { useToaster } from '@/components/Toaster';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import {
  parseAppleHealthFile,
  type AppleHealthStepData,
  type ParseProgress,
} from '@/lib/appleHealthParser';
import { BASE_ACTIVITY_MAP } from '@/lib/activityConfig';
import { STORAGE_KEYS } from '@/lib/constants';
import { startOfDay } from 'date-fns';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import { useSettings } from '@/lib/settingsStore';
import { useAuth } from '@/hooks/useAuth';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';

export function AppleHealthImport() {
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const { activities, addActivity, deleteActivity } = useActivities();
  const { settings } = useSettings();
  const { badges } = useBadges();
  const { challenges } = useChallenges();
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
  const { syncToCloud, isConfigured } = useCloudSync();
  const { isAuthenticated } = useAuth();

  const walkingDefinition =
    definitions.find((d) => d.key === 'WALKING') || BASE_ACTIVITY_MAP['WALKING'];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isValidType =
      fileName.endsWith('.csv') ||
      fileName.endsWith('.xml') ||
      fileName.endsWith('.xml.gz') ||
      file.type === 'text/csv' ||
      file.type === 'application/csv' ||
      file.type === 'text/xml' ||
      file.type === 'application/xml' ||
      file.type === 'application/gzip' ||
      file.type === ''; // Some mobile browsers don't set MIME type

    if (!isValidType) {
      showToast(`Invalid file type: ${file.name}. Please select a CSV or XML file.`, 'error');
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
          size: Math.round(sizeMB).toString(),
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
      const result = await parseAppleHealthFile(file, (progress) => {
        setParseProgress(progress);
      });

      setParseProgress(null);

      if (!result.success || result.data.length === 0) {
        const errorMessage =
          result.errors.length > 0
            ? result.errors.slice(0, 3).join(', ')
            : 'No step data found in file';

        showToast(
          t('appleHealth.parseFailed', { errors: errorMessage }) ||
            `Failed to parse file: ${errorMessage}`,
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
        errors: result.errors,
      });
      setShowConfirm(true);
      setIsImporting(false);
    } catch (error) {
      console.error('Failed to parse Apple Health file:', error);
      setParseProgress(null);
      showToast(
        t('appleHealth.parseFailed', {
          errors: error instanceof Error ? error.message : 'Unknown error',
        }),
        'error'
      );
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImport = async () => {
    if (!parseResult || !walkingDefinition) return;

    // Set flag to suppress badge notifications during import
    if (typeof window !== 'undefined') {
      localStorage.setItem('sporttrack.data_importing', 'true');
    }

    try {
      // Find existing WALKING activities and delete them
      const existingWalkingActivities = activities.filter((a) => a.activityKey === 'WALKING');

      existingWalkingActivities.forEach((activity) => {
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
          note: stepData.sourceName ? `Apple Health (${stepData.sourceName})` : 'Apple Health',
        });
      });

      // Save last import timestamp
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.APPLE_HEALTH_LAST_IMPORT, Date.now().toString());
        // Clear conflict storage key to prevent conflict dialog from showing after import
        // Imported data should always go to cloud without conflict check
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
      }

      // If user is authenticated and cloud sync is configured, upload to cloud immediately
      // No conflict check - imported data should always go to cloud
      if (isAuthenticated && isConfigured) {
        try {
          // Wait a bit for activities to be saved to localStorage
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Get updated activities from localStorage
          const storedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
          const activitiesToUpload = storedActivities ? JSON.parse(storedActivities) : [];

          await syncToCloud({
            activities: activitiesToUpload,
            settings: settings,
            badges: badges,
            challenges: challenges,
          });

          showToast(
            lang === 'tr'
              ? 'Apple Health verileri içe aktarıldı ve buluta yüklendi!'
              : 'Apple Health data imported and uploaded to cloud!',
            'success'
          );
        } catch (error) {
          console.error('Failed to sync Apple Health data to cloud:', error);
          // Still show success for import, but warn about cloud sync failure
          showToast(
            lang === 'tr'
              ? 'Apple Health verileri içe aktarıldı, ancak buluta yükleme başarısız oldu.'
              : 'Apple Health data imported, but cloud upload failed.',
            'warning'
          );
        }
      } else {
        showToast(
          t('appleHealth.importSuccess', {
            count: String(parseResult.data.length),
            replaced: String(existingWalkingActivities.length),
          }),
          'success'
        );
      }

      setParseResult(null);
      setShowConfirm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear flag after import completes
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sporttrack.data_importing');
      }
    } catch (error) {
      console.error('Failed to import Apple Health data:', error);
      showToast(t('appleHealth.importFailed'), 'error');

      // Clear flag even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sporttrack.data_importing');
      }
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
      <label
        className={`${isMobile ? 'px-2 py-2' : 'px-1.5'} text-base rounded-lg border-2 border-gray-200/50 dark:border-gray-700/50 glass-effect bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 cursor-pointer font-semibold flex items-center justify-center box-border leading-none backdrop-blur-sm hover:shadow-md`}
        style={
          isMobile
            ? {
                height: '44px',
                minHeight: '44px',
                maxHeight: '44px',
                width: '44px',
                minWidth: '44px',
                maxWidth: '44px',
              }
            : {
                height: '24px',
                minHeight: '24px',
                maxHeight: '24px',
                width: '24px',
                minWidth: '24px',
                maxWidth: '24px',
              }
        }
        title={lang === 'tr' ? 'Sağlık Verisi İçe Aktar' : 'Import Health Data'}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xml,.xml.gz,text/csv,application/csv,application/xml,text/xml,application/gzip"
          onChange={handleFileSelect}
          disabled={isImporting}
          className="hidden"
          aria-label={t('appleHealth.importLabel')}
        />
        <span className="flex items-center gap-0.5 leading-none text-base">
          {isImporting ? '⏳' : '📲'}
        </span>
      </label>

      {isImporting && parseProgress && parseProgress.total > 0 && (
        <div className="mt-2 space-y-1">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {t('appleHealth.processing', {
              processed: String(parseProgress.processed),
              total: String(parseProgress.total),
              percentage: String(parseProgress.percentage),
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
                existing: String(activities.filter((a) => a.activityKey === 'WALKING').length),
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
