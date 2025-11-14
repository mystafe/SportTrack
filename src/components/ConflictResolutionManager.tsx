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
import { STORAGE_KEYS } from '@/lib/constants';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';

/**
 * ConflictResolutionManager
 * Manages conflict resolution dialog globally, independent of SettingsDialog
 * This ensures the dialog appears immediately after login, before user opens settings
 */
export function ConflictResolutionManager() {
  const { user, isAuthenticated, isConfigured } = useAuth();
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
      setShowConflictDialog(false);
      setConflictData(null);
      return;
    }

    // Function to check and show conflict dialog
    const checkConflict = () => {
      const conflictStr =
        typeof window !== 'undefined' ? localStorage.getItem(CONFLICT_STORAGE_KEY) : null;
      if (conflictStr) {
        try {
          const conflict = JSON.parse(conflictStr);
          console.log('🔍 Conflict detected in localStorage:', {
            localActivities: conflict.local?.activities?.length || 0,
            cloudActivities: conflict.cloud?.activities?.length || 0,
            localBadges: conflict.local?.badges?.length || 0,
            cloudBadges: conflict.cloud?.badges?.length || 0,
          });
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
      } else {
        // No conflict, hide dialog if it was showing
        if (showConflictDialog) {
          setShowConflictDialog(false);
          setConflictData(null);
        }
      }
    };

    // Check immediately
    checkConflict();

    // Check after delays to catch late conflicts
    const timeout1 = setTimeout(checkConflict, 500);
    const timeout2 = setTimeout(checkConflict, 1000);
    const timeout3 = setTimeout(checkConflict, 2000);
    const timeout4 = setTimeout(checkConflict, 3000);

    // Listen to custom event from useCloudSyncListener
    const handleConflictDetected = () => {
      console.log('📢 Conflict detected event received');
      checkConflict();
    };
    window.addEventListener('sporttrack:conflict-detected', handleConflictDetected);

    // Also listen to storage events (for cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONFLICT_STORAGE_KEY) {
        checkConflict();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Poll localStorage periodically to catch conflicts set by other components
    const pollInterval = setInterval(checkConflict, 1000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sporttrack:conflict-detected', handleConflictDetected);
    };
  }, [isAuthenticated, isConfigured, showToast, t, showConflictDialog]);

  const applyCloudData = async (
    cloudData: import('@/lib/cloudSync/types').CloudData,
    strategy: ConflictStrategy
  ) => {
    const localData = { activities, settings, badges, challenges };
    const resolution = resolveConflicts(localData, cloudData, strategy);

    console.log('🔄 Applying conflict resolution:', {
      strategy,
      resolvedActivities: resolution.resolvedData.activities.length,
      resolvedBadges: resolution.resolvedData.badges.length,
      resolvedChallenges: resolution.resolvedData.challenges.length,
    });

    // Apply resolved data locally
    // Apply settings
    if (resolution.resolvedData.settings) {
      saveSettings(resolution.resolvedData.settings);
    }

    // Apply activities, badges, and challenges directly to localStorage
    // This bypasses the store setters which might have side effects
    try {
      if (typeof window !== 'undefined') {
        // Write activities
        localStorage.setItem(
          STORAGE_KEYS.ACTIVITIES,
          JSON.stringify(resolution.resolvedData.activities)
        );

        // Write badges
        localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(resolution.resolvedData.badges));

        // Write challenges
        localStorage.setItem(
          STORAGE_KEYS.CHALLENGES,
          JSON.stringify(resolution.resolvedData.challenges)
        );

        console.log('✅ Conflict resolution data written to localStorage');

        // Reload page to apply changes (stores will read from localStorage)
        // Small delay to ensure localStorage is written and cloud sync completes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to write conflict resolution data:', error);
      showToast(lang === 'tr' ? 'Veri yazma hatası' : 'Data write error', 'error');
      return;
    }

    // Only sync to cloud if strategy is NOT "cloud" (cloud strategy means use cloud data, don't overwrite it)
    // For "local" strategy: upload local data to cloud
    // For "merge" or "newest": upload merged/resolved data to cloud
    // For "cloud" strategy: just apply cloud data locally, don't upload anything
    if (strategy !== 'cloud') {
      await syncToCloud({
        activities: resolution.resolvedData.activities,
        settings: resolution.resolvedData.settings,
        badges: resolution.resolvedData.badges,
        challenges: resolution.resolvedData.challenges,
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

      // Add metadata to cloudData if missing (required by CloudData type)
      const cloudDataWithMetadata: import('@/lib/cloudSync/types').CloudData = {
        ...conflictData.cloud,
        metadata: {
          lastModified: new Date(),
          version: Date.now(),
          userId: user?.uid || 'unknown',
        },
      };
      await applyCloudData(cloudDataWithMetadata, strategy);
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
