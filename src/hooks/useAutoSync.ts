/**
 * Auto Sync Hook
 * Automatically syncs data to cloud when stores change
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useCloudSync } from './useCloudSync';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import { useToaster } from '@/components/Toaster';
import { useI18n } from '@/lib/i18n';

const SYNC_DEBOUNCE_MS = 3000; // Wait 3 seconds after last change before syncing
const SYNC_THROTTLE_MS = 10000; // Minimum 10 seconds between syncs
const INITIAL_SYNC_COMPLETE_KEY = 'sporttrack_initial_sync_complete';
const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';
const LAST_SYNC_TIME_KEY = 'sporttrack_last_sync_time';

// Helper function to create a hash from array length and first/last item IDs
function createArrayHash(arr: any[], maxItems: number = 5): string {
  if (arr.length === 0) return 'empty';
  const ids = arr
    .slice(0, maxItems)
    .map((item) => item.id || JSON.stringify(item))
    .join(',');
  const lastIds =
    arr.length > maxItems
      ? arr
          .slice(-maxItems)
          .map((item) => item.id || JSON.stringify(item))
          .join(',')
      : '';
  return `${arr.length}:${ids}${lastIds ? `:${lastIds}` : ''}`;
}

export function useAutoSync() {
  const { isAuthenticated, isConfigured } = useAuth();
  const { syncToCloud } = useCloudSync();
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const { badges, hydrated: badgesHydrated } = useBadges();
  const { challenges, hydrated: challengesHydrated } = useChallenges();
  const { showToast } = useToaster();
  const { t } = useI18n();

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<{
    activitiesHash: string;
    settings: string | null;
    badgesHash: string;
    challengesHash: string;
  } | null>(null);
  const isInitialSyncRef = useRef(true);
  const isSyncingRef = useRef(false);

  const allHydrated =
    activitiesHydrated && settingsHydrated && badgesHydrated && challengesHydrated;

  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !allHydrated) {
      // Reset lastSyncRef when not authenticated
      if (!isAuthenticated || !isConfigured) {
        lastSyncRef.current = null;
        isInitialSyncRef.current = true;
      }
      return;
    }

    // Check if initial sync is complete and if there's a pending conflict
    const initialSyncComplete =
      typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';
    const hasPendingConflict =
      typeof window !== 'undefined' && localStorage.getItem(CONFLICT_STORAGE_KEY) !== null;

    // Don't sync if initial sync is not complete or if there's a pending conflict
    if (!initialSyncComplete || hasPendingConflict) {
      return;
    }

    // Create current hashes
    const currentActivitiesHash = createArrayHash(activities);
    const currentSettingsStr = settings ? JSON.stringify(settings) : null;
    const currentBadgesHash = createArrayHash(badges);
    const currentChallengesHash = createArrayHash(challenges);

    // Initialize lastSyncRef on first sync
    if (lastSyncRef.current === null) {
      lastSyncRef.current = {
        activitiesHash: currentActivitiesHash,
        settings: currentSettingsStr,
        badgesHash: currentBadgesHash,
        challengesHash: currentChallengesHash,
      };
      // Don't sync on initial load, wait for changes
      isInitialSyncRef.current = false;
      return;
    }

    // Check if anything changed
    const activitiesChanged = currentActivitiesHash !== lastSyncRef.current.activitiesHash;
    const settingsChanged = currentSettingsStr !== lastSyncRef.current.settings;
    const badgesChanged = currentBadgesHash !== lastSyncRef.current.badgesHash;
    const challengesChanged = currentChallengesHash !== lastSyncRef.current.challengesHash;

    // If nothing changed, don't sync (prevents infinite loops)
    if (!activitiesChanged && !settingsChanged && !badgesChanged && !challengesChanged) {
      return;
    }

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout for debounced sync
    syncTimeoutRef.current = setTimeout(() => {
      // Check throttle - don't sync if last sync was too recent
      const lastSyncTime =
        typeof window !== 'undefined'
          ? parseInt(localStorage.getItem(LAST_SYNC_TIME_KEY) || '0', 10)
          : 0;
      const now = Date.now();
      const timeSinceLastSync = now - lastSyncTime;

      if (timeSinceLastSync < SYNC_THROTTLE_MS && lastSyncTime > 0) {
        // Too soon, reschedule
        syncTimeoutRef.current = setTimeout(() => {
          syncTimeoutRef.current = null;
        }, SYNC_THROTTLE_MS - timeSinceLastSync);
        return;
      }

      // Prevent concurrent syncs
      if (isSyncingRef.current) {
        return;
      }

      const settingsStr = settings ? JSON.stringify(settings) : null;
      const finalActivitiesHash = createArrayHash(activities);
      const finalBadgesHash = createArrayHash(badges);
      const finalChallengesHash = createArrayHash(challenges);

      isSyncingRef.current = true;
      syncToCloud({
        activities,
        settings,
        badges,
        challenges,
      })
        .then(() => {
          // Update last sync time
          if (typeof window !== 'undefined') {
            localStorage.setItem(LAST_SYNC_TIME_KEY, String(Date.now()));
          }
          // Show success toast
          showToast(t('cloudSync.syncedToCloud'), 'success');
        })
        .catch((error) => {
          console.error('❌ Auto-sync failed:', error);
          showToast(t('cloudSync.syncFailed'), 'error');
        })
        .finally(() => {
          isSyncingRef.current = false;
        });

      // Update last sync ref with current hashes
      lastSyncRef.current = {
        activitiesHash: finalActivitiesHash,
        settings: settingsStr,
        badgesHash: finalBadgesHash,
        challengesHash: finalChallengesHash,
      };
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [
    isAuthenticated,
    isConfigured,
    allHydrated,
    activities,
    settings,
    badges,
    challenges,
    syncToCloud,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);
}
