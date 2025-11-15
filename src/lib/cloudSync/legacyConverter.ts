/**
 * Legacy Data Converter
 * Converts old Firestore format to new format
 *
 * Old format:
 * - users/{userId} document: { activities, settings, badges, challenges, metadata }
 *
 * New format:
 * - users/{userId} document: { points, lastModified }
 * - users/{userId}/activities collection: Activity definitions
 * - users/{userId}/exercises collection: Exercise records
 * - users/{userId}/statistics collection: Statistics documents
 * - users/{userId}/challenges collection: Challenge records
 */

import type { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';
import type { Badge } from '@/lib/badges';
import type { Challenge } from '@/lib/challenges';
import type { ActivityDefinition } from '@/lib/activityConfig';
import { BASE_ACTIVITY_DEFINITIONS } from '@/lib/activityConfig';
import { calculateOverallStatistics } from './statisticsCalculator';

export interface LegacyData {
  activities?: ActivityRecord[];
  settings?: UserSettings | null;
  badges?: Badge[];
  challenges?: Challenge[];
  exportDate?: string;
  version?: string;
}

export interface ConvertedData {
  // Activities: Activity definitions (default + custom)
  activities: ActivityDefinition[];
  // Exercises: Exercise records (yapılan exercise'ler)
  exercises: ActivityRecord[];
  // Statistics: Calculated statistics
  statistics: Array<{
    id: string;
    totalPoints: number;
    totalExercises: number;
    totalActivities: number;
    streakDays: number;
    averageDailyPoints: number;
    completionRate: number;
    lastCalculated: Date;
  }>;
  // Challenges: Challenge records
  challenges: Challenge[];
  // Points: Total points
  points: number;
  // Last Modified: Last modification date
  lastModified: Date | null;
}

/**
 * Convert legacy JSON format to new format
 */
export function convertLegacyToNewFormat(legacyData: LegacyData): ConvertedData {
  const activities: ActivityRecord[] = legacyData.activities || [];
  const settings: UserSettings | null = legacyData.settings || null;
  const challenges: Challenge[] = legacyData.challenges || [];

  // 1. Extract activity definitions (default + custom)
  const activityDefinitions: ActivityDefinition[] = [
    ...BASE_ACTIVITY_DEFINITIONS,
    ...(settings?.customActivities?.map((custom) => ({
      key: custom.id,
      label: custom.label,
      labelEn: custom.labelEn,
      icon: custom.icon,
      multiplier: custom.multiplier,
      unit: custom.unit,
      unitEn: custom.unitEn,
      defaultAmount: custom.defaultAmount,
      description: custom.description,
      descriptionEn: custom.descriptionEn,
      isCustom: true,
      category: undefined, // Custom activities don't have category in old format
    })) || []),
  ];

  // 2. Exercises are the same as old activities
  const exercises: ActivityRecord[] = activities.map((activity) => ({
    ...activity,
    // Ensure all required fields are present
    id: activity.id || `exercise-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    activityKey: activity.activityKey,
    amount: activity.amount || 0,
    points: activity.points || 0,
    performedAt: activity.performedAt || new Date().toISOString(),
  }));

  // 3. Calculate statistics
  const dailyTarget = settings?.dailyTarget || 10000;
  const overallStats = calculateOverallStatistics(exercises, dailyTarget);

  // 4. Calculate total points
  const points = exercises.reduce((sum, ex) => sum + (ex.points || 0), 0);

  // 5. Get last modified date
  const lastModified = legacyData.exportDate
    ? new Date(legacyData.exportDate)
    : exercises.length > 0
      ? new Date(
          Math.max(
            ...exercises.map((ex) => new Date(ex.performedAt).getTime()).filter((t) => !isNaN(t))
          )
        )
      : null;

  return {
    activities: activityDefinitions,
    exercises,
    statistics: [overallStats],
    challenges,
    points,
    lastModified,
  };
}

/**
 * Validate legacy data format
 */
export function validateLegacyData(data: unknown): data is LegacyData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const legacy = data as Record<string, unknown>;

  // Check if it has activities array (optional)
  if (legacy.activities !== undefined && !Array.isArray(legacy.activities)) {
    return false;
  }

  // Check if it has settings object (optional)
  if (
    legacy.settings !== undefined &&
    legacy.settings !== null &&
    typeof legacy.settings !== 'object'
  ) {
    return false;
  }

  // Check if it has challenges array (optional)
  if (legacy.challenges !== undefined && !Array.isArray(legacy.challenges)) {
    return false;
  }

  return true;
}
