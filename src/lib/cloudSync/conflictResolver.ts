/**
 * Conflict Resolution Utilities
 * Handles conflicts when syncing data between local and cloud
 */

import type { CloudData, SyncMetadata } from './types';
import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { Badge } from '@/lib/badges';
import { Challenge } from '@/lib/challenges';

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
      return {
        strategy: 'cloud',
        resolvedData: {
          activities: (cloudData.activities as ActivityRecord[]) || [],
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
 */
function mergeData(
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
  // Merge activities by ID (cloud takes precedence for duplicates)
  const localActivityMap = new Map(localData.activities.map((a) => [a.id, a]));
  const cloudActivities = (cloudData.activities as ActivityRecord[]) || [];
  cloudActivities.forEach((activity) => {
    localActivityMap.set(activity.id, activity);
  });
  const mergedActivities = Array.from(localActivityMap.values());

  // Settings: Use cloud if available, otherwise local
  const mergedSettings = (cloudData.settings as UserSettings) || localData.settings;

  // Merge badges by ID (cloud takes precedence)
  const localBadgeMap = new Map(localData.badges.map((b) => [b.id, b]));
  const cloudBadges = (cloudData.badges as Badge[]) || [];
  cloudBadges.forEach((badge) => {
    localBadgeMap.set(badge.id, badge);
  });
  const mergedBadges = Array.from(localBadgeMap.values());

  // Merge challenges by ID (cloud takes precedence)
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
 * Check if data is empty (0 activities, 0 badges, 0 challenges)
 */
function isEmpty(data: {
  activities: ActivityRecord[] | unknown[];
  badges: Badge[] | unknown[];
  challenges: Challenge[] | unknown[];
}): boolean {
  return (
    (data.activities?.length || 0) === 0 &&
    (data.badges?.length || 0) === 0 &&
    (data.challenges?.length || 0) === 0
  );
}

/**
 * Use newest data based on metadata timestamps
 * If one side is empty (0 activities, 0 badges, 0 challenges), use the other side
 */
function useNewest(
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
    return {
      activities: (cloudData.activities as ActivityRecord[]) || [],
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
    return {
      activities: (cloudData.activities as ActivityRecord[]) || localData.activities,
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
