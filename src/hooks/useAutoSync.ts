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

const SYNC_DEBOUNCE_MS = 2000; // Wait 2 seconds after last change before syncing
const INITIAL_SYNC_COMPLETE_KEY = 'sporttrack_initial_sync_complete';
const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';

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

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<{
    activitiesHash: string;
    settings: string | null;
    badgesHash: string;
    challengesHash: string;
  } | null>(null);
  const isInitialSyncRef = useRef(true);

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
      const settingsStr = settings ? JSON.stringify(settings) : null;
      const finalActivitiesHash = createArrayHash(activities);
      const finalBadgesHash = createArrayHash(badges);
      const finalChallengesHash = createArrayHash(challenges);

      syncToCloud({
        activities,
        settings,
        badges,
        challenges,
      }).catch((error) => {
        console.error('❌ Auto-sync failed:', error);
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
