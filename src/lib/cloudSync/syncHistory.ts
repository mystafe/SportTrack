/**
 * Sync History Service
 * Manages sync history and statistics
 */

const SYNC_HISTORY_STORAGE_KEY = 'sporttrack_sync_history';
const MAX_HISTORY_ITEMS = 50; // Keep last 50 sync operations

export interface SyncHistoryItem {
  id: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'partial';
  itemsSynced: number;
  duration: number; // Duration in milliseconds
  error?: string;
  collections: {
    exercises?: number;
    activities?: number;
    badges?: number;
    challenges?: number;
    settings?: boolean;
  };
}

export interface SyncStatistics {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  averageSyncDuration: number;
  lastSyncTime: Date | null;
  lastSuccessfulSyncTime: Date | null;
  itemsSyncedToday: number;
  itemsSyncedThisWeek: number;
}

class SyncHistoryService {
  private history: SyncHistoryItem[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadHistory();
    }
  }

  /**
   * Load history from localStorage
   */
  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(SYNC_HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.history = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to load sync history:', error);
      this.history = [];
    }
  }

  /**
   * Save history to localStorage
   */
  private saveHistory(): void {
    try {
      // Keep only last MAX_HISTORY_ITEMS
      const historyToSave = this.history.slice(-MAX_HISTORY_ITEMS);
      localStorage.setItem(SYNC_HISTORY_STORAGE_KEY, JSON.stringify(historyToSave));
    } catch (error) {
      console.error('Failed to save sync history:', error);
    }
  }

  /**
   * Add a sync operation to history
   */
  addSync(
    status: 'success' | 'failed' | 'partial',
    itemsSynced: number,
    duration: number,
    error?: string,
    collections?: {
      exercises?: number;
      activities?: number;
      badges?: number;
      challenges?: number;
      settings?: boolean;
    }
  ): void {
    const item: SyncHistoryItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status,
      itemsSynced,
      duration,
      error,
      collections: collections || {},
    };

    this.history.push(item);
    this.saveHistory();
  }

  /**
   * Get sync history
   */
  getHistory(limit?: number): SyncHistoryItem[] {
    const history = [...this.history].reverse(); // Most recent first
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * Get sync statistics
   */
  getStatistics(): SyncStatistics {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const successfulSyncs = this.history.filter((item) => item.status === 'success');
    const failedSyncs = this.history.filter((item) => item.status === 'failed');
    const totalDuration = this.history.reduce((sum, item) => sum + item.duration, 0);
    const averageDuration = this.history.length > 0 ? totalDuration / this.history.length : 0;

    const lastSync = this.history[this.history.length - 1] || null;
    const lastSuccessfulSync =
      successfulSyncs.length > 0 ? successfulSyncs[successfulSyncs.length - 1] : null;

    const itemsSyncedToday = this.history
      .filter((item) => item.timestamp >= today && item.status === 'success')
      .reduce((sum, item) => sum + item.itemsSynced, 0);

    const itemsSyncedThisWeek = this.history
      .filter((item) => item.timestamp >= weekAgo && item.status === 'success')
      .reduce((sum, item) => sum + item.itemsSynced, 0);

    return {
      totalSyncs: this.history.length,
      successfulSyncs: successfulSyncs.length,
      failedSyncs: failedSyncs.length,
      averageSyncDuration: averageDuration,
      lastSyncTime: lastSync ? lastSync.timestamp : null,
      lastSuccessfulSyncTime: lastSuccessfulSync ? lastSuccessfulSync.timestamp : null,
      itemsSyncedToday,
      itemsSyncedThisWeek,
    };
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
    this.saveHistory();
  }

  /**
   * Get recent syncs (last N syncs)
   */
  getRecentSyncs(count: number = 10): SyncHistoryItem[] {
    return this.getHistory(count);
  }
}

export const syncHistoryService = new SyncHistoryService();
