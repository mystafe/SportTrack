'use client';

import { useAutoSync } from '@/hooks/useAutoSync';
import { useCloudSyncListener } from '@/hooks/useCloudSyncListener';
import { useSyncQueue } from '@/hooks/useSyncQueue';

/**
 * AutoSyncProvider
 * Handles automatic cloud sync when stores change
 * Also listens to cloud changes and updates local stores
 * Processes offline sync queue when online
 * This component doesn't render anything, it just runs the sync hooks
 */
export function AutoSyncProvider({ children }: { children: React.ReactNode }) {
  useAutoSync();
  useCloudSyncListener();
  useSyncQueue(); // Process offline queue when online
  return <>{children}</>;
}
