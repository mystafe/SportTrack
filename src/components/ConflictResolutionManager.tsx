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
      // Clear conflict storage on logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
      }
      return;
    }

    // Check if initial sync is complete - if so, don't show conflict dialog
    const initialSyncComplete =
      typeof window !== 'undefined' &&
      localStorage.getItem('sporttrack_initial_sync_complete') === 'true';

    if (initialSyncComplete) {
      // Initial sync is complete, clear any stale conflict data
      if (typeof window !== 'undefined') {
        const conflictStr = localStorage.getItem(CONFLICT_STORAGE_KEY);
        if (conflictStr) {
          console.log('🧹 Clearing stale conflict data (initial sync already complete)');
          localStorage.removeItem(CONFLICT_STORAGE_KEY);
        }
      }
      setShowConflictDialog(false);
      setConflictData(null);
      return;
    }

    // Function to check and show conflict dialog
    const checkConflict = () => {
      // Double-check initial sync status
      const syncComplete =
        typeof window !== 'undefined' &&
        localStorage.getItem('sporttrack_initial_sync_complete') === 'true';

      if (syncComplete) {
        // Initial sync is complete, don't show conflict dialog
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CONFLICT_STORAGE_KEY);
        }
        setShowConflictDialog(false);
        setConflictData(null);
        return;
      }

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

    // Check after delays to catch late conflicts (reduced frequency)
    const timeout1 = setTimeout(checkConflict, 500);
    const timeout2 = setTimeout(checkConflict, 1500);
    const timeout3 = setTimeout(checkConflict, 3000);

    // Listen to custom event from useCloudSyncListener
    const handleConflictDetected = () => {
      console.log('📢 Conflict detected event received');
      // Only check if dialog is not already showing
      if (!showConflictDialog) {
        checkConflict();
      }
    };
    window.addEventListener('sporttrack:conflict-detected', handleConflictDetected);

    // Also listen to storage events (for cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONFLICT_STORAGE_KEY && !showConflictDialog) {
        checkConflict();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Poll localStorage periodically to catch conflicts set by other components (reduced frequency)
    // Only poll if dialog is not showing to prevent infinite loops
    const pollInterval = setInterval(() => {
      if (!showConflictDialog) {
        checkConflict();
      }
    }, 2000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
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
      try {
        console.log('📤 Uploading resolved data to cloud...', {
          strategy,
          activities: resolution.resolvedData.activities.length,
          badges: resolution.resolvedData.badges.length,
          challenges: resolution.resolvedData.challenges.length,
        });
        await syncToCloud({
          activities: resolution.resolvedData.activities,
          settings: resolution.resolvedData.settings,
          badges: resolution.resolvedData.badges,
          challenges: resolution.resolvedData.challenges,
        });
        console.log('✅ Resolved data uploaded to cloud successfully');
      } catch (uploadError) {
        console.error('❌ Failed to upload resolved data to cloud:', uploadError);
        showToast(
          lang === 'tr'
            ? 'Veriler uygulandı ancak buluta yükleme başarısız oldu'
            : 'Data applied but cloud upload failed',
          'warning'
        );
      }
    }

    saveLocalLastModified();

    // Mark initial sync as complete to prevent useCloudSyncListener from running again after reload
    if (typeof window !== 'undefined') {
      localStorage.setItem('sporttrack_initial_sync_complete', 'true');
      console.log('✅ Initial sync marked as complete after conflict resolution');
    }

    // Reload page AFTER cloud sync completes (or fails) to apply changes
    // Stores will read from localStorage after reload
    setTimeout(() => {
      window.location.reload();
    }, 500);

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
      // Clear conflict storage IMMEDIATELY to prevent re-detection
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
        // Mark initial sync as complete to prevent re-detection
        localStorage.setItem('sporttrack_initial_sync_complete', 'true');
      }

      // Safety check: If cloud is empty and user selected "cloud" strategy,
      // automatically use "local" strategy instead to prevent data loss
      const cloudIsEmpty =
        (conflictData.cloud.activities?.length || 0) === 0 &&
        (conflictData.cloud.badges?.length || 0) === 0 &&
        (conflictData.cloud.challenges?.length || 0) === 0;

      const localHasData =
        (conflictData.local.activities?.length || 0) > 0 ||
        (conflictData.local.badges?.length || 0) > 0 ||
        (conflictData.local.challenges?.length || 0) > 0;

      let finalStrategy = strategy;
      if (strategy === 'cloud' && cloudIsEmpty && localHasData) {
        console.warn(
          '⚠️ Cloud is empty but user selected cloud strategy. Using local strategy to prevent data loss.'
        );
        finalStrategy = 'local';
        showToast(
          lang === 'tr'
            ? 'Bulut verileri boş olduğu için yerel veriler kullanıldı'
            : 'Cloud data is empty, using local data instead',
          'warning'
        );
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
      await applyCloudData(cloudDataWithMetadata, finalStrategy);
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

  // Get local last modified date
  const getLocalLastModified = (): Date | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('sporttrack_last_sync');
      if (stored) {
        const date = new Date(stored);
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
      // If no stored date, check if there are activities and use current time as fallback
      if (activities.length > 0) {
        // Return current time as fallback if activities exist but no timestamp
        return new Date();
      }
    } catch (error) {
      console.error('Failed to get local last modified:', error);
    }
    return null;
  };

  // Get cloud last modified date from conflict data
  // Only return date if cloud actually has data (not empty)
  const getCloudLastModified = (): Date | null => {
    if (!conflictData) return null;
    const cloudData = conflictData.cloud as any;

    // Check if cloud has any data - if empty, don't show last modified date
    const hasCloudData =
      (cloudData.activities && cloudData.activities.length > 0) ||
      (cloudData.badges && cloudData.badges.length > 0) ||
      (cloudData.challenges && cloudData.challenges.length > 0);

    if (!hasCloudData) {
      return null; // No data in cloud, don't show date
    }

    if (cloudData.metadata?.lastModified) {
      try {
        return new Date(cloudData.metadata.lastModified);
      } catch {
        return null;
      }
    }
    return null;
  };

  return (
    <ConflictResolutionDialog
      open={showConflictDialog}
      onResolve={handleConflictResolve}
      onCancel={() => {
        setShowConflictDialog(false);
        setConflictData(null);
        // Clear conflict storage on cancel and mark initial sync as complete
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CONFLICT_STORAGE_KEY);
          // Mark initial sync as complete to prevent re-detection
          localStorage.setItem('sporttrack_initial_sync_complete', 'true');
        }
      }}
      localCount={{
        activities: conflictData.local.activities.length,
        badges: conflictData.local.badges.length,
      }}
      cloudCount={{
        activities: conflictData.cloud.activities.length,
        badges: conflictData.cloud.badges.length,
      }}
      localLastModified={getLocalLastModified()}
      cloudLastModified={getCloudLastModified()}
    />
  );
}
