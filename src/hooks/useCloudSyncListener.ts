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
  const { isAuthenticated, isConfigured, user } = useAuth();
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

  // Reset initial sync flag when user logs out OR when user changes
  // This ensures that each user gets a fresh initial sync check
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // User logged out - clear flags
      console.log('🔓 User logged out - clearing sync flags');
      initialSyncDoneRef.current = false;
      userIdRef.current = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(INITIAL_SYNC_COMPLETE_KEY);
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
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

    // CRITICAL FIX: Force initial sync check immediately on login
    // Don't rely only on listener - also do a direct download check
    const performInitialSyncCheck = async () => {
      // Check if initial sync is already complete
      const initialSyncComplete =
        typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

      if (initialSyncComplete && initialSyncDoneRef.current) {
        // Initial sync already complete, skipping
        return;
      }

      // Force download from cloud immediately (with retry)
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries && !initialSyncDoneRef.current) {
        try {
          const cloudData = await cloudSyncService.downloadFromCloud();
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

          const localIsEmpty = isLocalEmpty(localData);
          const cloudIsEmpty = isCloudEmpty(
            cloudData || {
              exercises: [],
              activities: [],
              statistics: [],
              badges: [],
              challenges: [],
              settings: null,
              points: 0,
              lastModified: null,
              metadata: {
                lastModified: new Date(),
                version: 1,
                userId: '',
              },
            }
          );

          // If local is empty and cloud has data, download immediately
          if (localIsEmpty && cloudData && !cloudIsEmpty) {
            // Apply cloud data directly
            if (typeof window !== 'undefined') {
              const cloudExercises = (cloudData.exercises ||
                cloudData.activities ||
                []) as Array<unknown>;
              if (cloudExercises.length > 0) {
                localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(cloudExercises));
              }
              if (cloudData.badges && cloudData.badges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(cloudData.badges));
              }
              if (cloudData.challenges && cloudData.challenges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(cloudData.challenges));
              }
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
                }
              }

              // Mark initial sync as complete and reload to apply data
              initialSyncDoneRef.current = true;
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
              // Clear conflict storage if exists
              localStorage.removeItem(CONFLICT_STORAGE_KEY);
              // Silent sync - no toast for automatic sync
              setTimeout(() => window.location.reload(), 500);
              return;
            }
          }

          // If both empty or identical, mark as complete
          if (
            (localIsEmpty && cloudIsEmpty) ||
            (!localIsEmpty &&
              !cloudIsEmpty &&
              !hasConflicts(
                localData,
                cloudData || {
                  exercises: [],
                  activities: [],
                  statistics: [],
                  badges: [],
                  challenges: [],
                  settings: null,
                  points: 0,
                  lastModified: null,
                  metadata: {
                    lastModified: new Date(),
                    version: 1,
                    userId: '',
                  },
                }
              ))
          ) {
            initialSyncDoneRef.current = true;
            if (typeof window !== 'undefined') {
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
            }
            return;
          }

          // If we get here, there might be a conflict - let the listener handle it
          break;
        } catch (error) {
          // Log only in development
          if (process.env.NODE_ENV === 'development') {
            console.error(`Initial sync attempt ${retryCount + 1} failed:`, error);
          }
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          }
        }
      }
    };

    // Perform initial sync check immediately
    performInitialSyncCheck();

    // Check if initial sync is already complete - if so, don't subscribe to listener
    const initialSyncComplete =
      typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

    if (initialSyncComplete && initialSyncDoneRef.current) {
      // Initial sync already complete, skipping cloud listener subscription
      return;
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

      // Check if initial sync is already complete
      const initialSyncComplete =
        typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';

      // If initial sync is complete, skip initial sync logic but continue listening for real-time updates
      // Don't unsubscribe - we need to listen for changes from other devices
      if (initialSyncComplete && initialSyncDoneRef.current) {
        // Skip initial sync logic, but continue to regular sync below
        // Initial sync already complete, processing real-time update

        // Clear any stale conflict data
        if (typeof window !== 'undefined') {
          const existingConflict = localStorage.getItem(CONFLICT_STORAGE_KEY);
          if (existingConflict) {
            // Clearing stale conflict data
            localStorage.removeItem(CONFLICT_STORAGE_KEY);
          }
        }

        // Continue to regular sync below - don't return here
      }

      // Check if this is the initial sync (first time after login)
      const isInitialSync = !initialSyncDoneRef.current;

      // Skip conflict detection if conflict is already stored (prevent re-detection)
      const existingConflict =
        typeof window !== 'undefined' ? localStorage.getItem(CONFLICT_STORAGE_KEY) : null;

      if (existingConflict) {
        // Conflict already exists, skipping initial sync conflict detection
        initialSyncDoneRef.current = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
        }
        return;
      }

      // Only process initial sync if it hasn't been completed yet
      if (isInitialSync && !initialSyncComplete) {
        // Check if local is empty (0 activities, 0 badges, 0 challenges)
        const localIsEmpty = isLocalEmpty(localData);
        const cloudIsEmpty = isCloudEmpty(cloudData);

        const localHasData =
          localData.activities.length > 0 ||
          localData.badges.length > 0 ||
          localData.challenges.length > 0 ||
          localData.settings !== null;
        // Use exercises from new structure, fallback to activities for backward compatibility
        const cloudExercises = (cloudData.exercises ||
          cloudData.activities ||
          []) as Array<unknown>;
        const cloudHasData =
          cloudExercises.length > 0 ||
          (cloudData.badges?.length || 0) > 0 ||
          (cloudData.challenges?.length || 0) > 0 ||
          cloudData.settings !== null;

        // Debug log only in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Initial sync check:', {
            localIsEmpty,
            cloudIsEmpty,
            localHasData,
            cloudHasData,
            localActivities: localData.activities.length,
            cloudExercises: cloudExercises.length,
          });
        }

        // CRITICAL: If one environment has data and the other doesn't, automatically sync from the one with data
        // Priority: If local is empty and cloud has data -> download from cloud
        // If cloud is empty and local has data -> upload to cloud (handled by useAutoSync)
        if (localIsEmpty && cloudHasData) {
          // Initial sync: Local is empty, cloud has data - downloading from cloud automatically

          // Apply cloud data directly to localStorage
          try {
            if (typeof window !== 'undefined') {
              // Write activities (use exercises from new structure, fallback to activities for backward compatibility)
              const cloudExercises = (cloudData.exercises ||
                cloudData.activities ||
                []) as Array<unknown>;
              if (cloudExercises.length > 0) {
                localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(cloudExercises));
              }

              // Write badges
              if (cloudData.badges && cloudData.badges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(cloudData.badges));
              }

              // Write challenges
              if (cloudData.challenges && cloudData.challenges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(cloudData.challenges));
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
              }

              // Mark initial sync as complete
              initialSyncDoneRef.current = true;
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');

              // Silent sync - no toast for automatic sync
              setTimeout(() => {
                window.location.reload();
              }, 500);

              return; // Exit early, page will reload
            }
          } catch (error) {
            // Log error only in development
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to download cloud data:', error);
            }
            // Show error toast only for critical failures
            showToastRef.current(tRef.current('cloudSync.syncFailed') || 'Sync failed', 'error');
          }
        }

        // If cloud is empty and local has data, automatically upload local to cloud - no conflict
        if (cloudIsEmpty && localHasData && !localIsEmpty) {
          // Initial sync: Cloud is empty, local has data - uploading local data to cloud automatically

          // Upload immediately (async, don't block)
          (async () => {
            try {
              await cloudSyncService.uploadToCloud({
                activities: localData.activities as any[],
                settings: localData.settings as any,
                badges: localData.badges as any[],
                challenges: localData.challenges as any[],
              });

              // Mark initial sync as complete
              initialSyncDoneRef.current = true;
              if (typeof window !== 'undefined') {
                localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
              }

              // Show success toast
              showToastRef.current(
                lang === 'tr'
                  ? 'Yerel verileriniz buluta yüklendi'
                  : 'Your local data has been uploaded to cloud',
                'success'
              );
            } catch (error) {
              // Log error only in development
              if (process.env.NODE_ENV === 'development') {
                console.error('Failed to upload local data to cloud:', error);
              }
              showToastRef.current(
                lang === 'tr' ? 'Buluta yükleme hatası' : 'Upload to cloud failed',
                'error'
              );
              // Still mark as complete to prevent retry loops
              initialSyncDoneRef.current = true;
              if (typeof window !== 'undefined') {
                localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
              }
            }
          })();

          return; // Exit early
        }

        // If both have data, check for conflicts (but only if local is not empty)
        if (localHasData && cloudHasData && !localIsEmpty && !cloudIsEmpty) {
          // Both have data, check for conflicts
          const conflicts = hasConflicts(localData, cloudData);
          const localSettingsNormalized = normalizeSettingsForComparison(localData.settings);
          const cloudSettingsNormalized = normalizeSettingsForComparison(cloudData.settings);
          const settingsMatch = localSettingsNormalized === cloudSettingsNormalized;

          // Use exercises from new structure, fallback to activities for backward compatibility
          const cloudExercises = (cloudData.exercises ||
            cloudData.activities ||
            []) as Array<unknown>;

          // Check if data is identical (same IDs and content)
          const localActivities = localData.activities as Array<{ id?: string }>;
          const cloudActivities = cloudExercises as Array<{ id?: string }>;
          const localBadges = localData.badges as Array<{ id?: string }>;
          const cloudBadges = (cloudData.badges || []) as Array<{ id?: string }>;
          const localChallenges = localData.challenges as Array<{ id?: string }>;
          const cloudChallenges = (cloudData.challenges || []) as Array<{ id?: string }>;

          const activitiesIdentical = arraysEqualById(localActivities, cloudActivities);
          const badgesIdentical = arraysEqualById(localBadges, cloudBadges);
          const challengesIdentical = arraysEqualById(localChallenges, cloudChallenges);
          const isIdentical =
            !conflicts &&
            activitiesIdentical &&
            badgesIdentical &&
            challengesIdentical &&
            settingsMatch;

          // Debug log only in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Initial sync conflict check:', {
              conflicts,
              isIdentical,
              localActivities: localData.activities.length,
              cloudExercises: cloudExercises.length,
            });
          }

          // If data is identical, no conflict - just mark sync as complete
          if (isIdentical) {
            initialSyncDoneRef.current = true;
            if (typeof window !== 'undefined') {
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
            }
            return; // Exit early, no conflict dialog needed
          }

          if (conflicts) {
            // Check if conflict was already stored (prevent duplicate detection)
            const existingConflict =
              typeof window !== 'undefined' ? localStorage.getItem(CONFLICT_STORAGE_KEY) : null;

            if (existingConflict) {
              // Conflict already stored, skipping duplicate detection
              // Mark initial sync as complete to prevent re-detection
              initialSyncDoneRef.current = true;
              if (typeof window !== 'undefined') {
                localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
              }
              return;
            }

            // Store conflict data for ConflictResolutionManager to handle
            // Use exercises from new structure, fallback to activities for backward compatibility
            const cloudExercises = (cloudData.exercises ||
              cloudData.activities ||
              []) as Array<unknown>;
            const conflictData = {
              local: {
                activities: localData.activities,
                settings: localData.settings,
                badges: localData.badges,
                challenges: localData.challenges,
              },
              cloud: {
                activities: cloudExercises, // Use exercises for new structure
                settings: cloudData.settings || null,
                badges: cloudData.badges || [],
                challenges: cloudData.challenges || [],
                points: cloudData.points || 0, // Include points from cloudData
              },
            };

            // CONFLICT DETECTED - Storing conflict data

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

            // No toast - conflict dialog will be shown by ConflictResolutionManager

            return;
          }
        }

        // No conflict or one side is empty
        if (cloudHasData && !localHasData && !localIsEmpty) {
          // Cloud has data, local doesn't - use cloud
          // Use exercises from new structure, fallback to activities for backward compatibility
          const cloudExercises = (cloudData.exercises ||
            cloudData.activities ||
            []) as Array<unknown>;
          // Initial sync: Cloud has data, local is empty - downloading from cloud

          // Apply cloud data directly to localStorage (similar to conflict resolution)
          try {
            if (typeof window !== 'undefined') {
              // Write activities (use exercises from new structure)
              if (cloudExercises.length > 0) {
                localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(cloudExercises));
                // Downloaded exercises/activities
              }

              // Write badges
              if (cloudData.badges && cloudData.badges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(cloudData.badges));
                // Downloaded badges
              }

              // Write challenges
              if (cloudData.challenges && cloudData.challenges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(cloudData.challenges));
                // Downloaded challenges
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
                // Downloaded settings
              }

              // Mark initial sync as complete
              initialSyncDoneRef.current = true;
              localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');

              // Show success toast
              showToastRef.current(tRef.current('cloudSync.syncedFromCloud'), 'success');

              // Reload page to apply changes (stores will read from localStorage)
              // Reloading page to apply cloud data
              setTimeout(() => {
                window.location.reload();
              }, 500);

              return; // Exit early, page will reload
            }
          } catch (error) {
            // Log error only in development
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to download cloud data:', error);
            }
            // Show error toast only for critical failures
            showToastRef.current(tRef.current('cloudSync.syncFailed') || 'Sync failed', 'error');
          }
        } else if (!cloudHasData && localHasData && !localIsEmpty) {
          // Local has data, cloud doesn't - use local (useAutoSync will upload automatically)
          // Initial sync: Local has data, cloud is empty - will upload local data automatically
        } else if (cloudIsEmpty && localIsEmpty) {
          // Both empty (0 activities, 0 badges, 0 challenges) - useAutoSync will handle if local has settings
          // Initial sync: Both empty - useAutoSync will handle settings sync
        } else {
          // Both same or no action needed
          // Initial sync: Both same or no action needed
        }

        initialSyncDoneRef.current = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem(INITIAL_SYNC_COMPLETE_KEY, 'true');
        }

        // Don't unsubscribe - continue listening for real-time updates from other devices
        // The listener will continue to process regular sync updates below
        // Initial sync complete, continuing to listen for real-time updates
        return; // Exit initial sync logic, but listener continues
      }

      // Regular sync (after initial sync) - sync all data from cloud to local
      // This handles real-time updates from other devices
      if (initialSyncComplete && initialSyncDoneRef.current) {
        // Processing real-time cloud update

        // Use exercises from new structure, fallback to activities for backward compatibility
        const cloudExercises = (cloudData.exercises ||
          cloudData.activities ||
          []) as Array<unknown>;

        // Check if cloud has more recent data than local
        // For now, we'll download if cloud has more items (simple heuristic)
        // In the future, we could compare lastModified timestamps
        const cloudHasMoreData =
          cloudExercises.length > currentActivities.length ||
          (cloudData.badges?.length || 0) > currentBadges.length ||
          (cloudData.challenges?.length || 0) > currentChallenges.length;

        if (cloudHasMoreData) {
          // Cloud has more data than local - downloading updates

          try {
            if (typeof window !== 'undefined') {
              // Write activities (use exercises from new structure)
              if (cloudExercises.length > 0) {
                localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(cloudExercises));
                // Downloaded exercises/activities
              }

              // Write badges
              if (cloudData.badges && cloudData.badges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(cloudData.badges));
                // Downloaded badges
              }

              // Write challenges
              if (cloudData.challenges && cloudData.challenges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(cloudData.challenges));
                // Downloaded challenges
              }

              // Apply settings
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
                }
                // Downloaded settings
              }

              // Show success toast
              showToastRef.current(
                lang === 'tr' ? 'Bulut verileri güncellendi' : 'Cloud data updated',
                'success'
              );

              // Reload page to apply changes (stores will read from localStorage)
              // Reloading page silently
              setTimeout(() => {
                window.location.reload();
              }, 500);

              return; // Exit early, page will reload
            }
          } catch (error) {
            // Log error only in development
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to download cloud updates:', error);
            }
            showToastRef.current(
              lang === 'tr' ? 'Bulut güncellemesi başarısız' : 'Cloud update failed',
              'error'
            );
          }
        }

        // Sync settings if changed
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
    };
  }, [isAuthenticated, isConfigured, allHydrated]); // Removed activities, settings, badges, challenges, saveSettings from dependencies
}
