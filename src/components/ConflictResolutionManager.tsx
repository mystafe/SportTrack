'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';
import { useToaster } from './Toaster';
import { ConflictResolutionDialog } from './ConflictResolutionDialog';
import type { ConflictStrategy } from '@/lib/cloudSync/conflictResolver';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import { useCloudSync } from '@/hooks/useCloudSync';
import { resolveConflicts, saveLocalLastModified } from '@/lib/cloudSync/conflictResolver';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';

/**
 * ConflictResolutionManager
 * Manages conflict resolution dialog globally, independent of SettingsDialog
 * This ensures the dialog appears immediately after login, before user opens settings
 */
export function ConflictResolutionManager() {
  const { isAuthenticated, isConfigured } = useAuth();
  const { activities } = useActivities();
  const { settings, saveSettings } = useSettings();
  const { badges } = useBadges();
  const { challenges } = useChallenges();
  const { syncToCloud } = useCloudSync();
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictData, setConflictData] = useState<{
    local: {
      activities: unknown[];
      settings: unknown | null;
      badges: unknown[];
      challenges: unknown[];
    };
    cloud: {
      activities: unknown[];
      settings: unknown | null;
      badges: unknown[];
      challenges: unknown[];
    };
  } | null>(null);

  // Check for pending conflict on mount and when authenticated
  useEffect(() => {
    if (!isAuthenticated || !isConfigured) {
      return;
    }

    // Small delay to ensure stores are hydrated
    const checkConflict = () => {
      const conflictStr =
        typeof window !== 'undefined' ? localStorage.getItem(CONFLICT_STORAGE_KEY) : null;
      if (conflictStr) {
        try {
          const conflict = JSON.parse(conflictStr);
          setConflictData(conflict);
          // Show conflict dialog immediately
          setShowConflictDialog(true);
          showToast(t('cloudSync.conflictDetected'), 'info');
        } catch (error) {
          console.error('Failed to parse conflict data:', error);
          // Clear invalid conflict data
          if (typeof window !== 'undefined') {
            localStorage.removeItem(CONFLICT_STORAGE_KEY);
          }
        }
      }
    };

    // Check immediately and also after a delay to catch late conflicts
    checkConflict();
    const timeoutId = setTimeout(checkConflict, 500);
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isConfigured, showToast, t]);

  const applyCloudData = async (cloudData: any, strategy: ConflictStrategy) => {
    const localData = { activities, settings, badges, challenges };
    const resolution = resolveConflicts(localData, cloudData, strategy);

    // Apply resolved data locally
    // Apply settings
    if (resolution.resolvedData.settings) {
      saveSettings(resolution.resolvedData.settings as any);
    }

    // Only sync to cloud if strategy is NOT "cloud" (cloud strategy means use cloud data, don't overwrite it)
    // For "local" strategy: upload local data to cloud
    // For "merge" or "newest": upload merged/resolved data to cloud
    // For "cloud" strategy: just apply cloud data locally, don't upload anything
    if (strategy !== 'cloud') {
      await syncToCloud({
        activities: resolution.resolvedData.activities as any[],
        settings: resolution.resolvedData.settings,
        badges: resolution.resolvedData.badges as any[],
        challenges: resolution.resolvedData.challenges as any[],
      });
    }

    saveLocalLastModified();

    const message =
      strategy === 'cloud'
        ? lang === 'tr'
          ? 'Bulut verileri uygulandı'
          : 'Cloud data applied'
        : lang === 'tr'
          ? 'Veriler uygulandı ve senkronize edildi!'
          : 'Data applied and synced!';
    showToast(message, 'success');
  };

  const handleConflictResolve = async (strategy: ConflictStrategy) => {
    if (!conflictData) return;

    setShowConflictDialog(false);

    try {
      // Clear conflict storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
      }

      await applyCloudData(conflictData.cloud, strategy);
    } catch (error) {
      console.error('Conflict resolution error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast(
        lang === 'tr'
          ? `Çakışma çözümü hatası: ${errorMessage}`
          : `Conflict resolution error: ${errorMessage}`,
        'error'
      );
    } finally {
      setConflictData(null);
    }
  };

  if (!showConflictDialog || !conflictData) {
    return null;
  }

  return (
    <ConflictResolutionDialog
      open={showConflictDialog}
      onResolve={handleConflictResolve}
      onCancel={() => {
        setShowConflictDialog(false);
        setConflictData(null);
        // Clear conflict storage on cancel
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CONFLICT_STORAGE_KEY);
        }
      }}
      localCount={{
        activities: conflictData.local.activities.length,
        badges: conflictData.local.badges.length,
        challenges: conflictData.local.challenges.length,
      }}
      cloudCount={{
        activities: conflictData.cloud.activities.length,
        badges: conflictData.cloud.badges.length,
        challenges: conflictData.cloud.challenges.length,
      }}
    />
  );
}
