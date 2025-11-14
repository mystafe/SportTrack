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
       * Recursively remove undefined values from an object/array
       * Firestore doesn't accept undefined values
       */
      const removeUndefined = (obj: any): any => {
        if (obj === null || obj === undefined) {
          return null;
        }

        if (Array.isArray(obj)) {
          return obj.map(removeUndefined).filter((item) => item !== undefined);
        }

        if (typeof obj === 'object' && obj.constructor === Object) {
          const cleaned: any = {};
          for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
              cleaned[key] = removeUndefined(value);
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
          { merge: true }
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

      // Clean all data to remove undefined values
      const cleanedActivities = removeUndefined(data.activities || []);
      const cleanedBadges = removeUndefined(data.badges || []);
      const cleanedChallenges = removeUndefined(data.challenges || []);

      const cloudData: CloudData = {
        activities: cleanedActivities,
        settings: cleanedSettings,
        badges: cleanedBadges,
        challenges: cleanedChallenges,
        metadata,
      };

      const docData = removeUndefined({
        ...cloudData,
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
      });

      await setDoc(userDocRef, docData);
      console.log('✅ Successfully uploaded to cloud!');

      // Reset flag after a short delay
      setTimeout(() => {
        console.log('🔄 Resetting isUploading flag');
        this.isUploading = false;
      }, 2000);
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

          if (isFromCache || hasPendingWrites) {
            console.log('⏭️ Ignoring snapshot (from cache or pending writes)', {
              fromCache: isFromCache,
              hasPendingWrites: hasPendingWrites,
            });
            return;
          }

          if (docSnap.exists()) {
            const data = docSnap.data();
            const lastModified = data?.metadata?.lastModified;

            console.log('📥 Cloud snapshot received (from listener) - external change detected');

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
