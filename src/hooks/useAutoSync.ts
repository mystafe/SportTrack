/**
 * Auto Sync Hook
 * Automatically syncs data to cloud after activity is added
 * Uses batch sync - changes are batched and sent once per minute
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import { batchSyncService } from '@/lib/cloudSync/batchSyncService';

const INITIAL_SYNC_COMPLETE_KEY = 'sporttrack_initial_sync_complete';
const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';
const LAST_ACTIVITY_ADDED_KEY = 'sporttrack_last_activity_added';
const LAST_SYNC_TIME_KEY = 'sporttrack_last_sync_time';
const PERIODIC_CHECK_INTERVAL_MS = 30000; // 30 seconds

// Use batch sync instead of immediate sync - changes are batched and sent once per minute
// No debounce needed - batch sync handles timing

export function useAutoSync() {
  const { isAuthenticated, isConfigured } = useAuth();
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const { badges, hydrated: badgesHydrated } = useBadges();
  const { challenges, hydrated: challengesHydrated } = useChallenges();

  const periodicCheckRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityCountRef = useRef<number>(0);
  const lastCustomActivitiesCountRef = useRef<number>(0);
  const lastSyncHashRef = useRef<string | null>(null);

  // Use refs to access current values in async functions
  const activitiesRef = useRef(activities);
  const settingsRef = useRef(settings);
  const badgesRef = useRef(badges);
  const challengesRef = useRef(challenges);

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

    // Create a normalized settings hash that includes all settings fields
    const settingsHash = settingsRef.current
      ? JSON.stringify({
          name: settingsRef.current.name || '',
          dailyTarget: settingsRef.current.dailyTarget || 10000,
          customActivities: (settingsRef.current.customActivities || [])
            .map((a) => a.id)
            .sort()
            .join(','),
          baseActivityOverrides: (settingsRef.current.baseActivityOverrides || [])
            .map((a) => a.key)
            .sort()
            .join(','),
          mood: settingsRef.current.mood || null,
          listDensity: settingsRef.current.listDensity || 'compact',
          reduceAnimations: settingsRef.current.reduceAnimations || false,
          theme: settingsRef.current.theme || 'system',
          language: settingsRef.current.language || 'tr',
        })
      : null;

    return JSON.stringify({
      activities: activitiesHash,
      activitiesCount: activitiesRef.current.length,
      badges: badgesHash,
      badgesCount: badgesRef.current.length,
      challenges: challengesHash,
      challengesCount: challengesRef.current.length,
      settings: settingsHash,
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

  // Add change to batch sync queue
  const addToBatchSync = () => {
    // Check if quota is exceeded - disable auto-sync if so
    const quotaExceeded =
      typeof window !== 'undefined' && localStorage.getItem('sporttrack.quota_exceeded') === 'true';

    if (quotaExceeded) {
      // Check if quota error was more than 24 hours ago - allow retry
      const quotaExceededAt =
        typeof window !== 'undefined' ? localStorage.getItem('sporttrack.quota_exceeded_at') : null;

      if (quotaExceededAt) {
        const quotaDate = new Date(quotaExceededAt);
        const hoursSinceQuota = (Date.now() - quotaDate.getTime()) / (1000 * 60 * 60);

        // If quota error was more than 24 hours ago, clear the flag and allow sync
        if (hoursSinceQuota > 24) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sporttrack.quota_exceeded');
            localStorage.removeItem('sporttrack.quota_exceeded_at');
          }
        } else {
          // Quota exceeded recently - skip sync
          return;
        }
      } else {
        // No timestamp - skip sync
        return;
      }
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

    // Add to batch sync queue (will be sent once per minute)
    batchSyncService.addChange({
      activities: activitiesRef.current,
      settings: settingsRef.current,
      badges: badgesRef.current,
      challenges: challengesRef.current,
    });

    // Update hash to track changes
    lastSyncHashRef.current = createDataHash();
  };

  // Check if activities changed (added, edited, or deleted) - trigger debounced sync
  // Use refs to prevent unnecessary re-runs
  const prevActivitiesHashRef = useRef<string | null>(null);

  useEffect(() => {
    if (!allHydrated || !isAuthenticated || !isConfigured) {
      return;
    }

    const currentCount = activities.length;
    const lastCount = lastActivityCountRef.current;
    const currentHash = createDataHash();
    const lastHash = lastSyncHashRef.current;
    const prevHash = prevActivitiesHashRef.current;

    // If activity count changed OR content changed (edit), trigger debounced sync
    const countChanged = currentCount !== lastCount;
    const contentChanged =
      lastHash !== null && currentHash !== lastHash && currentHash !== prevHash;

    // Only proceed if there's an actual change
    if ((countChanged || contentChanged) && lastCount >= 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_ACTIVITY_ADDED_KEY, String(Date.now()));
      }

      // Add to batch sync queue
      addToBatchSync();

      // Update hash ref to prevent duplicate triggers
      prevActivitiesHashRef.current = currentHash;
    }

    lastActivityCountRef.current = currentCount;
  }, [activities, allHydrated, isAuthenticated, isConfigured]);

  // Check if settings changed (custom activities, theme, language, etc.) - trigger debounced sync
  useEffect(() => {
    if (!allHydrated || !isAuthenticated || !isConfigured) {
      return;
    }

    const currentCustomActivitiesCount = settings?.customActivities?.length || 0;
    const lastCustomCount = lastCustomActivitiesCountRef.current;
    const currentHash = createDataHash();
    const lastHash = lastSyncHashRef.current;

    // If custom activities count changed OR settings content changed (theme, language, etc.), trigger debounced sync
    const customActivitiesCountChanged =
      currentCustomActivitiesCount !== lastCustomCount && lastCustomCount >= 0;
    const settingsContentChanged = lastHash !== null && currentHash !== lastHash;

    if (customActivitiesCountChanged || settingsContentChanged) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_ACTIVITY_ADDED_KEY, String(Date.now()));
        // Settings change detected, adding to batch sync
      }

      // Add to batch sync queue
      addToBatchSync();
    }

    lastCustomActivitiesCountRef.current = currentCustomActivitiesCount;
  }, [settings, allHydrated, isAuthenticated, isConfigured]);

  // Periodic check: runs every 60 seconds to check for changes
  // NOTE: This effect should NOT depend on activities, settings, badges, challenges
  // to prevent infinite loops. It uses refs to access current values instead.
  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !allHydrated) {
      if (periodicCheckRef.current) {
        clearInterval(periodicCheckRef.current);
        periodicCheckRef.current = null;
      }
      return;
    }

    // Check if quota is exceeded - disable periodic sync if so
    const quotaExceeded =
      typeof window !== 'undefined' && localStorage.getItem('sporttrack.quota_exceeded') === 'true';

    if (quotaExceeded) {
      // Check if quota error was more than 24 hours ago - allow retry
      const quotaExceededAt =
        typeof window !== 'undefined' ? localStorage.getItem('sporttrack.quota_exceeded_at') : null;

      if (quotaExceededAt) {
        const quotaDate = new Date(quotaExceededAt);
        const hoursSinceQuota = (Date.now() - quotaDate.getTime()) / (1000 * 60 * 60);

        // If quota error was more than 24 hours ago, clear the flag and allow sync
        if (hoursSinceQuota <= 24) {
          // Quota exceeded recently - disable periodic sync
          if (periodicCheckRef.current) {
            clearInterval(periodicCheckRef.current);
            periodicCheckRef.current = null;
          }
          return;
        } else {
          // Clear quota flag after 24 hours
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sporttrack.quota_exceeded');
            localStorage.removeItem('sporttrack.quota_exceeded_at');
          }
        }
      } else {
        // No timestamp - disable periodic sync
        if (periodicCheckRef.current) {
          clearInterval(periodicCheckRef.current);
          periodicCheckRef.current = null;
        }
        return;
      }
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
      // Check if quota is exceeded - disable auto-sync if so
      const quotaExceeded =
        typeof window !== 'undefined' &&
        localStorage.getItem('sporttrack.quota_exceeded') === 'true';

      if (quotaExceeded) {
        // Check if quota error was more than 24 hours ago - allow retry
        const quotaExceededAt =
          typeof window !== 'undefined'
            ? localStorage.getItem('sporttrack.quota_exceeded_at')
            : null;

        if (quotaExceededAt) {
          const quotaDate = new Date(quotaExceededAt);
          const hoursSinceQuota = (Date.now() - quotaDate.getTime()) / (1000 * 60 * 60);

          // If quota error was more than 24 hours ago, clear the flag and allow sync
          if (hoursSinceQuota > 24) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('sporttrack.quota_exceeded');
              localStorage.removeItem('sporttrack.quota_exceeded_at');
            }
          } else {
            // Quota exceeded recently - skip sync
            return;
          }
        } else {
          // No timestamp - skip sync
          return;
        }
      }

      // Check if there are changes
      if (!hasChangesSinceLastSync()) {
        // Periodic check: No changes detected, skipping sync
        return;
      }

      // Check if an activity was added recently (within last 5 minutes)
      // This allows periodic sync to catch up on changes even if debounced sync was skipped
      const lastActivityAdded =
        typeof window !== 'undefined'
          ? parseInt(localStorage.getItem(LAST_ACTIVITY_ADDED_KEY) || '0', 10)
          : 0;
      const now = Date.now();
      const timeSinceActivityAdded = now - lastActivityAdded;
      const FIVE_MINUTES_MS = 5 * 60 * 1000;

      // Only sync if activity was added recently (within last 5 minutes) OR if it's been more than 10 minutes since last sync
      const lastSyncTime =
        typeof window !== 'undefined'
          ? parseInt(localStorage.getItem(LAST_SYNC_TIME_KEY) || '0', 10)
          : 0;
      const timeSinceLastSync = now - lastSyncTime;
      const TEN_MINUTES_MS = 10 * 60 * 1000;

      if (
        lastActivityAdded > 0 &&
        timeSinceActivityAdded > FIVE_MINUTES_MS &&
        timeSinceLastSync < TEN_MINUTES_MS
      ) {
        // Periodic check: No recent activity and recent sync, skipping
        return;
      }

      // Add to batch sync queue instead of syncing immediately
      // Batch sync will handle sending once per minute
      batchSyncService.addChange({
        activities: activitiesRef.current,
        settings: settingsRef.current,
        badges: badgesRef.current,
        challenges: challengesRef.current,
      });

      // Update hash to track changes
      lastSyncHashRef.current = createDataHash();

      // Update last sync time
      const syncTime = Date.now();
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_SYNC_TIME_KEY, String(syncTime));
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
    // CRITICAL: Only depend on authentication and hydration state
    // Do NOT depend on activities, settings, badges, or challenges
    // to prevent infinite loops. The periodic check uses refs to access current values.
  }, [isAuthenticated, isConfigured, allHydrated]);

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
    // Flush batch sync immediately
    await batchSyncService.flushBatch();
  };

  return {
    flushPendingSync,
  };
}
