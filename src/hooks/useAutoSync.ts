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

export function useAutoSync() {
  const { isAuthenticated, isConfigured } = useAuth();
  const { syncToCloud } = useCloudSync();
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const { badges, hydrated: badgesHydrated } = useBadges();
  const { challenges, hydrated: challengesHydrated } = useChallenges();

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<{
    activities: number;
    settings: string | null;
    badges: number;
    challenges: number;
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
      console.log('⏸️ Auto-sync paused:', {
        initialSyncComplete,
        hasPendingConflict,
      });
      return;
    }

    // Initialize lastSyncRef on first sync
    if (lastSyncRef.current === null) {
      lastSyncRef.current = {
        activities: activities.length,
        settings: settings ? JSON.stringify(settings) : null,
        badges: badges.length,
        challenges: challenges.length,
      };
      // Don't sync on initial load, wait for changes
      isInitialSyncRef.current = false;
      return;
    }

    // Check if anything changed
    const activitiesChanged = activities.length !== lastSyncRef.current.activities;
    const currentSettingsStr = settings ? JSON.stringify(settings) : null;
    const settingsChanged = currentSettingsStr !== lastSyncRef.current.settings;
    const badgesChanged = badges.length !== lastSyncRef.current.badges;
    const challengesChanged = challenges.length !== lastSyncRef.current.challenges;

    // If nothing changed, don't sync (prevents infinite loops)
    if (!activitiesChanged && !settingsChanged && !badgesChanged && !challengesChanged) {
      console.log('⏭️ No changes detected, skipping sync');
      return;
    }

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout for debounced sync
    syncTimeoutRef.current = setTimeout(() => {
      const settingsStr = settings ? JSON.stringify(settings) : null;

      console.log('🔄 Auto-sync triggered:', {
        activities: activities.length,
        settings: settings ? 'present' : 'null',
        badges: badges.length,
        challenges: challenges.length,
      });

      syncToCloud({
        activities,
        settings,
        badges,
        challenges,
      }).catch((error) => {
        console.error('❌ Auto-sync failed:', error);
      });

      // Update last sync ref
      lastSyncRef.current = {
        activities: activities.length,
        settings: settingsStr,
        badges: badges.length,
        challenges: challenges.length,
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
