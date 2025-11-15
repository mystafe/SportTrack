/**
 * Hook for managing sync queue
 */

import { useState, useEffect } from 'react';
import { syncQueueService, type SyncQueueItem } from '@/lib/cloudSync/syncQueue';
import { useOnlineStatus } from './useOnlineStatus';
import { useCloudSync } from './useCloudSync';

export function useSyncQueue() {
  const { isOnline } = useOnlineStatus();
  const { syncToCloud, isConfigured } = useCloudSync();
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Subscribe to queue changes
  useEffect(() => {
    const unsubscribe = syncQueueService.subscribe((items) => {
      setQueue(items);
    });

    return unsubscribe;
  }, []);

  // Auto-process queue when online
  useEffect(() => {
    if (isOnline && isConfigured && queue.length > 0 && !isProcessing) {
      processQueue();
    }
  }, [isOnline, isConfigured, queue.length, isProcessing]);

  /**
   * Process queue items
   */
  const processQueue = async () => {
    if (!isConfigured || !isOnline) {
      return;
    }

    const pending = syncQueueService.getPending();
    if (pending.length === 0) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await syncQueueService.processQueue(async (data) => {
        await syncToCloud(data);
      });

      console.log(`✅ Processed ${result.success} items, ${result.failed} failed`);
      if (result.errors.length > 0) {
        console.error('Queue processing errors:', result.errors);
      }
    } catch (error) {
      console.error('Failed to process sync queue:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Add item to queue
   */
  const addToQueue = (
    type: SyncQueueItem['type'],
    collection: SyncQueueItem['collection'],
    data: any,
    id?: string
  ) => {
    return syncQueueService.add(type, collection, data, id);
  };

  /**
   * Clear queue
   */
  const clearQueue = () => {
    syncQueueService.clear();
  };

  /**
   * Clear failed items
   */
  const clearFailed = () => {
    syncQueueService.clearFailed();
  };

  /**
   * Retry failed items (reset retry count and retry immediately)
   */
  const retryFailed = async () => {
    // Reset retry count for failed items
    const failed = syncQueueService.getFailed();
    failed.forEach((item) => {
      syncQueueService.remove(item.id);
      // Add back with reset retry count
      syncQueueService.add(item.type, item.collection, item.data, item.id);
    });
    // Process queue
    await processQueue();
  };

  /**
   * Get items waiting for retry (due to exponential backoff)
   */
  const getWaitingForRetry = () => {
    return syncQueueService.getWaitingForRetry();
  };

  return {
    queue,
    pendingCount: syncQueueService.pendingCount(),
    failedCount: syncQueueService.failedCount(),
    isEmpty: syncQueueService.isEmpty(),
    isProcessing,
    processQueue,
    addToQueue,
    clearQueue,
    clearFailed,
    retryFailed,
    getWaitingForRetry,
  };
}
