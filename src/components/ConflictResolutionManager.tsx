'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';
import { useToaster } from './Toaster';
import { ConflictResolutionDialog } from './ConflictResolutionDialog';
import type { ConflictStrategy } from '@/lib/cloudSync/conflictResolver';
import { useActivities, ActivityRecord } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import type { UserSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import type { Badge } from '@/lib/badges';
import { useChallenges } from '@/lib/challengeStore';
import type { Challenge } from '@/lib/challenges';
import { useCloudSync } from '@/hooks/useCloudSync';
import { resolveConflicts, saveLocalLastModified } from '@/lib/cloudSync/conflictResolver';
import { cloudSyncService } from '@/lib/cloudSync/syncService';
import { STORAGE_KEYS } from '@/lib/constants';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';

/**
 * ConflictResolutionManager
 * Manages conflict resolution dialog globally, independent of SettingsDialog
 * This ensures the dialog appears immediately after login, before user opens settings
 */
export function ConflictResolutionManager() {
  const router = useRouter();
  const { user, isAuthenticated, isConfigured } = useAuth();
  const { activities } = useActivities();
  const { settings, saveSettings } = useSettings();
  const { badges } = useBadges();
  const { challenges } = useChallenges();
  const { syncToCloud } = useCloudSync();
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictData, setConflictData] = useState<{
    local: {
      activities: unknown[];
      settings: unknown | null;
      badges: unknown[];
      challenges: unknown[];
    };
    cloud: {
      activities: unknown[];
      settings: unknown | null;
      badges: unknown[];
      challenges: unknown[];
      points?: number;
    };
  } | null>(null);

  // Check for pending conflict on mount and when authenticated
  useEffect(() => {
    if (!isAuthenticated || !isConfigured) {
      setShowConflictDialog(false);
      setConflictData(null);
      // Clear conflict storage on logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
      }
      return;
    }

    // Check if initial sync is complete - but still check for conflicts if local is empty
    const initialSyncComplete =
      typeof window !== 'undefined' &&
      localStorage.getItem('sporttrack_initial_sync_complete') === 'true';

    // If initial sync is complete but we have conflict data, check if local is empty
    // If local is empty and cloud has data, we should still download from cloud
    if (initialSyncComplete) {
      const conflictStr =
        typeof window !== 'undefined' ? localStorage.getItem(CONFLICT_STORAGE_KEY) : null;
      if (conflictStr) {
        try {
          const conflict = JSON.parse(conflictStr);
          // Check if local is truly empty (0 activities, 0 badges, 0 challenges)
          // Settings don't count as "data" for this check - we only care about activities/badges/challenges
          const localIsEmpty =
            (conflict.local?.activities?.length || 0) === 0 &&
            (conflict.local?.badges?.length || 0) === 0 &&
            (conflict.local?.challenges?.length || 0) === 0;
          const cloudHasData =
            (conflict.cloud?.activities?.length || 0) > 0 ||
            (conflict.cloud?.badges?.length || 0) > 0 ||
            (conflict.cloud?.challenges?.length || 0) > 0;

          console.log('🔍 Checking conflict with initialSyncComplete=true:', {
            localIsEmpty,
            cloudHasData,
            localActivities: conflict.local?.activities?.length || 0,
            cloudActivities: conflict.cloud?.activities?.length || 0,
            localBadges: conflict.local?.badges?.length || 0,
            cloudBadges: conflict.cloud?.badges?.length || 0,
          });

          // If local is empty and cloud has data, clear initial sync flag and process conflict
          if (localIsEmpty && cloudHasData) {
            console.log(
              '🔄 Local is empty but cloud has data - clearing initial sync flag to allow download'
            );
            if (typeof window !== 'undefined') {
              localStorage.removeItem('sporttrack_initial_sync_complete');
            }
            // Continue to process conflict below - don't return here
          } else if (!localIsEmpty) {
            // Local has data, initial sync complete - this is a real conflict, show dialog
            console.log('⚠️ Real conflict detected - showing conflict dialog');
            // Continue to process conflict below - don't return here
          } else {
            // Both empty or cloud empty - clear stale conflict data
            console.log(
              '🧹 Clearing stale conflict data (initial sync already complete, no real conflict)'
            );
            if (typeof window !== 'undefined') {
              localStorage.removeItem(CONFLICT_STORAGE_KEY);
            }
            setShowConflictDialog(false);
            setConflictData(null);
            return;
          }
        } catch (error) {
          console.error('Failed to parse conflict data:', error);
          // Clear invalid conflict data
          if (typeof window !== 'undefined') {
            localStorage.removeItem(CONFLICT_STORAGE_KEY);
          }
          setShowConflictDialog(false);
          setConflictData(null);
          return;
        }
      } else {
        // No conflict data, initial sync complete - nothing to do
        setShowConflictDialog(false);
        setConflictData(null);
        return;
      }
    }

    // Function to check and show conflict dialog
    const checkConflict = () => {
      // Double-check initial sync status
      const syncComplete =
        typeof window !== 'undefined' &&
        localStorage.getItem('sporttrack_initial_sync_complete') === 'true';

      // If sync is complete, we already handled it above
      // But if we cleared the flag (local empty + cloud has data), continue processing
      if (syncComplete) {
        // Check if we're in the special case (local empty + cloud has data)
        // If so, we already cleared the flag above, so continue processing
        const conflictStr =
          typeof window !== 'undefined' ? localStorage.getItem(CONFLICT_STORAGE_KEY) : null;
        if (conflictStr) {
          try {
            const conflict = JSON.parse(conflictStr);
            const localIsEmpty =
              (conflict.local?.activities?.length || 0) === 0 &&
              (conflict.local?.badges?.length || 0) === 0 &&
              (conflict.local?.challenges?.length || 0) === 0;
            const cloudHasData =
              (conflict.cloud?.activities?.length || 0) > 0 ||
              (conflict.cloud?.badges?.length || 0) > 0 ||
              (conflict.cloud?.challenges?.length || 0) > 0;

            // If local is empty and cloud has data, we already cleared the flag above
            // Continue processing to download from cloud
            if (localIsEmpty && cloudHasData) {
              console.log('✅ Continuing conflict processing after clearing flag');
              // Continue below - don't return
            } else {
              // Real conflict or both empty - don't process
              console.log('🧹 Clearing conflict (sync complete, no special case)');
              if (typeof window !== 'undefined') {
                localStorage.removeItem(CONFLICT_STORAGE_KEY);
              }
              setShowConflictDialog(false);
              setConflictData(null);
              return;
            }
          } catch (error) {
            console.error('Failed to parse conflict in checkConflict:', error);
            if (typeof window !== 'undefined') {
              localStorage.removeItem(CONFLICT_STORAGE_KEY);
            }
            setShowConflictDialog(false);
            setConflictData(null);
            return;
          }
        } else {
          // No conflict data, sync complete - nothing to do
          setShowConflictDialog(false);
          setConflictData(null);
          return;
        }
      }

      const conflictStr =
        typeof window !== 'undefined' ? localStorage.getItem(CONFLICT_STORAGE_KEY) : null;
      if (conflictStr) {
        try {
          const conflict = JSON.parse(conflictStr);
          console.log('🔍 Conflict detected in localStorage:', {
            localActivities: conflict.local?.activities?.length || 0,
            cloudActivities: conflict.cloud?.activities?.length || 0,
            localBadges: conflict.local?.badges?.length || 0,
            cloudBadges: conflict.cloud?.badges?.length || 0,
          });

          // Check if local is empty and cloud has data - if so, automatically download from cloud
          const localIsEmpty =
            (conflict.local?.activities?.length || 0) === 0 &&
            (conflict.local?.badges?.length || 0) === 0 &&
            (conflict.local?.challenges?.length || 0) === 0;
          const cloudHasData =
            (conflict.cloud?.activities?.length || 0) > 0 ||
            (conflict.cloud?.badges?.length || 0) > 0 ||
            (conflict.cloud?.challenges?.length || 0) > 0;
          const cloudIsEmpty = !cloudHasData;
          const localHasData = !localIsEmpty;

          // Check if data is identical (no real conflict)
          const localActivities = (conflict.local?.activities || []) as Array<{ id?: string }>;
          const cloudActivities = (conflict.cloud?.activities || []) as Array<{ id?: string }>;
          const localBadges = (conflict.local?.badges || []) as Array<{ id?: string }>;
          const cloudBadges = (conflict.cloud?.badges || []) as Array<{ id?: string }>;
          const localChallenges = (conflict.local?.challenges || []) as Array<{ id?: string }>;
          const cloudChallenges = (conflict.cloud?.challenges || []) as Array<{ id?: string }>;

          const arraysEqualById = <T extends { id?: string }>(arr1: T[], arr2: T[]): boolean => {
            if (arr1.length !== arr2.length) return false;
            const ids1 = new Set(arr1.map((item) => item.id).filter(Boolean));
            const ids2 = new Set(arr2.map((item) => item.id).filter(Boolean));
            if (ids1.size !== ids2.size) return false;
            for (const id of ids1) {
              if (!ids2.has(id)) return false;
            }
            return true;
          };

          const activitiesIdentical = arraysEqualById(localActivities, cloudActivities);
          const badgesIdentical = arraysEqualById(localBadges, cloudBadges);
          const challengesIdentical = arraysEqualById(localChallenges, cloudChallenges);
          const countsMatch =
            localActivities.length === cloudActivities.length &&
            localBadges.length === cloudBadges.length &&
            localChallenges.length === cloudChallenges.length;
          const isIdentical =
            countsMatch && activitiesIdentical && badgesIdentical && challengesIdentical;

          // If identical, no conflict - just mark sync as complete and clear conflict
          if (isIdentical && localHasData && cloudHasData) {
            console.log('✅ Data is identical - no conflict, clearing conflict data');
            if (typeof window !== 'undefined') {
              localStorage.removeItem(CONFLICT_STORAGE_KEY);
              localStorage.setItem('sporttrack_initial_sync_complete', 'true');
            }
            setShowConflictDialog(false);
            setConflictData(null);
            return;
          }

          // If only one side has data, automatically sync (no conflict dialog)
          if (localIsEmpty && cloudHasData) {
            // Local is empty, cloud has data - automatically download from cloud
            console.log('📥 Local is empty, cloud has data - automatically downloading from cloud');

            // Convert conflict cloud data to CloudData format
            const cloudDataWithMetadata: import('@/lib/cloudSync/types').CloudData = {
              exercises: conflict.cloud.activities || [],
              activities: [], // Activity definitions are not in conflict data
              statistics: [], // Statistics are not in conflict data
              points: conflict.cloud.points || 0, // Include points from conflict data
              badges: conflict.cloud.badges || [],
              challenges: conflict.cloud.challenges || [],
              lastModified: null,
              metadata: {
                lastModified: new Date(),
                version: Date.now(),
                userId: user?.uid || 'unknown',
              },
              settings: conflict.cloud.settings || null,
            };

            // Automatically apply cloud data
            applyCloudData(cloudDataWithMetadata, 'cloud').catch((error) => {
              console.error('Failed to auto-download cloud data:', error);
              showToast(
                lang === 'tr' ? 'Bulut verileri indirilemedi' : 'Failed to download cloud data',
                'error'
              );
            });

            // Clear conflict data
            if (typeof window !== 'undefined') {
              localStorage.removeItem(CONFLICT_STORAGE_KEY);
            }
            setShowConflictDialog(false);
            setConflictData(null);
            return;
          }

          if (cloudIsEmpty && localHasData) {
            // Cloud is empty, local has data - automatically upload to cloud (no conflict dialog)
            console.log('📤 Cloud is empty, local has data - automatically uploading to cloud');

            // Upload local data to cloud
            syncToCloud({
              activities: conflict.local.activities || [],
              settings: conflict.local.settings || null,
              badges: conflict.local.badges || [],
              challenges: conflict.local.challenges || [],
            })
              .then(() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(CONFLICT_STORAGE_KEY);
                  localStorage.setItem('sporttrack_initial_sync_complete', 'true');
                }
                showToast(
                  lang === 'tr'
                    ? 'Yerel verileriniz buluta yüklendi'
                    : 'Your local data has been uploaded to cloud',
                  'success'
                );
              })
              .catch((error) => {
                console.error('Failed to upload local data:', error);
                showToast(
                  lang === 'tr' ? 'Buluta yükleme hatası' : 'Upload to cloud failed',
                  'error'
                );
              });

            setShowConflictDialog(false);
            setConflictData(null);
            return;
          }

          // Real conflict - automatically use "keep all" (local) strategy
          console.log(
            '🔄 Real conflict detected - automatically using "keep all" (local) strategy'
          );

          // Set conflict data first
          setConflictData(conflict);

          // Automatically resolve with "local" strategy (keep all local data)
          // Use setTimeout to ensure state is set before calling handleConflictResolve
          setTimeout(() => {
            handleConflictResolve('local').catch((error) => {
              console.error('Failed to auto-resolve conflict:', error);
              showToast(
                lang === 'tr' ? 'Çakışma çözümü hatası' : 'Conflict resolution error',
                'error'
              );
            });
          }, 100);

          return;
        } catch (error) {
          // Log error only in development
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to parse conflict data:', error);
          }
          // Clear invalid conflict data
          if (typeof window !== 'undefined') {
            localStorage.removeItem(CONFLICT_STORAGE_KEY);
          }
        }
      } else {
        // No conflict, hide dialog if it was showing
        if (showConflictDialog) {
          setShowConflictDialog(false);
          setConflictData(null);
        }
      }
    };

    // Check immediately
    checkConflict();

    // Check after shorter delays to catch conflicts faster after login
    const timeout1 = setTimeout(checkConflict, 100);
    const timeout2 = setTimeout(checkConflict, 500);
    const timeout3 = setTimeout(checkConflict, 1000);

    // Listen to custom event from useCloudSyncListener
    const handleConflictDetected = () => {
      console.log('📢 Conflict detected event received');
      // Only check if dialog is not already showing
      if (!showConflictDialog) {
        checkConflict();
      }
    };
    window.addEventListener('sporttrack:conflict-detected', handleConflictDetected);

    // Also listen to storage events (for cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONFLICT_STORAGE_KEY && !showConflictDialog) {
        checkConflict();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Poll localStorage periodically to catch conflicts set by other components (reduced frequency)
    // Only poll if dialog is not showing to prevent infinite loops
    const pollInterval = setInterval(() => {
      if (!showConflictDialog) {
        checkConflict();
      }
    }, 2000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sporttrack:conflict-detected', handleConflictDetected);
    };
  }, [isAuthenticated, isConfigured, showToast, t, showConflictDialog]);

  const applyCloudData = async (
    cloudData: import('@/lib/cloudSync/types').CloudData,
    strategy: ConflictStrategy
  ) => {
    const localData = { activities, settings, badges, challenges };
    const resolution = resolveConflicts(localData, cloudData, strategy);

    console.log('🔄 Applying conflict resolution:', {
      strategy,
      resolvedActivities: resolution.resolvedData.activities.length,
      resolvedBadges: resolution.resolvedData.badges.length,
      resolvedChallenges: resolution.resolvedData.challenges.length,
      cloudActivities: cloudData.activities?.length || 0, // Activity definitions count
      cloudBadges: (cloudData.badges as Badge[])?.length || 0,
    });

    // Apply resolved data locally
    // Apply settings
    if (resolution.resolvedData.settings) {
      saveSettings(resolution.resolvedData.settings);
    }

    // Apply activities, badges, and challenges directly to localStorage
    // This bypasses the store setters which might have side effects
    try {
      if (typeof window !== 'undefined') {
        // Write activities
        const activitiesToWrite = resolution.resolvedData.activities || [];
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activitiesToWrite));
        console.log(`✅ Written ${activitiesToWrite.length} activities to localStorage`);

        // Write badges
        const badgesToWrite = resolution.resolvedData.badges || [];
        localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badgesToWrite));
        console.log(`✅ Written ${badgesToWrite.length} badges to localStorage`);

        // Write challenges
        const challengesToWrite = resolution.resolvedData.challenges || [];
        localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challengesToWrite));
        console.log(`✅ Written ${challengesToWrite.length} challenges to localStorage`);

        // Verify what was written
        const writtenActivities = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
        const writtenBadges = JSON.parse(localStorage.getItem(STORAGE_KEYS.BADGES) || '[]');
        console.log('🔍 Verification - Written to localStorage:', {
          activities: writtenActivities.length,
          badges: writtenBadges.length,
          challenges: challengesToWrite.length,
        });

        console.log('✅ Conflict resolution data written to localStorage');
      }
    } catch (error) {
      console.error('Failed to write conflict resolution data:', error);
      showToast(lang === 'tr' ? 'Veri yazma hatası' : 'Data write error', 'error');
      return;
    }

    // Only sync to cloud if strategy is NOT "cloud" (cloud strategy means use cloud data, don't overwrite it)
    // For "local" strategy: upload local data to cloud
    // For "merge" or "newest": upload merged/resolved data to cloud
    // For "cloud" strategy: just apply cloud data locally, don't upload anything
    // Mark initial sync as complete BEFORE upload to prevent useCloudSyncListener from interfering
    // This ensures useCloudSyncListener doesn't run during conflict resolution upload
    if (typeof window !== 'undefined') {
      localStorage.setItem('sporttrack_initial_sync_complete', 'true');
      console.log(
        '✅ Initial sync marked as complete before upload (to prevent listener interference)'
      );
    }

    if (strategy !== 'cloud') {
      try {
        console.log('📤 Uploading resolved data to cloud...', {
          strategy,
          activities: resolution.resolvedData.activities.length,
          badges: resolution.resolvedData.badges.length,
          challenges: resolution.resolvedData.challenges.length,
        });
        await syncToCloud({
          activities: resolution.resolvedData.activities,
          settings: resolution.resolvedData.settings,
          badges: resolution.resolvedData.badges,
          challenges: resolution.resolvedData.challenges,
        });
        console.log('✅ Resolved data uploaded to cloud successfully');

        try {
          // Wait longer for Firestore to process the upload
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const verifyData = await cloudSyncService.downloadFromCloud();
          if (verifyData) {
            // Use exercises from new structure, fallback to activities for legacy
            const verifyExercises =
              verifyData.exercises?.length || verifyData.activities?.length || 0;
            const verifyBadges = verifyData.badges?.length || 0;
            console.log('🔍 Post-upload verification:', {
              exercises: verifyExercises,
              badges: verifyBadges,
              expectedExercises: resolution.resolvedData.activities.length,
              expectedBadges: resolution.resolvedData.badges.length,
              match:
                verifyExercises === resolution.resolvedData.activities.length &&
                verifyBadges === resolution.resolvedData.badges.length,
            });

            if (
              verifyExercises !== resolution.resolvedData.activities.length ||
              verifyBadges !== resolution.resolvedData.badges.length
            ) {
              console.warn(
                '⚠️ Upload verification failed: Cloud data does not match uploaded data'
              );
            }
          }
        } catch (verifyError) {
          console.error('❌ Failed to verify upload:', verifyError);
        }
      } catch (uploadError) {
        console.error('❌ Failed to upload resolved data to cloud:', uploadError);
        showToast(
          lang === 'tr'
            ? 'Veriler uygulandı ancak buluta yükleme başarısız oldu'
            : 'Data applied but cloud upload failed',
          'warning'
        );
      }
    }

    saveLocalLastModified();

    // Remove conflict resolution flag before reload
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sporttrack_conflict_resolution_in_progress');
    }

    // Show success message
    const message =
      strategy === 'merge'
        ? lang === 'tr'
          ? 'Veriler güncellendi ve senkronize edildi!'
          : 'Data updated and synced!'
        : strategy === 'cloud'
          ? lang === 'tr'
            ? 'Veriler güncellendi ve senkronize edildi!'
            : 'Data updated and synced!'
          : lang === 'tr'
            ? 'Veriler güncellendi ve senkronize edildi!'
            : 'Data updated and synced!';
    showToast(message, 'success');

    // Wait for cloud sync to complete, then navigate with animation
    setTimeout(
      () => {
        // Add page transition class for smooth animation
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add('page-transitioning');
        }

        // Navigate to home page with smooth transition
        router.push('/');

        // Remove transition class after navigation and trigger data refresh
        setTimeout(() => {
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('page-transitioning');
          }
          // Trigger a custom event to refresh all stores (lazy loading)
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('sporttrack:refresh-data'));
          }
          // Small delay then reload to ensure all data is properly loaded
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }, 300);
      },
      strategy !== 'cloud' ? 2000 : 500
    );
  };

  const handleConflictResolve = async (strategy: ConflictStrategy) => {
    if (!conflictData) return;

    setShowConflictDialog(false);

    try {
      // Set flag to prevent useAutoSync from interfering during conflict resolution
      if (typeof window !== 'undefined') {
        localStorage.setItem('sporttrack_conflict_resolution_in_progress', 'true');
        // Clear conflict storage IMMEDIATELY to prevent re-detection
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
        // Mark initial sync as complete to prevent re-detection
        localStorage.setItem('sporttrack_initial_sync_complete', 'true');
      }

      // Safety check: If cloud is empty and user selected "cloud" strategy,
      // automatically use "local" strategy instead to prevent data loss
      const cloudIsEmpty =
        (conflictData.cloud.activities?.length || 0) === 0 &&
        (conflictData.cloud.badges?.length || 0) === 0 &&
        (conflictData.cloud.challenges?.length || 0) === 0;

      const localHasData =
        (conflictData.local.activities?.length || 0) > 0 ||
        (conflictData.local.badges?.length || 0) > 0 ||
        (conflictData.local.challenges?.length || 0) > 0;

      let finalStrategy = strategy;
      if (strategy === 'cloud' && cloudIsEmpty && localHasData) {
        console.warn(
          '⚠️ Cloud is empty but user selected cloud strategy. Using local strategy to prevent data loss.'
        );
        finalStrategy = 'local';
        showToast(
          lang === 'tr'
            ? 'Bulut verileri boş olduğu için yerel veriler kullanıldı'
            : 'Cloud data is empty, using local data instead',
          'warning'
        );
      }

      // Add metadata to cloudData if missing (required by CloudData type)
      const cloudDataWithMetadata: import('@/lib/cloudSync/types').CloudData = {
        exercises: (conflictData.cloud.activities as ActivityRecord[]) || [],
        activities: [],
        statistics: [],
        badges: (conflictData.cloud.badges as Badge[]) || [],
        challenges: (conflictData.cloud.challenges as Challenge[]) || [],
        settings: (conflictData.cloud.settings as UserSettings | null) || null,
        points: conflictData.cloud.points || 0,
        lastModified: new Date(),
        metadata: {
          lastModified: new Date(),
          version: Date.now(),
          userId: user?.uid || 'unknown',
        },
      };
      await applyCloudData(cloudDataWithMetadata, finalStrategy);
    } catch (error) {
      console.error('Conflict resolution error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast(
        lang === 'tr'
          ? `Çakışma çözümü hatası: ${errorMessage}`
          : `Conflict resolution error: ${errorMessage}`,
        'error'
      );
    } finally {
      setConflictData(null);
    }
  };

  if (!showConflictDialog || !conflictData) {
    return null;
  }

  // Get local last modified date
  const getLocalLastModified = (): Date | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('sporttrack_last_sync');
      if (stored) {
        const date = new Date(stored);
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
      // If no stored date, check if there are activities and use current time as fallback
      if (activities.length > 0) {
        // Return current time as fallback if activities exist but no timestamp
        return new Date();
      }
    } catch (error) {
      console.error('Failed to get local last modified:', error);
    }
    return null;
  };

  // Get cloud last modified date from conflict data
  // Only return date if cloud actually has data (not empty)
  const getCloudLastModified = (): Date | null => {
    if (!conflictData) return null;
    const cloudData = conflictData.cloud as any;

    // Check if cloud has any data - if empty, don't show last modified date
    const hasCloudData =
      (cloudData.activities && cloudData.activities.length > 0) ||
      (cloudData.badges && cloudData.badges.length > 0) ||
      (cloudData.challenges && cloudData.challenges.length > 0);

    if (!hasCloudData) {
      return null; // No data in cloud, don't show date
    }

    if (cloudData.metadata?.lastModified) {
      try {
        return new Date(cloudData.metadata.lastModified);
      } catch {
        return null;
      }
    }
    return null;
  };

  return (
    <ConflictResolutionDialog
      open={showConflictDialog}
      onResolve={handleConflictResolve}
      onCancel={() => {
        setShowConflictDialog(false);
        setConflictData(null);
        // Clear conflict storage on cancel and mark initial sync as complete
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CONFLICT_STORAGE_KEY);
          // Mark initial sync as complete to prevent re-detection
          localStorage.setItem('sporttrack_initial_sync_complete', 'true');
        }
      }}
      localData={{
        activities: (conflictData.local.activities as ActivityRecord[]) || [],
        badges: (conflictData.local.badges as Badge[]) || [],
        challenges: (conflictData.local.challenges as Challenge[]) || [],
        // Always use current settings from store, as conflict data may not include updated settings
        // This ensures that any settings changes made after conflict detection are reflected
        settings: settings || (conflictData.local.settings as UserSettings | null) || null,
      }}
      cloudData={{
        exercises: (conflictData.cloud.activities as ActivityRecord[]) || [],
        activities: [], // Activity definitions are not in conflict data
        badges: (conflictData.cloud.badges as Badge[]) || [],
        challenges: (conflictData.cloud.challenges as Challenge[]) || [],
        statistics: [], // Statistics are not in conflict data
        points: conflictData.cloud.points || 0, // Include points from conflict data
        lastModified: getCloudLastModified(),
        metadata: {
          lastModified: getCloudLastModified() || new Date(),
          version: Date.now(),
          userId: user?.uid || 'unknown',
        },
        settings: (conflictData.cloud.settings as UserSettings | null) || null,
      }}
      localLastModified={getLocalLastModified()}
      cloudLastModified={getCloudLastModified()}
    />
  );
}
