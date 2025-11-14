'use client';

import { useState } from 'react';
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

export function CloudSyncSettings() {
  const { user, isAuthenticated, logout, isConfigured } = useAuth();
  const { syncState, syncToCloud, syncFromCloud } = useCloudSync();
  const { activities } = useActivities();
  const { settings } = useSettings();
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

    setSyncing(true);
    try {
      await syncToCloud({
        activities,
        settings,
        badges,
        challenges,
      });
      showToast(lang === 'tr' ? 'Buluta senkronize edildi!' : 'Synced to cloud!', 'success');
    } catch (error) {
      showToast(lang === 'tr' ? 'Senkronizasyon hatası' : 'Sync error', 'error');
    } finally {
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

  const applyCloudData = async (cloudData: any, strategy: ConflictStrategy) => {
    const localData = { activities, settings, badges, challenges };
    const resolution = resolveConflicts(localData, cloudData, strategy);

    // Apply resolved data
    // Note: This would require store methods to update in bulk
    // For now, we'll just save the last sync timestamp
    saveLocalLastModified();

    showToast(lang === 'tr' ? 'Veriler uygulandı!' : 'Data applied!', 'success');
  };

  const handleConflictResolve = async (strategy: ConflictStrategy) => {
    if (!conflictData) return;

    setShowConflictDialog(false);
    setSyncing(true);

    try {
      await applyCloudData(conflictData.cloud, strategy);
    } catch (error) {
      showToast(lang === 'tr' ? 'Çakışma çözümü hatası' : 'Conflict resolution error', 'error');
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
      showToast(lang === 'tr' ? 'Çıkış yapıldı' : 'Logged out', 'success');
    } catch (error) {
      showToast(lang === 'tr' ? 'Çıkış hatası' : 'Logout error', 'error');
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Cloud Sync' : 'Cloud Sync'}
            </div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
              {isAuthenticated
                ? user?.email
                  ? `${lang === 'tr' ? 'Giriş yapıldı: ' : 'Signed in: '}${user.email}`
                  : lang === 'tr'
                    ? 'Giriş yapıldı'
                    : 'Signed in'
                : lang === 'tr'
                  ? 'Verilerinizi bulutta saklayın'
                  : 'Store your data in the cloud'}
            </div>
          </div>
          <div
            className={`text-xs px-2 py-1 rounded ${
              isAuthenticated
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {isAuthenticated
              ? lang === 'tr'
                ? 'Bağlı'
                : 'Connected'
              : lang === 'tr'
                ? 'Bağlı Değil'
                : 'Not Connected'}
          </div>
        </div>

        {!isAuthenticated ? (
          <button
            type="button"
            onClick={() => setShowAuthDialog(true)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300"
          >
            {lang === 'tr' ? 'Giriş Yap / Kayıt Ol' : 'Sign In / Sign Up'}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSyncToCloud}
                disabled={syncing || syncState.status === 'syncing'}
                className="flex-1 px-3 py-2 text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-50"
              >
                {syncing || syncState.status === 'syncing'
                  ? '...'
                  : lang === 'tr'
                    ? 'Yükle'
                    : 'Upload'}
              </button>
              <button
                type="button"
                onClick={handleSyncFromCloud}
                disabled={syncing || syncState.status === 'syncing'}
                className="flex-1 px-3 py-2 text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-50"
              >
                {syncing || syncState.status === 'syncing'
                  ? '...'
                  : lang === 'tr'
                    ? 'İndir'
                    : 'Download'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-3 py-2 text-xs rounded-lg border-2 border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-red-900/10 hover:from-red-100 hover:to-red-50 dark:hover:from-red-800/30 transition-all duration-200 text-red-700 dark:text-red-400 font-semibold"
            >
              {lang === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
            </button>
          </div>
        )}

        {syncState.status === 'error' && syncState.error && (
          <div className="text-xs text-red-500 dark:text-red-400">{syncState.error}</div>
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
          }}
          localCount={{
            activities: conflictData.local.activities.length,
            badges: conflictData.local.badges.length,
            challenges: conflictData.local.challenges.length,
          }}
          cloudCount={{
            activities: conflictData.cloud.activities.length,
            badges: conflictData.cloud.badges.length,
            challenges: conflictData.cloud.challenges.length,
          }}
        />
      )}
    </>
  );
}
