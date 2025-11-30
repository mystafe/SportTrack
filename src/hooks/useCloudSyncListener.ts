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
  // Use exercises from new structure, fallback to activities for backward compatibility
  const hasExercises = (cloud.exercises?.length || 0) > 0 || (cloud.activities?.length || 0) > 0;
  const hasBadges = (cloud.badges?.length || 0) > 0;
  const hasChallenges = (cloud.challenges?.length || 0) > 0;
  return !hasExercises && !hasBadges && !hasChallenges;
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
  // Use exercises from new structure, fallback to activities for backward compatibility
  const cloudExercises = (cloud.exercises || cloud.activities || []) as Array<{ id?: string }>;
  const cloudActivitiesLength = cloudExercises.length;
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
  if (!arraysEqualById(localActivities, cloudExercises)) {
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

  // Settings and activities sync automatically, so we don't compare them for conflicts
  // Only exercises, badges, and challenges are compared

  // All checks passed - data is identical, no conflict
  return false;
}

export function useCloudSyncListener() {
  const { isAuthenticated, isConfigured, user } = useAuth();
  const {
    activities,
    hydrated: activitiesHydrated,
    reloadFromStorage: reloadActivities,
  } = useActivities();
  const { settings, hydrated: settingsHydrated, saveSettings } = useSettings();
  const { badges, hydrated: badgesHydrated, reloadFromStorage: reloadBadges } = useBadges();
  const {
    challenges,
    hydrated: challengesHydrated,
    reloadFromStorage: reloadChallenges,
  } = useChallenges();
  const { showToast } = useToaster();
  const { t, lang } = useI18n();

  // Use refs to avoid re-subscribing on every change
  const activitiesRef = useRef(activities);
  const settingsRef = useRef(settings);
  const badgesRef = useRef(badges);
  const challengesRef = useRef(challenges);
  const saveSettingsRef = useRef(saveSettings);
  const reloadActivitiesRef = useRef(reloadActivities);
  const reloadBadgesRef = useRef(reloadBadges);
  const reloadChallengesRef = useRef(reloadChallenges);
  const showToastRef = useRef(showToast);
  const tRef = useRef(t);
  const initialSyncDoneRef = useRef(false);
  const isReloadingRef = useRef(false);
  const initialSyncCheckStartedRef = useRef(false);

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
    reloadActivitiesRef.current = reloadActivities;
  }, [reloadActivities]);

  useEffect(() => {
    reloadBadgesRef.current = reloadBadges;
  }, [reloadBadges]);

  useEffect(() => {
    reloadChallengesRef.current = reloadChallenges;
  }, [reloadChallenges]);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const allHydrated =
    activitiesHydrated && settingsHydrated && badgesHydrated && challengesHydrated;

  // Reset initial sync flag when user logs out OR when user changes
  // This ensures that each user gets a fresh initial sync check
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // User logged out - clear flags
      console.log('🔓 User logged out - clearing sync flags');
      initialSyncDoneRef.current = false;
      isReloadingRef.current = false;
      initialSyncCheckStartedRef.current = false;
      userIdRef.current = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(INITIAL_SYNC_COMPLETE_KEY);
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
        localStorage.removeItem('sporttrack_sync_in_progress');
      }
    } else if (user) {
      // User logged in - check if user changed
      const currentUserId = user.uid;
      if (userIdRef.current !== null && userIdRef.current !== currentUserId) {
        // User changed (different user logged in) - reset flags for new user
        console.log('👤 User changed - resetting initial sync flags', {
          oldUserId: userIdRef.current,
          newUserId: currentUserId,
        });
        initialSyncDoneRef.current = false;
        isReloadingRef.current = false;
        initialSyncCheckStartedRef.current = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem(INITIAL_SYNC_COMPLETE_KEY);
          localStorage.removeItem(CONFLICT_STORAGE_KEY);
        }
      } else if (userIdRef.current === null) {
        // First time detecting user after login - ensure flags are cleared
        console.log('👤 First login detected - ensuring sync flags are cleared', {
          userId: currentUserId,
        });
        initialSyncDoneRef.current = false;
        isReloadingRef.current = false;
        initialSyncCheckStartedRef.current = false;
        if (typeof window !== 'undefined') {
          // Don't remove if already removed, but ensure it's false
          const existing = localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY);
          if (existing === 'true') {
            // Clear stale flag silently
            localStorage.removeItem(INITIAL_SYNC_COMPLETE_KEY);
          }
          localStorage.removeItem(CONFLICT_STORAGE_KEY);
        }
      }
      userIdRef.current = currentUserId;
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !allHydrated) {
      return;
    }

    // Check if initial sync is already complete BEFORE starting
    // Use localStorage check only (refs reset on page reload)
    const initialSyncComplete =
      typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

    if (initialSyncComplete) {
      // Initial sync already complete (from previous page load), skip everything
      // Reset refs to match localStorage state
      initialSyncDoneRef.current = true;
      initialSyncCheckStartedRef.current = false;
      return;
    }

    // Prevent multiple simultaneous sync attempts
    // Check localStorage for a "sync in progress" flag to prevent race conditions
    const syncInProgress =
      typeof window !== 'undefined' &&
      localStorage.getItem('sporttrack_sync_in_progress') === 'true';

    if (initialSyncCheckStartedRef.current || isReloadingRef.current || syncInProgress) {
      return;
    }

    // CRITICAL: Double-check initial sync status before starting
    // This prevents race conditions where localStorage was updated between checks
    const doubleCheckInitialSyncComplete =
      typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

    if (doubleCheckInitialSyncComplete) {
      initialSyncDoneRef.current = true;
      initialSyncCheckStartedRef.current = false;
      return;
    }

    // Mark that we're starting the initial sync check
    initialSyncCheckStartedRef.current = true;

    // CRITICAL FIX: Force initial sync check immediately on login
    // Download cloud data directly without checking local data
    const performInitialSyncCheck = async () => {
      // CRITICAL: Double-check initial sync status at the start of function
      // This prevents race conditions where localStorage was updated between checks
      const tripleCheckInitialSyncComplete =
        typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

      if (tripleCheckInitialSyncComplete || initialSyncDoneRef.current) {
        // Initial sync already complete, skipping
        initialSyncCheckStartedRef.current = false;
        initialSyncDoneRef.current = true;
        return;
      }

      // Prevent multiple simultaneous sync attempts
      if (isReloadingRef.current) {
        initialSyncCheckStartedRef.current = false;
        return;
      }

      // CRITICAL: Check one more time before starting (race condition prevention)
      const finalCheckInitialSyncComplete =
        typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

      if (finalCheckInitialSyncComplete) {
        initialSyncCheckStartedRef.current = false;
        initialSyncDoneRef.current = true;
        return;
      }

      // Force download from cloud immediately (with retry)
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries && !initialSyncDoneRef.current && !isReloadingRef.current) {
        try {
          const cloudData = await cloudSyncService.downloadFromCloud();
          const currentSaveSettings = saveSettingsRef.current;

          // If cloud has data, download and apply it directly (ignore local data)
          if (cloudData) {
            const cloudHasData =
              (cloudData.exercises?.length || 0) > 0 ||
              (cloudData.activities?.length || 0) > 0 ||
              (cloudData.badges?.length || 0) > 0 ||
              (cloudData.challenges?.length || 0) > 0 ||
              cloudData.settings !== null;

            if (cloudHasData) {
              // Prevent multiple reloads
              if (isReloadingRef.current) {
                return;
              }
              isReloadingRef.current = true;

              // Set sync in progress flag to prevent race conditions after reload
              if (typeof window !== 'undefined') {
                localStorage.setItem('sporttrack_sync_in_progress', 'true');
              }

              // Apply cloud data to localStorage, merging with local changes
              if (typeof window !== 'undefined') {
                // First, flush any pending batch sync changes to preserve local changes
                try {
                  const { batchSyncService } = await import('@/lib/cloudSync/batchSyncService');
                  await batchSyncService.flushBatch();
                } catch (flushError) {
                  console.warn('Failed to flush batch sync before download:', flushError);
                  // Continue anyway - we'll merge with local data
                }

                // Get current local data before downloading
                const localActivitiesStr = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
                const localActivities = localActivitiesStr ? JSON.parse(localActivitiesStr) : [];

                // Write activities (use exercises from new structure, fallback to activities for backward compatibility)
                const cloudExercises = (cloudData.exercises ||
                  cloudData.activities ||
                  []) as Array<unknown>;
                if (cloudExercises.length > 0) {
                  // Merge cloud data with local (preserve local changes that aren't in cloud)
                  const cloudActivitiesMap = new Map(cloudExercises.map((a: any) => [a.id, a]));
                  const mergedActivities = [
                    ...cloudExercises,
                    ...localActivities.filter((local: any) => !cloudActivitiesMap.has(local.id)),
                  ];
                  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(mergedActivities));
                } else if (localActivities.length > 0) {
                  // Cloud has no exercises, keep local
                  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(localActivities));
                } else {
                  // Both empty, clear
                  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([]));
                }

                // Write badges
                if (cloudData.badges && cloudData.badges.length > 0) {
                  localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(cloudData.badges));
                } else {
                  localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify([]));
                }

                // Write challenges
                if (cloudData.challenges && cloudData.challenges.length > 0) {
                  localStorage.setItem(
                    STORAGE_KEYS.CHALLENGES,
                    JSON.stringify(cloudData.challenges)
                  );
                } else {
                  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify([]));
                }

                // Apply settings (including custom activities and base activity overrides)
                if (cloudData.settings) {
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
                    // Also apply theme and language to localStorage for immediate effect
                    if (cloudData.settings.theme && typeof window !== 'undefined') {
                      localStorage.setItem(STORAGE_KEYS.THEME, cloudData.settings.theme);
                      // Apply theme immediately
                      const root = document.documentElement;
                      const systemPrefersDark = window.matchMedia(
                        '(prefers-color-scheme: dark)'
                      ).matches;
                      const isDark =
                        cloudData.settings.theme === 'dark' ||
                        (cloudData.settings.theme === 'system' && systemPrefersDark);
                      root.classList.toggle('dark', isDark);
                    }
                    if (cloudData.settings.language && typeof window !== 'undefined') {
                      localStorage.setItem(STORAGE_KEYS.LANGUAGE, cloudData.settings.language);
                      // Trigger language change event for cross-tab communication
                      window.dispatchEvent(
                        new StorageEvent('storage', {
                          key: STORAGE_KEYS.LANGUAGE,
                          newValue: cloudData.settings.language,
                        })
                      );
                      // Also trigger custom event for same-tab updates
                      window.dispatchEvent(
                        new CustomEvent('sporttrack:language-changed', {
                          detail: { language: cloudData.settings.language },
                        })
                      );
                    }
                  }
                }

                // Mark initial sync as complete
                initialSyncDoneRef.current = true;
                localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
                // Clear conflict storage if exists
                localStorage.removeItem(CONFLICT_STORAGE_KEY);

                // Reload stores from localStorage (no page reload needed)
                // Use setTimeout to prevent state update during render
                setTimeout(() => {
                  reloadActivitiesRef.current();
                  reloadBadgesRef.current();
                  reloadChallengesRef.current();

                  // Clear sync in progress flag after stores are reloaded
                  setTimeout(() => {
                    localStorage.removeItem('sporttrack_sync_in_progress');
                    isReloadingRef.current = false;
                    initialSyncCheckStartedRef.current = false;
                  }, 100);
                }, 0);
                return;
              }
            }
          }

          // If cloud is empty, mark as complete (local data will be uploaded by useAutoSync)
          initialSyncDoneRef.current = true;
          initialSyncCheckStartedRef.current = false;
          if (typeof window !== 'undefined') {
            localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
          }
          return;
        } catch (error) {
          // Log only in development
          if (process.env.NODE_ENV === 'development') {
            console.error(`Initial sync attempt ${retryCount + 1} failed:`, error);
          }
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          } else {
            // All retries failed - reset flag to allow retry later
            initialSyncCheckStartedRef.current = false;
            // Clear sync in progress flag
            if (typeof window !== 'undefined') {
              localStorage.removeItem('sporttrack_sync_in_progress');
            }
            // Mark as complete anyway to prevent infinite retries
            initialSyncDoneRef.current = true;
            if (typeof window !== 'undefined') {
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
            }
          }
        }
      }
    };

    // Perform initial sync check immediately
    // Use a flag to prevent multiple calls
    let isCancelled = false;
    performInitialSyncCheck()
      .then(() => {
        if (!isCancelled) {
          initialSyncCheckStartedRef.current = false;
        }
      })
      .catch(() => {
        if (!isCancelled) {
          initialSyncCheckStartedRef.current = false;
        }
      });

    // Check if initial sync is already complete - if so, don't subscribe to listener
    // Reuse the initialSyncComplete variable defined at the start of useEffect
    if (initialSyncComplete && initialSyncDoneRef.current) {
      // Initial sync already complete, skipping cloud listener subscription
      // Return cleanup function
      return () => {
        isCancelled = true;
        initialSyncCheckStartedRef.current = false;
      };
    }

    let unsubscribeFn: (() => void) | null = null;
    let isUnsubscribed = false;

    // Set a timeout to mark initial sync as complete if listener doesn't fire within 10 seconds
    // Increased timeout for slower connections
    const fallbackTimeout = setTimeout(() => {
      if (!initialSyncDoneRef.current && !isUnsubscribed) {
        // Timeout - mark as complete silently
        initialSyncDoneRef.current = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
        }
        // Unsubscribe if not already done
        if (unsubscribeFn && !isUnsubscribed) {
          unsubscribeFn();
          isUnsubscribed = true;
        }
      }
    }, 10000); // Increased to 10 seconds

    unsubscribeFn = cloudSyncService.subscribeToCloud((cloudData: CloudData | null) => {
      // Clear fallback timeout since listener fired
      clearTimeout(fallbackTimeout);

      // If already unsubscribed, don't process
      if (isUnsubscribed) {
        return;
      }

      // Prevent processing if performInitialSyncCheck is running or reloading
      if (initialSyncCheckStartedRef.current || isReloadingRef.current) {
        return;
      }

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

      // CRITICAL: Skip initial sync logic in subscribeToCloud callback
      // performInitialSyncCheck already handles initial sync and reload
      // This callback should ONLY handle real-time updates after initial sync is complete

      // Check if initial sync is already complete (use localStorage only, refs reset on reload)
      const initialSyncComplete =
        typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

      if (!initialSyncComplete) {
        // Initial sync not complete yet - performInitialSyncCheck will handle it
        // Don't process anything here to avoid duplicate reloads
        return;
      }

      // Initial sync is complete - update ref to match localStorage state
      initialSyncDoneRef.current = true;

      // Clear any stale conflict data and sync flags
      if (typeof window !== 'undefined') {
        const existingConflict = localStorage.getItem(CONFLICT_STORAGE_KEY);
        if (existingConflict) {
          // Clearing stale conflict data
          localStorage.removeItem(CONFLICT_STORAGE_KEY);
        }
        // Clear sync in progress flag if exists (shouldn't exist after initial sync)
        localStorage.removeItem('sporttrack_sync_in_progress');
      }

      // Regular sync (after initial sync) - sync settings only (no reload to avoid infinite loops)
      // This handles real-time updates from other devices
      // NOTE: We only sync settings here to avoid infinite reload loops
      // Activities, badges, and challenges will sync on next page load or manual sync
      if (initialSyncComplete && initialSyncDoneRef.current) {
        // Processing real-time cloud update - settings only

        // Sync settings if changed (no reload needed - settings update automatically)
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
            // Silent sync - no toast for automatic real-time updates
          }
        }
      }

      // Note: Activities, badges, and challenges sync would require bulk update methods
      // For now, we only sync settings to avoid infinite loops
    });

    return () => {
      clearTimeout(fallbackTimeout);
      if (unsubscribeFn && !isUnsubscribed) {
        unsubscribeFn();
        isUnsubscribed = true;
      }
      // Reset sync flags on cleanup to prevent stale state
      initialSyncCheckStartedRef.current = false;
    };
  }, [isAuthenticated, isConfigured, allHydrated]); // Removed activities, settings, badges, challenges, saveSettings from dependencies
}
