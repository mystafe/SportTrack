/**
 * Cloud Sync Hook
 * Manages cloud synchronization state and operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { cloudSyncService } from '@/lib/cloudSync/syncService';
import { useOnlineStatus } from './useOnlineStatus';
import { syncQueueService } from '@/lib/cloudSync/syncQueue';
import { syncHistoryService } from '@/lib/cloudSync/syncHistory';
import type { SyncStatus, SyncState } from '@/lib/cloudSync/types';

/**
 * Classify error type for retry logic
 */
function classifyError(
  error: unknown
): 'network' | 'permission' | 'validation' | 'timeout' | 'quota' | 'unknown' {
  if (!error) return 'unknown';

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = error instanceof Error && 'code' in error ? String(error.code) : '';

  // Quota errors (don't retry - Firebase quota exceeded)
  if (
    errorCode === 'resource-exhausted' ||
    errorMessage.includes('quota') ||
    errorMessage.includes('Quota exceeded') ||
    errorMessage.includes('resource-exhausted')
  ) {
    return 'quota';
  }

  // Network errors (retry)
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('Failed to fetch') ||
    errorCode === 'unavailable' ||
    errorCode === 'deadline-exceeded'
  ) {
    return 'network';
  }

  // Permission errors (don't retry)
  if (
    errorMessage.includes('permission') ||
    errorMessage.includes('PERMISSION_DENIED') ||
    errorCode === 'permission-denied'
  ) {
    return 'permission';
  }

  // Validation errors (don't retry)
  if (
    errorMessage.includes('Invalid') ||
    errorMessage.includes('validation') ||
    errorMessage.includes('Invalid time value') ||
    errorMessage.includes('RangeError')
  ) {
    return 'validation';
  }

  // Timeout errors (retry)
  if (
    errorMessage.includes('timeout') ||
    errorMessage.includes('TIMEOUT') ||
    errorCode === 'deadline-exceeded'
  ) {
    return 'timeout';
  }

  return 'unknown';
}

export function useCloudSync() {
  const { isOnline } = useOnlineStatus();
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'idle',
    lastSyncAt: null,
    error: null,
    pendingChanges: 0,
  });

  const isConfigured = cloudSyncService.isConfigured();

  const updateStatus = useCallback((status: SyncStatus, error: string | null = null) => {
    setSyncState((prev) => ({
      ...prev,
      status,
      error,
    }));
  }, []);

  const syncToCloud = useCallback(
    async (
      data: {
        activities: unknown[];
        settings: unknown | null;
        badges: unknown[];
        challenges: unknown[];
      },
      options?: {
        isReset?: boolean; // Only allow empty data upload if this is a reset operation
      }
    ): Promise<void> => {
      if (!isConfigured) {
        updateStatus('offline');
        throw new Error('Cloud sync not configured');
      }

      // Never upload empty/zeroed data to cloud EXCEPT during reset operation
      // This prevents empty local data from overwriting cloud data
      const isReset = options?.isReset === true;
      const hasData =
        (data.activities && data.activities.length > 0) ||
        (data.badges && data.badges.length > 0) ||
        (data.challenges && data.challenges.length > 0) ||
        (data.settings && data.settings !== null);

      if (!hasData && !isReset) {
        // Skipping upload: No data to upload (all empty/zeroed)
        return; // Don't upload empty data unless it's a reset
      }

      // If offline, add to queue instead of syncing
      if (!isOnline) {
        // Offline: Adding changes to sync queue
        updateStatus('offline');

        // Add all data to queue
        // Note: We add the entire dataset as a single queue item per collection type
        // This is more efficient than adding individual items
        if (data.activities.length > 0) {
          // Add all activities as a batch
          data.activities.forEach((activity: any) => {
            syncQueueService.add('update', 'exercises', activity, activity.id);
          });
        }
        if (data.settings) {
          syncQueueService.add('update', 'settings', data.settings);
        }
        if (data.badges.length > 0) {
          data.badges.forEach((badge: any) => {
            syncQueueService.add('update', 'badges', badge, badge.id);
          });
        }
        if (data.challenges.length > 0) {
          data.challenges.forEach((challenge: any) => {
            syncQueueService.add('update', 'challenges', challenge, challenge.id);
          });
        }

        const pendingCount = syncQueueService.pendingCount();
        setSyncState((prev) => ({
          ...prev,
          pendingChanges: pendingCount,
        }));

        // Don't throw error - just return silently
        // The data is already saved to localStorage and queued for sync
        // Offline: Items queued for sync
        return;
      }

      const startTime = Date.now();

      // Retry configuration
      const MAX_RETRIES = 3;
      const INITIAL_RETRY_DELAY = 1000; // 1 second
      const BACKOFF_MULTIPLIER = 2;

      let lastError: Error | null = null;

      // Retry loop with exponential backoff
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          if (attempt > 0) {
            // Calculate exponential backoff delay
            const delay = INITIAL_RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, attempt - 1);
            console.log(`🔄 Retry attempt ${attempt}/${MAX_RETRIES} after ${delay}ms delay...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          updateStatus('syncing');
          // Starting cloud sync
          // Type assertions for cloud sync service
          await cloudSyncService.uploadToCloud(
            {
              activities: data.activities as import('@/lib/activityStore').ActivityRecord[],
              settings: data.settings as import('@/lib/settingsStore').UserSettings | null,
              badges: data.badges as import('@/lib/badges').Badge[],
              challenges: data.challenges as import('@/lib/challenges').Challenge[],
            },
            options
          );

          const duration = Date.now() - startTime;
          const totalItems =
            data.activities.length +
            (data.settings ? 1 : 0) +
            data.badges.length +
            data.challenges.length;

          // Clear quota flag on successful sync
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sporttrack.quota_exceeded');
            localStorage.removeItem('sporttrack.quota_exceeded_at');
          }

          // Cloud sync completed successfully
          updateStatus('synced');
          setSyncState((prev) => ({
            ...prev,
            lastSyncAt: new Date(),
            pendingChanges: 0,
          }));

          // Record successful sync in history
          syncHistoryService.addSync('success', totalItems, duration, undefined, {
            exercises: data.activities.length,
            badges: data.badges.length,
            challenges: data.challenges.length,
            settings: !!data.settings,
          });

          return; // Success - exit retry loop
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          const errorMessage = lastError.message;

          // Classify error type
          const errorType = classifyError(error);

          // Don't retry for certain error types
          if (errorType === 'permission' || errorType === 'validation' || errorType === 'quota') {
            // Log only in development
            if (process.env.NODE_ENV === 'development') {
              console.error(`Non-retryable error (${errorType}):`, errorMessage);
            }
            // Store quota error flag to disable auto-sync
            if (errorType === 'quota' && typeof window !== 'undefined') {
              localStorage.setItem('sporttrack.quota_exceeded', 'true');
              localStorage.setItem('sporttrack.quota_exceeded_at', new Date().toISOString());
            }
            break; // Exit retry loop
          }

          // If this is the last attempt, don't retry
          if (attempt >= MAX_RETRIES) {
            // Log only in development
            if (process.env.NODE_ENV === 'development') {
              console.error(`Max retries (${MAX_RETRIES}) reached. Sync failed.`);
            }
            break;
          }

          // Continue to next retry attempt (silent)
        }
      }

      // If we get here, all retries failed
      const duration = Date.now() - startTime;
      const errorMessage = lastError?.message || 'Sync failed after retries';
      // Log error only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Cloud sync failed after retries:', errorMessage, lastError);
      }

      // Classify final error
      const errorType = classifyError(lastError);
      updateStatus('error', errorMessage);

      // Record failed sync in history
      const totalItems =
        data.activities.length +
        (data.settings ? 1 : 0) +
        data.badges.length +
        data.challenges.length;
      syncHistoryService.addSync('failed', 0, duration, `${errorType}: ${errorMessage}`, {
        exercises: data.activities.length,
        badges: data.badges.length,
        challenges: data.challenges.length,
        settings: !!data.settings,
      });

      throw lastError || new Error('Sync failed');
    },
    [isConfigured, isOnline, updateStatus]
  );

  const syncFromCloud = useCallback(async () => {
    if (!isConfigured || !isOnline) {
      updateStatus('offline');
      return null;
    }

    const startTime = Date.now();

    // Retry configuration
    const MAX_RETRIES = 3;
    const INITIAL_RETRY_DELAY = 1000; // 1 second
    const BACKOFF_MULTIPLIER = 2;

    let lastError: Error | null = null;

    // Retry loop with exponential backoff
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          // Calculate exponential backoff delay
          const delay = INITIAL_RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, attempt - 1);
          // Log retry only in development
          if (process.env.NODE_ENV === 'development') {
            console.log(
              `Download retry attempt ${attempt}/${MAX_RETRIES} after ${delay}ms delay...`
            );
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        updateStatus('syncing');
        const data = await cloudSyncService.downloadFromCloud();
        const duration = Date.now() - startTime;

        if (data) {
          const totalItems =
            (data.exercises?.length || data.activities?.length || 0) +
            (data.settings ? 1 : 0) +
            (data.badges?.length || 0) +
            (data.challenges?.length || 0);

          // Record successful download in history
          syncHistoryService.addSync('success', totalItems, duration, undefined, {
            exercises: data.exercises?.length || data.activities?.length || 0,
            badges: data.badges?.length || 0,
            challenges: data.challenges?.length || 0,
            settings: !!data.settings,
          });
        }

        // Clear quota flag on successful sync
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sporttrack.quota_exceeded');
          localStorage.removeItem('sporttrack.quota_exceeded_at');
        }

        updateStatus('synced');
        setSyncState((prev) => ({
          ...prev,
          lastSyncAt: new Date(),
        }));
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const errorMessage = lastError.message;

        // Classify error type
        const errorType = classifyError(error);

        // Don't retry for certain error types
        if (errorType === 'permission' || errorType === 'validation' || errorType === 'quota') {
          // Log only in development
          if (process.env.NODE_ENV === 'development') {
            console.error(`Non-retryable download error (${errorType}):`, errorMessage);
          }
          // Store quota error flag to disable auto-sync
          if (errorType === 'quota' && typeof window !== 'undefined') {
            localStorage.setItem('sporttrack.quota_exceeded', 'true');
            localStorage.setItem('sporttrack.quota_exceeded_at', new Date().toISOString());
          }
          break; // Exit retry loop
        }

        // If this is the last attempt, don't retry
        if (attempt >= MAX_RETRIES) {
          // Log only in development
          if (process.env.NODE_ENV === 'development') {
            console.error(`Max download retries (${MAX_RETRIES}) reached.`);
          }
          break;
        }

        // Continue to next retry attempt (silent)
      }
    }

    // If we get here, all retries failed
    const duration = Date.now() - startTime;
    const errorMessage = lastError?.message || 'Download failed after retries';
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Cloud download failed after retries:', errorMessage, lastError);
    }

    // Classify final error
    const errorType = classifyError(lastError);
    updateStatus('error', errorMessage);

    // Record failed download in history
    syncHistoryService.addSync('failed', 0, duration, `${errorType}: ${errorMessage}`);

    return null;
  }, [isConfigured, isOnline, updateStatus]);

  useEffect(() => {
    if (!isOnline && syncState.status === 'syncing') {
      updateStatus('offline');
    }
  }, [isOnline, syncState.status, updateStatus]);

  // Auto-reset 'synced' status to 'idle' after 3 seconds
  useEffect(() => {
    if (syncState.status === 'synced') {
      const timer = setTimeout(() => {
        updateStatus('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [syncState.status, updateStatus]);

  // Update pending changes count from queue
  useEffect(() => {
    const unsubscribe = syncQueueService.subscribe((queue) => {
      setSyncState((prev) => ({
        ...prev,
        pendingChanges: syncQueueService.pendingCount(),
      }));
    });

    return unsubscribe;
  }, []);

  return {
    syncState,
    syncToCloud,
    syncFromCloud,
    isConfigured,
    isOnline,
  };
}
