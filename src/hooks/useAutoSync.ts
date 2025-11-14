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
  }>({
    activities: 0,
    settings: null,
    badges: 0,
    challenges: 0,
  });

  const allHydrated =
    activitiesHydrated && settingsHydrated && badgesHydrated && challengesHydrated;

  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !allHydrated) {
      return;
    }

    // Check if anything changed
    const activitiesChanged = activities.length !== lastSyncRef.current.activities;
    const settingsChanged =
      settings !== null && JSON.stringify(settings) !== lastSyncRef.current.settings;
    const badgesChanged = badges.length !== lastSyncRef.current.badges;
    const challengesChanged = challenges.length !== lastSyncRef.current.challenges;

    if (!activitiesChanged && !settingsChanged && !badgesChanged && !challengesChanged) {
      return;
    }

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout for debounced sync
    syncTimeoutRef.current = setTimeout(() => {
      syncToCloud({
        activities,
        settings,
        badges,
        challenges,
      }).catch((error) => {
        console.error('Auto-sync failed:', error);
      });

      // Update last sync ref
      lastSyncRef.current = {
        activities: activities.length,
        settings: settings ? JSON.stringify(settings) : null,
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
