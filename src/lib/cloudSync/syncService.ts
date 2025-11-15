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

    console.log('📤 Uploading converted data to cloud (new format)...');
    console.log('📋 Data summary:', {
      activities: convertedData.activities.length,
      exercises: convertedData.exercises.length,
      statistics: convertedData.statistics.length,
      challenges: convertedData.challenges.length,
      points: convertedData.points,
    });

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
        convertedData.challenges.length;

      if (totalOperations > MAX_BATCH_SIZE) {
        console.log(
          `⚠️ Large dataset detected (${totalOperations} operations). Splitting into multiple batches...`
        );

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
          batch1.set(activityDocRef, activity, { merge: true });
        }

        for (const stat of convertedData.statistics) {
          const statDocRef = doc(statisticsCollectionRef, stat.id);
          const statData = {
            ...stat,
            lastCalculated: Timestamp.fromDate(stat.lastCalculated),
            period: stat.period
              ? {
                  start: Timestamp.fromDate(stat.period.start),
                  end: Timestamp.fromDate(stat.period.end),
                }
              : undefined,
          };
          batch1.set(statDocRef, statData, { merge: true });
        }

        for (const challenge of convertedData.challenges) {
          const challengeDocRef = doc(challengesCollectionRef, challenge.id);
          batch1.set(challengeDocRef, challenge, { merge: true });
        }

        batches.push(batch1.commit());

        // Batch 2+: Exercises (split into chunks of 500)
        const exercisesPerBatch = MAX_BATCH_SIZE;
        for (let i = 0; i < convertedData.exercises.length; i += exercisesPerBatch) {
          const batch = writeBatch(db!);
          const chunk = convertedData.exercises.slice(i, i + exercisesPerBatch);

          for (const exercise of chunk) {
            const exerciseDocRef = doc(exercisesCollectionRef, exercise.id);
            const exerciseData = {
              ...exercise,
              performedAt: Timestamp.fromDate(new Date(exercise.performedAt)),
            };
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
          batch.set(activityDocRef, activity, { merge: true });
        }

        // 3. Upload exercises (exercise records)
        for (const exercise of convertedData.exercises) {
          const exerciseDocRef = doc(exercisesCollectionRef, exercise.id);
          // Ensure performedAt is a Timestamp
          const exerciseData = {
            ...exercise,
            performedAt: Timestamp.fromDate(new Date(exercise.performedAt)),
          };
          batch.set(exerciseDocRef, exerciseData, { merge: true });
        }

        // 4. Upload statistics
        for (const stat of convertedData.statistics) {
          const statDocRef = doc(statisticsCollectionRef, stat.id);
          const statData = {
            ...stat,
            lastCalculated: Timestamp.fromDate(stat.lastCalculated),
            period: stat.period
              ? {
                  start: Timestamp.fromDate(stat.period.start),
                  end: Timestamp.fromDate(stat.period.end),
                }
              : undefined,
          };
          batch.set(statDocRef, statData, { merge: true });
        }

        // 5. Upload challenges
        for (const challenge of convertedData.challenges) {
          const challengeDocRef = doc(challengesCollectionRef, challenge.id);
          batch.set(challengeDocRef, challenge, { merge: true });
        }

        // Commit batch
        await batch.commit();
      }

      console.log('✅ Successfully uploaded converted data to cloud!');
      console.log('📋 Uploaded:', {
        activities: convertedData.activities.length,
        exercises: convertedData.exercises.length,
        statistics: convertedData.statistics.length,
        challenges: convertedData.challenges.length,
      });
    } catch (error) {
      console.error('❌ Failed to upload converted data:', error);
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
      console.log('🔄 Reset operation: Uploading empty data to cloud to clear cloud storage');
    }

    // Set flag to prevent listener from processing our own writes
    this.isUploading = true;

    try {
      // Check authentication first
      if (!auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      const userDocRef = this.getUserDocRef();

      console.log('📤 Starting upload...');
      console.log('📋 Document path:', userDocRef.path);
      console.log('🔐 User ID:', this.userId);
      console.log('👤 Auth user:', auth.currentUser.uid);
      console.log('✅ Auth matches:', auth.currentUser.uid === this.userId);

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
            console.warn('⚠️ Invalid date detected during sync, using current date:', dateStr);
            return fallbackDate.toISOString();
          }

          // Check if date is reasonable (not too far in past/future)
          const now = Date.now();
          const tenYearsAgo = now - 10 * 365 * 24 * 60 * 60 * 1000;
          const tenYearsFuture = now + 10 * 365 * 24 * 60 * 60 * 1000;

          if (timeValue < tenYearsAgo || timeValue > tenYearsFuture) {
            console.warn(
              '⚠️ Date out of reasonable range during sync, using current date:',
              dateStr
            );
            return fallbackDate.toISOString();
          }

          // Try to convert to ISO string - this can throw RangeError for invalid dates
          try {
            const isoString = date.toISOString();
            // Validate the ISO string is not empty or malformed
            if (!isoString || isoString.length === 0 || !isoString.includes('T')) {
              console.warn('⚠️ Invalid ISO string generated, using current date:', dateStr);
              return fallbackDate.toISOString();
            }
            return isoString;
          } catch (isoError) {
            // RangeError: Invalid time value
            console.warn(
              '⚠️ RangeError converting to ISO string, using current date:',
              dateStr,
              isoError
            );
            return fallbackDate.toISOString();
          }
        } catch (error) {
          // Catch any other errors (TypeError, etc.)
          console.warn('⚠️ Error parsing date during sync, using current date:', dateStr, error);
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
      console.log('🧪 Testing simple write...');
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

        const result = await Promise.race([testWritePromise, timeoutPromise]);
        console.log('✅ Test write successful!', result);
      } catch (testError: any) {
        console.error('❌ Test write failed:', testError);
        console.error('Error code:', testError?.code);
        console.error('Error message:', testError?.message);

        if (testError?.code === 'permission-denied') {
          console.error('🚫 PERMISSION DENIED!');
          console.error('📋 Adımlar:');
          console.error('1. Firebase Console → Firestore Database');
          console.error('2. Eğer database yoksa: "Create database" butonuna tıklayın');
          console.error('3. Rules sekmesine gidin');
          console.error("4. Şu rules'ları ekleyin ve Publish yapın:");
          console.error(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
          `);
        } else if (testError?.message?.includes('timeout')) {
          console.error('⏱️ TIMEOUT - Firestore database oluşturulmamış olabilir!');
          console.error('📋 Adımlar:');
          console.error('1. Firebase Console → Firestore Database');
          console.error('2. "Create database" butonuna tıklayın');
          console.error('3. "Start in test mode" seçin (güvenlik için sonra rules ekleyeceğiz)');
          console.error('4. Location seçin (örn: us-central1)');
          console.error('5. "Enable" butonuna tıklayın');
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
            console.warn(
              '⚠️ Invalid date in activity, using current date:',
              activity.id,
              activity.performedAt,
              dateError
            );
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
            console.error(
              '❌ Final date validation failed for activity:',
              activity.id,
              activity.performedAt,
              finalError
            );
            return {
              ...activity,
              performedAt: new Date().toISOString(),
            };
          }
        });
      } catch (error) {
        console.error('❌ Error cleaning activities:', error);
        // If cleaning fails, try to salvage valid activities with safe dates
        cleanedActivities = (data.activities || []).map((activity) => {
          try {
            return {
              ...activity,
              performedAt: validateAndSanitizeDate(activity.performedAt),
            };
          } catch (salvageError) {
            console.error(
              '❌ Cannot salvage activity, using current date:',
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

      const cleanedBadgesRaw = removeUndefined(data.badges || []);
      const cleanedBadges = Array.isArray(cleanedBadgesRaw) ? cleanedBadgesRaw : [];

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
      // IMPORTANT: Use cleanedActivities (with validated dates) instead of raw data.activities
      const docDataRaw = removeUndefined({
        activities: cleanedActivities, // Use cleaned activities with validated dates
        settings: cleanedSettings,
        badges: cleanedBadges,
        challenges: cleanedChallenges,
        metadata: {
          ...metadata,
          lastModified: serverTimestamp(),
        },
      });
      const docData =
        typeof docDataRaw === 'object' && docDataRaw !== null
          ? (docDataRaw as Record<string, unknown>)
          : {};

      console.log('📤 Uploading full data:', {
        activities: data.activities.length,
        settings: data.settings ? 'present' : 'null',
        badges: data.badges.length,
        challenges: data.challenges.length,
        totalActivitiesPoints: data.activities.reduce(
          (sum: number, act: ActivityRecord) => sum + (act.points || 0),
          0
        ),
      });

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
            setDocError.message.includes('RangeError'))
        ) {
          console.error('❌ Date validation error during upload, retrying with sanitized dates...');
          // Re-sanitize all dates and retry once
          const reSanitizedDocData: Record<string, unknown> = {
            ...docData,
            activities: cleanedActivities.map((activity) => ({
              ...activity,
              performedAt: validateAndSanitizeDate(activity.performedAt),
            })),
          };
          await setDoc(userDocRef, reSanitizedDocData, { merge: true });
        } else {
          throw setDocError;
        }
      }
      const uploadDuration = Date.now() - uploadStartTime;
      console.log(`✅ Successfully uploaded to cloud! (${uploadDuration}ms)`);
      console.log('📋 Uploaded data summary:', {
        activitiesCount: data.activities.length,
        badgesCount: data.badges.length,
        challengesCount: data.challenges.length,
        hasSettings: !!data.settings,
      });

      // Verify the upload by reading back immediately
      try {
        const verifyDoc = await getDoc(userDocRef);
        if (verifyDoc.exists()) {
          const verifyData = verifyDoc.data();
          const verifyActivitiesCount = verifyData.activities?.length || 0;
          const verifyBadgesCount = verifyData.badges?.length || 0;
          console.log('🔍 Upload doğrulama:', {
            activitiesCount: verifyActivitiesCount,
            badgesCount: verifyBadgesCount,
            challengesCount: verifyData.challenges?.length || 0,
            beklenenActivities: data.activities.length,
            beklenenBadges: data.badges.length,
            eşleşiyor:
              verifyActivitiesCount === data.activities.length &&
              verifyBadgesCount === data.badges.length,
          });

          if (
            verifyActivitiesCount !== data.activities.length ||
            verifyBadgesCount !== data.badges.length
          ) {
            console.error("⚠️ UYARI: Upload edilen veri ile cloud'daki veri eşleşmiyor!");
            console.error(
              'Bu, başka bir yerden verilerin silindiği veya üzerine yazıldığı anlamına gelebilir.'
            );
          }
        }
      } catch (verifyError) {
        console.warn('⚠️ Upload doğrulama hatası:', verifyError);
      }

      // Reset flag after a short delay (reduced from 2000ms to 1000ms for faster sync)
      setTimeout(() => {
        console.log('🔄 Resetting isUploading flag');
        this.isUploading = false;
        // Update last upload timestamp to prevent listener from processing our own writes
        this.lastUploadTimestamp = Date.now();
        // Keep lastUploadTimestamp for 5 seconds to ignore our own snapshots
        setTimeout(() => {
          this.lastUploadTimestamp = 0;
        }, 5000);
      }, 1000);
    } catch (error: any) {
      console.error('❌ Failed to upload to cloud:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);

      if (error?.code === 'permission-denied') {
        console.error('🚫 PERMISSION DENIED!');
        console.error("Firebase Console → Firestore Database → Rules → Şu rules'ları ekleyin:");
        console.error(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
        `);
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
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      const lastModified = data.metadata?.lastModified;

      return {
        activities: data.activities || [],
        settings: data.settings || null,
        badges: data.badges || [],
        challenges: data.challenges || [],
        metadata: {
          lastModified: lastModified ? (lastModified as Timestamp).toDate() : new Date(),
          version: data.metadata?.version || 0,
          userId: this.userId!,
        },
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
      console.log('👂 Subscribing to cloud changes for user:', this.userId);

      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnap: DocumentSnapshot) => {
          // Ignore snapshots that are triggered by our own uploads
          if (this.isUploading) {
            console.log('⏭️ Ignoring snapshot (we are uploading) - metadata:', docSnap.metadata);
            return;
          }

          // Check upload ID first (most reliable method to prevent self-trigger)
          if (docSnap.exists()) {
            const data = docSnap.data();
            const uploadId = data?.metadata?.uploadId as string | undefined;

            if (uploadId && uploadId === this.lastUploadId) {
              console.log('⏭️ Ignoring snapshot (our own upload detected by upload ID)', {
                uploadId,
              });
              return;
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
            console.log(
              '⏭️ Ignoring snapshot (from cache/pending writes AND recent upload/uploading)',
              {
                fromCache: isFromCache,
                hasPendingWrites: hasPendingWrites,
                timeSinceUpload: `${timeSinceUpload}ms`,
                isUploading: this.isUploading,
              }
            );
            return;
          }

          // Also ignore if it's a recent upload (even if not from cache)
          if (isRecentUpload) {
            console.log('⏭️ Ignoring snapshot (recent upload, likely our own write)', {
              timeSinceUpload: `${timeSinceUpload}ms`,
            });
            return;
          }

          // Log cache reads for debugging (but don't ignore them)
          if (isFromCache) {
            console.log('📥 Snapshot from cache (allowing for initial sync):', {
              exists: docSnap.exists(),
              hasData: docSnap.exists() ? Object.keys(docSnap.data() || {}).length : 0,
            });
          }

          if (docSnap.exists()) {
            const data = docSnap.data();
            const lastModified = data?.metadata?.lastModified;

            console.log('📥 Cloud snapshot received (from listener) - external change detected', {
              activitiesCount: data.activities?.length || 0,
              badgesCount: data.badges?.length || 0,
              challengesCount: data.challenges?.length || 0,
              hasSettings: !!data.settings,
              lastModified: lastModified
                ? new Date((lastModified as Timestamp).toDate()).toLocaleString()
                : 'unknown',
            });

            callback({
              activities: data.activities || [],
              settings: data.settings || null,
              badges: data.badges || [],
              challenges: data.challenges || [],
              metadata: {
                lastModified: lastModified ? (lastModified as Timestamp).toDate() : new Date(),
                version: data.metadata?.version || 0,
                userId: this.userId!,
              },
            });
          } else {
            console.log('📭 No document found in cloud');
            callback(null);
          }
        },
        (error) => {
          console.error('❌ Cloud sync subscription error:', error);
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
