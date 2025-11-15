'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useToaster } from './Toaster';
import { AuthDialog } from './AuthDialog';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import { resolveConflicts, saveLocalLastModified } from '@/lib/cloudSync/conflictResolver';
import { ConflictResolutionDialog } from './ConflictResolutionDialog';
import type { ConflictStrategy } from '@/lib/cloudSync/conflictResolver';

const CONFLICT_STORAGE_KEY = 'sporttrack_sync_conflict';

export function CloudSyncSettings() {
  const { user, isAuthenticated, logout, isConfigured } = useAuth();
  const { syncState, syncToCloud, syncFromCloud } = useCloudSync();
  const { activities } = useActivities();
  const { settings, saveSettings } = useSettings();
  const { badges } = useBadges();
  const { challenges } = useChallenges();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { showToast } = useToaster();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [syncing, setSyncing] = useState(false);
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
    };
  } | null>(null);

  // Note: Initial conflict resolution on login is now handled by ConflictResolutionManager component
  // This conflict dialog is only used for manual download conflicts

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

    console.log('🔄 handleSyncToCloud called');
    setSyncing(true);
    try {
      console.log('📊 Data to sync:', {
        activities: activities.length,
        settings: settings ? 'present' : 'null',
        badges: badges.length,
        challenges: challenges.length,
      });

      await syncToCloud({
        activities,
        settings,
        badges,
        challenges,
      });

      console.log('✅ Sync completed, showing toast');
      showToast(lang === 'tr' ? 'Buluta senkronize edildi!' : 'Synced to cloud!', 'success');
    } catch (error) {
      console.error('❌ Sync error in handleSyncToCloud:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast(
        lang === 'tr' ? `Senkronizasyon hatası: ${errorMessage}` : `Sync error: ${errorMessage}`,
        'error'
      );
    } finally {
      console.log('🏁 handleSyncToCloud finally, setting syncing to false');
      setSyncing(false);
    }
  };

  const checkForConflicts = (
    local: {
      activities: unknown[];
      settings: unknown | null;
      badges: unknown[];
      challenges: unknown[];
    },
    cloud: {
      activities: unknown[];
      settings: unknown | null;
      badges: unknown[];
      challenges: unknown[];
    }
  ): boolean => {
    // Simple conflict detection: check if counts differ
    return (
      local.activities.length !== cloud.activities.length ||
      local.badges.length !== cloud.badges.length ||
      local.challenges.length !== cloud.challenges.length ||
      JSON.stringify(local.settings) !== JSON.stringify(cloud.settings)
    );
  };

  const applyCloudData = async (
    cloudData: import('@/lib/cloudSync/types').CloudData,
    strategy: ConflictStrategy
  ) => {
    const localData = { activities, settings, badges, challenges };
    const resolution = resolveConflicts(localData, cloudData, strategy);

    // Apply resolved data locally
    // Apply settings
    if (resolution.resolvedData.settings) {
      saveSettings(resolution.resolvedData.settings);
    }

    // Only sync to cloud if strategy is NOT "cloud" (cloud strategy means use cloud data, don't overwrite it)
    // For "local" strategy: upload local data to cloud
    // For "merge" or "newest": upload merged/resolved data to cloud
    // For "cloud" strategy: just apply cloud data locally, don't upload anything
    if (strategy !== 'cloud') {
      await syncToCloud({
        activities: resolution.resolvedData.activities,
        settings: resolution.resolvedData.settings,
        badges: resolution.resolvedData.badges,
        challenges: resolution.resolvedData.challenges,
      });
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
  };

  const handleConflictResolve = async (strategy: ConflictStrategy) => {
    if (!conflictData) return;

    setShowConflictDialog(false);
    setSyncing(true);

    try {
      // Clear conflict storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CONFLICT_STORAGE_KEY);
      }

      // Add metadata to cloudData if missing (required by CloudData type)
      const cloudDataWithMetadata: import('@/lib/cloudSync/types').CloudData = {
        ...conflictData.cloud,
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
    } finally {
      setSyncing(false);
      setConflictData(null);
    }
  };

  const handleSyncFromCloud = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    setSyncing(true);
    try {
      const cloudData = await syncFromCloud();
      if (cloudData) {
        // Check for conflicts
        const localData = { activities, settings, badges, challenges };
        const hasConflicts = checkForConflicts(localData, cloudData);

        if (hasConflicts) {
          setConflictData({
            local: localData,
            cloud: cloudData,
          });
          setShowConflictDialog(true);
        } else {
          // No conflicts, apply cloud data directly
          await applyCloudData(cloudData, 'cloud');
          showToast(
            lang === 'tr' ? 'Buluttan senkronize edildi!' : 'Synced from cloud!',
            'success'
          );
        }
      }
    } catch (error) {
      showToast(lang === 'tr' ? 'Senkronizasyon hatası' : 'Sync error', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
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
        lang === 'tr' ? 'Çıkış yapıldı ve önbellek temizlendi' : 'Logged out and cache cleared',
        'success'
      );
    } catch (error) {
      showToast(lang === 'tr' ? 'Çıkış hatası' : 'Logout error', 'error');
    }
  };

  return (
    <>
      <div className={`${isMobile ? 'space-y-2' : 'space-y-2.5'}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-950 dark:text-white`}
            >
              {lang === 'tr' ? 'Cloud Sync' : 'Cloud Sync'}
            </div>
            <div
              className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-400 ${isMobile ? 'mt-0.5' : 'mt-1'} truncate`}
            >
              {isAuthenticated
                ? user?.email
                  ? `${lang === 'tr' ? 'Giriş: ' : 'Signed in: '}${user.email}`
                  : lang === 'tr'
                    ? 'Giriş yapıldı'
                    : 'Signed in'
                : lang === 'tr'
                  ? 'Verilerinizi bulutta saklayın'
                  : 'Store your data in the cloud'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isAuthenticated && (
              <button
                type="button"
                onClick={async () => {
                  if (!isAuthenticated) {
                    setShowAuthDialog(true);
                    return;
                  }

                  setSyncing(true);
                  try {
                    const cloudData = await syncFromCloud();
                    if (cloudData) {
                      // Check for conflicts
                      const localData = { activities, settings, badges, challenges };
                      const hasConflicts = checkForConflicts(localData, cloudData);

                      if (hasConflicts) {
                        setConflictData({
                          local: localData,
                          cloud: cloudData,
                        });
                        setShowConflictDialog(true);
                      } else {
                        // No conflicts, sync both ways
                        await syncToCloud({
                          activities,
                          settings,
                          badges,
                          challenges,
                        });
                        showToast(lang === 'tr' ? 'Senkronize edildi!' : 'Synced!', 'success');
                      }
                    } else {
                      // No cloud data, just upload local
                      await syncToCloud({
                        activities,
                        settings,
                        badges,
                        challenges,
                      });
                      showToast(
                        lang === 'tr' ? 'Buluta senkronize edildi!' : 'Synced to cloud!',
                        'success'
                      );
                    }
                  } catch (error) {
                    showToast(lang === 'tr' ? 'Senkronizasyon hatası' : 'Sync error', 'error');
                  } finally {
                    setSyncing(false);
                  }
                }}
                disabled={syncing || syncState.status === 'syncing'}
                className="px-1.5 text-[8px] sm:text-[9px] rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center box-border leading-none"
                style={{ height: '24px', minHeight: '24px', maxHeight: '24px' }}
                title={
                  syncing || syncState.status === 'syncing'
                    ? lang === 'tr'
                      ? 'Senkronize ediliyor...'
                      : 'Syncing...'
                    : lang === 'tr'
                      ? 'Senkronize Et'
                      : 'Sync'
                }
                aria-label={lang === 'tr' ? 'Senkronize Et' : 'Sync'}
              >
                {syncing || syncState.status === 'syncing'
                  ? '⏳'
                  : syncState.status === 'synced'
                    ? '✅'
                    : '🔄'}
              </button>
            )}
            <div
              className="text-[8px] sm:text-[9px] px-1.5 rounded box-border leading-none flex items-center justify-center"
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
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <button
            type="button"
            onClick={() => setShowAuthDialog(true)}
            className={`w-full ${isMobile ? 'px-2.5 py-1.5 text-[10px]' : 'px-3 py-2 text-xs sm:text-sm'} rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300`}
          >
            {lang === 'tr' ? 'Giriş Yap / Kayıt Ol' : 'Sign In / Sign Up'}
          </button>
        )}

        {/* Sync Status Display */}
        {isAuthenticated && (
          <div
            className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} ${
              syncState.status === 'syncing'
                ? 'text-blue-500 dark:text-blue-400'
                : syncState.status === 'synced'
                  ? 'text-green-500 dark:text-green-400'
                  : syncState.status === 'error'
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {syncState.status === 'syncing' &&
              (lang === 'tr' ? 'Senkronize ediliyor...' : 'Syncing...')}
            {syncState.status === 'synced' &&
              syncState.lastSyncAt &&
              (lang === 'tr'
                ? `Son senkronizasyon: ${new Date(syncState.lastSyncAt).toLocaleTimeString('tr-TR')}`
                : `Last synced: ${new Date(syncState.lastSyncAt).toLocaleTimeString('en-US')}`)}
            {syncState.status === 'error' && syncState.error && <span>{syncState.error}</span>}
          </div>
        )}
      </div>

      {showAuthDialog && (
        <AuthDialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)} />
      )}

      {showConflictDialog && conflictData && (
        <ConflictResolutionDialog
          open={showConflictDialog}
          onResolve={handleConflictResolve}
          onCancel={() => {
            setShowConflictDialog(false);
            setConflictData(null);
            // Clear conflict storage on cancel
            if (typeof window !== 'undefined') {
              localStorage.removeItem(CONFLICT_STORAGE_KEY);
            }
          }}
          localCount={{
            activities: conflictData.local.activities.length,
            badges: conflictData.local.badges.length,
          }}
          cloudCount={{
            activities: conflictData.cloud.activities.length,
            badges: conflictData.cloud.badges.length,
          }}
          localLastModified={(() => {
            if (typeof window === 'undefined') return null;
            try {
              const stored = localStorage.getItem('sporttrack_last_sync');
              if (stored) {
                const date = new Date(stored);
                if (!isNaN(date.getTime())) {
                  return date;
                }
              }
              // If no stored date, check if there are activities and use current time as fallback
              if (activities.length > 0) {
                return new Date();
              }
            } catch (error) {
              console.error('Failed to get local last modified:', error);
            }
            return null;
          })()}
          cloudLastModified={
            (conflictData.cloud as any).metadata?.lastModified
              ? new Date((conflictData.cloud as any).metadata.lastModified)
              : null
          }
        />
      )}
    </>
  );
}
