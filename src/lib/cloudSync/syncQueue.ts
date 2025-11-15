/**
 * Sync Queue Service
 * Manages offline changes queue for cloud synchronization
 */

import { STORAGE_KEYS } from '@/lib/constants';
import type { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';
import type { Badge } from '@/lib/badges';
import type { Challenge } from '@/lib/challenges';

export type SyncQueueItemType = 'create' | 'update' | 'delete';
export type SyncQueueCollection = 'exercises' | 'activities' | 'settings' | 'badges' | 'challenges';

export interface SyncQueueItem {
  id: string;
  type: SyncQueueItemType;
  collection: SyncQueueCollection;
  data: any;
  timestamp: Date;
  retryCount: number;
  lastRetryAt?: Date;
  nextRetryAt?: Date;
  error?: string;
  errorDetails?: {
    code?: string;
    message: string;
    timestamp: Date;
  };
}

const QUEUE_STORAGE_KEY = 'sporttrack_sync_queue';
const MAX_RETRY_COUNT = 5; // Increased from 3 to 5
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 60000; // 60 seconds
const BACKOFF_MULTIPLIER = 2; // Exponential backoff multiplier

class SyncQueueService {
  private queue: SyncQueueItem[] = [];
  private listeners: Set<(queue: SyncQueueItem[]) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadQueue();
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.queue = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          lastRetryAt: item.lastRetryAt ? new Date(item.lastRetryAt) : undefined,
          nextRetryAt: item.nextRetryAt ? new Date(item.nextRetryAt) : undefined,
          errorDetails: item.errorDetails
            ? {
                ...item.errorDetails,
                timestamp: new Date(item.errorDetails.timestamp),
              }
            : undefined,
        }));
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      this.queue = [];
    }
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateRetryDelay(retryCount: number): number {
    const delay = Math.min(
      INITIAL_RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, retryCount),
      MAX_RETRY_DELAY
    );
    return delay;
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  /**
   * Notify all listeners about queue changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener([...this.queue]));
  }

  /**
   * Subscribe to queue changes
   */
  subscribe(listener: (queue: SyncQueueItem[]) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current queue
    listener([...this.queue]);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Add item to queue
   */
  add(type: SyncQueueItemType, collection: SyncQueueCollection, data: any, id?: string): string {
    const itemId = id || `${collection}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const item: SyncQueueItem = {
      id: itemId,
      type,
      collection,
      data,
      timestamp: new Date(),
      retryCount: 0,
    };

    // Check if item already exists (for updates/deletes)
    const existingIndex = this.queue.findIndex(
      (q) => q.id === itemId && q.collection === collection
    );

    if (existingIndex >= 0) {
      // Update existing item
      this.queue[existingIndex] = item;
    } else {
      // Add new item
      this.queue.push(item);
    }

    this.saveQueue();
    return itemId;
  }

  /**
   * Remove item from queue
   */
  remove(itemId: string): void {
    this.queue = this.queue.filter((item) => item.id !== itemId);
    this.saveQueue();
  }

  /**
   * Mark item as failed and increment retry count with exponential backoff
   */
  markFailed(itemId: string, error: string | Error, errorCode?: string): void {
    const item = this.queue.find((q) => q.id === itemId);
    if (item) {
      item.retryCount += 1;
      item.lastRetryAt = new Date();

      const errorMessage = error instanceof Error ? error.message : error;
      item.error = errorMessage;
      item.errorDetails = {
        code:
          errorCode || (error instanceof Error && 'code' in error ? String(error.code) : undefined),
        message: errorMessage,
        timestamp: new Date(),
      };

      // Calculate next retry time with exponential backoff
      const delay = this.calculateRetryDelay(item.retryCount);
      item.nextRetryAt = new Date(Date.now() + delay);

      this.saveQueue();
    }
  }

  /**
   * Check if item is ready for retry (nextRetryAt has passed)
   */
  isReadyForRetry(item: SyncQueueItem): boolean {
    if (!item.nextRetryAt) {
      return true; // No retry scheduled, ready immediately
    }
    return new Date() >= item.nextRetryAt;
  }

  /**
   * Clear all items from queue
   */
  clear(): void {
    this.queue = [];
    this.saveQueue();
  }

  /**
   * Clear failed items (exceeded max retry count)
   */
  clearFailed(): void {
    this.queue = this.queue.filter((item) => item.retryCount < MAX_RETRY_COUNT);
    this.saveQueue();
  }

  /**
   * Get all items in queue
   */
  getAll(): SyncQueueItem[] {
    return [...this.queue];
  }

  /**
   * Get pending items (not failed and ready for retry)
   */
  getPending(): SyncQueueItem[] {
    return this.queue.filter(
      (item) => item.retryCount < MAX_RETRY_COUNT && this.isReadyForRetry(item)
    );
  }

  /**
   * Get items waiting for retry (not ready yet due to backoff)
   */
  getWaitingForRetry(): SyncQueueItem[] {
    return this.queue.filter(
      (item) => item.retryCount < MAX_RETRY_COUNT && item.nextRetryAt && !this.isReadyForRetry(item)
    );
  }

  /**
   * Get failed items
   */
  getFailed(): SyncQueueItem[] {
    return this.queue.filter((item) => item.retryCount >= MAX_RETRY_COUNT);
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Get pending count
   */
  pendingCount(): number {
    return this.getPending().length;
  }

  /**
   * Get failed count
   */
  failedCount(): number {
    return this.getFailed().length;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Process queue items (for sync service to use)
   */
  async processQueue(
    syncFn: (data: {
      activities: ActivityRecord[];
      settings: UserSettings | null;
      badges: Badge[];
      challenges: Challenge[];
    }) => Promise<void>
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const pending = this.getPending();
    if (pending.length === 0) {
      return { success: 0, failed: 0, errors: [] };
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    // Sync current data from localStorage (queue items are already saved there)
    // The queue just tracks what needs to be synced
    try {
      // Get current data from localStorage (this is the source of truth)
      const currentExercises = this.getCurrentExercises();
      const currentSettings = this.getCurrentSettings();
      const currentBadges = this.getCurrentBadges();
      const currentChallenges = this.getCurrentChallenges();

      await syncFn({
        activities: currentExercises,
        settings: currentSettings,
        badges: currentBadges,
        challenges: currentChallenges,
      });

      // Remove successfully synced items
      pending.forEach((item) => this.remove(item.id));
      success = pending.length;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Sync failed';
      const errorCode = error instanceof Error && 'code' in error ? String(error.code) : undefined;
      errors.push(errorMsg);
      // Mark all items as failed with exponential backoff
      pending.forEach((item) => this.markFailed(item.id, errorMsg, errorCode));
      failed = pending.length;
    }

    return { success, failed, errors };
  }

  /**
   * Get current exercises from localStorage
   */
  private getCurrentExercises(): ActivityRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get current settings from localStorage
   */
  private getCurrentSettings(): UserSettings | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get current badges from localStorage
   */
  private getCurrentBadges(): Badge[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BADGES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get current challenges from localStorage
   */
  private getCurrentChallenges(): Challenge[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

// Singleton instance
export const syncQueueService = new SyncQueueService();
