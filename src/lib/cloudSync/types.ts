/**
 * Cloud Sync Types
 *
 * Yeni Firestore yapısı:
 * - users/{userId} document: points, lastModified
 * - users/{userId}/activities collection: Activity definitions (default + custom)
 * - users/{userId}/exercises collection: Exercise records (yapılan exercise'ler)
 * - users/{userId}/statistics collection: Statistics documents
 * - users/{userId}/challenges collection: Challenge records
 */

import type { ActivityDefinition } from '@/lib/activityConfig';
import type { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';
import type { Badge } from '@/lib/badges';
import type { Challenge } from '@/lib/challenges';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

export interface SyncState {
  status: SyncStatus;
  lastSyncAt: Date | null;
  error: string | null;
  pendingChanges: number;
}

export interface SyncMetadata {
  lastModified: Date;
  version: number;
  userId: string;
  uploadId?: string; // Optional upload ID to prevent self-trigger
}

/**
 * Statistics document structure
 */
export interface StatisticsDocument {
  id: string;
  totalPoints: number;
  totalExercises: number;
  totalActivities: number; // Activity type count
  streakDays: number;
  averageDailyPoints: number;
  completionRate: number; // Percentage
  lastCalculated: Date;
  period?: {
    start: Date;
    end: Date;
  };
}

/**
 * Cloud Data structure (for backward compatibility and conflict resolution)
 */
export interface CloudData {
  // Activities: Activity definitions (default + custom)
  activities: ActivityDefinition[];
  // Exercises: Exercise records (yapılan exercise'ler)
  exercises: ActivityRecord[];
  // Statistics: Calculated statistics
  statistics: StatisticsDocument[];
  // Challenges: Challenge records
  challenges: Challenge[];
  // Points: Total points (from user document)
  points: number;
  // Last Modified: Last modification date
  lastModified: Date | null;
  // Metadata
  metadata: SyncMetadata;
  // Legacy fields for migration
  settings?: UserSettings | null;
  badges?: Badge[];
}
