/**
 * Batch Sync Service
 * Batches database operations and sends them once per minute
 * Flushes immediately on logout
 */

import { cloudSyncService } from './syncService';
import type { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';
import type { Badge } from '@/lib/badges';
import type { Challenge } from '@/lib/challenges';

type PendingChange = {
  type: 'activities' | 'settings' | 'badges' | 'challenges';
  data: {
    activities?: ActivityRecord[];
    settings?: UserSettings | null;
    badges?: Badge[];
    challenges?: Challenge[];
  };
  timestamp: number;
};

class BatchSyncService {
  private pendingChanges: PendingChange[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;
  private readonly BATCH_INTERVAL_MS = 60000; // 1 minute
  private lastBatchTime: number = 0;

  /**
   * Add a change to the batch queue
   */
  addChange(data: {
    activities?: ActivityRecord[];
    settings?: UserSettings | null;
    badges?: Badge[];
    challenges?: Challenge[];
  }): void {
    // Determine change type based on what's provided
    let changeType: 'activities' | 'settings' | 'badges' | 'challenges' = 'activities';
    if (data.settings !== undefined) changeType = 'settings';
    else if (data.badges !== undefined) changeType = 'badges';
    else if (data.challenges !== undefined) changeType = 'challenges';

    // Merge with existing pending changes of the same type
    const existingIndex = this.pendingChanges.findIndex((c) => c.type === changeType);
    if (existingIndex >= 0) {
      // Merge: keep the latest data
      this.pendingChanges[existingIndex] = {
        type: changeType,
        data: {
          ...this.pendingChanges[existingIndex].data,
          ...data,
        },
        timestamp: Date.now(),
      };
    } else {
      // Add new change
      this.pendingChanges.push({
        type: changeType,
        data,
        timestamp: Date.now(),
      });
    }

    // Start batch timer if not already running
    this.startBatchTimer();
  }

  /**
   * Start the batch timer
   * Only starts if there are pending changes
   */
  private startBatchTimer(): void {
    // Don't start timer if there are no pending changes
    if (this.pendingChanges.length === 0) {
      return;
    }

    if (this.batchTimer) {
      return; // Timer already running
    }

    // Calculate time until next minute boundary
    const now = Date.now();
    const timeSinceLastBatch = now - this.lastBatchTime;
    const timeUntilNextBatch = Math.max(0, this.BATCH_INTERVAL_MS - timeSinceLastBatch);

    this.batchTimer = setTimeout(() => {
      this.flushBatch();
    }, timeUntilNextBatch);
  }

  /**
   * Flush all pending changes immediately
   */
  async flushBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.pendingChanges.length === 0 || this.isSyncing) {
      return;
    }

    this.isSyncing = true;

    try {
      // Merge all pending changes into a single data object
      const mergedData: {
        activities: ActivityRecord[];
        settings: UserSettings | null;
        badges: Badge[];
        challenges: Challenge[];
      } = {
        activities: [],
        settings: null,
        badges: [],
        challenges: [],
      };

      // Process changes in order (newest first)
      const sortedChanges = [...this.pendingChanges].sort((a, b) => b.timestamp - a.timestamp);

      for (const change of sortedChanges) {
        if (change.data.activities) {
          mergedData.activities = change.data.activities;
        }
        if (change.data.settings !== undefined) {
          mergedData.settings = change.data.settings;
        }
        if (change.data.badges) {
          mergedData.badges = change.data.badges;
        }
        if (change.data.challenges) {
          mergedData.challenges = change.data.challenges;
        }
      }

      // Only sync if there's actual data
      const hasData =
        mergedData.activities.length > 0 ||
        mergedData.badges.length > 0 ||
        mergedData.challenges.length > 0 ||
        (mergedData.settings !== null && mergedData.settings.name?.trim() !== '');

      if (hasData && cloudSyncService.isConfigured()) {
        await cloudSyncService.uploadToCloud(mergedData);
        this.lastBatchTime = Date.now();
      }

      // Clear pending changes after successful sync
      this.pendingChanges = [];
    } catch (error) {
      console.error('Batch sync failed:', error);
      // Keep pending changes for retry
    } finally {
      this.isSyncing = false;
      // Restart timer if there are new changes
      if (this.pendingChanges.length > 0) {
        this.startBatchTimer();
      }
    }
  }

  /**
   * Get pending changes count
   */
  getPendingCount(): number {
    return this.pendingChanges.length;
  }

  /**
   * Clear all pending changes
   */
  clear(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    this.pendingChanges = [];
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.clear();
  }
}

export const batchSyncService = new BatchSyncService();
