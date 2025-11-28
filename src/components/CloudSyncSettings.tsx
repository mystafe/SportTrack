'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useToaster } from './Toaster';
import { AuthDialog } from './AuthDialog';
import { useActivities, ActivityRecord } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import type { UserSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import type { Badge } from '@/lib/badges';
import { useChallenges } from '@/lib/challengeStore';
import type { Challenge } from '@/lib/challenges';
import { resolveConflicts, saveLocalLastModified } from '@/lib/cloudSync/conflictResolver';
import { STORAGE_KEYS } from '@/lib/constants';
import { syncHistoryService } from '@/lib/cloudSync/syncHistory';
import type { ConflictStrategy } from '@/lib/cloudSync/conflictResolver';
import { formatDistanceToNow } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { useGlobalDialogState } from '@/lib/globalDialogState';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';

/**
 * Format relative time (e.g., "2 minutes ago")
 */
function formatRelativeTime(date: Date, lang: 'tr' | 'en'): string {
  const locale = lang === 'tr' ? tr : enUS;
  return formatDistanceToNow(date, { addSuffix: true, locale });
}

interface CloudSyncSettingsProps {
  onSyncComplete?: () => void;
  onSyncingChange?: (syncing: boolean) => void;
  onSettingsClose?: () => void;
}

export function CloudSyncSettings({
  onSyncComplete,
  onSyncingChange,
  onSettingsClose,
}: CloudSyncSettingsProps = {}) {
  const router = useRouter();
  const { user, isAuthenticated, logout, isConfigured } = useAuth();
  const { syncState, syncToCloud, syncFromCloud } = useCloudSync();
  const { pendingCount, failedCount, isProcessing, processQueue, retryFailed, getWaitingForRetry } =
    useSyncQueue();
  const { activities } = useActivities();
  const { settings, saveSettings } = useSettings();
  const { badges } = useBadges();
  const { challenges } = useChallenges();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { showToast } = useToaster();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    showConflictDialog,
    setShowConflictDialog,
    conflictData,
    setConflictData,
    showSyncHistoryDialog,
    setShowSyncHistoryDialog,
  } = useGlobalDialogState();
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [syncStatistics, setSyncStatistics] = useState(syncHistoryService.getStatistics());
  const [hasConflicts, setHasConflicts] = useState<boolean | null>(null);

  // Note: Initial conflict resolution on login is now handled by ConflictResolutionManager component
  // This conflict dialog is only used for manual download conflicts

  const checkForConflicts = (
    local: {
      activities: unknown[];
      settings: unknown | null;
      badges: unknown[];
      challenges: unknown[];
    },
    cloud: import('@/lib/cloudSync/types').CloudData
  ): boolean => {
    // Use exercises (yapılan aktiviteler) for comparison, not activities (aktivite tanımları)
    const cloudExercises = (cloud.exercises || cloud.activities || []) as Array<{
      points?: number;
    }>;
    const cloudExercisesLength = cloudExercises.length;

    // Calculate total points for comparison (always from exercises for accuracy)
    const localTotalPoints = (local.activities as Array<{ points?: number }>).reduce(
      (sum, ex) => sum + (ex.points || 0),
      0
    );
    const cloudTotalPoints = cloudExercises.reduce((sum, ex) => sum + (ex.points || 0), 0);

    // Check if counts differ
    const countsDiffer =
      local.activities.length !== cloudExercisesLength ||
      local.badges.length !== (cloud.badges?.length || 0) ||
      local.challenges.length !== (cloud.challenges?.length || 0);

    // Check if total points differ (more accurate than just counts)
    const pointsDiffer = Math.abs(localTotalPoints - cloudTotalPoints) > 0.01; // Allow small floating point differences

    // If counts are the same but points differ, there's still a conflict (data might be different)
    // If counts differ, there's definitely a conflict
    return countsDiffer || pointsDiffer;
  };

  // Check for conflicts periodically (optimized: less frequent checks)
  useEffect(() => {
    if (!isAuthenticated || !isConfigured) {
      setHasConflicts(null);
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    const checkConflicts = async () => {
      try {
        const cloudData = await syncFromCloud();
        if (cloudData) {
          const localData = { activities, settings, badges, challenges };
          const conflicts = checkForConflicts(localData, cloudData);
          setHasConflicts(conflicts);
        } else {
          setHasConflicts(null);
        }
      } catch (error) {
        // Silent fail - conflicts check is not critical
        setHasConflicts(null);
      }
    };

    // Initial check after a short delay (debounce)
    timeoutId = setTimeout(() => {
      checkConflicts();
    }, 2000);

    // Check every 60 seconds (increased from 30s to reduce Firebase requests)
    intervalId = setInterval(checkConflicts, 60000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    isConfigured,
    activities.length,
    badges.length,
    challenges.length,
    settings?.name,
    settings?.dailyTarget,
  ]);

  if (!isConfigured) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {lang === 'tr' ? 'Cloud Sync yapılandırılmamış' : 'Cloud Sync not configured'}
      </div>
    );
  }

  const handleSyncToCloud = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    // Close settings dialog first
    onSettingsClose?.();

    // Show syncing overlay
    setSyncing(true);
    if (onSyncingChange) {
      onSyncingChange(true);
    }

    try {
      // Sync local data to cloud
      await syncToCloud({
        activities,
        settings,
        badges,
        challenges,
      });

      // Show success message
      showToast(lang === 'tr' ? 'Veriler buluta yüklendi!' : 'Data uploaded to cloud!', 'success');

      // Show success overlay
      setSyncing(false);
      setShowSyncSuccess(true);
      if (onSyncingChange) {
        onSyncingChange(false);
      }

      // Hide success overlay after 2 seconds
      setTimeout(() => {
        setShowSyncSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to sync to cloud:', error);
      showToast(lang === 'tr' ? 'Buluta yükleme hatası' : 'Failed to upload to cloud', 'error');
      setSyncing(false);
      if (onSyncingChange) {
        onSyncingChange(false);
      }
    }
  };

  const applyCloudData = useCallback(
    async (cloudData: import('@/lib/cloudSync/types').CloudData, strategy: ConflictStrategy) => {
      const localData = { activities, settings, badges, challenges };
      const resolution = resolveConflicts(localData, cloudData, strategy);

      // Apply resolved data to localStorage
      if (typeof window !== 'undefined') {
        // Write activities
        if (resolution.resolvedData.activities.length > 0) {
          localStorage.setItem(
            STORAGE_KEYS.ACTIVITIES,
            JSON.stringify(resolution.resolvedData.activities)
          );
        } else {
          localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
        }

        // Write badges
        if (resolution.resolvedData.badges.length > 0) {
          localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(resolution.resolvedData.badges));
        } else {
          localStorage.removeItem(STORAGE_KEYS.BADGES);
        }

        // Write challenges
        if (resolution.resolvedData.challenges.length > 0) {
          localStorage.setItem(
            STORAGE_KEYS.CHALLENGES,
            JSON.stringify(resolution.resolvedData.challenges)
          );
        } else {
          localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
        }

        // Apply settings
        if (resolution.resolvedData.settings) {
          saveSettings(resolution.resolvedData.settings);
        }
      }

      // Only sync to cloud if strategy is NOT "cloud" (cloud strategy means use cloud data, don't overwrite it)
      // For "local" strategy: upload local data to cloud
      // For "merge" or "newest": upload merged/resolved data to cloud
      // For "cloud" strategy: just apply cloud data locally, don't upload anything
      if (strategy !== 'cloud') {
        try {
          await syncToCloud({
            activities: resolution.resolvedData.activities,
            settings: resolution.resolvedData.settings,
            badges: resolution.resolvedData.badges,
            challenges: resolution.resolvedData.challenges,
          });
          // Wait a bit more to ensure upload is fully processed
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Failed to sync to cloud after conflict resolution:', error);
          showToast(
            lang === 'tr' ? "Cloud'a yükleme hatası" : 'Failed to upload to cloud',
            'error'
          );
        }
      }

      saveLocalLastModified();

      const message =
        strategy === 'cloud'
          ? lang === 'tr'
            ? 'Bulut verileri uygulandı'
            : 'Cloud data applied'
          : lang === 'tr'
            ? 'Veriler uygulandı ve senkronize edildi!'
            : 'Data applied and synced!';
      showToast(message, 'success');

      // Hide syncing overlay and notify parent
      setSyncing(false);
      if (onSyncingChange) {
        onSyncingChange(false); // This will trigger success overlay in SettingsDialog
      }

      // Close settings dialog after sync completes
      if (onSyncComplete) {
        setTimeout(() => {
          onSyncComplete();
        }, 500);
      }

      // Navigate to homepage after a delay
      setTimeout(() => {
        router.push('/');
      }, 2500);
    },
    [
      activities,
      settings,
      badges,
      challenges,
      syncToCloud,
      saveSettings,
      router,
      lang,
      showToast,
      onSyncingChange,
      onSyncComplete,
    ]
  );

  // Listen for conflict resolve event from GlobalDialogs
  useEffect(() => {
    const handleConflictResolveEvent = async (event: CustomEvent<ConflictStrategy>) => {
      const strategy = event.detail;
      if (!conflictData) return;

      // Show syncing overlay first
      setSyncing(true);
      if (onSyncingChange) {
        onSyncingChange(true);
      }

      try {
        // Clear conflict storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CONFLICT_STORAGE_KEY);
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
            userId: user?.uid || '',
          },
        };
        await applyCloudData(cloudDataWithMetadata, strategy);
      } catch (error) {
        console.error('Conflict resolution error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        showToast(
          lang === 'tr'
            ? `Çakışma çözümü hatası: ${errorMessage}`
            : `Conflict resolution error: ${errorMessage}`,
          'error'
        );
        setSyncing(false);
        if (onSyncingChange) {
          onSyncingChange(false);
        }
        setConflictData(null);
        // Close settings dialog on error too
        if (onSyncComplete) {
          setTimeout(() => {
            onSyncComplete();
          }, 500);
        }
      }
    };

    const eventHandler = (event: Event) => {
      handleConflictResolveEvent(event as CustomEvent<ConflictStrategy>);
    };
    window.addEventListener('sporttrack:conflict-resolve-handler', eventHandler);
    return () => {
      window.removeEventListener('sporttrack:conflict-resolve-handler', eventHandler);
    };
  }, [
    conflictData,
    user?.uid,
    applyCloudData,
    setConflictData,
    setSyncing,
    onSyncingChange,
    onSyncComplete,
    showToast,
    lang,
  ]);

  const handleSyncFromCloud = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    // Close settings dialog first
    onSettingsClose?.();

    // Don't show syncing overlay here, just check for conflicts
    try {
      const cloudData = await syncFromCloud();
      if (cloudData) {
        // Check for conflicts
        const localData = { activities, settings, badges, challenges };
        const hasConflicts = checkForConflicts(localData, cloudData);

        if (hasConflicts) {
          // Convert CloudData to conflict format (use exercises, not activities)
          setConflictData({
            local: localData,
            cloud: {
              activities: (cloudData.exercises || cloudData.activities || []) as unknown[],
              settings: cloudData.settings,
              badges: (cloudData.badges || []) as unknown[],
              challenges: (cloudData.challenges || []) as unknown[],
              metadata: cloudData.metadata,
            },
          });
          // Use requestAnimationFrame to ensure Settings Dialog closes first
          requestAnimationFrame(() => {
            setTimeout(() => {
              setShowConflictDialog(true);
            }, 100);
          });
        } else {
          // No conflicts, apply cloud data directly
          // Show syncing overlay only when actually syncing
          setSyncing(true);
          try {
            await applyCloudData(cloudData, 'cloud');
            showToast(
              lang === 'tr' ? 'Buluttan senkronize edildi!' : 'Synced from cloud!',
              'success'
            );
            // Close settings dialog if callback provided
            if (onSyncComplete) {
              setTimeout(() => {
                onSyncComplete();
              }, 500);
            }
          } finally {
            setSyncing(false);
          }
        }
      }
    } catch (error) {
      showToast(lang === 'tr' ? 'Senkronizasyon hatası' : 'Sync error', 'error');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Before logout, upload local data to cloud if there's any data
      // Never upload empty/zeroed data to cloud
      const hasLocalData =
        activities.length > 0 ||
        badges.length > 0 ||
        challenges.length > 0 ||
        (settings && settings.name && settings.name.trim() !== '');

      if (hasLocalData && isAuthenticated && isConfigured) {
        try {
          console.log('📤 Uploading local data to cloud before logout...');
          await syncToCloud({
            activities,
            settings,
            badges,
            challenges,
          });
          console.log('✅ Local data uploaded to cloud before logout');
        } catch (uploadError) {
          console.error('❌ Failed to upload data before logout:', uploadError);
          // Continue with logout even if upload fails
        }
      }

      // Now logout
      await logout();

      // Clear name from settings when user logs out
      saveSettings({
        name: '',
        dailyTarget: settings?.dailyTarget ?? 10000,
        customActivities: settings?.customActivities ?? [],
        mood: settings?.mood,
      });

      // Clear all localStorage cache
      if (typeof window !== 'undefined') {
        // Clear all SportTrack related localStorage items
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sporttrack.') || key === 'theme' || key === 'lang') {
            localStorage.removeItem(key);
          }
        });
      }

      showToast(
        lang === 'tr'
          ? hasLocalData
            ? 'Veriler buluta yüklendi ve çıkış yapıldı'
            : 'Çıkış yapıldı ve önbellek temizlendi'
          : hasLocalData
            ? 'Data uploaded to cloud and logged out'
            : 'Logged out and cache cleared',
        'success'
      );
    } catch (error) {
      showToast(lang === 'tr' ? 'Çıkış hatası' : 'Logout error', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Syncing Overlay - Shows while syncing */}
      {syncing && !showSyncSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-white p-10 shadow-2xl dark:bg-gray-800 animate-in fade-in zoom-in duration-300">
            {/* Loading Spinner */}
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400"></div>
            </div>

            {/* Syncing Message */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {lang === 'tr' ? 'Veriler Senkronize Ediliyor...' : 'Synchronizing Data...'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {lang === 'tr'
                  ? 'Lütfen bekleyin, verileriniz senkronize ediliyor.'
                  : 'Please wait, your data is being synchronized.'}
              </p>
            </div>

            {/* Loading dots */}
            <div className="flex gap-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400"></div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Success Overlay */}
      {showSyncSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-white p-10 shadow-2xl dark:bg-gray-800 animate-in fade-in zoom-in duration-300">
            {/* Success Checkmark Animation */}
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-green-500 dark:bg-green-600">
                <svg
                  className="h-12 w-12 text-white animate-in zoom-in duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {lang === 'tr' ? 'Senkronizasyon Tamamlandı!' : 'Synchronization Complete!'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {lang === 'tr'
                  ? 'Verileriniz başarıyla senkronize edildi.'
                  : 'Your data has been successfully synchronized.'}
              </p>
            </div>

            {/* Loading dots */}
            <div className="flex gap-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-green-500 dark:bg-green-400 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-green-500 dark:bg-green-400 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-green-500 dark:bg-green-400"></div>
            </div>
          </div>
        </div>
      )}

      <div className={`${isMobile ? 'space-y-2' : 'space-y-2.5'}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-950 dark:text-white`}
            >
              {lang === 'tr' ? 'Cloud Sync' : 'Cloud Sync'}
            </div>
            <div
              className={`${isMobile ? 'text-[10px]' : 'text-[9px] sm:text-[10px]'} font-medium text-gray-600 dark:text-gray-400 ${isMobile ? 'mt-0.5' : 'mt-1'} flex flex-col`}
              title={isAuthenticated && user?.email ? user.email : undefined}
            >
              {isAuthenticated ? (
                user?.email ? (
                  <>
                    <span>{lang === 'tr' ? 'Giriş:' : 'Signed in:'}</span>
                    <span className="truncate">{user.email}</span>
                  </>
                ) : lang === 'tr' ? (
                  'Giriş yapıldı'
                ) : (
                  'Signed in'
                )
              ) : lang === 'tr' ? (
                'Verilerinizi bulutta saklayın'
              ) : (
                'Store your data in the cloud'
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isAuthenticated && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!isAuthenticated) {
                    setShowAuthDialog(true);
                    return;
                  }

                  // Close settings dialog first
                  onSettingsClose?.();

                  // Don't show syncing overlay here, just open conflict dialog
                  try {
                    const cloudData = await syncFromCloud();
                    const localData = { activities, settings, badges, challenges };

                    if (cloudData) {
                      // Convert CloudData to conflict format
                      // Include points from cloudData for proper display
                      setConflictData({
                        local: localData,
                        cloud: {
                          activities: (cloudData.exercises ||
                            cloudData.activities ||
                            []) as unknown[],
                          settings: cloudData.settings,
                          badges: (cloudData.badges || []) as unknown[],
                          challenges: (cloudData.challenges || []) as unknown[],
                          metadata: cloudData.metadata,
                          points: cloudData.points, // Include points for proper display
                        },
                      });
                      // Use requestAnimationFrame to ensure Settings Dialog closes first
                      requestAnimationFrame(() => {
                        setTimeout(() => {
                          setShowConflictDialog(true);
                        }, 100);
                      });
                    } else {
                      // No cloud data, show local data only
                      setConflictData({
                        local: localData,
                        cloud: {
                          activities: [],
                          settings: null,
                          badges: [],
                          challenges: [],
                          points: 0,
                          metadata: {
                            lastModified: new Date(),
                            version: Date.now(),
                            userId: user?.uid || 'unknown',
                          },
                        },
                      });
                      // Use requestAnimationFrame to ensure Settings Dialog closes first
                      requestAnimationFrame(() => {
                        setTimeout(() => {
                          setShowConflictDialog(true);
                        }, 100);
                      });
                    }
                  } catch (error) {
                    console.error('Failed to fetch cloud data:', error);
                    showToast(
                      lang === 'tr' ? 'Bulut verileri alınamadı' : 'Failed to fetch cloud data',
                      'error'
                    );
                  }
                }}
                disabled={syncing || syncState.status === 'syncing'}
                className={`${isMobile ? 'px-2 py-2' : 'px-1.5'} ${isMobile ? 'text-sm' : 'text-xs sm:text-xs'} rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center box-border leading-none`}
                style={
                  isMobile
                    ? {
                        height: '44px',
                        minHeight: '44px',
                        maxHeight: '44px',
                        width: '44px',
                        minWidth: '44px',
                        maxWidth: '44px',
                      }
                    : { height: '24px', minHeight: '24px', maxHeight: '24px' }
                }
                title={
                  lang === 'tr'
                    ? 'Cloud ve Local verileri karşılaştır'
                    : 'Compare Cloud and Local data'
                }
                aria-label={
                  lang === 'tr'
                    ? 'Cloud ve Local verileri karşılaştır'
                    : 'Compare Cloud and Local data'
                }
              >
                {syncing || syncState.status === 'syncing'
                  ? '⏳'
                  : hasConflicts === false
                    ? '✅'
                    : hasConflicts === true
                      ? '⚠️'
                      : syncState.status === 'synced'
                        ? '✅'
                        : '🔄'}
              </Button>
            )}
            <div
              className={`${isMobile ? 'text-xs' : 'text-[8px] sm:text-[9px]'} px-1.5 rounded box-border leading-none flex items-center justify-center gap-2`}
              style={{ height: '24px', minHeight: '24px', maxHeight: '24px' }}
            >
              <span
                className={`${
                  isAuthenticated
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                } px-1.5 py-0.5 rounded`}
              >
                {isAuthenticated
                  ? lang === 'tr'
                    ? 'Bağlı'
                    : 'Connected'
                  : lang === 'tr'
                    ? 'Bağlı Değil'
                    : 'Not Connected'}
              </span>
              {isAuthenticated && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      // Close Settings Dialog first
                      onSettingsClose?.();
                      // Use requestAnimationFrame to ensure Settings Dialog closes first
                      requestAnimationFrame(() => {
                        setTimeout(() => {
                          setShowSyncHistoryDialog(true);
                        }, 100);
                      });
                    }}
                    className={`text-base hover:opacity-70 transition-opacity flex items-center justify-center ${isMobile ? 'min-h-[44px] min-w-[44px]' : 'min-h-[24px] min-w-[24px]'}`}
                    title={lang === 'tr' ? 'Senkronizasyon geçmişi' : 'Sync history'}
                    aria-label={lang === 'tr' ? 'Senkronizasyon geçmişi' : 'Sync history'}
                  >
                    📊
                  </button>
                  {syncState.lastSyncAt && syncState.status !== 'syncing' && (
                    <span className="text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(syncState.lastSyncAt, lang)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <button
            type="button"
            onClick={() => setShowAuthDialog(true)}
            className={`w-full ${isMobile ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs sm:text-sm'} rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300`}
          >
            {lang === 'tr' ? 'Giriş Yap / Kayıt Ol' : 'Sign In / Sign Up'}
          </button>
        )}

        {/* Enhanced Sync Status Display */}
        {isAuthenticated && (
          <div className="space-y-1">
            {/* Real-time Status Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Status Icon */}
                <div className="relative">
                  {syncState.status === 'syncing' || isProcessing ? (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  ) : syncState.status === 'synced' ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  ) : syncState.status === 'error' ? (
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  ) : syncState.status === 'offline' ? (
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  )}
                </div>

                {/* Status Text */}
                <div
                  className={`${isMobile ? 'text-xs' : 'text-[10px]'} ${
                    syncState.status === 'syncing' || isProcessing
                      ? 'text-blue-500 dark:text-blue-400'
                      : syncState.status === 'synced'
                        ? 'text-green-500 dark:text-green-400'
                        : syncState.status === 'error'
                          ? 'text-red-500 dark:text-red-400'
                          : syncState.status === 'offline'
                            ? 'text-gray-500 dark:text-gray-400'
                            : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {syncState.status === 'syncing' || isProcessing
                    ? lang === 'tr'
                      ? 'Senkronize ediliyor...'
                      : 'Syncing...'
                    : syncState.status === 'synced' && syncState.lastSyncAt
                      ? lang === 'tr'
                        ? `Son senkronizasyon: ${new Date(syncState.lastSyncAt).toLocaleTimeString('tr-TR')}`
                        : `Last synced: ${new Date(syncState.lastSyncAt).toLocaleTimeString('en-US')}`
                      : syncState.status === 'error' && syncState.error
                        ? syncState.error
                        : ''}
                </div>
              </div>
            </div>

            {/* Queue Status */}
            {(pendingCount > 0 || failedCount > 0 || getWaitingForRetry().length > 0) && (
              <div className="flex items-center gap-2 flex-wrap">
                {pendingCount > 0 && (
                  <div
                    className={`${isMobile ? 'text-[8px]' : 'text-[9px]'} px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700`}
                  >
                    📦 {lang === 'tr' ? `${pendingCount} bekleyen` : `${pendingCount} pending`}
                  </div>
                )}
                {getWaitingForRetry().length > 0 && (
                  <div
                    className={`${isMobile ? 'text-[8px]' : 'text-[9px]'} px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-700`}
                    title={
                      lang === 'tr'
                        ? 'Exponential backoff nedeniyle bekliyor'
                        : 'Waiting due to exponential backoff'
                    }
                  >
                    ⏳{' '}
                    {lang === 'tr'
                      ? `${getWaitingForRetry().length} bekliyor`
                      : `${getWaitingForRetry().length} waiting`}
                  </div>
                )}
                {failedCount > 0 && (
                  <button
                    type="button"
                    onClick={retryFailed}
                    className={`${isMobile ? 'text-[8px]' : 'text-[9px]'} px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors`}
                    title={lang === 'tr' ? 'Başarısız olanları tekrar dene' : 'Retry failed items'}
                  >
                    ⚠️ {lang === 'tr' ? `${failedCount} başarısız` : `${failedCount} failed`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showAuthDialog && (
        <AuthDialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)} />
      )}

      {/* ConflictResolutionDialog is now rendered in GlobalDialogs */}
      {/* SyncHistoryDialog is now rendered in GlobalDialogs */}
    </>
  );
}
