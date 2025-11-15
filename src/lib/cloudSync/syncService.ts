/**
 * Cloud Sync Service
 * Handles synchronization between local storage and Firebase
 */

import { db, auth } from '@/lib/firebase/config';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  collection,
  writeBatch,
  getDocs,
  deleteDoc,
  type DocumentSnapshot,
} from 'firebase/firestore';
import type { SyncStatus, CloudData, SyncMetadata } from './types';
import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { Badge } from '@/lib/badges';
import { Challenge } from '@/lib/challenges';
import { ActivityDefinition, BASE_ACTIVITY_DEFINITIONS } from '@/lib/activityConfig';
import { calculateOverallStatistics, calculatePeriodStatistics } from './statisticsCalculator';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export class CloudSyncService {
  private userId: string | null = null;
  private syncListeners: Map<string, () => void> = new Map();
  private isUploading: boolean = false; // Flag to prevent listener from triggering on our own writes
  private lastUploadTimestamp: number = 0; // Track when we last uploaded to ignore our own snapshots
  private lastUploadId: string | null = null; // Track upload ID to prevent self-trigger
  private lastDownloadTimestamp: number = 0; // Track when we last downloaded to prevent rapid re-downloads
  private lastDownloadedDataHash: string | null = null; // Track hash of last downloaded data

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  getUserId(): string | null {
    return this.userId;
  }

  isConfigured(): boolean {
    return Boolean(isFirebaseConfigured() && this.userId);
  }

  /**
   * Get user data document reference
   */
  private getUserDocRef() {
    if (!this.userId || !db) {
      throw new Error('Firebase not configured or user not authenticated');
    }
    return doc(db, 'users', this.userId);
  }

  /**
   * Get activities collection reference
   */
  private getActivitiesCollectionRef() {
    if (!this.userId || !db) {
      throw new Error('Firebase not configured or user not authenticated');
    }
    return collection(db, 'users', this.userId, 'activities');
  }

  /**
   * Get exercises collection reference
   */
  private getExercisesCollectionRef() {
    if (!this.userId || !db) {
      throw new Error('Firebase not configured or user not authenticated');
    }
    return collection(db, 'users', this.userId, 'exercises');
  }

  /**
   * Get statistics collection reference
   */
  private getStatisticsCollectionRef() {
    if (!this.userId || !db) {
      throw new Error('Firebase not configured or user not authenticated');
    }
    return collection(db, 'users', this.userId, 'statistics');
  }

  /**
   * Get challenges collection reference
   */
  private getChallengesCollectionRef() {
    if (!this.userId || !db) {
      throw new Error('Firebase not configured or user not authenticated');
    }
    return collection(db, 'users', this.userId, 'challenges');
  }

  /**
   * Get badges collection reference
   */
  private getBadgesCollectionRef() {
    if (!this.userId || !db) {
      throw new Error('Firebase not configured or user not authenticated');
    }
    return collection(db, 'users', this.userId, 'badges');
  }

  /**
   * Upload converted data to cloud in new format
   * This function handles the new Firestore structure:
   * - users/{userId} document: { points, lastModified }
   * - users/{userId}/activities collection: Activity definitions
   * - users/{userId}/exercises collection: Exercise records
   * - users/{userId}/statistics collection: Statistics documents
   * - users/{userId}/challenges collection: Challenge records
   */
  async uploadConvertedDataToCloud(convertedData: {
    activities: ActivityDefinition[];
    exercises: ActivityRecord[];
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
    challenges: Challenge[];
    points: number;
    lastModified: Date | null;
  }): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Cloud sync not configured');
    }

    // Check authentication
    if (!auth?.currentUser) {
      throw new Error('User not authenticated');
    }

    const userDocRef = this.getUserDocRef();
    const activitiesCollectionRef = this.getActivitiesCollectionRef();
    const exercisesCollectionRef = this.getExercisesCollectionRef();
    const statisticsCollectionRef = this.getStatisticsCollectionRef();
    const challengesCollectionRef = this.getChallengesCollectionRef();
    const badgesCollectionRef = this.getBadgesCollectionRef();

    // Uploading converted data to cloud (new format)

    // Set flag to prevent listener from processing our own writes
    this.isUploading = true;

    try {
      // Firestore batch write limit is 500 operations
      // We need to split into multiple batches if needed
      const MAX_BATCH_SIZE = 500;

      // Calculate total operations
      const totalOperations =
        1 + // user document
        convertedData.activities.length +
        convertedData.exercises.length +
        convertedData.statistics.length +
        convertedData.challenges.length +
        (convertedData.badges?.length || 0);

      if (totalOperations > MAX_BATCH_SIZE) {
        // Large dataset detected, splitting into multiple batches

        // Process in chunks
        const batches: Array<Promise<void>> = [];

        // Batch 1: User document + activities + statistics + challenges (small collections)
        const batch1 = writeBatch(db!);
        batch1.set(
          userDocRef,
          {
            points: convertedData.points,
            lastModified: convertedData.lastModified
              ? Timestamp.fromDate(convertedData.lastModified)
              : serverTimestamp(),
          },
          { merge: true }
        );

        for (const activity of convertedData.activities) {
          const activityDocRef = doc(activitiesCollectionRef, activity.key);
          // Remove undefined values from activity definition
          const cleanedActivity = Object.fromEntries(
            Object.entries(activity).filter(([_, value]) => value !== undefined)
          ) as ActivityDefinition;
          batch1.set(activityDocRef, cleanedActivity, { merge: true });
        }

        for (const stat of convertedData.statistics) {
          const statDocRef = doc(statisticsCollectionRef, stat.id);
          const statData: Record<string, unknown> = {
            id: stat.id,
            totalPoints: stat.totalPoints,
            totalExercises: stat.totalExercises,
            totalActivities: stat.totalActivities,
            streakDays: stat.streakDays,
            averageDailyPoints: stat.averageDailyPoints,
            completionRate: stat.completionRate,
            lastCalculated: Timestamp.fromDate(stat.lastCalculated),
          };
          // Only add period if it exists
          if (stat.period) {
            statData.period = {
              start: Timestamp.fromDate(stat.period.start),
              end: Timestamp.fromDate(stat.period.end),
            };
          }
          batch1.set(statDocRef, statData, { merge: true });
        }

        for (const challenge of convertedData.challenges) {
          const challengeDocRef = doc(challengesCollectionRef, challenge.id);
          // Remove undefined values from challenge
          const cleanedChallenge = Object.fromEntries(
            Object.entries(challenge).filter(([_, value]) => value !== undefined)
          ) as Challenge;
          batch1.set(challengeDocRef, cleanedChallenge, { merge: true });
        }

        // Upload badges
        if (convertedData.badges && convertedData.badges.length > 0) {
          for (const badge of convertedData.badges) {
            const badgeDocRef = doc(badgesCollectionRef, badge.id);
            const badgeData: Record<string, unknown> = {
              id: badge.id,
              name: badge.name,
              description: badge.description,
              icon: badge.icon,
              points: badge.points,
            };
            // Add unlockedAt only if it's a valid Date
            if (badge.unlockedAt) {
              try {
                const unlockedDate =
                  badge.unlockedAt instanceof Date ? badge.unlockedAt : new Date(badge.unlockedAt);
                if (!isNaN(unlockedDate.getTime()) && isFinite(unlockedDate.getTime())) {
                  badgeData.unlockedAt = Timestamp.fromDate(unlockedDate);
                }
              } catch (dateError) {
                // Invalid date silently skipped
              }
            }
            batch1.set(badgeDocRef, badgeData, { merge: true });
          }
        }

        batches.push(batch1.commit());

        // Batch 2+: Exercises (split into chunks of 500)
        const exercisesPerBatch = MAX_BATCH_SIZE;
        for (let i = 0; i < convertedData.exercises.length; i += exercisesPerBatch) {
          const batch = writeBatch(db!);
          const chunk = convertedData.exercises.slice(i, i + exercisesPerBatch);

          for (const exercise of chunk) {
            const exerciseDocRef = doc(exercisesCollectionRef, exercise.id);
            // Remove undefined values and ensure performedAt is a Timestamp
            const exerciseData: Record<string, unknown> = {
              id: exercise.id,
              activityKey: exercise.activityKey,
              label: exercise.label,
              icon: exercise.icon,
              unit: exercise.unit,
              multiplier: exercise.multiplier,
              amount: exercise.amount,
              points: exercise.points,
              performedAt: Timestamp.fromDate(new Date(exercise.performedAt)),
            };
            // Add optional fields only if they exist
            if (exercise.labelEn) exerciseData.labelEn = exercise.labelEn;
            if (exercise.unitEn) exerciseData.unitEn = exercise.unitEn;
            if (exercise.note) exerciseData.note = exercise.note;
            if (exercise.description) exerciseData.description = exercise.description;
            if (exercise.descriptionEn) exerciseData.descriptionEn = exercise.descriptionEn;
            if (exercise.isCustom !== undefined) exerciseData.isCustom = exercise.isCustom;
            if (exercise.category) exerciseData.category = exercise.category;
            if (exercise.duration !== undefined) exerciseData.duration = exercise.duration;
            batch.set(exerciseDocRef, exerciseData, { merge: true });
          }

          batches.push(batch.commit());
        }

        // Execute all batches
        await Promise.all(batches);
      } else {
        // Single batch for smaller datasets
        const batch = writeBatch(db!);

        // 1. Update user document with points and lastModified
        batch.set(
          userDocRef,
          {
            points: convertedData.points,
            lastModified: convertedData.lastModified
              ? Timestamp.fromDate(convertedData.lastModified)
              : serverTimestamp(),
          },
          { merge: true }
        );

        // 2. Upload activities (activity definitions)
        for (const activity of convertedData.activities) {
          const activityDocRef = doc(activitiesCollectionRef, activity.key);
          // Remove undefined values from activity definition
          const cleanedActivity = Object.fromEntries(
            Object.entries(activity).filter(([_, value]) => value !== undefined)
          ) as ActivityDefinition;
          batch.set(activityDocRef, cleanedActivity, { merge: true });
        }

        // 3. Upload exercises (exercise records)
        for (const exercise of convertedData.exercises) {
          const exerciseDocRef = doc(exercisesCollectionRef, exercise.id);
          // Remove undefined values and ensure performedAt is a Timestamp
          const exerciseData: Record<string, unknown> = {
            id: exercise.id,
            activityKey: exercise.activityKey,
            label: exercise.label,
            icon: exercise.icon,
            unit: exercise.unit,
            multiplier: exercise.multiplier,
            amount: exercise.amount,
            points: exercise.points,
            performedAt: Timestamp.fromDate(new Date(exercise.performedAt)),
          };
          // Add optional fields only if they exist
          if (exercise.labelEn) exerciseData.labelEn = exercise.labelEn;
          if (exercise.unitEn) exerciseData.unitEn = exercise.unitEn;
          if (exercise.note) exerciseData.note = exercise.note;
          if (exercise.description) exerciseData.description = exercise.description;
          if (exercise.descriptionEn) exerciseData.descriptionEn = exercise.descriptionEn;
          if (exercise.isCustom !== undefined) exerciseData.isCustom = exercise.isCustom;
          if (exercise.category) exerciseData.category = exercise.category;
          if (exercise.duration !== undefined) exerciseData.duration = exercise.duration;
          batch.set(exerciseDocRef, exerciseData, { merge: true });
        }

        // 4. Upload statistics
        for (const stat of convertedData.statistics) {
          const statDocRef = doc(statisticsCollectionRef, stat.id);
          const statData: Record<string, unknown> = {
            id: stat.id,
            totalPoints: stat.totalPoints,
            totalExercises: stat.totalExercises,
            totalActivities: stat.totalActivities,
            streakDays: stat.streakDays,
            averageDailyPoints: stat.averageDailyPoints,
            completionRate: stat.completionRate,
            lastCalculated: Timestamp.fromDate(stat.lastCalculated),
          };
          // Only add period if it exists
          if (stat.period) {
            statData.period = {
              start: Timestamp.fromDate(stat.period.start),
              end: Timestamp.fromDate(stat.period.end),
            };
          }
          batch.set(statDocRef, statData, { merge: true });
        }

        // 5. Upload challenges
        for (const challenge of convertedData.challenges) {
          const challengeDocRef = doc(challengesCollectionRef, challenge.id);
          // Remove undefined values from challenge
          const cleanedChallenge = Object.fromEntries(
            Object.entries(challenge).filter(([_, value]) => value !== undefined)
          ) as Challenge;
          batch.set(challengeDocRef, cleanedChallenge, { merge: true });
        }

        // 6. Upload badges
        if (convertedData.badges && convertedData.badges.length > 0) {
          for (const badge of convertedData.badges) {
            const badgeDocRef = doc(badgesCollectionRef, badge.id);
            const badgeData: Record<string, unknown> = {
              id: badge.id,
              name: badge.name,
              description: badge.description,
              icon: badge.icon,
              points: badge.points,
            };
            // Add unlockedAt only if it's a valid Date
            if (badge.unlockedAt) {
              try {
                const unlockedDate =
                  badge.unlockedAt instanceof Date ? badge.unlockedAt : new Date(badge.unlockedAt);
                if (!isNaN(unlockedDate.getTime()) && isFinite(unlockedDate.getTime())) {
                  badgeData.unlockedAt = Timestamp.fromDate(unlockedDate);
                }
              } catch (dateError) {
                // Invalid date silently skipped
              }
            }
            batch.set(badgeDocRef, badgeData, { merge: true });
          }
        }

        // Commit batch
        await batch.commit();
      }

      // Successfully uploaded converted data to cloud
    } catch (error) {
      console.error('Failed to upload converted data:', error);
      throw error;
    } finally {
      this.isUploading = false;
      this.lastUploadTimestamp = Date.now();
    }
  }

  /**
   * Upload local data to cloud
   */
  async uploadToCloud(
    data: {
      activities: ActivityRecord[];
      settings: UserSettings | null;
      badges: Badge[];
      challenges: Challenge[];
    },
    options?: {
      isReset?: boolean; // Only allow empty data upload if this is a reset operation
    }
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Cloud sync not configured');
    }

    const isReset = options?.isReset === true;

    // Never upload empty/zeroed data to cloud EXCEPT during reset operation
    // Check if there's any meaningful data to upload
    const hasData =
      (data.activities && data.activities.length > 0) ||
      (data.badges && data.badges.length > 0) ||
      (data.challenges && data.challenges.length > 0) ||
      (data.settings && data.settings.name && data.settings.name.trim() !== '');

    if (!hasData && !isReset) {
      console.log(
        '⏭️ Skipping upload: No data to upload (all empty/zeroed). Only reset operations can upload empty data.'
      );
      return; // Don't upload empty data unless it's a reset
    }

    if (!hasData && isReset) {
      // Reset operation: Uploading empty data to cloud to clear cloud storage
    }

    // Set flag to prevent listener from processing our own writes
    this.isUploading = true;

    try {
      // Check authentication first
      if (!auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      const userDocRef = this.getUserDocRef();

      // Starting upload to cloud

      /**
       * Validates and sanitizes a date string, returning a valid ISO string or current date
       * This function is designed to NEVER throw an error - always returns a valid ISO string
       */
      const validateAndSanitizeDate = (dateStr: string | null | undefined): string => {
        // Always return a valid date, never throw
        const fallbackDate = new Date();

        if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
          return fallbackDate.toISOString();
        }

        try {
          // Try to parse the date
          const date = new Date(dateStr);

          // Check if date is valid (not NaN)
          const timeValue = date.getTime();
          if (Number.isNaN(timeValue) || !isFinite(timeValue)) {
            return fallbackDate.toISOString();
          }

          // Check if date is reasonable (not too far in past/future)
          const now = Date.now();
          const tenYearsAgo = now - 10 * 365 * 24 * 60 * 60 * 1000;
          const tenYearsFuture = now + 10 * 365 * 24 * 60 * 60 * 1000;

          if (timeValue < tenYearsAgo || timeValue > tenYearsFuture) {
            // Date out of reasonable range, using current date
            return fallbackDate.toISOString();
          }

          // Try to convert to ISO string - this can throw RangeError for invalid dates
          try {
            const isoString = date.toISOString();
            // Validate the ISO string is not empty or malformed
            if (!isoString || isoString.length === 0 || !isoString.includes('T')) {
              return fallbackDate.toISOString();
            }
            return isoString;
          } catch (isoError) {
            // RangeError: Invalid time value - using current date
            return fallbackDate.toISOString();
          }
        } catch (error) {
          // Catch any other errors (TypeError, etc.)
          return fallbackDate.toISOString();
        }
      };

      /**
       * Type guard to check if value is an object with performedAt property
       */
      const hasPerformedAt = (
        value: unknown
      ): value is { performedAt: string; [key: string]: unknown } => {
        return (
          typeof value === 'object' &&
          value !== null &&
          'performedAt' in value &&
          typeof (value as { performedAt: unknown }).performedAt === 'string'
        );
      };

      /**
       * Recursively remove undefined values and validate dates from an object/array
       * Firestore doesn't accept undefined values
       */
      const removeUndefined = (obj: unknown): unknown => {
        if (obj === null || obj === undefined) {
          return null;
        }

        if (Array.isArray(obj)) {
          return obj
            .map((item) => {
              // If item is an activity record, preserve performedAt and validate it
              if (hasPerformedAt(item)) {
                // Store the original performedAt before cleaning
                const originalPerformedAt = item.performedAt;
                // Clean the item (this might modify performedAt, so we'll restore it)
                const cleaned = removeUndefined(item);
                if (typeof cleaned === 'object' && cleaned !== null) {
                  // Ensure performedAt is always validated and present
                  const validatedDate = validateAndSanitizeDate(originalPerformedAt);
                  return {
                    ...(cleaned as Record<string, unknown>),
                    performedAt: validatedDate,
                  };
                }
                // Fallback: return item with validated date
                return {
                  ...item,
                  performedAt: validateAndSanitizeDate(originalPerformedAt),
                };
              }
              return removeUndefined(item);
            })
            .filter((item) => item !== undefined);
        }

        if (typeof obj === 'object' && obj.constructor === Object) {
          const cleaned: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
              // Special handling for performedAt fields
              if (key === 'performedAt' && typeof value === 'string') {
                cleaned[key] = validateAndSanitizeDate(value);
              } else if (value instanceof Date) {
                // Convert Date objects to ISO string to prevent Firestore issues
                // But skip if it's a serverTimestamp() function (which is a special Firestore function)
                try {
                  const timeValue = value.getTime();
                  if (Number.isNaN(timeValue) || !isFinite(timeValue)) {
                    continue; // Skip invalid dates
                  }
                  cleaned[key] = value.toISOString();
                } catch (dateError) {
                  continue; // Skip invalid dates
                }
              } else {
                cleaned[key] = removeUndefined(value);
              }
            }
          }
          return cleaned;
        }

        return obj;
      };

      // Clean settings: remove undefined fields (Firestore doesn't accept undefined)
      // Always include mood with a default value (null) if not set
      const cleanedSettings = data.settings
        ? (() => {
            const cleaned: {
              name: string;
              dailyTarget: number;
              customActivities: unknown[];
              mood: string | null;
            } = {
              name: data.settings.name || '',
              dailyTarget: data.settings.dailyTarget || 10000,
              customActivities: data.settings.customActivities || [],
              mood: data.settings.mood !== undefined ? data.settings.mood : null, // Always include mood
            };
            return removeUndefined(cleaned) as typeof cleaned;
          })()
        : null;

      // Simple test write first - just write a timestamp
      try {
        // Add timeout to detect if database doesn't exist or rules block it
        const testWritePromise = setDoc(
          userDocRef,
          {
            test: true,
            timestamp: serverTimestamp(),
          },
          { merge: true } // Use merge to preserve existing data
        );

        // Use shorter timeout and better error handling
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(
              new Error(
                'TIMEOUT: setDoc 5 saniye içinde tamamlanmadı. Security rules yazmaya izin vermiyor olabilir.'
              )
            );
          }, 5000);
        });

        await Promise.race([testWritePromise, timeoutPromise]);
      } catch (testError: any) {
        const errorCode = testError?.code;
        const errorMessage = testError?.message;

        if (errorCode === 'permission-denied') {
          throw new Error(
            'PERMISSION_DENIED: Firestore security rules do not allow write access. Please check Firebase Console → Firestore Database → Rules.'
          );
        } else if (errorMessage?.includes('timeout') || errorMessage?.includes('TIMEOUT')) {
          throw new Error(
            'TIMEOUT: Firestore database may not exist. Please create it in Firebase Console → Firestore Database.'
          );
        }

        throw testError;
      }

      // If test write succeeds, write actual data
      const metadata: SyncMetadata = {
        lastModified: new Date(),
        version: Date.now(),
        userId: this.userId!,
      };

      // Clean all data to remove undefined values and validate dates
      // This also sanitizes any invalid dates in activities
      // IMPORTANT: Validate ALL dates BEFORE any processing to prevent "Invalid time value" errors
      let cleanedActivities: ActivityRecord[];
      try {
        // First, validate and sanitize all dates in activities BEFORE removeUndefined
        const preValidatedActivities = (data.activities || []).map((activity) => {
          try {
            // Ensure performedAt is always a valid ISO string
            const validatedDate = validateAndSanitizeDate(activity.performedAt);
            return {
              ...activity,
              performedAt: validatedDate,
            };
          } catch (dateError) {
            // Invalid date silently fixed
            return {
              ...activity,
              performedAt: new Date().toISOString(),
            };
          }
        });

        // Now remove undefined values from pre-validated activities
        const cleaned = removeUndefined(preValidatedActivities);
        cleanedActivities = Array.isArray(cleaned) ? (cleaned as ActivityRecord[]) : [];

        // Final validation pass - ensure all dates are still valid
        cleanedActivities = cleanedActivities.map((activity) => {
          try {
            const finalDate = validateAndSanitizeDate(activity.performedAt);
            return {
              ...activity,
              performedAt: finalDate,
            };
          } catch (finalError) {
            // Final validation failed, using fallback date
            return {
              ...activity,
              performedAt: new Date().toISOString(),
            };
          }
        });
      } catch (error) {
        // If cleaning fails, try to salvage valid activities with safe dates
        cleanedActivities = (data.activities || []).map((activity) => {
          try {
            return {
              ...activity,
              performedAt: validateAndSanitizeDate(activity.performedAt),
            };
          } catch (salvageError) {
            console.error(
              'Cannot salvage activity, using current date:',
              activity.id,
              salvageError
            );
            return {
              ...activity,
              performedAt: new Date().toISOString(),
            };
          }
        });
      }

      // Clean badges - handle unlockedAt Date objects properly
      // Badge interface: id, name, description, icon, category, rarity, unlockedAt (no points field)
      const cleanedBadges = (data.badges || []).map((badge) => {
        const cleanedBadge: Record<string, unknown> = {
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          category: badge.category,
          rarity: badge.rarity,
        };
        // Handle unlockedAt Date objects
        if (badge.unlockedAt) {
          try {
            const unlockedDate =
              badge.unlockedAt instanceof Date ? badge.unlockedAt : new Date(badge.unlockedAt);
            if (!isNaN(unlockedDate.getTime()) && isFinite(unlockedDate.getTime())) {
              cleanedBadge.unlockedAt = unlockedDate.toISOString();
            }
          } catch (dateError) {
            console.warn(`⚠️ Invalid unlockedAt date for badge ${badge.id}, skipping:`, dateError);
          }
        }
        return cleanedBadge;
      });

      const cleanedChallengesRaw = removeUndefined(data.challenges || []);
      const cleanedChallenges = Array.isArray(cleanedChallengesRaw) ? cleanedChallengesRaw : [];

      const cloudData: CloudData = {
        activities: cleanedActivities,
        settings: cleanedSettings,
        badges: cleanedBadges,
        challenges: cleanedChallenges,
        metadata,
      };

      // Ensure we're sending complete data, not partial updates
      // IMPORTANT: Don't write activities to document - they're in subcollection now
      // Only write settings, metadata, and points summary to document
      const docDataRaw = removeUndefined({
        // activities: removed - now stored in subcollection
        settings: cleanedSettings,
        // badges: removed - now stored in subcollection
        // challenges: removed - now stored in subcollection
        points: data.activities.reduce(
          (sum: number, act: ActivityRecord) => sum + (act.points || 0),
          0
        ),
        metadata: {
          ...metadata,
          lastModified: serverTimestamp(),
        },
      });
      const docData =
        typeof docDataRaw === 'object' && docDataRaw !== null
          ? (docDataRaw as Record<string, unknown>)
          : {};

      // Uploading full data to cloud

      const uploadStartTime = Date.now();
      const uploadId = `upload-${uploadStartTime}-${Math.random().toString(36).substring(2, 9)}`;
      this.lastUploadId = uploadId;
      this.lastUploadTimestamp = uploadStartTime; // Track upload time

      // Add upload ID to metadata
      const docDataWithUploadId = {
        ...docData,
        metadata: {
          ...(docData.metadata as Record<string, unknown>),
          uploadId,
        },
      };

      // Write exercises, badges and challenges to subcollections (new structure)
      const exercisesCollectionRef = this.getExercisesCollectionRef();
      const badgesCollectionRef = this.getBadgesCollectionRef();
      const challengesCollectionRef = this.getChallengesCollectionRef();
      const activitiesCollectionRef = this.getActivitiesCollectionRef();

      // First, delete all existing exercises, badges, challenges, and activities from subcollections
      // This ensures we don't have stale data
      // Firestore batch limit is 500 operations, so we need to batch deletions
      try {
        const [
          existingExercisesSnap,
          existingBadgesSnap,
          existingChallengesSnap,
          existingActivitiesSnap,
        ] = await Promise.all([
          getDocs(exercisesCollectionRef),
          getDocs(badgesCollectionRef),
          getDocs(challengesCollectionRef),
          getDocs(activitiesCollectionRef),
        ]);

        const allDocsToDelete = [
          ...existingExercisesSnap.docs.map((d) => d.ref),
          ...existingBadgesSnap.docs.map((d) => d.ref),
          ...existingChallengesSnap.docs.map((d) => d.ref),
          ...existingActivitiesSnap.docs.map((d) => d.ref),
        ];

        // Delete in batches of 500 (Firestore limit)
        const BATCH_SIZE = 500;
        for (let i = 0; i < allDocsToDelete.length; i += BATCH_SIZE) {
          const batch = writeBatch(db!);
          const batchDocs = allDocsToDelete.slice(i, i + BATCH_SIZE);
          batchDocs.forEach((docRef) => {
            batch.delete(docRef);
          });
          await batch.commit();
        }
      } catch (deleteError) {
        // If delete fails, continue anyway - might be first upload
        // Silent fail - not critical
      }

      // Create batch for subcollections
      const subcollectionBatch = writeBatch(db!);

      // Write exercises to subcollection
      if (cleanedActivities.length > 0) {
        for (const exercise of cleanedActivities) {
          const exerciseDocRef = doc(exercisesCollectionRef, exercise.id);
          const exerciseData: Record<string, unknown> = {
            id: exercise.id,
            activityKey: exercise.activityKey,
            label: exercise.label,
            icon: exercise.icon,
            unit: exercise.unit,
            multiplier: exercise.multiplier,
            amount: exercise.amount,
            points: exercise.points,
            performedAt: Timestamp.fromDate(new Date(exercise.performedAt)),
          };
          // Add optional fields only if they exist
          if (exercise.labelEn) exerciseData.labelEn = exercise.labelEn;
          if (exercise.unitEn) exerciseData.unitEn = exercise.unitEn;
          if (exercise.note) exerciseData.note = exercise.note;
          if (exercise.description) exerciseData.description = exercise.description;
          if (exercise.descriptionEn) exerciseData.descriptionEn = exercise.descriptionEn;
          if (exercise.isCustom !== undefined) exerciseData.isCustom = exercise.isCustom;
          if (exercise.category) exerciseData.category = exercise.category;
          if (exercise.duration !== undefined) exerciseData.duration = exercise.duration;

          // Remove undefined values before writing
          const cleanedExerciseData = Object.fromEntries(
            Object.entries(exerciseData).filter(([_, value]) => value !== undefined)
          );

          subcollectionBatch.set(exerciseDocRef, cleanedExerciseData);
        }
        // Prepared exercises for subcollection upload
      }

      // Write badges to subcollection
      if (cleanedBadges.length > 0) {
        for (const badgeObj of cleanedBadges) {
          const badge = badgeObj as Record<string, unknown>;
          const badgeId = badge.id as string;
          if (!badgeId) {
            continue; // Badge missing id, skipping
          }

          const badgeDocRef = doc(badgesCollectionRef, badgeId);

          // Badge interface doesn't have points field - only id, name, description, icon, category, rarity, unlockedAt
          // Handle name and description as objects (tr/en) or strings
          let badgeName: string | { tr: string; en: string } = '';
          let badgeDescription: string | { tr: string; en: string } = '';

          if (badge.name) {
            if (typeof badge.name === 'object' && badge.name !== null) {
              badgeName = badge.name as { tr: string; en: string };
            } else {
              badgeName = (badge.name as string) || '';
            }
          }

          if (badge.description) {
            if (typeof badge.description === 'object' && badge.description !== null) {
              badgeDescription = badge.description as { tr: string; en: string };
            } else {
              badgeDescription = (badge.description as string) || '';
            }
          }

          const badgeData: Record<string, unknown> = {
            id: badgeId,
            name: badgeName,
            description: badgeDescription,
            icon: (badge.icon as string) || '',
            category: (badge.category as string) || 'special',
            rarity: (badge.rarity as string) || 'common',
          };

          // Add unlockedAt if it exists and is valid
          if (badge.unlockedAt && typeof badge.unlockedAt === 'string') {
            try {
              const unlockedDate = new Date(badge.unlockedAt);
              if (!isNaN(unlockedDate.getTime()) && isFinite(unlockedDate.getTime())) {
                badgeData.unlockedAt = Timestamp.fromDate(unlockedDate);
              }
            } catch (dateError) {
              // Invalid unlockedAt date for badge, skipping
            }
          }

          // Remove undefined values before writing
          const cleanedBadgeData = Object.fromEntries(
            Object.entries(badgeData).filter(([_, value]) => value !== undefined)
          );

          subcollectionBatch.set(badgeDocRef, cleanedBadgeData);
        }
      }

      // Write challenges to subcollection
      if (cleanedChallenges.length > 0) {
        for (const challenge of cleanedChallenges) {
          const challengeDocRef = doc(challengesCollectionRef, (challenge as { id: string }).id);
          const cleanedChallenge = Object.fromEntries(
            Object.entries(challenge).filter(([_, value]) => value !== undefined)
          ) as Challenge;
          subcollectionBatch.set(challengeDocRef, cleanedChallenge);
        }
      }

      // Write custom activity definitions (activity types) to subcollection
      if (cleanedSettings?.customActivities && Array.isArray(cleanedSettings.customActivities)) {
        const customActivities = cleanedSettings.customActivities as ActivityDefinition[];
        for (const activity of customActivities) {
          // Only write custom activities (not default ones)
          if (activity.isCustom && activity.key) {
            const activityDocRef = doc(activitiesCollectionRef, activity.key);
            const cleanedActivity = Object.fromEntries(
              Object.entries(activity).filter(([_, value]) => value !== undefined)
            ) as ActivityDefinition;
            subcollectionBatch.set(activityDocRef, cleanedActivity);
          }
        }
      }

      // Commit subcollections batch
      await subcollectionBatch.commit();
      // Successfully uploaded exercises, badges and challenges to subcollections

      // Use merge: true to preserve existing fields that we're not updating
      try {
        await setDoc(userDocRef, docDataWithUploadId, { merge: true });
      } catch (setDocError: unknown) {
        // Type guard for error with message property
        const hasMessage = (err: unknown): err is { message: string } => {
          return (
            typeof err === 'object' &&
            err !== null &&
            'message' in err &&
            typeof (err as { message: unknown }).message === 'string'
          );
        };

        // Check if error is related to invalid dates
        if (
          hasMessage(setDocError) &&
          (setDocError.message.includes('Invalid time') ||
            setDocError.message.includes('RangeError') ||
            setDocError.message.includes('toISOString'))
        ) {
          // Date validation error during upload, retrying with sanitized dates
          // Re-sanitize all dates and retry once
          // Ensure metadata is included and all dates are properly sanitized
          const reSanitizedActivities = cleanedActivities.map((activity) => {
            try {
              const validatedDate = validateAndSanitizeDate(activity.performedAt);
              return {
                ...activity,
                performedAt: validatedDate,
              };
            } catch (dateError) {
              // Failed to sanitize date for activity, using current date
              return {
                ...activity,
                performedAt: new Date().toISOString(),
              };
            }
          });

          const reSanitizedDocData: Record<string, unknown> = {
            ...docData,
            activities: reSanitizedActivities,
            // Ensure metadata is included with serverTimestamp
            metadata: {
              ...(docData.metadata as Record<string, unknown>),
              lastModified: serverTimestamp(),
              uploadId,
            },
          };

          // Remove any Date objects from metadata that might cause issues
          if (reSanitizedDocData.metadata && typeof reSanitizedDocData.metadata === 'object') {
            const metadata = reSanitizedDocData.metadata as Record<string, unknown>;
            // Ensure lastModified is serverTimestamp, not a Date object
            if (metadata.lastModified instanceof Date) {
              metadata.lastModified = serverTimestamp();
            }
          }

          await setDoc(userDocRef, reSanitizedDocData, { merge: true });
        } else {
          throw setDocError;
        }
      }
      // Successfully uploaded to cloud

      // Verify the upload by reading back from subcollections (only log errors)
      try {
        // Wait a bit for Firestore to process the subcollection writes
        await new Promise((resolve) => setTimeout(resolve, 500));

        const verifyExercisesSnap = await getDocs(exercisesCollectionRef);
        const verifyBadgesSnap = await getDocs(badgesCollectionRef);

        const verifyExercisesCount = verifyExercisesSnap.docs.length;
        const verifyBadgesCount = verifyBadgesSnap.docs.length;

        // Verification check (silent - only log in development)
        if (
          process.env.NODE_ENV === 'development' &&
          (verifyExercisesCount !== data.activities.length ||
            verifyBadgesCount !== data.badges.length)
        ) {
          console.warn('Upload verification mismatch', {
            expectedExercises: data.activities.length,
            actualExercises: verifyExercisesCount,
            expectedBadges: data.badges.length,
            actualBadges: verifyBadgesCount,
          });
        }
      } catch (verifyError) {
        // Silent fail - verification is not critical
      }

      // Reset flag after a short delay
      setTimeout(() => {
        this.isUploading = false;
        // Update last upload timestamp to prevent listener from processing our own writes
        this.lastUploadTimestamp = Date.now();
        // Keep lastUploadTimestamp for 5 seconds to ignore our own snapshots
        setTimeout(() => {
          this.lastUploadTimestamp = 0;
        }, 5000);
      }, 1000);
    } catch (error: any) {
      const errorCode = (error as any)?.code;
      const errorMessage = (error as any)?.message;

      if (errorCode === 'permission-denied') {
        throw new Error('PERMISSION_DENIED: Firestore security rules do not allow write access.');
      }

      this.isUploading = false;
      // Update last upload timestamp even on error to prevent listener from processing failed writes
      this.lastUploadTimestamp = Date.now();
      throw error;
    }
  }

  /**
   * Download data from cloud
   */
  async downloadFromCloud(): Promise<CloudData | null> {
    if (!this.isConfigured()) {
      throw new Error('Cloud sync not configured');
    }

    try {
      const userDocRef = this.getUserDocRef();
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        return null;
      }

      const userData = userDocSnap.data();
      const lastModified = userData.lastModified
        ? (userData.lastModified as Timestamp).toDate()
        : null;

      // Download from subcollections (new structure)
      const exercisesCollectionRef = this.getExercisesCollectionRef();
      const activitiesCollectionRef = this.getActivitiesCollectionRef();
      const challengesCollectionRef = this.getChallengesCollectionRef();
      const badgesCollectionRef = this.getBadgesCollectionRef();

      // Fetch all subcollections in parallel
      const [exercisesSnap, activitiesSnap, challengesSnap, badgesSnap] = await Promise.all([
        getDocs(exercisesCollectionRef),
        getDocs(activitiesCollectionRef),
        getDocs(challengesCollectionRef),
        getDocs(badgesCollectionRef),
      ]);

      // Convert exercises (Firestore Timestamp -> Date -> ISO string)
      const exercises: ActivityRecord[] = exercisesSnap.docs.map((doc) => {
        const data = doc.data();
        const performedAt = data.performedAt
          ? (data.performedAt as Timestamp).toDate().toISOString()
          : new Date().toISOString();
        return {
          ...data,
          performedAt,
        } as ActivityRecord;
      });

      // Convert activities (ActivityDefinition[])
      // Include all activity definitions (both default and custom) from subcollection
      const activities = activitiesSnap.docs.map((doc) => doc.data() as ActivityDefinition);

      // Convert challenges
      const challenges = challengesSnap.docs.map((doc) => doc.data() as Challenge);

      // Convert badges (Firestore Timestamp -> Date)
      const badges = badgesSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          unlockedAt: data.unlockedAt ? (data.unlockedAt as Timestamp).toDate() : undefined,
        } as Badge;
      });

      // Get settings from user document (if exists, for backward compatibility)
      const settingsFromDoc = userData.settings || null;

      // Merge custom activities from subcollection into settings
      // Filter only custom activities (not default ones)
      const customActivities = activities.filter((activity) => activity.isCustom);

      const settings = settingsFromDoc
        ? {
            ...settingsFromDoc,
            customActivities:
              customActivities.length > 0
                ? customActivities
                : settingsFromDoc.customActivities || [],
          }
        : customActivities.length > 0
          ? {
              name: '',
              dailyTarget: 10000,
              customActivities,
              mood: null,
            }
          : null;

      // Successfully downloaded from cloud

      return {
        exercises, // New structure: exercises collection
        activities, // New structure: activities collection (definitions)
        challenges,
        badges,
        points: userData.points || 0,
        lastModified,
        metadata: {
          lastModified: lastModified || new Date(),
          version: Date.now(),
          userId: this.userId!,
        },
        // Legacy fields for backward compatibility
        settings,
      };
    } catch (error) {
      console.error('Failed to download from cloud:', error);
      throw error;
    }
  }

  /**
   * Subscribe to cloud data changes
   */
  subscribeToCloud(callback: (data: CloudData | null) => void): () => void {
    if (!this.isConfigured()) {
      return () => {};
    }

    try {
      const userDocRef = this.getUserDocRef();
      // Subscribing to cloud changes

      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnap: DocumentSnapshot) => {
          // Ignore snapshots that are triggered by our own uploads
          if (this.isUploading) {
            return;
          }

          // Check upload ID first (most reliable method to prevent self-trigger)
          if (docSnap.exists()) {
            const data = docSnap.data();
            const uploadId = data?.metadata?.uploadId as string | undefined;

            if (uploadId && uploadId === this.lastUploadId) {
              return; // Ignoring snapshot (our own upload detected by upload ID)
            }
          }

          // Check if this is from cache (our own write) or has pending writes
          const isFromCache = docSnap.metadata.fromCache;
          const hasPendingWrites = docSnap.metadata.hasPendingWrites;

          // Ignore snapshots that arrive within 5 seconds of our upload (likely our own write)
          // Increased from 3 seconds to prevent false positives
          const now = Date.now();
          const timeSinceUpload = now - this.lastUploadTimestamp;
          const isRecentUpload = this.lastUploadTimestamp > 0 && timeSinceUpload < 5000;

          // Ignore cache/pending writes if it's a recent upload OR if we're currently uploading
          // Otherwise, allow cache reads (important for initial sync after login)
          if ((isFromCache || hasPendingWrites) && (isRecentUpload || this.isUploading)) {
            return; // Ignoring snapshot (from cache/pending writes AND recent upload/uploading)
          }

          // Also ignore if it's a recent upload (even if not from cache)
          if (isRecentUpload) {
            return; // Ignoring snapshot (recent upload, likely our own write)
          }

          // Allow cache reads for initial sync

          if (docSnap.exists()) {
            const data = docSnap.data();
            const lastModified = data?.metadata?.lastModified;

            // Prevent rapid re-downloads (debounce: wait at least 2 seconds between downloads)
            const now = Date.now();
            const timeSinceLastDownload = now - this.lastDownloadTimestamp;
            const isRecentDownload = this.lastDownloadTimestamp > 0 && timeSinceLastDownload < 2000;

            if (isRecentDownload) {
              // Ignoring snapshot (recent download, debouncing)
              return;
            }

            // Cloud snapshot received - external change detected

            // Always download from subcollections for accurate data
            // Document may contain stale data from old structure
            // Download from subcollections asynchronously
            this.lastDownloadTimestamp = now;
            this.downloadFromCloud()
              .then((cloudData) => {
                if (cloudData) {
                  // Calculate hash of downloaded data to prevent duplicate processing
                  const dataHash = JSON.stringify({
                    exercises: cloudData.exercises?.length || 0,
                    badges: cloudData.badges?.length || 0,
                    challenges: cloudData.challenges?.length || 0,
                    lastModified: cloudData.lastModified?.getTime() || 0,
                  });

                  // Only callback if data actually changed
                  if (this.lastDownloadedDataHash !== dataHash) {
                    this.lastDownloadedDataHash = dataHash;
                    callback(cloudData);
                  } else {
                    // Data unchanged, skipping callback
                  }
                } else {
                  callback(null);
                }
              })
              .catch(() => {
                callback(null);
              });
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error('Cloud sync subscription error:', error);
          callback(null);
        }
      );

      const listenerId = `sync-${Date.now()}`;
      this.syncListeners.set(listenerId, unsubscribe);

      return () => {
        unsubscribe();
        this.syncListeners.delete(listenerId);
      };
    } catch (error) {
      console.error('Failed to subscribe to cloud:', error);
      return () => {};
    }
  }

  /**
   * Cleanup all listeners
   */
  cleanup() {
    this.syncListeners.forEach((unsubscribe) => unsubscribe());
    this.syncListeners.clear();
  }
}

export const cloudSyncService = new CloudSyncService();
