/**
 * Sync Status Hook
 * Provides comprehensive sync state information
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCloudSync } from './useCloudSync';
import { useAuth } from './useAuth';
import { useOnlineStatus } from './useOnlineStatus';
import { syncHistoryService } from '@/lib/cloudSync/syncHistory';
import type { SyncStatus } from '@/lib/cloudSync/types';

export interface SyncStatusInfo {
  status: SyncStatus;
  lastSyncTime: Date | null;
  pendingChanges: number;
  hasConflicts: boolean | null;
  networkStatus: 'online' | 'offline';
  isConfigured: boolean;
  isAuthenticated: boolean;
  syncHistory: Array<{
    status: 'success' | 'failed';
    timestamp: Date;
    itemsCount: number;
    duration: number;
    error?: string;
  }>;
}

export function useSyncStatus() {
  const { syncState, isConfigured } = useCloudSync();
  const { isAuthenticated } = useAuth();
  const { isOnline } = useOnlineStatus();
  const [hasConflicts, setHasConflicts] = useState<boolean | null>(null);
  const [syncHistory, setSyncHistory] = useState<SyncStatusInfo['syncHistory']>([]);

  // Load sync history
  useEffect(() => {
    const loadHistory = () => {
      try {
        const history = syncHistoryService.getHistory(10); // Last 10 syncs
        setSyncHistory(
          history
            .filter((entry) => entry.status === 'success' || entry.status === 'failed') // Filter out 'partial'
            .map((entry) => ({
              status: entry.status === 'partial' ? 'success' : entry.status, // Convert partial to success
              timestamp: new Date(entry.timestamp),
              itemsCount: entry.itemsSynced,
              duration: entry.duration,
              error: entry.error,
            }))
        );
      } catch (error) {
        console.error('Failed to load sync history:', error);
      }
    };

    loadHistory();
    // Refresh history every 5 seconds
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, [syncState.status]);

  // Check for conflicts periodically
  useEffect(() => {
    if (!isAuthenticated || !isConfigured) {
      setHasConflicts(null);
      return;
    }

    const checkConflicts = async () => {
      try {
        // Check localStorage for conflict flag
        const conflictStr = localStorage.getItem('sporttrack_sync_conflict');
        if (conflictStr) {
          setHasConflicts(true);
          return;
        }

        // If no conflict flag, assume no conflicts (optimistic)
        setHasConflicts(false);
      } catch (error) {
        // Silent fail
        setHasConflicts(null);
      }
    };

    checkConflicts();
    // Check every 30 seconds
    const interval = setInterval(checkConflicts, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, isConfigured]);

  const statusInfo: SyncStatusInfo = {
    status: syncState.status,
    lastSyncTime: syncState.lastSyncAt,
    pendingChanges: syncState.pendingChanges,
    hasConflicts,
    networkStatus: isOnline ? 'online' : 'offline',
    isConfigured,
    isAuthenticated,
    syncHistory,
  };

  return statusInfo;
}
