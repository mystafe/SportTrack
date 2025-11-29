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
import { ImportPreviewDialog } from '@/components/ImportPreviewDialog';
import { DuplicateDetectionDialog } from '@/components/DuplicateDetectionDialog';
import { useAppleHealthReminder } from '@/hooks/useAppleHealthReminder';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useCloudSync } from '@/hooks/useCloudSync';
import { usePlatform } from '@/lib/hooks/usePlatform';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import {
  convertLegacyToNewFormat,
  validateLegacyData,
  type LegacyData,
} from '@/lib/cloudSync/legacyConverter';
import { cloudSyncService } from '@/lib/cloudSync/syncService';
import { useDialogManager } from '@/lib/dialogManager';
import { useGlobalDialogState } from '@/lib/globalDialogState';

// Lazy load Apple Health components
const AppleHealthImport = lazy(() =>
  import('@/components/AppleHealthImport').then((m) => ({ default: m.AppleHealthImport }))
);
const AppleHealthGuide = lazy(() =>
  import('@/components/AppleHealthGuide').then((m) => ({ default: m.AppleHealthGuide }))
);

interface DataExportImportProps {
  onSettingsClose?: () => void;
}

export function DataExportImport({ onSettingsClose }: DataExportImportProps = {}) {
  const { activities } = useActivities();
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [isImporting, setIsImporting] = useState(false);
  const {
    setShowExportDialog,
    setShowImportPreviewDialog,
    setImportPreviewData,
    showDuplicateDialog,
    setShowDuplicateDialog,
    showHealthGuide,
    setShowHealthGuide,
  } = useGlobalDialogState();
  const [showConversionDialog, setShowConversionDialog] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const { daysSinceLastImport, shouldShowReminder, dismissReminder } = useAppleHealthReminder();
  const { isConfigured } = useCloudSync();
  const { isAuthenticated } = useAuth();
  const { isIOS } = usePlatform();
  const { openDialog } = useDialogManager();

  const handleExport = () => {
    try {
      const data = {
        activities,
        settings,
        exportDate: new Date().toISOString(),
        version: '0.18.17',
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
      const parsedData = JSON.parse(text);

      // Type guard to determine format
      type NewFormat = {
        exercises?: ActivityRecord[];
        activities?: Array<{
          key: string;
          label: string;
          labelEn?: string;
          icon: string;
          multiplier: number;
          unit: string;
          unitEn?: string;
          defaultAmount: number;
          description?: string;
          descriptionEn?: string;
          isCustom?: boolean;
          category?: string;
        }>;
        settings?: UserSettings;
        userName?: string | null;
        version?: string;
      };

      type LegacyFormat = {
        activities?: ActivityRecord[];
        settings?: UserSettings;
        userName?: string | null;
        version?: string;
      };

      const data = parsedData as NewFormat | LegacyFormat;

      // Determine format: new format has 'exercises' and 'activities' (definitions)
      // Legacy format has 'activities' (records) and 'settings'
      const newFormatData = data as NewFormat;
      const legacyFormatData = data as LegacyFormat;
      const isNewFormat =
        newFormatData.exercises !== undefined && Array.isArray(newFormatData.exercises);
      const isLegacyFormat =
        !isNewFormat &&
        legacyFormatData.activities !== undefined &&
        Array.isArray(legacyFormatData.activities);

      let validExercises: ActivityRecord[] = [];
      let activityDefinitions: Array<{
        key: string;
        label: string;
        labelEn?: string;
        icon: string;
        multiplier: number;
        unit: string;
        unitEn?: string;
        defaultAmount: number;
        description?: string;
        descriptionEn?: string;
        isCustom?: boolean;
        category?: string;
      }> = [];
      let settingsToImport: UserSettings | null = null;

      if (isNewFormat) {
        // New format: exercises + activities (definitions)
        validExercises = (newFormatData.exercises || []).filter((a: ActivityRecord) => {
          return (
            a &&
            typeof a.id === 'string' &&
            typeof a.activityKey === 'string' &&
            typeof a.amount === 'number' &&
            typeof a.points === 'number' &&
            typeof a.performedAt === 'string'
          );
        });

        // Extract custom activities from activity definitions
        if (newFormatData.activities && Array.isArray(newFormatData.activities)) {
          activityDefinitions = newFormatData.activities.filter(
            (a: { isCustom?: boolean }) => a.isCustom === true
          );
        }

        settingsToImport = newFormatData.settings || null;
      } else if (isLegacyFormat) {
        // Legacy format: activities (records) + settings
        validExercises = (legacyFormatData.activities || []).filter((a: ActivityRecord) => {
          return (
            a &&
            typeof a.id === 'string' &&
            typeof a.activityKey === 'string' &&
            typeof a.amount === 'number' &&
            typeof a.points === 'number' &&
            typeof a.performedAt === 'string'
          );
        });

        settingsToImport = legacyFormatData.settings || null;

        // Extract custom activities from settings.customActivities
        if (settingsToImport?.customActivities) {
          activityDefinitions = settingsToImport.customActivities.map((ca) => ({
            key: ca.id,
            label: ca.label,
            labelEn: ca.labelEn,
            icon: ca.icon,
            multiplier: ca.multiplier,
            unit: ca.unit,
            unitEn: ca.unitEn,
            defaultAmount: ca.defaultAmount,
            description: undefined,
            descriptionEn: undefined,
            isCustom: true,
            category: undefined,
          }));
        }
      } else {
        throw new Error('Invalid file format: missing exercises or activities');
      }

      if (!settingsToImport) {
        throw new Error('Invalid file format: settings missing');
      }

      const totalExercises = isNewFormat
        ? newFormatData.exercises?.length || 0
        : legacyFormatData.activities?.length || 0;

      if (validExercises.length === 0 && totalExercises > 0) {
        throw new Error('No valid exercises found in file');
      }

      // Extract badges and challenges from data if available
      const badgesToImport = (data as any).badges || [];
      const challengesToImport = (data as any).challenges || [];

      // Prepare preview data
      const previewDataToShow = {
        exercises: validExercises,
        activities: activityDefinitions,
        settings: settingsToImport,
        userName: isNewFormat ? newFormatData.userName || null : legacyFormatData.userName || null,
        badges: badgesToImport,
        challenges: challengesToImport,
      };

      // Show preview dialog instead of simple confirm
      // Close Settings Dialog first if it's open
      if (onSettingsClose) {
        onSettingsClose();
      }
      // Use requestAnimationFrame to ensure Settings Dialog closes first
      requestAnimationFrame(() => {
        setImportPreviewData(previewDataToShow);
        setShowImportPreviewDialog(true);
        setIsImporting(false);
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
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

  const handlePreviewCancel = () => {
    setShowImportPreviewDialog(false);
    setImportPreviewData(null);
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.name.endsWith('.json')) {
      return;
    }

    // Create a synthetic event for handleImport
    const syntheticEvent = {
      target: {
        files: e.dataTransfer.files,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    // Close Settings Dialog first
    if (onSettingsClose) {
      onSettingsClose();
    }
    // Wait for Settings Dialog to close, then handle import
    setTimeout(() => {
      handleImport(syntheticEvent);
    }, 350);
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size={isMobile ? 'md' : 'sm'}
          onClick={() => {
            // Open Export Dialog FIRST (before closing Settings Dialog)
            // This prevents DataExportImport from unmounting and losing state
            setShowExportDialog(true);
            // Then close Settings Dialog immediately to remove backdrop
            if (onSettingsClose) {
              // Use requestAnimationFrame to ensure Export Dialog renders first
              requestAnimationFrame(() => {
                onSettingsClose();
              });
            }
          }}
          className={`${isMobile ? 'px-2 py-2' : 'px-1.5'} text-base flex items-center justify-center`}
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
          title={t('data.exportTooltip')}
          aria-label={t('data.exportTooltip')}
        >
          💾
        </Button>
        <Button
          type="button"
          variant="secondary"
          size={isMobile ? 'md' : 'sm'}
          onClick={() => {
            if (!isImporting && fileInputRef.current) {
              fileInputRef.current.value = '';
              fileInputRef.current.click();
            }
          }}
          className={`${isMobile ? 'px-2 py-2' : 'px-1.5'} text-base flex items-center justify-center`}
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
          title={t('data.importTooltip')}
          aria-label={t('data.importTooltip')}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
        >
          {isImporting ? '⏳' : '📥'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) {
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              return;
            }

            // Close Settings Dialog first
            if (onSettingsClose) {
              onSettingsClose();
            }
            // Wait for Settings Dialog to close, then handle import
            setTimeout(() => {
              handleImport(e);
            }, 350);
          }}
          disabled={isImporting}
          className="hidden"
          aria-label={t('data.importTooltip')}
          style={{ display: 'none' }}
        />
        {isAuthenticated && (
          <Button
            type="button"
            variant="outline"
            size={isMobile ? 'md' : 'sm'}
            onClick={() => {
              // Close Settings Dialog first
              if (onSettingsClose) {
                onSettingsClose();
              }
              // Wait for Settings Dialog to close, then open Duplicate Detection Dialog
              setTimeout(() => {
                setShowDuplicateDialog(true);
              }, 350);
            }}
            className={`${isMobile ? 'px-2 py-2' : 'px-1.5'} text-base flex items-center justify-center`}
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
            title={lang === 'tr' ? 'Yinelenen Kayıt Tespiti' : 'Duplicate Detection'}
            aria-label={lang === 'tr' ? 'Yinelenen Kayıt Tespiti' : 'Duplicate Detection'}
          >
            🔍
          </Button>
        )}
        {isAuthenticated && isIOS && (
          <div className="flex items-center gap-1">
            <Suspense
              fallback={
                <div
                  className="bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
                  style={{
                    height: '24px',
                    minHeight: '24px',
                    maxHeight: '24px',
                    width: '24px',
                    minWidth: '24px',
                    maxWidth: '24px',
                  }}
                />
              }
            >
              <AppleHealthImport />
            </Suspense>
            <Button
              type="button"
              variant="outline"
              size={isMobile ? 'md' : 'sm'}
              onClick={() => {
                // Close Settings Dialog first
                if (onSettingsClose) {
                  onSettingsClose();
                }
                // Wait for Settings Dialog to close, then toggle Health Guide
                setTimeout(() => {
                  setShowHealthGuide(!showHealthGuide);
                }, 350);
              }}
              className={`${isMobile ? 'px-2 py-2' : 'px-1.5'} text-base flex items-center justify-center`}
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
              title={lang === 'tr' ? 'Sağlık Verisi İçe Aktar Rehberi' : 'Import Health Data Guide'}
              aria-label={
                lang === 'tr' ? 'Sağlık Verisi İçe Aktar Rehberi' : 'Import Health Data Guide'
              }
            >
              ?
            </Button>
          </div>
        )}
      </div>
      {/* Health Guide is now rendered in GlobalDialogs */}
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => dismissReminder(7)}
              className={`${isMobile ? 'px-1.5 py-1 text-[10px]' : 'px-2 py-1 text-xs'} border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex-shrink-0`}
              title={lang === 'tr' ? '7 gün hatırlatma' : 'Remind in 7 days'}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
      {/* Export Dialog, Import Preview Dialog, and Import Progress Dialog are now rendered in GlobalDialogs */}

      {/* Legacy Format Conversion Dialog */}
      {showConversionDialog && (
        <LegacyConversionDialog
          open={showConversionDialog}
          onClose={() => {
            setShowConversionDialog(false);
            setIsConverting(false);
          }}
          isConverting={isConverting}
          setIsConverting={setIsConverting}
          isAuthenticated={isAuthenticated}
          isConfigured={isConfigured}
          lang={lang}
          showToast={showToast}
        />
      )}

      {/* Duplicate Detection Dialog */}
      {showDuplicateDialog && (
        <DuplicateDetectionDialog
          open={showDuplicateDialog}
          onClose={() => setShowDuplicateDialog(false)}
        />
      )}
    </>
  );
}

/**
 * Legacy Format Conversion Dialog
 */
function LegacyConversionDialog({
  open,
  onClose,
  isConverting,
  setIsConverting,
  isAuthenticated,
  isConfigured,
  lang,
  showToast,
}: {
  open: boolean;
  onClose: () => void;
  isConverting: boolean;
  setIsConverting: (converting: boolean) => void;
  isAuthenticated: boolean;
  isConfigured: boolean;
  lang: 'tr' | 'en';
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    try {
      const text = await file.text();
      const legacyData = JSON.parse(text) as LegacyData;

      // Validate legacy data
      if (!validateLegacyData(legacyData)) {
        throw new Error(
          lang === 'tr'
            ? 'Geçersiz dosya formatı. Eski SportTrack JSON dosyası bekleniyor.'
            : 'Invalid file format. Expected legacy SportTrack JSON file.'
        );
      }

      // Check if user is authenticated
      if (!isAuthenticated || !isConfigured) {
        showToast(
          lang === 'tr'
            ? 'Dönüştürme için giriş yapmanız gerekiyor.'
            : 'You need to be logged in to convert.',
          'error'
        );
        setIsConverting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Convert legacy format to new format
      const convertedData = convertLegacyToNewFormat(legacyData);

      console.log('🔄 Converting legacy format to new format:', {
        activities: convertedData.activities.length,
        exercises: convertedData.exercises.length,
        statistics: convertedData.statistics.length,
        challenges: convertedData.challenges.length,
        points: convertedData.points,
      });

      // Upload to cloud using new format
      // Note: This will require updating uploadToCloud to handle new format
      // For now, we'll use a temporary upload function
      await uploadConvertedDataToCloud(convertedData);

      showToast(
        lang === 'tr'
          ? `✅ Dönüştürme tamamlandı! ${convertedData.exercises.length} aktivite yeni formata yüklendi.`
          : `✅ Conversion completed! ${convertedData.exercises.length} activities uploaded in new format.`,
        'success'
      );

      onClose();
    } catch (error) {
      console.error('Conversion failed:', error);
      const message = error instanceof Error ? error.message : 'Conversion failed';
      showToast(message, 'error');
      setIsConverting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10014] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="conversion-dialog-title"
    >
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto mx-4' : 'rounded-xl shadow-xl max-w-md w-full mx-4'} border-2 border-purple-200 dark:border-purple-700 animate-scale-in`}
      >
        <div className={`${isMobile ? 'p-6' : 'p-6'}`}>
          <h2
            id="conversion-dialog-title"
            className={`${isMobile ? 'text-xl' : 'text-lg'} font-bold text-gray-950 dark:text-white mb-4`}
          >
            {lang === 'tr' ? 'Eski Formatı Yeni Formata Çevir' : 'Convert Legacy Format'}
          </h2>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            {lang === 'tr'
              ? 'Eski SportTrack JSON dosyanızı yeni Firestore formatına çevirin ve buluta yükleyin.'
              : 'Convert your legacy SportTrack JSON file to the new Firestore format and upload to cloud.'}
          </p>

          {!isAuthenticated && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {lang === 'tr'
                  ? '⚠️ Dönüştürme için giriş yapmanız gerekiyor.'
                  : '⚠️ You need to be logged in to convert.'}
              </p>
            </div>
          )}

          <label
            className={`block w-full ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-sm'} rounded-lg border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-50 dark:hover:from-purple-800 dark:hover:to-purple-700 transition-all duration-200 cursor-pointer font-semibold text-purple-700 dark:text-purple-300 text-center`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isConverting || !isAuthenticated || !isConfigured}
              className="hidden"
              aria-label={lang === 'tr' ? 'Eski JSON dosyası seç' : 'Select legacy JSON file'}
            />
            {isConverting ? '⏳ Dönüştürülüyor...' : '📁 JSON Dosyası Seç'}
          </label>

          <div className="mt-4 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size={isMobile ? 'md' : 'md'}
              onClick={onClose}
              disabled={isConverting}
              fullWidth={isMobile}
              className={isMobile ? 'min-h-[44px]' : ''}
            >
              {lang === 'tr' ? 'İptal' : 'Cancel'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Upload converted data to cloud in new format
 */
async function uploadConvertedDataToCloud(
  convertedData: ReturnType<typeof convertLegacyToNewFormat>
) {
  await cloudSyncService.uploadConvertedDataToCloud(convertedData);
}
