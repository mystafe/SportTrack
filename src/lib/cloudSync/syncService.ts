/**
 * Cloud Sync Service
 * Handles synchronization between local storage and Firebase
 */

import { db } from '@/lib/firebase/config';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { SyncStatus, CloudData, SyncMetadata } from './types';
import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { Badge } from '@/lib/badges';
import { Challenge } from '@/lib/challenges';

export class CloudSyncService {
  private userId: string | null = null;
  private syncListeners: Map<string, () => void> = new Map();

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

    try {
      const userDocRef = this.getUserDocRef();
      const metadata: SyncMetadata = {
        lastModified: new Date(),
        version: Date.now(),
        userId: this.userId!,
      };

      const cloudData: CloudData = {
        activities: data.activities,
        settings: data.settings,
        badges: data.badges,
        challenges: data.challenges,
        metadata,
      };

      await setDoc(userDocRef, {
        ...cloudData,
        metadata: {
          ...metadata,
          lastModified: serverTimestamp(),
        },
      });
    } catch (error) {
      console.error('Failed to upload to cloud:', error);
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
      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const lastModified = data.metadata?.lastModified;

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
