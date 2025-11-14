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
import { useToaster } from '@/components/Toaster';
import { useI18n } from '@/lib/i18n';
import { STORAGE_KEYS } from '@/lib/constants';
import type { CloudData } from '@/lib/cloudSync/types';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';
const INITIAL_SYNC_COMPLETE_KEY = 'sporttrack_initial_sync_complete';

/**
 * Check if local data is empty (all zeros)
 */
function isLocalEmpty(local: {
  activities: unknown[];
  badges: unknown[];
  challenges: unknown[];
}): boolean {
  return (
    local.activities.length === 0 && local.badges.length === 0 && local.challenges.length === 0
  );
}

/**
 * Check if cloud data is empty (all zeros)
 */
function isCloudEmpty(cloud: CloudData): boolean {
  return (
    (cloud.activities?.length || 0) === 0 &&
    (cloud.badges?.length || 0) === 0 &&
    (cloud.challenges?.length || 0) === 0
  );
}

/**
 * Normalize settings for comparison (handle undefined vs null, remove undefined fields, ignore metadata)
 * Also sorts customActivities arrays for consistent comparison
 */
function normalizeSettingsForComparison(settings: unknown | null): string {
  if (!settings || typeof settings !== 'object') {
    return JSON.stringify({ name: '', dailyTarget: 10000, customActivities: [], mood: null });
  }
  const s = settings as Record<string, unknown>;

  // Sort customActivities by id for consistent comparison
  const customActivities = Array.isArray(s.customActivities) ? s.customActivities : [];
  const sortedCustomActivities = customActivities
    .map((item) => {
      if (typeof item === 'object' && item !== null && 'id' in item) {
        return item;
      }
      return item;
    })
    .sort((a, b) => {
      const aId = typeof a === 'object' && a !== null && 'id' in a ? String(a.id) : '';
      const bId = typeof b === 'object' && b !== null && 'id' in b ? String(b.id) : '';
      return aId.localeCompare(bId);
    });

  return JSON.stringify({
    name: String(s.name || '').trim(),
    dailyTarget: Number(s.dailyTarget || 10000),
    customActivities: sortedCustomActivities,
    mood: s.mood !== undefined && s.mood !== null ? String(s.mood) : null,
  });
}

/**
 * Check if two arrays contain the same items (by ID)
 */
function arraysEqualById<T extends { id?: string }>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  const ids1 = new Set(arr1.map((item) => item.id).filter(Boolean));
  const ids2 = new Set(arr2.map((item) => item.id).filter(Boolean));
  if (ids1.size !== ids2.size) {
    return false;
  }
  for (const id of ids1) {
    if (!ids2.has(id)) {
      return false;
    }
  }
  return true;
}

/**
 * Check if local and cloud data have conflicts
 * Returns false if local is empty (0 activities, 0 badges, 0 challenges) - no conflict, use cloud
 * Returns false if data is identical (same IDs and content) - no conflict
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
  // If local is empty (0 activities, 0 badges, 0 challenges), no conflict - use cloud automatically
  if (isLocalEmpty(local)) {
    return false;
  }

  // If cloud is empty, no conflict - use local (will be uploaded automatically)
  if (isCloudEmpty(cloud)) {
    return false;
  }

  // Both have data, check if they are actually different
  // First check lengths (quick check)
  const cloudActivitiesLength = cloud.activities?.length || 0;
  const cloudBadgesLength = cloud.badges?.length || 0;
  const cloudChallengesLength = cloud.challenges?.length || 0;

  if (
    local.activities.length !== cloudActivitiesLength ||
    local.badges.length !== cloudBadgesLength ||
    local.challenges.length !== cloudChallengesLength
  ) {
    return true; // Different lengths = conflict
  }

  // Check if activities are the same (by ID)
  const localActivities = local.activities as Array<{ id?: string }>;
  const cloudActivities = (cloud.activities || []) as Array<{ id?: string }>;
  if (!arraysEqualById(localActivities, cloudActivities)) {
    return true; // Different activities = conflict
  }

  // Check if badges are the same (by ID)
  const localBadges = local.badges as Array<{ id?: string }>;
  const cloudBadges = (cloud.badges || []) as Array<{ id?: string }>;
  if (!arraysEqualById(localBadges, cloudBadges)) {
    return true; // Different badges = conflict
  }

  // Check if challenges are the same (by ID)
  const localChallenges = local.challenges as Array<{ id?: string }>;
  const cloudChallenges = (cloud.challenges || []) as Array<{ id?: string }>;
  if (!arraysEqualById(localChallenges, cloudChallenges)) {
    return true; // Different challenges = conflict
  }

  // Check settings (normalize first to handle undefined vs null)
  const normalizedLocalSettings = normalizeSettingsForComparison(local.settings);
  const normalizedCloudSettings = normalizeSettingsForComparison(cloud.settings);
  if (normalizedLocalSettings !== normalizedCloudSettings) {
    return true; // Different settings = conflict
  }

  // All checks passed - data is identical, no conflict
  return false;
}

export function useCloudSyncListener() {
  const { isAuthenticated, isConfigured } = useAuth();
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated, saveSettings } = useSettings();
  const { badges, hydrated: badgesHydrated } = useBadges();
  const { challenges, hydrated: challengesHydrated } = useChallenges();
  const { showToast } = useToaster();
  const { t, lang } = useI18n();

  // Use refs to avoid re-subscribing on every change
  const activitiesRef = useRef(activities);
  const settingsRef = useRef(settings);
  const badgesRef = useRef(badges);
  const challengesRef = useRef(challenges);
  const saveSettingsRef = useRef(saveSettings);
  const showToastRef = useRef(showToast);
  const tRef = useRef(t);
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

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

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

    // Set a timeout to mark initial sync as complete if listener doesn't fire within 5 seconds
    // This handles cases where Firebase connection is slow or fails
    const fallbackTimeout = setTimeout(() => {
      if (!initialSyncDoneRef.current) {
        console.log('⏱️ Fallback: Marking initial sync as complete (listener timeout)');
        initialSyncDoneRef.current = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
        }
      }
    }, 5000);

    const unsubscribe = cloudSyncService.subscribeToCloud((cloudData: CloudData | null) => {
      // Clear fallback timeout since listener fired
      clearTimeout(fallbackTimeout);

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

      if (!cloudData) {
        // If no cloud data, mark initial sync as complete
        // useAutoSync will handle uploading local data if it exists
        if (!initialSyncDoneRef.current) {
          initialSyncDoneRef.current = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
          }
        }
        return;
      }

      // Check if this is the initial sync (first time after login)
      const isInitialSync = !initialSyncDoneRef.current;
      const initialSyncComplete =
        typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

      if (isInitialSync && !initialSyncComplete) {
        // Check if local is empty (0 activities, 0 badges, 0 challenges)
        const localIsEmpty = isLocalEmpty(localData);
        const cloudIsEmpty = isCloudEmpty(cloudData);

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

        console.log('🔍 Initial sync check:', {
          localIsEmpty,
          cloudIsEmpty,
          localHasData,
          cloudHasData,
          localActivities: localData.activities.length,
          cloudActivities: cloudData.activities?.length || 0,
          localBadges: localData.badges.length,
          cloudBadges: cloudData.badges?.length || 0,
        });

        // If local is empty (0 activities, badges, challenges), automatically use cloud - no conflict
        if (localIsEmpty && cloudHasData) {
          console.log(
            '📥 Initial sync: Local is empty (0 activities/badges/challenges), cloud has data - downloading from cloud automatically'
          );

          // Apply cloud data directly to localStorage
          try {
            if (typeof window !== 'undefined') {
              // Write activities
              if (cloudData.activities && cloudData.activities.length > 0) {
                localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(cloudData.activities));
                console.log('✅ Downloaded activities:', cloudData.activities.length);
              }

              // Write badges
              if (cloudData.badges && cloudData.badges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(cloudData.badges));
                console.log('✅ Downloaded badges:', cloudData.badges.length);
              }

              // Write challenges
              if (cloudData.challenges && cloudData.challenges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(cloudData.challenges));
                console.log('✅ Downloaded challenges:', cloudData.challenges.length);
              }

              // Apply settings
              if (cloudData.settings) {
                // Type guard for UserSettings
                const isUserSettings = (
                  s: unknown
                ): s is import('@/lib/settingsStore').UserSettings => {
                  return (
                    typeof s === 'object' &&
                    s !== null &&
                    ('name' in s || 'dailyTarget' in s || 'customActivities' in s || 'mood' in s)
                  );
                };
                if (isUserSettings(cloudData.settings)) {
                  currentSaveSettings(cloudData.settings);
                }
                console.log('✅ Downloaded settings');
              }

              // Mark initial sync as complete
              initialSyncDoneRef.current = true;
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');

              // Show success toast
              showToastRef.current(tRef.current('cloudSync.syncedFromCloud'), 'success');

              // Reload page to apply changes (stores will read from localStorage)
              console.log('🔄 Reloading page to apply cloud data...');
              setTimeout(() => {
                window.location.reload();
              }, 500);

              return; // Exit early, page will reload
            }
          } catch (error) {
            console.error('❌ Failed to download cloud data:', error);
            showToastRef.current(tRef.current('cloudSync.syncFailed') || 'Sync failed', 'error');
          }
        }

        // If cloud is empty and local has data, automatically upload local to cloud - no conflict
        if (cloudIsEmpty && localHasData && !localIsEmpty) {
          console.log(
            '📤 Initial sync: Cloud is empty (0 activities/badges/challenges), local has data - uploading local data to cloud automatically'
          );

          // Mark initial sync as complete and let auto-sync handle the upload
          initialSyncDoneRef.current = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
          }

          // Show info toast
          showToastRef.current(
            lang === 'tr'
              ? 'Yerel verileriniz buluta yüklenecek'
              : 'Your local data will be uploaded to cloud',
            'info'
          );

          return; // Exit early, auto-sync will upload
        }

        // If both have data, check for conflicts (but only if local is not empty)
        if (localHasData && cloudHasData && !localIsEmpty && !cloudIsEmpty) {
          // Both have data, check for conflicts
          const conflicts = hasConflicts(localData, cloudData);
          const localSettingsNormalized = normalizeSettingsForComparison(localData.settings);
          const cloudSettingsNormalized = normalizeSettingsForComparison(cloudData.settings);
          const settingsMatch = localSettingsNormalized === cloudSettingsNormalized;

          console.log('🔍 Initial sync conflict check:', {
            conflicts,
            localActivities: localData.activities.length,
            cloudActivities: cloudData.activities?.length || 0,
            localBadges: localData.badges.length,
            cloudBadges: cloudData.badges?.length || 0,
            localChallenges: localData.challenges.length,
            cloudChallenges: cloudData.challenges?.length || 0,
            settingsMatch,
            localSettings: localSettingsNormalized,
            cloudSettings: cloudSettingsNormalized,
          });

          if (conflicts) {
            // Store conflict data for ConflictResolutionManager to handle
            const conflictData = {
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
            };

            console.log('⚠️ CONFLICT DETECTED - Storing conflict data:', {
              local: {
                activities: conflictData.local.activities.length,
                badges: conflictData.local.badges.length,
                challenges: conflictData.local.challenges.length,
              },
              cloud: {
                activities: conflictData.cloud.activities.length,
                badges: conflictData.cloud.badges.length,
                challenges: conflictData.cloud.challenges.length,
              },
            });

            if (typeof window !== 'undefined') {
              localStorage.setItem(CONFLICT_STORAGE_KEY, JSON.stringify(conflictData));
              // Trigger a custom event to notify ConflictResolutionManager
              window.dispatchEvent(new CustomEvent('sporttrack:conflict-detected'));
            }

            // Don't apply cloud data yet, wait for user to resolve conflict
            initialSyncDoneRef.current = true;
            if (typeof window !== 'undefined') {
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
            }

            // Show toast notification
            showToastRef.current(tRef.current('cloudSync.conflictDetected'), 'warning');

            return;
          }
        }

        // No conflict or one side is empty
        if (cloudHasData && !localHasData && !localIsEmpty) {
          // Cloud has data, local doesn't - use cloud
          console.log('📥 Initial sync: Cloud has data, local is empty - downloading from cloud', {
            cloudActivities: cloudData.activities?.length || 0,
            cloudBadges: cloudData.badges?.length || 0,
            cloudChallenges: cloudData.challenges?.length || 0,
            hasSettings: !!cloudData.settings,
          });

          // Apply cloud data directly to localStorage (similar to conflict resolution)
          try {
            if (typeof window !== 'undefined') {
              // Write activities
              if (cloudData.activities && cloudData.activities.length > 0) {
                localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(cloudData.activities));
                console.log('✅ Downloaded activities:', cloudData.activities.length);
              }

              // Write badges
              if (cloudData.badges && cloudData.badges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(cloudData.badges));
                console.log('✅ Downloaded badges:', cloudData.badges.length);
              }

              // Write challenges
              if (cloudData.challenges && cloudData.challenges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(cloudData.challenges));
                console.log('✅ Downloaded challenges:', cloudData.challenges.length);
              }

              // Apply settings
              if (cloudData.settings) {
                // Type guard for UserSettings
                const isUserSettings = (
                  s: unknown
                ): s is import('@/lib/settingsStore').UserSettings => {
                  return (
                    typeof s === 'object' &&
                    s !== null &&
                    ('name' in s || 'dailyTarget' in s || 'customActivities' in s || 'mood' in s)
                  );
                };
                if (isUserSettings(cloudData.settings)) {
                  currentSaveSettings(cloudData.settings);
                }
                console.log('✅ Downloaded settings');
              }

              // Mark initial sync as complete
              initialSyncDoneRef.current = true;
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');

              // Show success toast
              showToastRef.current(tRef.current('cloudSync.syncedFromCloud'), 'success');

              // Reload page to apply changes (stores will read from localStorage)
              console.log('🔄 Reloading page to apply cloud data...');
              setTimeout(() => {
                window.location.reload();
              }, 500);

              return; // Exit early, page will reload
            }
          } catch (error) {
            console.error('❌ Failed to download cloud data:', error);
            showToastRef.current(tRef.current('cloudSync.syncFailed') || 'Sync failed', 'error');
          }
        } else if (!cloudHasData && localHasData && !localIsEmpty) {
          // Local has data, cloud doesn't - use local (useAutoSync will upload automatically)
          console.log(
            '📤 Initial sync: Local has data, cloud is empty - will upload local data automatically'
          );
        } else if (cloudIsEmpty && localIsEmpty) {
          // Both empty (0 activities, 0 badges, 0 challenges) - useAutoSync will handle if local has settings
          console.log(
            '✅ Initial sync: Both empty (0 activities/badges/challenges) - useAutoSync will handle settings sync'
          );
        } else {
          // Both same or no action needed
          console.log('✅ Initial sync: Both same or no action needed');
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
        const normalizeSettings = (
          s: unknown
        ): {
          name: string;
          dailyTarget: number;
          customActivities: unknown[];
          mood: string | null;
        } | null => {
          if (!s || typeof s !== 'object') return null;
          const settings = s as Record<string, unknown>;
          return {
            name: typeof settings.name === 'string' ? settings.name : '',
            dailyTarget: typeof settings.dailyTarget === 'number' ? settings.dailyTarget : 10000,
            customActivities: Array.isArray(settings.customActivities)
              ? settings.customActivities
              : [],
            mood: settings.mood !== undefined ? (settings.mood as string | null) : null,
          };
        };

        const normalizedCloud = normalizeSettings(cloudData.settings);
        const normalizedLocal = normalizeSettings(currentSettings);

        const cloudSettingsStr = JSON.stringify(normalizedCloud);
        const localSettingsStr = JSON.stringify(normalizedLocal);

        if (cloudSettingsStr !== localSettingsStr) {
          // Type guard for UserSettings
          const isUserSettings = (s: unknown): s is import('@/lib/settingsStore').UserSettings => {
            return (
              typeof s === 'object' &&
              s !== null &&
              ('name' in s || 'dailyTarget' in s || 'customActivities' in s || 'mood' in s)
            );
          };
          if (isUserSettings(cloudData.settings)) {
            currentSaveSettings(cloudData.settings);
          }
          showToastRef.current(tRef.current('cloudSync.syncedFromCloud'), 'info');
        }
      }

      // Note: Activities, badges, and challenges sync would require bulk update methods
      // For now, we only sync settings to avoid infinite loops
    });

    return () => {
      clearTimeout(fallbackTimeout);
      unsubscribe();
    };
  }, [isAuthenticated, isConfigured, allHydrated]); // Removed activities, settings, badges, challenges, saveSettings from dependencies
}
