/**
 * Cloud Sync Listener Hook
 * Listens to cloud changes and updates local stores
 * Handles initial sync conflict detection on login
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { cloudSyncService } from '@/lib/cloudSync/syncService';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import type { CloudData } from '@/lib/cloudSync/types';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';
const INITIAL_SYNC_COMPLETE_KEY = 'sporttrack_initial_sync_complete';

/**
 * Check if local and cloud data have conflicts
 */
function hasConflicts(
  local: {
    activities: unknown[];
    settings: unknown | null;
    badges: unknown[];
    challenges: unknown[];
  },
  cloud: CloudData
): boolean {
  // Check if both have data
  const localHasData =
    local.activities.length > 0 ||
    local.badges.length > 0 ||
    local.challenges.length > 0 ||
    local.settings !== null;
  const cloudHasData =
    (cloud.activities?.length || 0) > 0 ||
    (cloud.badges?.length || 0) > 0 ||
    (cloud.challenges?.length || 0) > 0 ||
    cloud.settings !== null;

  // If one is empty, no conflict
  if (!localHasData || !cloudHasData) {
    return false;
  }

  // Both have data, check if they differ
  return (
    local.activities.length !== (cloud.activities?.length || 0) ||
    local.badges.length !== (cloud.badges?.length || 0) ||
    local.challenges.length !== (cloud.challenges?.length || 0) ||
    JSON.stringify(local.settings) !== JSON.stringify(cloud.settings)
  );
}

export function useCloudSyncListener() {
  const { isAuthenticated, isConfigured } = useAuth();
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated, saveSettings } = useSettings();
  const { badges, hydrated: badgesHydrated } = useBadges();
  const { challenges, hydrated: challengesHydrated } = useChallenges();

  // Use refs to avoid re-subscribing on every change
  const activitiesRef = useRef(activities);
  const settingsRef = useRef(settings);
  const badgesRef = useRef(badges);
  const challengesRef = useRef(challenges);
  const saveSettingsRef = useRef(saveSettings);
  const initialSyncDoneRef = useRef(false);

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
    saveSettingsRef.current = saveSettings;
  }, [saveSettings]);

  const allHydrated =
    activitiesHydrated && settingsHydrated && badgesHydrated && challengesHydrated;

  // Reset initial sync flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      initialSyncDoneRef.current = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(INITIAL_SYNC_COMPLETE_KEY);
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !allHydrated) {
      return;
    }

    console.log('👂 Setting up cloud sync listener...');

    const unsubscribe = cloudSyncService.subscribeToCloud((cloudData: CloudData | null) => {
      if (!cloudData) {
        console.log('📭 No cloud data available');
        // If no cloud data and local has data, mark initial sync as complete
        // useAutoSync will handle uploading local data
        if (!initialSyncDoneRef.current) {
          initialSyncDoneRef.current = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
          }
        }
        return;
      }

      console.log('📥 Cloud data received:', {
        activities: cloudData.activities?.length || 0,
        settings: cloudData.settings ? 'present' : 'null',
        badges: cloudData.badges?.length || 0,
        challenges: cloudData.challenges?.length || 0,
      });

      // Use refs to get current values without causing re-renders
      const currentActivities = activitiesRef.current;
      const currentSettings = settingsRef.current;
      const currentBadges = badgesRef.current;
      const currentChallenges = challengesRef.current;
      const currentSaveSettings = saveSettingsRef.current;

      const localData = {
        activities: currentActivities,
        settings: currentSettings,
        badges: currentBadges,
        challenges: currentChallenges,
      };

      // Check if this is the initial sync (first time after login)
      const isInitialSync = !initialSyncDoneRef.current;
      const initialSyncComplete =
        typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

      if (isInitialSync && !initialSyncComplete) {
        console.log('🔍 Initial sync: Checking for conflicts...');

        // Check if both local and cloud have data
        const localHasData =
          localData.activities.length > 0 ||
          localData.badges.length > 0 ||
          localData.challenges.length > 0 ||
          localData.settings !== null;
        const cloudHasData =
          (cloudData.activities?.length || 0) > 0 ||
          (cloudData.badges?.length || 0) > 0 ||
          (cloudData.challenges?.length || 0) > 0 ||
          cloudData.settings !== null;

        if (localHasData && cloudHasData) {
          // Both have data, check for conflicts
          const conflicts = hasConflicts(localData, cloudData);
          if (conflicts) {
            console.log('⚠️ Conflict detected on initial sync! Storing conflict data...');
            // Store conflict data for CloudSyncSettings to handle
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                CONFLICT_STORAGE_KEY,
                JSON.stringify({
                  local: {
                    activities: localData.activities,
                    settings: localData.settings,
                    badges: localData.badges,
                    challenges: localData.challenges,
                  },
                  cloud: {
                    activities: cloudData.activities || [],
                    settings: cloudData.settings || null,
                    badges: cloudData.badges || [],
                    challenges: cloudData.challenges || [],
                  },
                })
              );
            }
            // Don't apply cloud data yet, wait for user to resolve conflict
            initialSyncDoneRef.current = true;
            if (typeof window !== 'undefined') {
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
            }
            return;
          }
        }

        // No conflict or one side is empty
        if (cloudHasData && !localHasData) {
          // Cloud has data, local doesn't - use cloud
          console.log('📥 Initial sync: Using cloud data (local is empty)');
          // Apply cloud data
          if (cloudData.settings) {
            currentSaveSettings(cloudData.settings as any);
          }
          // Note: Activities, badges, challenges would need bulk update methods
        } else if (!cloudHasData && localHasData) {
          // Local has data, cloud doesn't - use local (useAutoSync will upload)
          console.log('📤 Initial sync: Using local data (cloud is empty)');
        } else {
          // Both empty or same - no action needed
          console.log('✅ Initial sync: No data or already in sync');
        }

        initialSyncDoneRef.current = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
        }
        return;
      }

      // Regular sync (not initial) - only sync settings for now
      if (cloudData.settings) {
        // Normalize both settings objects for comparison (handle undefined vs null)
        const normalizeSettings = (s: any) => {
          if (!s) return null;
          return {
            name: s.name || '',
            dailyTarget: s.dailyTarget || 10000,
            customActivities: s.customActivities || [],
            mood: s.mood !== undefined ? s.mood : null,
          };
        };

        const normalizedCloud = normalizeSettings(cloudData.settings);
        const normalizedLocal = normalizeSettings(currentSettings);

        const cloudSettingsStr = JSON.stringify(normalizedCloud);
        const localSettingsStr = JSON.stringify(normalizedLocal);

        if (cloudSettingsStr !== localSettingsStr) {
          console.log('🔄 Updating settings from cloud (different from local)');
          console.log('Cloud:', normalizedCloud);
          console.log('Local:', normalizedLocal);
          currentSaveSettings(cloudData.settings as any);
        } else {
          console.log('✅ Settings already in sync (no update needed)');
        }
      } else {
        console.log('ℹ️ No settings in cloud data');
      }

      // Note: Activities, badges, and challenges sync would require bulk update methods
      // For now, we only sync settings to avoid infinite loops
    });

    return () => {
      console.log('🔇 Cleaning up cloud sync listener');
      unsubscribe();
    };
  }, [isAuthenticated, isConfigured, allHydrated]); // Removed activities, settings, badges, challenges, saveSettings from dependencies
}
