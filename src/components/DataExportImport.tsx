'use client';

import { useState, useRef, lazy, Suspense } from 'react';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useI18n } from '@/lib/i18n';
import { useToaster } from '@/components/Toaster';
import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { STORAGE_KEYS } from '@/lib/constants';
import { ExportDialog } from '@/components/ExportDialog';
import { useAppleHealthReminder } from '@/hooks/useAppleHealthReminder';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import { useAuth } from '@/hooks/useAuth';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';

// Lazy load Apple Health components
const AppleHealthImport = lazy(() =>
  import('@/components/AppleHealthImport').then((m) => ({ default: m.AppleHealthImport }))
);
const AppleHealthGuide = lazy(() =>
  import('@/components/AppleHealthGuide').then((m) => ({ default: m.AppleHealthGuide }))
);

export function DataExportImport() {
  const { activities } = useActivities();
  const { settings } = useSettings();
  const { badges } = useBadges();
  const { challenges } = useChallenges();
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [isImporting, setIsImporting] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHealthGuide, setShowHealthGuide] = useState(false);
  const { shouldShowReminder, daysSinceLastImport, dismissReminder } = useAppleHealthReminder();
  const { syncToCloud, isConfigured } = useCloudSync();
  const { isAuthenticated } = useAuth();

  const handleExport = () => {
    try {
      const data = {
        activities,
        settings,
        exportDate: new Date().toISOString(),
        version: '0.7.7',
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sporttrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t('data.exportSuccess'), 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast(t('data.exportFailed'), 'error');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text) as {
        activities?: ActivityRecord[];
        settings?: UserSettings;
        version?: string;
      };

      if (!data.activities || !Array.isArray(data.activities)) {
        throw new Error('Invalid file format: activities missing');
      }
      if (!data.settings) {
        throw new Error('Invalid file format: settings missing');
      }

      // Validate data structure
      const validActivities = data.activities.filter((a) => {
        return (
          a &&
          typeof a.id === 'string' &&
          typeof a.activityKey === 'string' &&
          typeof a.amount === 'number' &&
          typeof a.points === 'number' &&
          typeof a.performedAt === 'string'
        );
      });

      if (validActivities.length === 0 && data.activities.length > 0) {
        throw new Error('No valid activities found in file');
      }

      // Show confirmation dialog
      const confirmed = window.confirm(
        t('data.importConfirm', {
          activities: String(validActivities.length),
          settings: data.settings.name || 'Unknown',
        })
      );

      if (!confirmed) {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Import data
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(validActivities));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));

      // Clear conflict storage key to prevent conflict dialog from showing after import
      // Imported data should always go to cloud without conflict check
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
      }

      // If user is authenticated and cloud sync is configured, upload to cloud immediately
      // No conflict check - imported data should always go to cloud
      if (isAuthenticated && isConfigured) {
        try {
          // Get current badges and challenges from localStorage (they might not be loaded yet)
          const storedBadges = localStorage.getItem(STORAGE_KEYS.BADGES);
          const storedChallenges = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
          const badgesToUpload = storedBadges ? JSON.parse(storedBadges) : [];
          const challengesToUpload = storedChallenges ? JSON.parse(storedChallenges) : [];

          await syncToCloud({
            activities: validActivities,
            settings: data.settings,
            badges: badgesToUpload,
            challenges: challengesToUpload,
          });

          showToast(
            lang === 'tr'
              ? 'Veriler içe aktarıldı ve buluta yüklendi!'
              : 'Data imported and uploaded to cloud!',
            'success'
          );
        } catch (error) {
          console.error('Failed to sync imported data to cloud:', error);
          // Still show success for import, but warn about cloud sync failure
          showToast(
            lang === 'tr'
              ? 'Veriler içe aktarıldı, ancak buluta yükleme başarısız oldu.'
              : 'Data imported, but cloud upload failed.',
            'warning'
          );
        }
      } else {
        showToast(t('data.importSuccess'), 'success');
      }

      // Reload page to apply changes
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      const message = error instanceof Error ? error.message : t('data.importFailed');
      showToast(message, 'error');
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setShowExportDialog(true)}
          className="px-1.5 text-[8px] sm:text-[9px] rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center box-border leading-none whitespace-nowrap"
          style={{ height: '24px', minHeight: '24px', maxHeight: '24px' }}
          title={t('data.exportTooltip')}
          aria-label={t('data.exportTooltip')}
        >
          💾 {t('data.export')}
        </button>
        <label
          className="px-1.5 text-[8px] sm:text-[9px] rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 cursor-pointer font-semibold flex items-center justify-center box-border leading-none whitespace-nowrap"
          style={{ height: '24px', minHeight: '24px', maxHeight: '24px' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="hidden"
            aria-label={t('data.importTooltip')}
          />
          {isImporting ? '⏳' : '📥'} {t('data.import')}
        </label>
        <div className="flex items-center gap-1">
          <Suspense
            fallback={
              <div
                className="w-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
                style={{ height: '24px', minHeight: '24px', maxHeight: '24px' }}
              />
            }
          >
            <AppleHealthImport />
          </Suspense>
          <button
            type="button"
            onClick={() => setShowHealthGuide(!showHealthGuide)}
            className="px-1.5 text-[8px] sm:text-[9px] rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center box-border leading-none"
            style={{
              height: '24px',
              minHeight: '24px',
              maxHeight: '24px',
              width: '24px',
              minWidth: '24px',
              maxWidth: '24px',
            }}
            title={lang === 'tr' ? 'Sağlık Verisi İçe Aktar Rehberi' : 'Import Health Data Guide'}
            aria-label={
              lang === 'tr' ? 'Sağlık Verisi İçe Aktar Rehberi' : 'Import Health Data Guide'
            }
          >
            ?
          </button>
        </div>
      </div>
      {showHealthGuide && (
        <div className="mt-2">
          <Suspense
            fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />}
          >
            <AppleHealthGuide />
          </Suspense>
        </div>
      )}
      {shouldShowReminder && (
        <div
          className={`mt-2 ${isMobile ? 'p-2' : 'p-2.5'} rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-blue-900 dark:text-blue-200 mb-1`}
              >
                📱{' '}
                {lang === 'tr' ? 'Apple Health Verilerini Güncelleyin' : 'Update Apple Health Data'}
              </div>
              <p
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-blue-800 dark:text-blue-300`}
              >
                {daysSinceLastImport === null
                  ? lang === 'tr'
                    ? 'Apple Health verilerinizi henüz içe aktarmadınız. Adım verilerinizi senkronize etmek için import yapın.'
                    : "You haven't imported Apple Health data yet. Import to sync your step data."
                  : daysSinceLastImport >= 7
                    ? lang === 'tr'
                      ? `${daysSinceLastImport} gün önce içe aktardınız. Verilerinizi güncellemek için tekrar import yapın.`
                      : `You imported ${daysSinceLastImport} days ago. Import again to update your data.`
                    : lang === 'tr'
                      ? `${daysSinceLastImport} gün önce içe aktardınız.`
                      : `You imported ${daysSinceLastImport} days ago.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismissReminder(7)}
              className={`${isMobile ? 'px-1.5 py-1 text-[10px]' : 'px-2 py-1 text-xs'} rounded border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all flex-shrink-0`}
              title={lang === 'tr' ? '7 gün hatırlatma' : 'Remind in 7 days'}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <ExportDialog open={showExportDialog} onClose={() => setShowExportDialog(false)} />
    </>
  );
}
