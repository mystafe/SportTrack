/**
 * Cloud Sync Hook
 * Manages cloud synchronization state and operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { cloudSyncService } from '@/lib/cloudSync/syncService';
import { useOnlineStatus } from './useOnlineStatus';
import type { SyncStatus, SyncState } from '@/lib/cloudSync/types';

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
    async (data: {
      activities: unknown[];
      settings: unknown | null;
      badges: unknown[];
      challenges: unknown[];
    }): Promise<void> => {
      if (!isConfigured || !isOnline) {
        updateStatus('offline');
        throw new Error('Cloud sync not configured or offline');
      }

      try {
        updateStatus('syncing');
        console.log('🔄 Starting cloud sync...');
        // Type assertions for cloud sync service
        await cloudSyncService.uploadToCloud({
          activities: data.activities as import('@/lib/activityStore').ActivityRecord[],
          settings: data.settings as import('@/lib/settingsStore').UserSettings | null,
          badges: data.badges as import('@/lib/badges').Badge[],
          challenges: data.challenges as import('@/lib/challenges').Challenge[],
        });
        console.log('✅ Cloud sync completed successfully');
        updateStatus('synced');
        setSyncState((prev) => ({
          ...prev,
          lastSyncAt: new Date(),
          pendingChanges: 0,
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Sync failed';
        console.error('❌ Cloud sync failed:', errorMessage, error);
        updateStatus('error', errorMessage);
        throw error; // Re-throw to allow caller to handle
      }
    },
    [isConfigured, isOnline, updateStatus]
  );

  const syncFromCloud = useCallback(async () => {
    if (!isConfigured || !isOnline) {
      updateStatus('offline');
      return null;
    }

    try {
      updateStatus('syncing');
      const data = await cloudSyncService.downloadFromCloud();
      updateStatus('synced');
      setSyncState((prev) => ({
        ...prev,
        lastSyncAt: new Date(),
      }));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      updateStatus('error', errorMessage);
      return null;
    }
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

  return {
    syncState,
    syncToCloud,
    syncFromCloud,
    isConfigured,
    isOnline,
  };
}
