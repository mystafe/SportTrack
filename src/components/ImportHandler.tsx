'use client';

import { useEffect, useCallback, useState } from 'react';
import { useGlobalDialogState } from '@/lib/globalDialogState';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';
import { useToaster } from '@/components/Toaster';
import {
  cleanActivities,
  validateSettings,
  validateBadge,
  validateChallenge,
} from '@/lib/dataValidation';
import { UserSettings } from '@/lib/settingsStore';
import { Badge } from '@/lib/badges';
import { Challenge } from '@/lib/challenges';
import { STORAGE_KEYS } from '@/lib/constants';
import { ImportProgressDialog } from '@/components/ImportProgressDialog';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';

export function ImportHandler() {
  const { importPreviewData, setImportPreviewData, setShowImportPreviewDialog } =
    useGlobalDialogState();
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const { syncToCloud, isConfigured } = useCloudSync();
  const { isAuthenticated } = useAuth();

  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [importProgress, setImportProgress] = useState<{
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
  }>({
    processed: 0,
    total: 0,
    percentage: 0,
    currentItem: '',
    errors: [],
    warnings: [],
  });

  const performImport = useCallback(async () => {
    if (!importPreviewData) return;

    // Set flag to suppress badge notifications during import
    if (typeof window !== 'undefined') {
      localStorage.setItem('sporttrack.data_importing', 'true');
    }

    setShowImportPreviewDialog(false);
    setShowProgressDialog(true);

    const totalItems =
      importPreviewData.exercises.length +
      (importPreviewData.activities?.length || 0) +
      (importPreviewData.badges?.length || 0) +
      (importPreviewData.challenges?.length || 0);
    let processed = 0;
    const errors: string[] = [];
    const warnings: string[] = [];

    // Summary tracking
    const summary = {
      exercisesImported: 0,
      exercisesRemoved: 0,
      badgesImported: 0,
      badgesRemoved: 0,
      challengesImported: 0,
      challengesRemoved: 0,
      activitiesImported: 0,
      activitiesRemoved: 0,
    };

    try {
      // Update progress: Starting import
      setImportProgress({
        processed: 0,
        total: totalItems,
        percentage: 0,
        currentItem: lang === 'tr' ? 'Import başlatılıyor...' : 'Starting import...',
        errors: [],
      });

      // Step 1: Import exercises (with validation and cleaning)
      if (importPreviewData.exercises.length > 0) {
        setImportProgress((prev) => ({
          ...prev,
          currentItem:
            lang === 'tr'
              ? 'Aktiviteler doğrulanıyor ve temizleniyor...'
              : 'Validating and cleaning activities...',
        }));

        // Clean activities (validate, remove duplicates, fix issues)
        const {
          cleaned,
          removed,
          warnings: cleaningWarnings,
        } = cleanActivities(importPreviewData.exercises);

        // Update summary
        summary.exercisesImported = cleaned.length;
        summary.exercisesRemoved = removed.length;

        // Add removal reasons to errors
        removed.forEach(({ activity, reason }) => {
          errors.push(`Removed: ${reason} (ID: ${activity.id})`);
        });

        // Add cleaning warnings to warnings array (not errors)
        cleaningWarnings.forEach(({ activity, warning }) => {
          warnings.push(`Warning for ${activity.id}: ${warning}`);
        });

        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(cleaned));
        processed += cleaned.length;

        setImportProgress((prev) => ({
          ...prev,
          processed,
          percentage: Math.round((processed / totalItems) * 100),
          errors,
          currentItem:
            lang === 'tr'
              ? `${cleaned.length} aktivite import edildi${removed.length > 0 ? `, ${removed.length} kaldırıldı` : ''}`
              : `${cleaned.length} activities imported${removed.length > 0 ? `, ${removed.length} removed` : ''}`,
        }));

        // Small delay for UI update
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Step 2: Import custom activities and settings (with validation)
      if (importPreviewData.activities && importPreviewData.activities.length > 0) {
        setImportProgress((prev) => ({
          ...prev,
          currentItem:
            lang === 'tr'
              ? 'Aktivite tanımları doğrulanıyor...'
              : 'Validating activity definitions...',
        }));

        const userNameToImport =
          importPreviewData.userName || importPreviewData.settings?.name || null;
        const finalUserName = userNameToImport || importPreviewData.settings?.name || null;

        const updatedSettings: UserSettings = {
          ...importPreviewData.settings!,
          customActivities: importPreviewData.activities.map((ad) => ({
            id: ad.key,
            label: ad.label,
            labelEn: ad.labelEn,
            icon: ad.icon,
            multiplier: ad.multiplier,
            unit: ad.unit,
            unitEn: ad.unitEn,
            defaultAmount: ad.defaultAmount,
            description: ad.description,
            descriptionEn: ad.descriptionEn,
          })),
          ...(finalUserName && finalUserName.trim() !== '' ? { name: finalUserName } : {}),
        };

        // Validate settings
        const settingsValidation = validateSettings(updatedSettings);
        if (!settingsValidation.isValid) {
          settingsValidation.errors.forEach((err) => {
            errors.push(`Settings validation error: ${err.field} - ${err.message}`);
          });
        }
        if (settingsValidation.warnings.length > 0) {
          settingsValidation.warnings.forEach((warn) => {
            warnings.push(`Settings warning: ${warn.field} - ${warn.message}`);
          });
        }

        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
        summary.activitiesImported = importPreviewData.activities.length;
        processed += importPreviewData.activities.length;

        setImportProgress((prev) => ({
          ...prev,
          processed,
          percentage: Math.round((processed / totalItems) * 100),
          errors,
        }));

        await new Promise((resolve) => setTimeout(resolve, 100));
      } else if (importPreviewData.settings) {
        // Still update userName if available and validate settings
        const userNameToImport =
          importPreviewData.userName || importPreviewData.settings?.name || null;

        const settingsToSave: UserSettings =
          userNameToImport && userNameToImport.trim() !== ''
            ? { ...importPreviewData.settings, name: userNameToImport }
            : importPreviewData.settings;

        // Validate settings
        const settingsValidation = validateSettings(settingsToSave);
        if (!settingsValidation.isValid) {
          settingsValidation.errors.forEach((err) => {
            errors.push(`Settings validation error: ${err.field} - ${err.message}`);
          });
        }

        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settingsToSave));
      }

      // Step 3: Import badges (with validation)
      if (importPreviewData.badges && importPreviewData.badges.length > 0) {
        setImportProgress((prev) => ({
          ...prev,
          currentItem: lang === 'tr' ? 'Rozetler doğrulanıyor...' : 'Validating badges...',
        }));

        // Validate badges
        const validBadges: Badge[] = [];
        importPreviewData.badges.forEach((badge: any) => {
          const validation = validateBadge(badge);
          if (validation.isValid) {
            validBadges.push(badge);
          } else {
            validation.errors.forEach((err) => {
              errors.push(`Badge validation error (${badge.id}): ${err.field} - ${err.message}`);
            });
          }
          if (validation.warnings.length > 0) {
            validation.warnings.forEach((warn) => {
              warnings.push(`Badge warning (${badge.id}): ${warn.field} - ${warn.message}`);
            });
          }
        });

        // Update summary
        summary.badgesImported = validBadges.length;
        summary.badgesRemoved = importPreviewData.badges.length - validBadges.length;

        localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(validBadges));
        processed += validBadges.length;

        setImportProgress((prev) => ({
          ...prev,
          processed,
          percentage: Math.round((processed / totalItems) * 100),
          errors,
        }));

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Step 4: Import challenges (with validation)
      if (importPreviewData.challenges && importPreviewData.challenges.length > 0) {
        setImportProgress((prev) => ({
          ...prev,
          currentItem: lang === 'tr' ? 'Hedefler doğrulanıyor...' : 'Validating challenges...',
        }));

        // Validate challenges
        const validChallenges: Challenge[] = [];
        importPreviewData.challenges.forEach((challenge: any) => {
          const validation = validateChallenge(challenge);
          if (validation.isValid) {
            validChallenges.push(challenge);
          } else {
            validation.errors.forEach((err) => {
              errors.push(
                `Challenge validation error (${challenge.id}): ${err.field} - ${err.message}`
              );
            });
          }
          if (validation.warnings.length > 0) {
            validation.warnings.forEach((warn) => {
              warnings.push(`Challenge warning (${challenge.id}): ${warn.field} - ${warn.message}`);
            });
          }
        });

        // Update summary
        summary.challengesImported = validChallenges.length;
        summary.challengesRemoved = importPreviewData.challenges.length - validChallenges.length;

        localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(validChallenges));
        processed += validChallenges.length;

        setImportProgress((prev) => ({
          ...prev,
          processed,
          percentage: Math.round((processed / totalItems) * 100),
          errors,
        }));

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Clear conflict storage key
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
        const finalUserName =
          importPreviewData.userName || importPreviewData.settings?.name || null;
        if (finalUserName && finalUserName.trim() !== '') {
          localStorage.setItem('name_dialog_shown', 'true');
        }
      }

      // Step 5: Sync to cloud if authenticated
      if (isAuthenticated && isConfigured) {
        setImportProgress((prev) => ({
          ...prev,
          currentItem: lang === 'tr' ? 'Buluta yükleniyor...' : 'Uploading to cloud...',
        }));

        try {
          const storedBadges = localStorage.getItem(STORAGE_KEYS.BADGES);
          const storedChallenges = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
          const badgesToUpload = storedBadges ? JSON.parse(storedBadges) : [];
          const challengesToUpload = storedChallenges ? JSON.parse(storedChallenges) : [];

          await syncToCloud({
            activities: importPreviewData.exercises,
            settings: importPreviewData.settings,
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
          errors.push(
            `Cloud sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
          showToast(
            lang === 'tr'
              ? 'Veriler içe aktarıldı, ancak buluta yükleme başarısız oldu.'
              : 'Data imported, but cloud upload failed.',
            'warning'
          );
        }
      } else {
        showToast(
          lang === 'tr' ? 'Veriler başarıyla yüklendi!' : 'Data imported successfully!',
          'success'
        );
      }

      // Final progress update with summary
      setImportProgress((prev) => ({
        ...prev,
        processed: totalItems,
        percentage: 100,
        currentItem: lang === 'tr' ? 'Import tamamlandı!' : 'Import completed!',
        errors,
        warnings,
        summary,
      }));

      // Clear flag after import completes (before reload)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sporttrack.data_importing');
      }

      // Don't auto-reload if there are errors - let user review them
      if (errors.length === 0) {
        // Wait a bit before reloading
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        // If there are errors, don't reload automatically
        // setIsImporting(false); // This was in DataExportImport but not needed here as we use showProgressDialog
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportProgress((prev) => ({
        ...prev,
        currentItem: lang === 'tr' ? 'Import başarısız!' : 'Import failed!',
        errors: [...(prev.errors || []), error instanceof Error ? error.message : 'Unknown error'],
      }));
      showToast(t('data.importFailed'), 'error');
    }
  }, [
    importPreviewData,
    lang,
    t,
    isAuthenticated,
    isConfigured,
    syncToCloud,
    showToast,
    setShowImportPreviewDialog,
  ]);

  // Listen for import confirmation from dialog
  useEffect(() => {
    const handleImportConfirm = () => {
      console.log('ImportHandler: handleImportConfirm triggered');
      if (importPreviewData) {
        console.log('ImportHandler: Starting performImport...');
        performImport();
      } else {
        console.warn('ImportHandler: No importPreviewData available!');
      }
    };
    window.addEventListener('sporttrack:import-confirm', handleImportConfirm);
    return () => {
      window.removeEventListener('sporttrack:import-confirm', handleImportConfirm);
    };
  }, [importPreviewData, performImport]);

  return (
    <ImportProgressDialog
      open={showProgressDialog}
      processed={importProgress.processed}
      total={importProgress.total}
      percentage={importProgress.percentage}
      currentItem={importProgress.currentItem}
      errors={importProgress.errors}
      warnings={importProgress.warnings}
      summary={importProgress.summary}
      onClose={() => setShowProgressDialog(false)}
    />
  );
}
