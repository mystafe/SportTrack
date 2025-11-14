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
  type DocumentSnapshot,
} from 'firebase/firestore';
import type { SyncStatus, CloudData, SyncMetadata } from './types';
import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { Badge } from '@/lib/badges';
import { Challenge } from '@/lib/challenges';

export class CloudSyncService {
  private userId: string | null = null;
  private syncListeners: Map<string, () => void> = new Map();
  private isUploading: boolean = false; // Flag to prevent listener from triggering on our own writes
  private lastUploadTimestamp: number = 0; // Track when we last uploaded to ignore our own snapshots

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
   * Upload local data to cloud
   */
  async uploadToCloud(data: {
    activities: ActivityRecord[];
    settings: UserSettings | null;
    badges: Badge[];
    challenges: Challenge[];
  }): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Cloud sync not configured');
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
       */
      const validateAndSanitizeDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) {
          return new Date().toISOString();
        }

        try {
          const date = new Date(dateStr);
          // Check if date is valid
          if (Number.isNaN(date.getTime())) {
            console.warn('⚠️ Invalid date detected during sync, using current date:', dateStr);
            return new Date().toISOString();
          }
          // Check if date is reasonable (not too far in past/future)
          const now = Date.now();
          const dateTime = date.getTime();
          const tenYearsAgo = now - 10 * 365 * 24 * 60 * 60 * 1000;
          const tenYearsFuture = now + 10 * 365 * 24 * 60 * 60 * 1000;

          if (dateTime < tenYearsAgo || dateTime > tenYearsFuture) {
            console.warn(
              '⚠️ Date out of reasonable range during sync, using current date:',
              dateStr
            );
            return new Date().toISOString();
          }

          return date.toISOString();
        } catch (error) {
          console.warn('⚠️ Error parsing date during sync, using current date:', dateStr, error);
          return new Date().toISOString();
        }
      };

      /**
       * Recursively remove undefined values and validate dates from an object/array
       * Firestore doesn't accept undefined values
       */
      const removeUndefined = (obj: any): any => {
        if (obj === null || obj === undefined) {
          return null;
        }

        if (Array.isArray(obj)) {
          return obj
            .map((item) => {
              // If item is an activity record, validate its performedAt date
              if (item && typeof item === 'object' && 'performedAt' in item) {
                return {
                  ...removeUndefined(item),
                  performedAt: validateAndSanitizeDate(item.performedAt),
                };
              }
              return removeUndefined(item);
            })
            .filter((item) => item !== undefined);
        }

        if (typeof obj === 'object' && obj.constructor === Object) {
          const cleaned: any = {};
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
            const cleaned: any = {
              name: data.settings.name || '',
              dailyTarget: data.settings.dailyTarget || 10000,
              customActivities: data.settings.customActivities || [],
              mood: data.settings.mood !== undefined ? data.settings.mood : null, // Always include mood
            };
            return removeUndefined(cleaned);
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
      let cleanedActivities: ActivityRecord[];
      try {
        cleanedActivities = removeUndefined(data.activities || []) as ActivityRecord[];
        // Double-check all activities have valid dates
        cleanedActivities = cleanedActivities.map((activity) => ({
          ...activity,
          performedAt: validateAndSanitizeDate(activity.performedAt),
        }));
      } catch (error) {
        console.error('❌ Error cleaning activities:', error);
        // If cleaning fails, try to salvage valid activities
        cleanedActivities = (data.activities || []).map((activity) => ({
          ...activity,
          performedAt: validateAndSanitizeDate(activity.performedAt),
        }));
      }

      const cleanedBadges = removeUndefined(data.badges || []);
      const cleanedChallenges = removeUndefined(data.challenges || []);

      const cloudData: CloudData = {
        activities: cleanedActivities,
        settings: cleanedSettings,
        badges: cleanedBadges,
        challenges: cleanedChallenges,
        metadata,
      };

      // Ensure we're sending complete data, not partial updates
      const docData = removeUndefined({
        activities: data.activities,
        settings: cleanedSettings,
        badges: data.badges,
        challenges: data.challenges,
        metadata: {
          ...metadata,
          lastModified: serverTimestamp(),
        },
      });

      console.log('📤 Uploading full data:', {
        activities: data.activities.length,
        settings: data.settings ? 'present' : 'null',
        badges: data.badges.length,
        challenges: data.challenges.length,
        totalActivitiesPoints: data.activities.reduce(
          (sum: number, act: any) => sum + (act.points || 0),
          0
        ),
      });

      const uploadStartTime = Date.now();
      this.lastUploadTimestamp = uploadStartTime; // Track upload time
      // Use merge: true to preserve existing fields that we're not updating
      try {
        await setDoc(userDocRef, docData, { merge: true });
      } catch (setDocError: any) {
        // Check if error is related to invalid dates
        if (
          setDocError?.message?.includes('Invalid time') ||
          setDocError?.message?.includes('RangeError')
        ) {
          console.error('❌ Date validation error during upload, retrying with sanitized dates...');
          // Re-sanitize all dates and retry once
          const reSanitizedDocData = {
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

          // Check if this is from cache (our own write) or has pending writes
          const isFromCache = docSnap.metadata.fromCache;
          const hasPendingWrites = docSnap.metadata.hasPendingWrites;

          // Ignore snapshots that arrive within 3 seconds of our upload (likely our own write)
          const now = Date.now();
          const timeSinceUpload = now - this.lastUploadTimestamp;
          const isRecentUpload = this.lastUploadTimestamp > 0 && timeSinceUpload < 3000;

          // Only ignore cache/pending writes if it's a recent upload
          // Otherwise, allow cache reads (important for initial sync after login)
          if ((isFromCache || hasPendingWrites) && isRecentUpload) {
            console.log('⏭️ Ignoring snapshot (from cache/pending writes AND recent upload)', {
              fromCache: isFromCache,
              hasPendingWrites: hasPendingWrites,
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
