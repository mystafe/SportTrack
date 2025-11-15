/**
 * Conflict Resolution Utilities
 * Handles conflicts when syncing data between local and cloud
 */

import type { CloudData, SyncMetadata } from './types';
import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { Badge } from '@/lib/badges';
import { Challenge } from '@/lib/challenges';
import type { ActivityDefinition } from '@/lib/activityConfig';

export type ConflictStrategy = 'local' | 'cloud' | 'merge' | 'newest';

export interface ConflictResolution {
  strategy: ConflictStrategy;
  resolvedData: {
    activities: ActivityRecord[];
    settings: UserSettings | null;
    badges: Badge[];
    challenges: Challenge[];
  };
}

/**
 * Resolve conflicts between local and cloud data
 */
export function resolveConflicts(
  localData: {
    activities: ActivityRecord[];
    settings: UserSettings | null;
    badges: Badge[];
    challenges: Challenge[];
  },
  cloudData: CloudData,
  strategy: ConflictStrategy = 'newest'
): ConflictResolution {
  switch (strategy) {
    case 'local':
      return {
        strategy: 'local',
        resolvedData: localData,
      };

    case 'cloud':
      // Safety check: If cloud is empty, use local data instead to prevent data loss
      const cloudIsEmpty = isEmpty(cloudData);
      const localIsEmpty = isEmpty(localData);

      if (cloudIsEmpty && !localIsEmpty) {
        console.warn(
          '⚠️ Cloud strategy selected but cloud is empty. Using local data instead to prevent data loss.'
        );
        return {
          strategy: 'local',
          resolvedData: localData,
        };
      }

      return {
        strategy: 'cloud',
        resolvedData: {
          // Use exercises from new structure, fallback to activities for backward compatibility
          activities:
            (cloudData.exercises as ActivityRecord[]) ||
            (cloudData.activities as ActivityRecord[]) ||
            [],
          settings: (cloudData.settings as UserSettings) || null,
          badges: (cloudData.badges as Badge[]) || [],
          challenges: (cloudData.challenges as Challenge[]) || [],
        },
      };

    case 'merge':
      return {
        strategy: 'merge',
        resolvedData: mergeData(localData, cloudData),
      };

    case 'newest':
    default:
      return {
        strategy: 'newest',
        resolvedData: useNewest(localData, cloudData),
      };
  }
}

/**
 * Merge local and cloud data
 * Improved: Uses timestamp-based merge for duplicates (newer data wins)
 */
export function mergeData(
  localData: {
    activities: ActivityRecord[];
    settings: UserSettings | null;
    badges: Badge[];
    challenges: Challenge[];
  },
  cloudData: CloudData
): {
  activities: ActivityRecord[];
  settings: UserSettings | null;
  badges: Badge[];
  challenges: Challenge[];
} {
  // Merge activities by ID with timestamp-based conflict resolution
  // Use exercises from new structure, fallback to activities for backward compatibility
  const localActivityMap = new Map<string, ActivityRecord>();
  localData.activities.forEach((activity) => {
    localActivityMap.set(activity.id, activity);
  });

  const cloudActivities =
    (cloudData.exercises as ActivityRecord[]) || (cloudData.activities as ActivityRecord[]) || [];
  cloudActivities.forEach((cloudActivity) => {
    const localActivity = localActivityMap.get(cloudActivity.id);
    if (localActivity) {
      // Both have same ID - use the one with newer timestamp
      const localTime = new Date(localActivity.performedAt).getTime();
      const cloudTime = new Date(cloudActivity.performedAt).getTime();
      // Use newer one (higher timestamp)
      if (cloudTime > localTime) {
        localActivityMap.set(cloudActivity.id, cloudActivity);
      }
      // Otherwise keep local (already in map)
    } else {
      // Cloud has new activity - add it
      localActivityMap.set(cloudActivity.id, cloudActivity);
    }
  });
  const mergedActivities = Array.from(localActivityMap.values());

  // Settings: Merge intelligently - prefer cloud but keep local custom activities
  let mergedSettings: UserSettings | null = null;
  if (cloudData.settings && localData.settings) {
    // Both have settings - merge custom activities
    const localCustomActivities = localData.settings.customActivities || [];
    const cloudCustomActivities = (cloudData.settings as UserSettings).customActivities || [];
    const customActivitiesMap = new Map<string, ActivityDefinition>();

    // Add local custom activities
    localCustomActivities.forEach((activity) => {
      if (activity.key) {
        customActivitiesMap.set(activity.key, activity);
      }
    });

    // Add cloud custom activities (cloud takes precedence for duplicates)
    cloudCustomActivities.forEach((activity) => {
      if (activity.key) {
        customActivitiesMap.set(activity.key, activity);
      }
    });

    mergedSettings = {
      ...(cloudData.settings as UserSettings),
      customActivities: Array.from(customActivitiesMap.values()),
      // Keep local name if cloud doesn't have one
      name: (cloudData.settings as UserSettings).name || localData.settings.name || '',
    };
  } else {
    // Use whichever is available
    mergedSettings = (cloudData.settings as UserSettings) || localData.settings;
  }

  // Merge badges by ID with timestamp-based conflict resolution
  const localBadgeMap = new Map<string, Badge>();
  localData.badges.forEach((badge) => {
    localBadgeMap.set(badge.id, badge);
  });

  const cloudBadges = (cloudData.badges as Badge[]) || [];
  cloudBadges.forEach((cloudBadge) => {
    const localBadge = localBadgeMap.get(cloudBadge.id);
    if (localBadge) {
      // Both have same ID - use the one with newer unlock time
      const localUnlockTime = localBadge.unlockedAt ? new Date(localBadge.unlockedAt).getTime() : 0;
      const cloudUnlockTime = cloudBadge.unlockedAt ? new Date(cloudBadge.unlockedAt).getTime() : 0;
      // Use newer one (higher timestamp)
      if (cloudUnlockTime > localUnlockTime) {
        localBadgeMap.set(cloudBadge.id, cloudBadge);
      }
      // Otherwise keep local (already in map)
    } else {
      // Cloud has new badge - add it
      localBadgeMap.set(cloudBadge.id, cloudBadge);
    }
  });
  const mergedBadges = Array.from(localBadgeMap.values());

  // Merge challenges by ID (cloud takes precedence for duplicates)
  const localChallengeMap = new Map(localData.challenges.map((c) => [c.id, c]));
  const cloudChallenges = (cloudData.challenges as Challenge[]) || [];
  cloudChallenges.forEach((challenge) => {
    localChallengeMap.set(challenge.id, challenge);
  });
  const mergedChallenges = Array.from(localChallengeMap.values());

  return {
    activities: mergedActivities,
    settings: mergedSettings,
    badges: mergedBadges,
    challenges: mergedChallenges,
  };
}

/**
 * Check if data is empty (0 activities/exercises, 0 badges, 0 challenges)
 */
export function isEmpty(
  data:
    | CloudData
    | {
        activities: ActivityRecord[] | unknown[];
        badges: Badge[] | unknown[];
        challenges: Challenge[] | unknown[];
      }
): boolean {
  // Check both exercises (new structure) and activities (legacy) for CloudData
  const hasActivities =
    'exercises' in data
      ? ((data as CloudData).exercises?.length || 0) > 0 ||
        ((data as CloudData).activities?.length || 0) > 0
      : ((data as { activities: unknown[] }).activities?.length || 0) > 0;

  const hasBadges = (data.badges?.length || 0) > 0;
  const hasChallenges = (data.challenges?.length || 0) > 0;

  return !hasActivities && !hasBadges && !hasChallenges;
}

/**
 * Use newest data based on metadata timestamps
 * If one side is empty (0 activities, 0 badges, 0 challenges), use the other side
 */
export function useNewest(
  localData: {
    activities: ActivityRecord[];
    settings: UserSettings | null;
    badges: Badge[];
    challenges: Challenge[];
  },
  cloudData: CloudData
): {
  activities: ActivityRecord[];
  settings: UserSettings | null;
  badges: Badge[];
  challenges: Challenge[];
} {
  const localIsEmpty = isEmpty(localData);
  const cloudIsEmpty = isEmpty(cloudData);

  // If local is empty, use cloud (even if cloud is also empty, prefer cloud for consistency)
  if (localIsEmpty) {
    // Use exercises from new structure, fallback to activities for backward compatibility
    const cloudExercises =
      (cloudData.exercises as ActivityRecord[]) || (cloudData.activities as ActivityRecord[]) || [];
    return {
      activities: cloudExercises,
      settings: (cloudData.settings as UserSettings) || localData.settings,
      badges: (cloudData.badges as Badge[]) || [],
      challenges: (cloudData.challenges as Challenge[]) || [],
    };
  }

  // If cloud is empty, use local
  if (cloudIsEmpty) {
    return localData;
  }

  // Both have data, compare timestamps
  const localLastModified = getLocalLastModified();
  const cloudLastModified = cloudData.metadata?.lastModified || new Date(0);

  if (cloudLastModified > localLastModified) {
    // Use exercises from new structure, fallback to activities for backward compatibility
    const cloudExercises =
      (cloudData.exercises as ActivityRecord[]) || (cloudData.activities as ActivityRecord[]) || [];
    return {
      activities: cloudExercises.length > 0 ? cloudExercises : localData.activities,
      settings: (cloudData.settings as UserSettings) || localData.settings,
      badges: (cloudData.badges as Badge[]) || localData.badges,
      challenges: (cloudData.challenges as Challenge[]) || localData.challenges,
    };
  }

  return localData;
}

/**
 * Get local data last modified timestamp
 */
function getLocalLastModified(): Date {
  try {
    const stored = localStorage.getItem('sporttrack_last_sync');
    if (stored) {
      return new Date(stored);
    }
  } catch (error) {
    console.error('Failed to get local last modified:', error);
  }
  return new Date(0);
}

/**
 * Save local last modified timestamp
 */
export function saveLocalLastModified(): void {
  try {
    localStorage.setItem('sporttrack_last_sync', new Date().toISOString());
  } catch (error) {
    console.error('Failed to save local last modified:', error);
  }
}
