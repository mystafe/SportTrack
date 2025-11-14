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
    }) => {
      if (!isConfigured || !isOnline) {
        updateStatus('offline');
        return;
      }

      try {
        updateStatus('syncing');
        await cloudSyncService.uploadToCloud(data as any);
        updateStatus('synced');
        setSyncState((prev) => ({
          ...prev,
          lastSyncAt: new Date(),
          pendingChanges: 0,
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Sync failed';
        updateStatus('error', errorMessage);
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

  return {
    syncState,
    syncToCloud,
    syncFromCloud,
    isConfigured,
    isOnline,
  };
}
