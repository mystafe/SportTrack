/**
 * Cloud Sync Types
 */

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

export interface SyncState {
  status: SyncStatus;
  lastSyncAt: Date | null;
  error: string | null;
  pendingChanges: number;
}

export interface SyncMetadata {
  lastModified: Date;
  version: number;
  userId: string;
}

export interface CloudData {
  activities: unknown[];
  settings: unknown | null;
  badges: unknown[];
  challenges: unknown[];
  metadata: SyncMetadata;
}
