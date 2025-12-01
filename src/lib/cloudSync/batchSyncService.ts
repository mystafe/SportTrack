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
  private consecutiveFailures: number = 0;
  private readonly MAX_CONSECUTIVE_FAILURES = 3; // Stop retrying after 3 failures
  private lastFailureTime: number = 0;
  private readonly BACKOFF_BASE_MS = 60000; // Start with 1 minute

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
   * Only starts if there are pending changes and not in backoff period
   */
  private startBatchTimer(): void {
    // Don't start timer if there are no pending changes
    if (this.pendingChanges.length === 0) {
      return;
    }

    // Don't start if Firebase is not configured
    if (!cloudSyncService.isConfigured()) {
      // Clear pending changes if Firebase is not configured
      this.pendingChanges = [];
      return;
    }

    // Don't start if we've exceeded max consecutive failures
    if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
      // Clear pending changes to prevent infinite loop
      this.pendingChanges = [];
      this.consecutiveFailures = 0;
      return;
    }

    if (this.batchTimer) {
      return; // Timer already running
    }

    // Calculate time until next batch (with exponential backoff on failures)
    const now = Date.now();
    const timeSinceLastBatch = now - this.lastBatchTime;
    const timeSinceLastFailure = now - this.lastFailureTime;

    // Exponential backoff: wait longer after failures
    const backoffDelay =
      this.consecutiveFailures > 0
        ? Math.min(this.BACKOFF_BASE_MS * Math.pow(2, this.consecutiveFailures - 1), 300000) // Max 5 minutes
        : 0;

    const baseDelay = Math.max(0, this.BATCH_INTERVAL_MS - timeSinceLastBatch);
    const backoffRemaining = Math.max(0, backoffDelay - timeSinceLastFailure);
    const timeUntilNextBatch = Math.max(baseDelay, backoffRemaining);

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

      // Only attempt sync if configured
      if (hasData && cloudSyncService.isConfigured()) {
        try {
          await cloudSyncService.uploadToCloud(mergedData);
          this.lastBatchTime = Date.now();
          // Reset failure counter on success
          this.consecutiveFailures = 0;
        } catch (syncError) {
          // Re-throw to be caught by outer catch block
          throw syncError;
        }
      } else if (hasData && !cloudSyncService.isConfigured()) {
        // Silently skip if not configured - don't log errors
        // Clear pending changes to prevent infinite loop
        this.pendingChanges = [];
        this.consecutiveFailures = 0;
        this.isSyncing = false;
        return;
      }

      // Clear pending changes after successful sync
      this.pendingChanges = [];
      this.consecutiveFailures = 0;
    } catch (error) {
      // Silently handle timeout/configuration errors - don't spam console
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isTimeoutError =
        errorMessage.includes('TIMEOUT') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('resource-exhausted') ||
        errorMessage.includes('Quota exceeded');

      const isConfigError =
        errorMessage.includes('not configured') ||
        errorMessage.includes('Firestore database may not exist');

      // Increment failure counter
      this.consecutiveFailures++;
      this.lastFailureTime = Date.now();

      // Only log non-timeout/config errors (and only first few times)
      if (!isTimeoutError && !isConfigError && this.consecutiveFailures <= 2) {
        console.error('Batch sync failed:', error);
      } else if (isTimeoutError || isConfigError) {
        // Use debug level for timeout/config errors (less noisy)
        // Only log first failure to avoid spam
        if (this.consecutiveFailures === 1) {
          console.debug('Batch sync skipped (timeout/config):', errorMessage);
        }
      }

      // If we've exceeded max failures or it's a config error, clear pending changes
      if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES || isConfigError) {
        // Clear pending changes to prevent infinite loop
        this.pendingChanges = [];
        this.consecutiveFailures = 0;
      }
      // Otherwise keep pending changes for retry (with backoff)
    } finally {
      this.isSyncing = false;
      // Only restart timer if:
      // 1. There are pending changes
      // 2. We haven't exceeded max failures
      // 3. Firebase is configured
      if (
        this.pendingChanges.length > 0 &&
        this.consecutiveFailures < this.MAX_CONSECUTIVE_FAILURES &&
        cloudSyncService.isConfigured()
      ) {
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
    this.consecutiveFailures = 0;
    this.lastFailureTime = 0;
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.clear();
  }
}

export const batchSyncService = new BatchSyncService();
