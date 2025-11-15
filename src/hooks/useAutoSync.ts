/**
 * Auto Sync Hook
 * Automatically syncs data to cloud after activity is added
 * Uses debounced sync (5 seconds after activity added) and periodic check (every 30 seconds)
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

const INITIAL_SYNC_COMPLETE_KEY = 'sporttrack_initial_sync_complete';
const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';
const LAST_ACTIVITY_ADDED_KEY = 'sporttrack_last_activity_added';
const LAST_SYNC_TIME_KEY = 'sporttrack_last_sync_time';

// Debounce delay: wait 2 seconds after activity added before syncing (reduced from 5s for faster sync)
const DEBOUNCE_DELAY_MS = 2000;
// Periodic check interval: check every 60 seconds for changes (increased from 30s to reduce Firebase requests)
const PERIODIC_CHECK_INTERVAL_MS = 60000;

export function useAutoSync() {
  const { isAuthenticated, isConfigured } = useAuth();
  const { syncToCloud } = useCloudSync();
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const { badges, hydrated: badgesHydrated } = useBadges();
  const { challenges, hydrated: challengesHydrated } = useChallenges();
  const { showToast } = useToaster();
  const { t } = useI18n();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const periodicCheckRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);
  const lastActivityCountRef = useRef<number>(0);
  const lastCustomActivitiesCountRef = useRef<number>(0);
  const lastSyncHashRef = useRef<string | null>(null);

  // Use refs to access current values in async functions
  const activitiesRef = useRef(activities);
  const settingsRef = useRef(settings);
  const badgesRef = useRef(badges);
  const challengesRef = useRef(challenges);
  const syncToCloudRef = useRef(syncToCloud);

  // Update refs when values change
  useEffect(() => {
    activitiesRef.current = activities;
  }, [activities]);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);
  useEffect(() => {
    badgesRef.current = badges;
  }, [badges]);
  useEffect(() => {
    challengesRef.current = challenges;
  }, [challenges]);
  useEffect(() => {
    syncToCloudRef.current = syncToCloud;
  }, [syncToCloud]);

  const allHydrated =
    activitiesHydrated && settingsHydrated && badgesHydrated && challengesHydrated;

  // Create a detailed hash of current data for change detection
  // This includes content changes, not just counts
  const createDataHash = (): string => {
    // Create hash based on IDs and timestamps to detect edits/deletes
    const activitiesHash = activitiesRef.current
      .map((a) => `${a.id}:${a.performedAt}:${a.amount}:${a.points}`)
      .sort()
      .join('|');

    const badgesHash = badgesRef.current
      .map((b) => `${b.id}:${b.unlockedAt || ''}`)
      .sort()
      .join('|');

    const challengesHash = challengesRef.current
      .map((c) => `${c.id}:${c.completedAt || ''}`)
      .sort()
      .join('|');

    return JSON.stringify({
      activities: activitiesHash,
      activitiesCount: activitiesRef.current.length,
      badges: badgesHash,
      badgesCount: badgesRef.current.length,
      challenges: challengesHash,
      challengesCount: challengesRef.current.length,
      settings: settingsRef.current ? JSON.stringify(settingsRef.current) : null,
    });
  };

  // Check if data has changed since last sync
  const hasChangesSinceLastSync = (): boolean => {
    const currentHash = createDataHash();
    if (lastSyncHashRef.current === null) {
      // First sync, initialize hash
      lastSyncHashRef.current = currentHash;
      return false; // Don't sync on initial load
    }
    return currentHash !== lastSyncHashRef.current;
  };

  // Debounced sync function
  const performDebouncedSync = async () => {
    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Check if initial sync is complete and if there's a pending conflict
    const initialSyncComplete =
      typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';
    const hasPendingConflict =
      typeof window !== 'undefined' && localStorage.getItem(CONFLICT_STORAGE_KEY) !== null;
    const conflictResolutionInProgress =
      typeof window !== 'undefined' &&
      localStorage.getItem('sporttrack_conflict_resolution_in_progress') === 'true';

    // Don't sync if initial sync is not complete, if there's a pending conflict, or if conflict resolution is in progress
    if (!initialSyncComplete || hasPendingConflict || conflictResolutionInProgress) {
      return;
    }

    // Check if there are changes
    if (!hasChangesSinceLastSync()) {
      // No changes detected, skipping sync
      return;
    }

    // Prevent concurrent syncs
    if (isSyncingRef.current) {
      // Auto-sync skipped: Already syncing
      return;
    }

    isSyncingRef.current = true;
    // Starting debounced sync

    try {
      await syncToCloudRef.current({
        activities: activitiesRef.current,
        settings: settingsRef.current,
        badges: badgesRef.current,
        challenges: challengesRef.current,
      });

      // Update last sync time and hash
      const syncTime = Date.now();
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_SYNC_TIME_KEY, String(syncTime));
      }
      lastSyncHashRef.current = createDataHash();

      // Debounced sync successful
    } catch (error) {
      // Check if error is due to offline mode
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Offline') || errorMessage.includes('offline')) {
        // Offline mode - data is already queued, just log it
        // Offline: Changes queued for sync when online
      } else {
        // Real error - log it
        console.error('Debounced sync failed:', error);
      }
    } finally {
      isSyncingRef.current = false;
    }
  };

  // Check if activities changed (added, edited, or deleted) - trigger debounced sync
  useEffect(() => {
    if (!allHydrated || !isAuthenticated || !isConfigured) {
      return;
    }

    const currentCount = activities.length;
    const lastCount = lastActivityCountRef.current;
    const currentHash = createDataHash();
    const lastHash = lastSyncHashRef.current;

    // If activity count changed OR content changed (edit), trigger debounced sync
    const countChanged = currentCount !== lastCount;
    const contentChanged = lastHash !== null && currentHash !== lastHash;

    if ((countChanged || contentChanged) && lastCount >= 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_ACTIVITY_ADDED_KEY, String(Date.now()));
      }

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Schedule debounced sync
      debounceTimerRef.current = setTimeout(() => {
        performDebouncedSync();
      }, DEBOUNCE_DELAY_MS);
    }

    lastActivityCountRef.current = currentCount;

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [activities, allHydrated, isAuthenticated, isConfigured]);

  // Check if custom activity was added/updated/removed - trigger debounced sync
  useEffect(() => {
    if (!allHydrated || !isAuthenticated || !isConfigured) {
      return;
    }

    const currentCustomActivitiesCount = settings?.customActivities?.length || 0;
    const lastCustomCount = lastCustomActivitiesCountRef.current;

    // If custom activities count changed, trigger debounced sync
    if (currentCustomActivitiesCount !== lastCustomCount && lastCustomCount >= 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_ACTIVITY_ADDED_KEY, String(Date.now()));
        // Custom activity change detected, scheduling debounced sync
      }

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Schedule debounced sync
      debounceTimerRef.current = setTimeout(() => {
        performDebouncedSync();
      }, DEBOUNCE_DELAY_MS);
    }

    lastCustomActivitiesCountRef.current = currentCustomActivitiesCount;

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [settings?.customActivities?.length, allHydrated, isAuthenticated, isConfigured]);

  // Periodic check: runs every 30 seconds to check for changes
  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !allHydrated) {
      if (periodicCheckRef.current) {
        clearInterval(periodicCheckRef.current);
        periodicCheckRef.current = null;
      }
      return;
    }

    // Check if initial sync is complete and if there's a pending conflict
    const initialSyncComplete =
      typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';
    const hasPendingConflict =
      typeof window !== 'undefined' && localStorage.getItem(CONFLICT_STORAGE_KEY) !== null;
    const conflictResolutionInProgress =
      typeof window !== 'undefined' &&
      localStorage.getItem('sporttrack_conflict_resolution_in_progress') === 'true';

    // Don't sync if initial sync is not complete, if there's a pending conflict, or if conflict resolution is in progress
    if (!initialSyncComplete || hasPendingConflict || conflictResolutionInProgress) {
      if (periodicCheckRef.current) {
        clearInterval(periodicCheckRef.current);
        periodicCheckRef.current = null;
      }
      return;
    }

    // Initialize last sync hash on first run
    if (lastSyncHashRef.current === null) {
      lastSyncHashRef.current = createDataHash();
    }

    // Periodic check function
    const performPeriodicCheck = async () => {
      // Check if there are changes
      if (!hasChangesSinceLastSync()) {
        // Periodic check: No changes detected, skipping sync
        return;
      }

      // Check if an activity was added recently (within last 30 seconds)
      const lastActivityAdded =
        typeof window !== 'undefined'
          ? parseInt(localStorage.getItem(LAST_ACTIVITY_ADDED_KEY) || '0', 10)
          : 0;
      const now = Date.now();
      const timeSinceActivityAdded = now - lastActivityAdded;

      // Only sync if activity was added recently (within last 30 seconds)
      if (lastActivityAdded > 0 && timeSinceActivityAdded > PERIODIC_CHECK_INTERVAL_MS) {
        // Periodic check: No recent activity, skipping sync
        return;
      }

      // Prevent concurrent syncs
      if (isSyncingRef.current) {
        // Periodic check: Already syncing, skipping
        return;
      }

      isSyncingRef.current = true;
      // Periodic check: Starting sync

      try {
        await syncToCloudRef.current({
          activities: activitiesRef.current,
          settings: settingsRef.current,
          badges: badgesRef.current,
          challenges: challengesRef.current,
        });

        // Update last sync time and hash
        const syncTime = Date.now();
        if (typeof window !== 'undefined') {
          localStorage.setItem(LAST_SYNC_TIME_KEY, String(syncTime));
        }
        lastSyncHashRef.current = createDataHash();

        // Periodic check sync successful
      } catch (error) {
        // Check if error is due to offline mode
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('Offline') || errorMessage.includes('offline')) {
          // Offline mode - data is already queued, just log it
          // Periodic check: Offline - changes queued for sync
        } else {
          // Real error - log it
          console.error('Periodic check sync failed:', error);
        }
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Start periodic check (every 30 seconds)
    periodicCheckRef.current = setInterval(() => {
      performPeriodicCheck();
    }, PERIODIC_CHECK_INTERVAL_MS);

    // Periodic sync check started

    return () => {
      if (periodicCheckRef.current) {
        clearInterval(periodicCheckRef.current);
        periodicCheckRef.current = null;
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

  // Initialize last activity count, custom activities count, and sync hash
  useEffect(() => {
    if (allHydrated) {
      lastActivityCountRef.current = activities.length;
      lastCustomActivitiesCountRef.current = settings?.customActivities?.length || 0;
      if (lastSyncHashRef.current === null) {
        lastSyncHashRef.current = createDataHash();
      }
    }
  }, [allHydrated, activities.length, settings?.customActivities?.length]);

  // Flush pending sync immediately (for logout scenarios)
  const flushPendingSync = async (): Promise<void> => {
    // Clear debounce timer and sync immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Check if there are changes that need syncing
    if (!hasChangesSinceLastSync()) {
      return; // No changes, nothing to sync
    }

    // Prevent concurrent syncs
    if (isSyncingRef.current) {
      // Wait for current sync to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!isSyncingRef.current) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 5000);
      });
    }

    isSyncingRef.current = true;
    try {
      await syncToCloud({
        activities: activitiesRef.current,
        settings: settingsRef.current,
        badges: badgesRef.current,
        challenges: challengesRef.current,
      });

      // Update last sync time and hash
      const syncTime = Date.now();
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_SYNC_TIME_KEY, String(syncTime));
      }
      lastSyncHashRef.current = createDataHash();
    } catch (error) {
      console.error('Flush sync failed:', error);
      throw error; // Re-throw to allow caller to handle
    } finally {
      isSyncingRef.current = false;
    }
  };

  return {
    flushPendingSync,
  };
}
