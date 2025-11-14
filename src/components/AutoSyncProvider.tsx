'use client';

import { useAutoSync } from '@/hooks/useAutoSync';
import { useCloudSyncListener } from '@/hooks/useCloudSyncListener';

/**
 * AutoSyncProvider
 * Handles automatic cloud sync when stores change
 * Also listens to cloud changes and updates local stores
 * This component doesn't render anything, it just runs the sync hooks
 */
export function AutoSyncProvider({ children }: { children: React.ReactNode }) {
  useAutoSync();
  useCloudSyncListener();
  return <>{children}</>;
}
