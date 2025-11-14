/**
 * Auto Sync Hook
 * Automatically syncs data to cloud when stores change
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useCloudSync } from './useCloudSync';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import { useToaster } from '@/components/Toaster';
import { useI18n } from '@/lib/i18n';

const SYNC_DEBOUNCE_MS = 3000; // Wait 3 seconds after last change before syncing
const SYNC_THROTTLE_MS = 10000; // Minimum 10 seconds between syncs
const INITIAL_SYNC_COMPLETE_KEY = 'sporttrack_initial_sync_complete';
const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';
const LAST_SYNC_TIME_KEY = 'sporttrack_last_sync_time';

// Helper function to create a hash from array length and first/last item IDs
function createArrayHash(
  arr: Array<{ id?: string; [key: string]: unknown }>,
  maxItems: number = 5
): string {
  if (arr.length === 0) return 'empty';

  // Get first few items (most recent activities are at the beginning)
  const firstIds = arr
    .slice(0, maxItems)
    .map((item) => item.id || JSON.stringify(item))
    .join(',');

  // Get last few items
  const lastIds =
    arr.length > maxItems
      ? arr
          .slice(-maxItems)
          .map((item) => item.id || JSON.stringify(item))
          .join(',')
      : '';

  // Also include a checksum of all IDs for better change detection
  const allIds = arr.map((item) => item.id || '').join(',');
  const checksum =
    allIds.length > 0
      ? allIds.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10000
      : 0;

  return `${arr.length}:${firstIds}${lastIds ? `:${lastIds}` : ''}:${checksum}`;
}

export function useAutoSync() {
  const { isAuthenticated, isConfigured } = useAuth();
  const { syncToCloud } = useCloudSync();
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const { badges, hydrated: badgesHydrated } = useBadges();
  const { challenges, hydrated: challengesHydrated } = useChallenges();
  const { showToast } = useToaster();
  const { t } = useI18n();

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<{
    activitiesHash: string;
    settings: string | null;
    badgesHash: string;
    challengesHash: string;
  } | null>(null);
  const isInitialSyncRef = useRef(true);
  const isSyncingRef = useRef(false);

  const allHydrated =
    activitiesHydrated && settingsHydrated && badgesHydrated && challengesHydrated;

  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !allHydrated) {
      // Reset lastSyncRef when not authenticated
      if (!isAuthenticated || !isConfigured) {
        lastSyncRef.current = null;
        isInitialSyncRef.current = true;
        console.log('🔄 Auto-sync: Auth/config durumu değişti, reset ediliyor');
      }
      return;
    }

    // Check if initial sync is complete and if there's a pending conflict
    const initialSyncComplete =
      typeof window !== 'undefined' && localStorage.getItem(INITIAL_SYNC_COMPLETE_KEY) === 'true';
    const hasPendingConflict =
      typeof window !== 'undefined' && localStorage.getItem(CONFLICT_STORAGE_KEY) !== null;

    // Log sync status
    console.log('📊 Auto-sync durumu:', {
      isAuthenticated,
      isConfigured,
      allHydrated,
      initialSyncComplete,
      hasPendingConflict,
      activitiesCount: activities.length,
      settingsName: settings?.name || 'null',
    });

    // Don't sync if initial sync is not complete or if there's a pending conflict
    if (!initialSyncComplete || hasPendingConflict) {
      // Log why sync is skipped for debugging
      if (!initialSyncComplete) {
        console.log('⏭️ Auto-sync skipped: Initial sync not complete');
        console.log(
          "💡 Çözüm: useCloudSyncListener hook'unun INITIAL_SYNC_COMPLETE_KEY set etmesini bekliyor"
        );
      }
      if (hasPendingConflict) {
        console.log('⏭️ Auto-sync skipped: Pending conflict resolution');
        console.log("💡 Çözüm: Conflict resolution dialog'unu tamamlayın");
      }
      return;
    }

    // Create current hashes
    const currentActivitiesHash = createArrayHash(activities);
    const currentSettingsStr = settings ? JSON.stringify(settings) : null;
    const currentBadgesHash = createArrayHash(badges);
    const currentChallengesHash = createArrayHash(challenges);

    // Initialize lastSyncRef on first sync
    if (lastSyncRef.current === null) {
      lastSyncRef.current = {
        activitiesHash: currentActivitiesHash,
        settings: currentSettingsStr,
        badgesHash: currentBadgesHash,
        challengesHash: currentChallengesHash,
      };
      // Don't sync on initial load, wait for changes
      isInitialSyncRef.current = false;
      return;
    }

    // Check if anything changed
    const activitiesChanged = currentActivitiesHash !== lastSyncRef.current.activitiesHash;
    const settingsChanged = currentSettingsStr !== lastSyncRef.current.settings;
    const badgesChanged = currentBadgesHash !== lastSyncRef.current.badgesHash;
    const challengesChanged = currentChallengesHash !== lastSyncRef.current.challengesHash;

    // Log changes for debugging
    if (activitiesChanged || settingsChanged || badgesChanged || challengesChanged) {
      console.log('🔄 Değişiklik tespit edildi:', {
        activities: activitiesChanged,
        settings: settingsChanged,
        badges: badgesChanged,
        challenges: challengesChanged,
        activitiesCount: activities.length,
        settingsName: settings?.name || 'null',
        badgesCount: badges.length,
        challengesCount: challenges.length,
      });

      // Show hash comparison for activities if changed
      if (activitiesChanged) {
        console.log('📊 Activities hash karşılaştırması:', {
          önceki: lastSyncRef.current.activitiesHash,
          şimdiki: currentActivitiesHash,
          fark: 'Hash değişti, sync tetiklenecek',
        });
      }
    } else {
      // Log when no changes detected (for debugging)
      console.log('✅ Değişiklik yok, sync atlanıyor', {
        activitiesHash: currentActivitiesHash,
        activitiesCount: activities.length,
      });
    }

    // If nothing changed, don't sync (prevents infinite loops)
    if (!activitiesChanged && !settingsChanged && !badgesChanged && !challengesChanged) {
      return;
    }

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout for debounced sync
    syncTimeoutRef.current = setTimeout(() => {
      // Check throttle - don't sync if last sync was too recent
      const lastSyncTime =
        typeof window !== 'undefined'
          ? parseInt(localStorage.getItem(LAST_SYNC_TIME_KEY) || '0', 10)
          : 0;
      const now = Date.now();
      const timeSinceLastSync = now - lastSyncTime;

      if (timeSinceLastSync < SYNC_THROTTLE_MS && lastSyncTime > 0) {
        // Too soon, reschedule
        const waitTime = SYNC_THROTTLE_MS - timeSinceLastSync;
        console.log(
          `⏱️ Throttle: Son sync ${Math.round(timeSinceLastSync / 1000)}s önce yapıldı, ${Math.round(waitTime / 1000)}s bekleniyor`
        );
        syncTimeoutRef.current = setTimeout(() => {
          syncTimeoutRef.current = null;
        }, waitTime);
        return;
      }

      // Prevent concurrent syncs
      if (isSyncingRef.current) {
        console.log('⏭️ Auto-sync skipped: Zaten bir sync işlemi devam ediyor');
        return;
      }

      const settingsStr = settings ? JSON.stringify(settings) : null;
      const finalActivitiesHash = createArrayHash(activities);
      const finalBadgesHash = createArrayHash(badges);
      const finalChallengesHash = createArrayHash(challenges);

      isSyncingRef.current = true;
      console.log('🚀 Auto-sync başlatılıyor...', {
        activities: activities.length,
        settings: settings ? 'present' : 'null',
        badges: badges.length,
        challenges: challenges.length,
      });

      syncToCloud({
        activities,
        settings,
        badges,
        challenges,
      })
        .then(() => {
          // Update last sync time
          const syncTime = Date.now();
          if (typeof window !== 'undefined') {
            localStorage.setItem(LAST_SYNC_TIME_KEY, String(syncTime));
          }
          console.log('✅ Auto-sync başarılı!', {
            syncTime: new Date(syncTime).toLocaleTimeString(),
          });
          // Show success toast
          showToast(t('cloudSync.syncedToCloud'), 'success');
        })
        .catch((error) => {
          console.error('❌ Auto-sync failed:', error);
          // Type guard for Firebase errors
          const isFirebaseError = (err: unknown): err is { code: string; message: string } => {
            return typeof err === 'object' && err !== null && 'code' in err && 'message' in err;
          };

          console.error('Error details:', {
            message: error instanceof Error ? error.message : String(error),
            code: isFirebaseError(error) ? error.code : undefined,
            stack: error instanceof Error ? error.stack : undefined,
          });

          // Check if error is related to invalid dates (RangeError)
          const isDateError =
            error instanceof RangeError ||
            (error instanceof Error &&
              (error.message.includes('Invalid time') ||
                error.message.includes('RangeError') ||
                error.message.includes('Invalid date')));

          if (isDateError) {
            console.error('⚠️ Date validation error detected. Activities may have invalid dates.');
            console.error('💡 Attempting to sanitize activities and retry...');
            // Don't show error toast for date errors, as they're being handled automatically
            // The sync service will retry with sanitized dates
          } else {
            showToast(t('cloudSync.syncFailed'), 'error');
          }
        })
        .finally(() => {
          isSyncingRef.current = false;
          console.log('🏁 Auto-sync tamamlandı (flag reset)');
        });

      // Update last sync ref with current hashes
      lastSyncRef.current = {
        activitiesHash: finalActivitiesHash,
        settings: settingsStr,
        badgesHash: finalBadgesHash,
        challengesHash: finalChallengesHash,
      };
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [
    isAuthenticated,
    isConfigured,
    allHydrated,
    activities,
    settings,
    badges,
    challenges,
    syncToCloud,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);
}
