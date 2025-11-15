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

// Debounce delay: wait 5 seconds after activity added before syncing
const DEBOUNCE_DELAY_MS = 5000;
// Periodic check interval: check every 30 seconds for changes
const PERIODIC_CHECK_INTERVAL_MS = 30000;

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

  // Create a simple hash of current data for change detection
  const createDataHash = (): string => {
    return JSON.stringify({
      activities: activitiesRef.current.length,
      badges: badgesRef.current.length,
      challenges: challengesRef.current.length,
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

    // Don't sync if initial sync is not complete or if there's a pending conflict
    if (!initialSyncComplete || hasPendingConflict) {
      return;
    }

    // Check if there are changes
    if (!hasChangesSinceLastSync()) {
      console.log('⏭️ No changes detected, skipping sync');
      return;
    }

    // Prevent concurrent syncs
    if (isSyncingRef.current) {
      console.log('⏭️ Auto-sync skipped: Already syncing');
      return;
    }

    isSyncingRef.current = true;
    console.log('🚀 Starting debounced sync...', {
      activities: activitiesRef.current.length,
      settings: settingsRef.current ? 'present' : 'null',
      badges: badgesRef.current.length,
      challenges: challengesRef.current.length,
    });

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

      console.log('✅ Debounced sync başarılı!', {
        syncTime: new Date(syncTime).toLocaleTimeString(),
      });
    } catch (error) {
      console.error('❌ Debounced sync failed:', error);
    } finally {
      isSyncingRef.current = false;
    }
  };

  // Check if activity was added (count increased) - trigger debounced sync
  useEffect(() => {
    if (!allHydrated || !isAuthenticated || !isConfigured) {
      return;
    }

    const currentCount = activities.length;
    const lastCount = lastActivityCountRef.current;

    // If activity count increased, trigger debounced sync
    if (currentCount > lastCount && lastCount > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_ACTIVITY_ADDED_KEY, String(Date.now()));
        console.log('📝 Activity added detected, scheduling debounced sync in 5 seconds');
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
  }, [activities.length, allHydrated, isAuthenticated, isConfigured]);

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

    // Don't sync if initial sync is not complete or if there's a pending conflict
    if (!initialSyncComplete || hasPendingConflict) {
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
        console.log('⏭️ Periodic check: No changes detected, skipping sync');
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
        console.log('⏭️ Periodic check: No recent activity, skipping sync');
        return;
      }

      // Prevent concurrent syncs
      if (isSyncingRef.current) {
        console.log('⏭️ Periodic check: Already syncing, skipping');
        return;
      }

      isSyncingRef.current = true;
      console.log('🚀 Periodic check: Starting sync...', {
        activities: activitiesRef.current.length,
        settings: settingsRef.current ? 'present' : 'null',
        badges: badgesRef.current.length,
        challenges: challengesRef.current.length,
      });

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

        console.log('✅ Periodic check sync başarılı!', {
          syncTime: new Date(syncTime).toLocaleTimeString(),
        });
      } catch (error) {
        console.error('❌ Periodic check sync failed:', error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Start periodic check (every 30 seconds)
    periodicCheckRef.current = setInterval(() => {
      performPeriodicCheck();
    }, PERIODIC_CHECK_INTERVAL_MS);

    console.log(
      `⏰ Periodic sync check started (every ${PERIODIC_CHECK_INTERVAL_MS / 1000} seconds)`
    );

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

  // Initialize last activity count and sync hash
  useEffect(() => {
    if (allHydrated) {
      lastActivityCountRef.current = activities.length;
      if (lastSyncHashRef.current === null) {
        lastSyncHashRef.current = createDataHash();
      }
    }
  }, [allHydrated, activities.length]);
}
