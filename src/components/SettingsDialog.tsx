'use client';

import React, { FormEvent, useEffect, useState, useRef, lazy, Suspense, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings, Mood } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { LIMITS } from '@/lib/constants';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationSettings } from '@/components/NotificationSettings';
import { LevelDisplay } from '@/components/LevelDisplay';
import { useKeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/AuthDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToaster } from '@/components/Toaster';
import { useRouter } from 'next/navigation';
import { useActivities } from '@/lib/activityStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import { STORAGE_KEYS } from '@/lib/constants';
import type { ActivityDefinition } from '@/lib/activityConfig';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useAutoSync } from '@/hooks/useAutoSync';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useDialogManager } from '@/lib/dialogManager';

// Lazy load heavy components that are not always visible
const DataExportImport = lazy(() =>
  import('@/components/DataExportImport').then((m) => ({ default: m.DataExportImport }))
);
const AppleHealthImport = lazy(() =>
  import('@/components/AppleHealthImport').then((m) => ({ default: m.AppleHealthImport }))
);
const AppleHealthGuide = lazy(() =>
  import('@/components/AppleHealthGuide').then((m) => ({ default: m.AppleHealthGuide }))
);
const CloudSyncSettings = lazy(() =>
  import('@/components/CloudSyncSettings').then((m) => ({ default: m.CloudSyncSettings }))
);
const ActivityReminders = lazy(() =>
  import('@/components/ActivityReminders').then((m) => ({ default: m.ActivityReminders }))
);

interface SettingsDialogProps {
  triggerButton?: React.ReactNode;
}

export function SettingsDialog({ triggerButton }: SettingsDialogProps = {}) {
  const { settings, hydrated, saveSettings } = useSettings();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const keyboardShortcuts = useKeyboardShortcuts();
  const { isAuthenticated, isConfigured, user, logout } = useAuth();
  const { showToast } = useToaster();
  const router = useRouter();
  const { activities, clearAllActivities, addActivity } = useActivities();
  const { badges, clearAllBadges, checkNewBadges } = useBadges();
  const { challenges, clearAllChallenges, addChallenge } = useChallenges();
  const { syncToCloud } = useCloudSync();
  const { flushPendingSync } = useAutoSync();
  const { dialogs } = useDialogManager();
  const [open, setOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showActivityRemindersDialog, setShowActivityRemindersDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [showClearDataSuccess, setShowClearDataSuccess] = useState(false);
  const [name, setName] = useState<string>(settings?.name ?? '');
  const [dailyTarget, setDailyTarget] = useState<string>(
    String(settings?.dailyTarget ?? DEFAULT_DAILY_TARGET)
  );
  const [mood, setMood] = useState<Mood>(settings?.mood ?? null);
  const [reduceAnimations, setReduceAnimations] = useState<boolean>(
    settings?.reduceAnimations ?? false
  );
  const [isLoadingDummyData, setIsLoadingDummyData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasSyncedNameRef = useRef(false);

  useEffect(() => {
    if (settings) {
      setName(settings.name || '');
      setDailyTarget(String(settings.dailyTarget));
      setMood(settings.mood ?? null);
      setReduceAnimations(settings.reduceAnimations ?? false);
    }
  }, [settings]);

  // Listen for custom event to open settings
  useEffect(() => {
    const handleOpenSettings = () => {
      setOpen(true);
    };
    window.addEventListener('open-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open-settings', handleOpenSettings);
    };
  }, []);

  // Listen for custom event to close settings (e.g., from Conflict Resolution Manager)
  useEffect(() => {
    const handleCloseSettings = () => {
      setOpen(false);
    };
    window.addEventListener('sporttrack:close-settings-dialog', handleCloseSettings);
    return () => {
      window.removeEventListener('sporttrack:close-settings-dialog', handleCloseSettings);
    };
  }, []);

  // Close Settings Dialog when other dialogs are opened
  useEffect(() => {
    // Filter out Settings Dialog itself and check if any other dialog is open
    const otherDialogs = dialogs.filter((d) => d.id !== 'settings-dialog');
    if (open && otherDialogs.length > 0) {
      // Close Settings Dialog when another dialog opens
      setOpen(false);
    }
  }, [dialogs, open]);

  // Update name when user logs in - sync Firebase displayName to settings (only once)
  useEffect(() => {
    if (isAuthenticated && user?.displayName && !hasSyncedNameRef.current) {
      // If Firebase has displayName and settings doesn't have it or is different, sync it
      if (!settings?.name || settings.name !== user.displayName) {
        hasSyncedNameRef.current = true;
        saveSettings({
          name: user.displayName,
          dailyTarget: settings?.dailyTarget ?? DEFAULT_DAILY_TARGET,
          customActivities: settings?.customActivities ?? [],
          mood: settings?.mood,
        });
      }
    }
    // Reset ref and clear name when user logs out
    if (!isAuthenticated) {
      hasSyncedNameRef.current = false;
      // Clear name from settings when user logs out
      if (settings?.name && settings.name.trim() !== '') {
        saveSettings({
          name: '',
          dailyTarget: settings.dailyTarget,
          customActivities: settings.customActivities,
          mood: settings.mood,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.displayName]);

  if (!hydrated) {
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName && !isAuthenticated) {
      setError(lang === 'tr' ? 'Lütfen bir isim girin' : 'Please enter a name');
      return;
    }
    const targetValue = Number(dailyTarget);
    if (!Number.isFinite(targetValue) || targetValue <= 0) {
      setError(t('settings.errors.targetPositive'));
      return;
    }
    if (targetValue < LIMITS.DAILY_TARGET_MIN || targetValue > LIMITS.DAILY_TARGET_MAX) {
      setError(t('settings.errors.targetRange'));
      return;
    }
    saveSettings({
      name: trimmedName || (isAuthenticated && user?.displayName ? user.displayName : ''),
      dailyTarget: Math.round(targetValue),
      customActivities: settings?.customActivities ?? [],
      mood: mood ?? undefined,
      reduceAnimations: reduceAnimations,
    });
    setOpen(false);
    setError(null);
  }

  // Listen for open-settings event from CommandPalette
  useEffect(() => {
    const handleOpenSettings = () => {
      setOpen(true);
    };
    window.addEventListener('open-settings', handleOpenSettings);
    return () => window.removeEventListener('open-settings', handleOpenSettings);
  }, []);

  // Auto-save on change instead of requiring explicit save
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      const trimmedName = name.trim();
      const targetValue = Number(dailyTarget);

      if (
        Number.isFinite(targetValue) &&
        targetValue > 0 &&
        targetValue >= LIMITS.DAILY_TARGET_MIN &&
        targetValue <= LIMITS.DAILY_TARGET_MAX &&
        (trimmedName || isAuthenticated)
      ) {
        saveSettings({
          name: trimmedName || (isAuthenticated && user?.displayName ? user.displayName : ''),
          dailyTarget: Math.round(targetValue),
          customActivities: settings?.customActivities ?? [],
          mood: mood ?? undefined,
          reduceAnimations: reduceAnimations,
        });
      }
    }, 1000); // Auto-save after 1 second of no changes

    return () => clearTimeout(timer);
  }, [
    name,
    dailyTarget,
    mood,
    reduceAnimations,
    open,
    isAuthenticated,
    user?.displayName,
    settings?.customActivities,
  ]);

  const handleLoginClick = () => {
    setOpen(false); // Close settings dialog first
    setError(null);
    // Wait for settings dialog to fully close before opening auth dialog
    // Increased timeout to ensure Settings Dialog backdrop is removed
    setTimeout(() => {
      setShowAuthDialog(true); // Then open auth dialog
    }, 300);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setOpen(false); // Close settings dialog immediately

    try {
      // CRITICAL: Flush any pending debounced sync operations first
      // Use timeout to prevent blocking logout
      try {
        await Promise.race([
          flushPendingSync(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Sync timeout')), 5000)),
        ]);
      } catch (flushError: any) {
        // Log only in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to flush pending sync:', flushError);
        }
        // Check if it's a quota error - skip sync if so
        const isQuotaError =
          flushError?.code === 'resource-exhausted' ||
          flushError?.message?.includes('quota') ||
          flushError?.message?.includes('Quota exceeded');
        if (isQuotaError) {
          console.warn('Firebase quota exceeded - skipping sync before logout');
        }
        // Continue anyway - we'll try a full sync below (with timeout)
      }

      // Read latest data directly from localStorage to ensure we have the most up-to-date data
      // This is important because store updates might be debounced
      let latestActivities: unknown[] = [];
      let latestSettings: unknown | null = null;
      let latestBadges: unknown[] = [];
      let latestChallenges: unknown[] = [];

      if (typeof window !== 'undefined') {
        try {
          const activitiesRaw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
          if (activitiesRaw) {
            latestActivities = JSON.parse(activitiesRaw);
          }
          const settingsRaw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          if (settingsRaw) {
            latestSettings = JSON.parse(settingsRaw);
          }
          const badgesRaw = localStorage.getItem(STORAGE_KEYS.BADGES);
          if (badgesRaw) {
            latestBadges = JSON.parse(badgesRaw);
          }
          const challengesRaw = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
          if (challengesRaw) {
            latestChallenges = JSON.parse(challengesRaw);
          }
        } catch (parseError) {
          console.error('Failed to read data from localStorage:', parseError);
          // Fallback to store values
          latestActivities = activities;
          latestSettings = settings;
          latestBadges = badges;
          latestChallenges = challenges;
        }
      } else {
        // Fallback to store values if localStorage is not available
        latestActivities = activities;
        latestSettings = settings;
        latestBadges = badges;
        latestChallenges = challenges;
      }

      // Sync to cloud before logout ONLY if there's actual data to sync
      // Don't sync empty data as it will overwrite cloud data
      const hasDataToSync =
        latestActivities.length > 0 ||
        latestBadges.length > 0 ||
        latestChallenges.length > 0 ||
        (latestSettings && latestSettings !== null);

      if (hasDataToSync) {
        try {
          // Debug log only in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Syncing latest data to cloud before logout...', {
              activitiesCount: latestActivities.length,
              badgesCount: latestBadges.length,
              challengesCount: latestChallenges.length,
              hasSettings: !!latestSettings,
            });
          }
          // Add timeout to prevent blocking logout
          await Promise.race([
            syncToCloud({
              activities: latestActivities,
              settings: latestSettings,
              badges: latestBadges,
              challenges: latestChallenges,
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Sync timeout')), 8000)),
          ]);
        } catch (syncError: any) {
          // Check if it's a quota error
          const isQuotaError =
            syncError?.code === 'resource-exhausted' ||
            syncError?.message?.includes('quota') ||
            syncError?.message?.includes('Quota exceeded') ||
            syncError?.message === 'Sync timeout';

          if (isQuotaError) {
            console.warn(
              'Firebase quota exceeded or sync timeout - continuing logout without sync'
            );
            // Show warning toast but don't block logout
            showToast(
              lang === 'tr'
                ? 'Firebase kotası doldu. Çıkış yapılıyor ancak veriler senkronize edilemedi.'
                : 'Firebase quota exceeded. Logging out but data could not be synced.',
              'warning'
            );
          } else {
            // Log other errors only in development
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to sync before logout:', syncError);
            }
          }
          // Continue with logout even if sync fails
        }
      } else {
        // Debug log only in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Skipping sync before logout - no data to sync');
        }
      }

      // Clear all data stores BEFORE logout to prevent race conditions
      clearAllActivities();
      clearAllBadges();
      clearAllChallenges();

      // Reset settings to default values
      saveSettings({
        name: '',
        dailyTarget: 10000,
        customActivities: [],
        mood: undefined,
      });

      // Clear all localStorage cache (except theme and lang)
      if (typeof window !== 'undefined') {
        // Clear all SportTrack related localStorage items
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sporttrack.')) {
            localStorage.removeItem(key);
          }
        });

        // Clear initial sync flags to allow fresh sync on next login
        localStorage.removeItem('sporttrack_initial_sync_complete');
        localStorage.removeItem('sporttrack_sync_conflict');
        localStorage.removeItem('sporttrack_last_login_time'); // Clear for WelcomeToast
        localStorage.removeItem('sporttrack_last_user_id'); // Clear for WelcomeToast

        // Prevent login popup from showing
        localStorage.setItem('sporttrack.skip_login_popup', 'true');
      }

      // Perform logout
      await logout();

      // Small delay to ensure logout completes
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Navigate to homepage using replace to prevent back navigation
      router.replace('/');

      // Show success message (only if we didn't already show a warning)
      // Check if we already showed a warning toast by checking if there was a sync error
      // For now, always show success message
      showToast(lang === 'tr' ? 'Başarıyla çıkış yapıldı!' : 'Successfully logged out!', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast(
        lang === 'tr'
          ? 'Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
          : 'An error occurred while logging out. Please try again.',
        'error'
      );
    } finally {
      // Reset logout state after a short delay to show completion
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 500);
    }
  };

  const handleClearData = () => {
    setShowClearDataDialog(true);
  };

  const confirmClearData = async () => {
    // Close dialog and show clearing animation
    setShowClearDataDialog(false);
    setIsClearingData(true);

    try {
      // If user is authenticated, upload empty data to cloud to clear cloud storage
      // This is the ONLY place where empty data can be uploaded to cloud
      if (isAuthenticated && isConfigured) {
        try {
          await syncToCloud(
            {
              activities: [],
              settings: null,
              badges: [],
              challenges: [],
            },
            { isReset: true } // Mark this as a reset operation to allow empty data upload
          );
          console.log('✅ Cloud storage cleared via reset operation');
        } catch (uploadError) {
          console.error('❌ Failed to clear cloud storage:', uploadError);
          // Continue with local clear even if cloud clear fails
        }
      }

      // Clear all data stores
      clearAllActivities();
      clearAllBadges();
      clearAllChallenges();

      // Reset settings to default values
      saveSettings({
        name: '',
        dailyTarget: 10000,
        customActivities: [],
        mood: undefined,
      });

      // Clear all localStorage data
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach((key) => {
          if (
            key.startsWith('sporttrack.') ||
            key === 'theme' ||
            key === 'lang' ||
            key === 'name_dialog_shown'
          ) {
            localStorage.removeItem(key);
          }
        });

        // Clear initial sync flags to allow fresh sync on next login
        localStorage.removeItem('sporttrack_initial_sync_complete');
        localStorage.removeItem('sporttrack_sync_conflict');
        localStorage.removeItem('sporttrack_last_login_time'); // Clear for WelcomeToast
        localStorage.removeItem('sporttrack_last_user_id'); // Clear for WelcomeToast

        // Prevent login popup from showing
        localStorage.setItem('sporttrack.skip_login_popup', 'true');
      }

      // Close settings dialog
      setOpen(false);

      // Show success animation
      setIsClearingData(false);
      setShowClearDataSuccess(true);

      // Wait for animation, then navigate to homepage
      setTimeout(() => {
        setShowClearDataSuccess(false);
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Failed to clear data:', error);
      setIsClearingData(false);
      showToast(lang === 'tr' ? 'Veri temizleme hatası' : 'Error clearing data', 'error');
    }
  };

  // Settings dialog - Different content for authenticated vs non-authenticated users
  const renderSettingsDialog = () => {
    if (!open || showAuthDialog) return null;
    return (
      <div
        className={`fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 dark:bg-black/50 backdrop-blur-sm px-4 pt-4 pb-4 overflow-y-auto safe-top safe-bottom safe-left safe-right transition-opacity duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none opacity-0'}`}
        onClick={(e) => {
          // Close when clicking outside the dialog
          if (e.target === e.currentTarget) {
            setOpen(false);
            setError(null);
            if (settings) {
              setName(settings.name || '');
              setDailyTarget(String(settings.dailyTarget));
            }
          }
        }}
      >
        <div
          className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-lg'} rounded-b-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 ${isMobile ? 'p-4' : 'p-4 sm:p-5'} mt-0 sticky top-0 max-h-[90vh] overflow-y-auto slide-down-top pointer-events-auto`}
          onClick={(e) => {
            // Prevent closing when clicking inside the dialog
            e.stopPropagation();
          }}
        >
          {/* Header */}
          <div
            className={`${isMobile ? 'mb-2.5 pb-2' : 'mb-3 pb-2.5'} border-b border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-1">
                <h2
                  className={`${isMobile ? 'text-xs' : 'text-sm sm:text-base'} font-bold text-gray-950 dark:text-white flex items-center gap-1.5`}
                >
                  <span className={isMobile ? 'text-sm' : 'text-base'}>⚙️</span>
                  {isAuthenticated ? (lang === 'tr' ? 'Ayarlar' : 'Settings') : t('settings.title')}
                </h2>
                <span
                  className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} text-gray-400 dark:text-gray-500 font-normal whitespace-nowrap ml-2`}
                >
                  © {new Date().getFullYear()} · Mustafa Evleksiz · Beta v0.26.7
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setError(null);
                  if (settings) {
                    setName(settings.name || '');
                    setDailyTarget(String(settings.dailyTarget));
                  }
                }}
                className={`text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg leading-none flex items-center justify-center ${isMobile ? 'min-h-[44px] min-w-[44px]' : 'min-h-[36px] min-w-[36px]'}`}
                aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
                title={lang === 'tr' ? 'Kapat' : 'Close'}
              >
                ×
              </button>
            </div>
            {!isMobile && (
              <p
                className={`text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5`}
              >
                {isAuthenticated
                  ? lang === 'tr'
                    ? 'Hesap ayarlarınızı ve uygulama tercihlerinizi yönetin.'
                    : 'Manage your account settings and app preferences.'
                  : t('settings.subtitle')}
              </p>
            )}
          </div>

          {/* Form */}
          <form
            className={isMobile ? 'space-y-3' : 'space-y-2.5'}
            onSubmit={submit}
            autoComplete="off"
          >
            {!isAuthenticated ? (
              <>
                {/* Non-authenticated users: Login options + Name + Daily Goal + Emotion */}

                {/* Login Section */}
                {isConfigured && (
                  <div
                    className={`${isMobile ? 'mb-4 pb-4' : 'mb-4 pb-4'} border-b border-gray-200 dark:border-gray-700`}
                  >
                    <button
                      type="button"
                      onClick={handleLoginClick}
                      className={`w-full ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm sm:text-base'} rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300`}
                    >
                      {t('nav.login') || 'Login'} / {t('auth.signUp') || 'Sign Up'}
                    </button>
                  </div>
                )}

                {/* Name Field */}
                <label className={`block ${isMobile ? 'space-y-1' : 'space-y-1.5'}`}>
                  <span
                    className={`${isMobile ? 'text-sm' : 'text-xs sm:text-sm'} font-semibold text-gray-700 dark:text-gray-300`}
                  >
                    {t('settings.nameLabel')}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`input-enhanced w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-3 py-2.5 text-base min-h-[44px]' : 'px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base min-h-[44px]'} bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all`}
                    placeholder={lang === 'tr' ? 'İsminiz' : 'Your name'}
                    autoComplete="off"
                    data-form-type="other"
                    inputMode="text"
                  />
                </label>

                {/* Daily Goal and Emotion/Feeling - Same Row (always side by side) */}
                <div className={`grid grid-cols-2 ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                  <label className={`block ${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
                    <span
                      className={`${isMobile ? 'text-sm' : 'text-xs sm:text-sm'} font-semibold text-gray-700 dark:text-gray-300`}
                    >
                      {t('settings.goalLabel')}
                    </span>
                    <Input
                      type="number"
                      min={LIMITS.DAILY_TARGET_MIN}
                      max={LIMITS.DAILY_TARGET_MAX}
                      step={100}
                      value={dailyTarget}
                      onChange={(e) => setDailyTarget(e.target.value)}
                      placeholder="10000"
                      autoComplete="off"
                      data-form-type="other"
                      size={isMobile ? 'sm' : 'sm'}
                      className="w-full"
                    />
                  </label>

                  <label className={`block ${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
                    <span
                      className={`${isMobile ? 'text-sm' : 'text-xs sm:text-sm'} font-semibold text-gray-700 dark:text-gray-300`}
                    >
                      {t('settings.moodLabel')}
                    </span>
                    <Select
                      value={mood || ''}
                      onChange={(e) => setMood((e.target.value || null) as Mood)}
                      size={isMobile ? 'sm' : 'sm'}
                      options={[
                        { value: '', label: t('settings.moodNone') },
                        { value: 'happy', label: t('settings.moodHappy') },
                        { value: 'cheerful', label: t('settings.moodCheerful') },
                        { value: 'sad', label: t('settings.moodSad') },
                        { value: 'unhappy', label: t('settings.moodUnhappy') },
                        { value: 'tired', label: t('settings.moodTired') },
                      ]}
                      className="w-full"
                    />
                  </label>
                </div>

                {/* Export/Import - Only show if authenticated */}
                {isAuthenticated && (
                  <div
                    className={`${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-gray-200 dark:border-gray-700`}
                  >
                    <span
                      className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                    >
                      {t('data.export')} / {t('data.import')}
                    </span>
                    <Suspense
                      fallback={
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      }
                    >
                      <DataExportImport onSettingsClose={() => setOpen(false)} />
                    </Suspense>
                  </div>
                )}

                {/* Language & Theme & Reduce Animations */}
                <div
                  className={`${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-gray-200 dark:border-gray-700`}
                >
                  <span
                    className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                  >
                    {lang === 'tr' ? 'Görünüm Ayarları' : 'Display Settings'}
                  </span>
                  <div className={`flex items-center flex-wrap ${isMobile ? 'gap-1.5' : 'gap-3'}`}>
                    <LanguageToggle />
                    <ThemeToggle />
                    <Button
                      type="button"
                      variant={reduceAnimations ? 'primary' : 'ghost'}
                      size="sm"
                      className={`px-1 py-0.5 ${isMobile ? 'text-[7px] min-h-[20px]' : 'text-[8px] sm:text-[9px] min-h-[22px]'} hover:scale-110 active:scale-95`}
                      onClick={() => setReduceAnimations(!reduceAnimations)}
                      aria-pressed={reduceAnimations}
                      title={lang === 'tr' ? 'Animasyonları Azalt' : 'Reduce Animations'}
                    >
                      ⚡
                    </Button>
                    {/* Admin Mod Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`px-1 py-0.5 ${isMobile ? 'text-[7px] min-h-[20px]' : 'text-[8px] sm:text-[9px] min-h-[22px]'} hover:scale-110 active:scale-95`}
                      onClick={async () => {
                        // Close settings dialog immediately
                        setOpen(false);

                        // Small delay to allow dialog to close smoothly
                        await new Promise((resolve) => setTimeout(resolve, 300));

                        setIsLoadingDummyData(true);
                        // Set flag to disable badge notifications during dummy data loading
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('sporttrack.dummy_data_loading', 'true');
                        }
                        try {
                          // Clear existing data first
                          clearAllActivities();
                          clearAllBadges();
                          clearAllChallenges();

                          // Import BASE_ACTIVITY_DEFINITIONS
                          const { BASE_ACTIVITY_DEFINITIONS } = await import(
                            '@/lib/activityConfig'
                          );
                          const {
                            createDailyChallenge,
                            createWeeklyChallenge,
                            createMonthlyChallenge,
                          } = await import('@/lib/challenges');

                          // Helper function to round numbers nicely
                          const roundAmount = (
                            amount: number,
                            activity: ActivityDefinition
                          ): number => {
                            if (activity.unit.includes('adım') || activity.unit.includes('steps')) {
                              return Math.round(amount / 100) * 100; // Round to nearest 100 for steps
                            } else if (
                              activity.unit.includes('dakika') ||
                              activity.unit.includes('minutes')
                            ) {
                              return Math.round(amount / 5) * 5; // Round to nearest 5 for minutes
                            } else if (
                              activity.unit.includes('tekrar') ||
                              activity.unit.includes('reps')
                            ) {
                              return Math.round(amount / 5) * 5; // Round to nearest 5 for reps
                            } else if (activity.unit.includes('basamak')) {
                              return Math.round(amount / 10) * 10; // Round to nearest 10 for stairs
                            }
                            return Math.round(amount);
                          };

                          // Generate dummy activities for the last 240 days (8 months)
                          const now = new Date();
                          const activitiesToAdd: Parameters<typeof addActivity>[0][] = [];
                          const totalDays = 240;

                          for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
                            const baseDate = new Date(now);
                            baseDate.setDate(baseDate.getDate() - dayOffset);
                            baseDate.setHours(0, 0, 0, 0);
                            const dayOfWeek = baseDate.getDay(); // 0 = Sunday, 6 = Saturday

                            // Different activity patterns for different days
                            if (dayOfWeek === 0) {
                              // Sunday - Rest day, 1-2 activities
                              const numActivities = Math.random() > 0.3 ? 1 : 2;
                              for (let i = 0; i < numActivities; i++) {
                                const activityDate = new Date(baseDate);
                                activityDate.setHours(
                                  10 + Math.floor(Math.random() * 4),
                                  Math.floor(Math.random() * 60),
                                  0,
                                  0
                                );
                                const activity = BASE_ACTIVITY_DEFINITIONS.find(
                                  (a) => a.key === 'WALKING'
                                )!;
                                const amount = roundAmount(2000 + Math.random() * 2000, activity);
                                activitiesToAdd.push({
                                  definition: activity,
                                  amount,
                                  performedAt: activityDate.toISOString(),
                                });
                              }
                            } else if (dayOfWeek === 6) {
                              // Saturday - Active day, 3-4 activities
                              const numActivities = Math.random() > 0.5 ? 3 : 4;
                              const activityTypes = [
                                'RUNNING',
                                'SWIMMING',
                                'WEIGHT_LIFTING',
                                'PUSH_UP',
                                'SIT_UP',
                              ];
                              for (let i = 0; i < numActivities; i++) {
                                const activityKey =
                                  activityTypes[Math.floor(Math.random() * activityTypes.length)];
                                const activity = BASE_ACTIVITY_DEFINITIONS.find(
                                  (a) => a.key === activityKey
                                )!;
                                const activityDate = new Date(baseDate);
                                const hour =
                                  i === 0
                                    ? 7 + Math.floor(Math.random() * 2)
                                    : i === 1
                                      ? 10 + Math.floor(Math.random() * 2)
                                      : i === 2
                                        ? 15 + Math.floor(Math.random() * 2)
                                        : 18 + Math.floor(Math.random() * 2);
                                activityDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

                                let amount: number;
                                if (activity.key === 'RUNNING') {
                                  amount = roundAmount(3000 + Math.random() * 3000, activity);
                                } else if (activity.key === 'SWIMMING') {
                                  amount = roundAmount(20 + Math.random() * 40, activity);
                                } else if (activity.key === 'WEIGHT_LIFTING') {
                                  amount = roundAmount(30 + Math.random() * 60, activity);
                                } else {
                                  amount = roundAmount(
                                    activity.defaultAmount * (0.5 + Math.random() * 0.8),
                                    activity
                                  );
                                }

                                activitiesToAdd.push({
                                  definition: activity,
                                  amount,
                                  performedAt: activityDate.toISOString(),
                                });
                              }
                            } else {
                              // Weekdays - Regular activity, 2-4 activities
                              const numActivities =
                                Math.random() > 0.4 ? (Math.random() > 0.5 ? 2 : 3) : 4;

                              // Use different activities each day
                              const availableActivities = BASE_ACTIVITY_DEFINITIONS.filter(
                                (a) => a.key !== 'WALKING' || Math.random() > 0.7 // Less walking on weekdays
                              );

                              for (let i = 0; i < numActivities; i++) {
                                const activity =
                                  availableActivities[
                                    Math.floor(Math.random() * availableActivities.length)
                                  ];
                                const activityDate = new Date(baseDate);
                                const hour =
                                  i === 0
                                    ? 6 + Math.floor(Math.random() * 2)
                                    : i === 1
                                      ? 12 + Math.floor(Math.random() * 2)
                                      : i === 2
                                        ? 17 + Math.floor(Math.random() * 2)
                                        : 20 + Math.floor(Math.random() * 2);
                                activityDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

                                let amount: number;
                                if (activity.key === 'WALKING') {
                                  amount = roundAmount(5000 + Math.random() * 5000, activity);
                                } else if (activity.key === 'RUNNING') {
                                  amount = roundAmount(2000 + Math.random() * 3000, activity);
                                } else if (activity.key === 'SWIMMING') {
                                  amount = roundAmount(15 + Math.random() * 30, activity);
                                } else if (activity.key === 'WEIGHT_LIFTING') {
                                  amount = roundAmount(20 + Math.random() * 50, activity);
                                } else if (activity.key === 'STAIRS') {
                                  amount = roundAmount(20 + Math.random() * 30, activity);
                                } else {
                                  amount = roundAmount(
                                    activity.defaultAmount * (0.6 + Math.random() * 0.6),
                                    activity
                                  );
                                }

                                activitiesToAdd.push({
                                  definition: activity,
                                  amount,
                                  performedAt: activityDate.toISOString(),
                                });
                              }
                            }
                          }

                          // Add all activities
                          activitiesToAdd.forEach((activity) => {
                            addActivity(activity);
                          });

                          // Wait a bit for activities to be processed
                          await new Promise((resolve) => setTimeout(resolve, 1500));

                          // Check and unlock badges silently (no notifications)
                          checkNewBadges();

                          // Create challenges only if they don't already exist
                          const currentSettings = settings || { dailyTarget: DEFAULT_DAILY_TARGET };
                          const existingChallengeIds = new Set(challenges.map((c) => c.id));

                          // Check if daily challenge exists
                          const hasDailyChallenge = challenges.some(
                            (c) => c.type === 'daily' && c.status === 'active'
                          );
                          if (!hasDailyChallenge) {
                            const dailyChallenge = createDailyChallenge(
                              { tr: 'Günlük Hedef', en: 'Daily Goal' },
                              currentSettings.dailyTarget,
                              new Date()
                            );
                            if (!existingChallengeIds.has(dailyChallenge.id)) {
                              addChallenge(dailyChallenge);
                            }
                          }

                          // Check if weekly challenge exists
                          const hasWeeklyChallenge = challenges.some(
                            (c) => c.type === 'weekly' && c.status === 'active'
                          );
                          if (!hasWeeklyChallenge) {
                            const weeklyChallenge = createWeeklyChallenge(
                              { tr: 'Haftalık Hedef', en: 'Weekly Goal' },
                              50000,
                              new Date()
                            );
                            if (!existingChallengeIds.has(weeklyChallenge.id)) {
                              addChallenge(weeklyChallenge);
                            }
                          }

                          // Check if monthly challenge exists
                          const hasMonthlyChallenge = challenges.some(
                            (c) => c.type === 'monthly' && c.status === 'active'
                          );
                          if (!hasMonthlyChallenge) {
                            const monthlyChallenge = createMonthlyChallenge(
                              { tr: 'Aylık Hedef', en: 'Monthly Goal' },
                              200000,
                              new Date()
                            );
                            if (!existingChallengeIds.has(monthlyChallenge.id)) {
                              addChallenge(monthlyChallenge);
                            }
                          }

                          showToast(
                            lang === 'tr'
                              ? `✅ ${activitiesToAdd.length} aktivite, rozetler ve challenge'lar yüklendi!`
                              : `✅ ${activitiesToAdd.length} activities, badges, and challenges loaded!`,
                            'success'
                          );

                          // Navigate to homepage after a short delay
                          setTimeout(() => {
                            router.push('/');
                          }, 500);
                        } catch (error) {
                          console.error('Failed to load dummy data:', error);
                          showToast(
                            lang === 'tr'
                              ? 'Dummy veri yükleme hatası'
                              : 'Failed to load dummy data',
                            'error'
                          );
                        } finally {
                          // Clear flag to re-enable badge notifications
                          if (typeof window !== 'undefined') {
                            localStorage.removeItem('sporttrack.dummy_data_loading');
                          }
                          setIsLoadingDummyData(false);
                        }
                      }}
                      disabled={isLoadingDummyData}
                      title={lang === 'tr' ? 'Admin Mod' : 'Admin Mode'}
                    >
                      {isLoadingDummyData ? <span className="animate-spin">⏳</span> : '🧪'}
                    </Button>
                    {/* Clear Cache & Data Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`px-1 py-0.5 ${isMobile ? 'text-[7px] min-h-[20px]' : 'text-[8px] sm:text-[9px] min-h-[22px]'} hover:scale-110 active:scale-95`}
                      onClick={async () => {
                        if (
                          !confirm(
                            lang === 'tr'
                              ? 'Tüm cache ve verileri temizlemek istediğinize emin misiniz? Bu işlem geri alınamaz ve sayfa yenilenecektir.'
                              : 'Are you sure you want to clear all cache and data? This action cannot be undone and the page will reload.'
                          )
                        ) {
                          return;
                        }

                        try {
                          // Clear all localStorage data
                          if (typeof window !== 'undefined') {
                            // Clear all SportTrack related keys
                            Object.values(STORAGE_KEYS).forEach((key) => {
                              localStorage.removeItem(key);
                            });

                            // Clear other SportTrack related keys
                            const allKeys = Object.keys(localStorage);
                            allKeys.forEach((key) => {
                              if (key.startsWith('sporttrack') || key.startsWith('sportTrack')) {
                                localStorage.removeItem(key);
                              }
                            });

                            // Clear Service Worker cache if available
                            if ('serviceWorker' in navigator && 'caches' in window) {
                              try {
                                const cacheNames = await caches.keys();
                                await Promise.all(
                                  cacheNames.map((cacheName) => caches.delete(cacheName))
                                );
                              } catch (error) {
                                console.warn('Failed to clear cache:', error);
                              }
                            }

                            // Clear IndexedDB if available
                            if ('indexedDB' in window) {
                              try {
                                // Try to delete IndexedDB databases
                                const databases = await indexedDB.databases();
                                await Promise.all(
                                  databases.map((db) => {
                                    if (db.name) {
                                      return new Promise<void>((resolve, reject) => {
                                        const deleteReq = indexedDB.deleteDatabase(db.name!);
                                        deleteReq.onsuccess = () => resolve();
                                        deleteReq.onerror = () => reject(deleteReq.error);
                                        deleteReq.onblocked = () => resolve(); // Still resolve if blocked
                                      });
                                    }
                                  })
                                );
                              } catch (error) {
                                console.warn('Failed to clear IndexedDB:', error);
                              }
                            }

                            showToast(
                              lang === 'tr'
                                ? 'Cache ve veriler temizlendi. Sayfa yenileniyor...'
                                : 'Cache and data cleared. Reloading page...',
                              'success'
                            );

                            // Reload page after a short delay
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                          }
                        } catch (error) {
                          console.error('Failed to clear cache and data:', error);
                          showToast(lang === 'tr' ? 'Temizleme hatası' : 'Clear error', 'error');
                        }
                      }}
                      title={lang === 'tr' ? 'Cache ve Verileri Temizle' : 'Clear Cache & Data'}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Authenticated users: Full settings (no name field, but show user info) */}

                {/* User Info Display */}
                {(user?.displayName || settings?.name) && (
                  <div
                    className={`${isMobile ? 'mb-2 pb-1.5' : 'mb-2.5 pb-2'} border-b border-gray-200 dark:border-gray-700`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={isMobile ? 'text-sm' : 'text-base'}>👤</span>
                      <span
                        className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-white truncate`}
                      >
                        {user?.displayName || settings?.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Daily Goal and Emotion/Feeling - Same Row (always side by side) */}
                <div className={`grid grid-cols-2 ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                  <label className={`block ${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
                    <span
                      className={`${isMobile ? 'text-sm' : 'text-xs sm:text-sm'} font-semibold text-gray-700 dark:text-gray-300`}
                    >
                      {t('settings.goalLabel')}
                    </span>
                    <Input
                      type="number"
                      min={LIMITS.DAILY_TARGET_MIN}
                      max={LIMITS.DAILY_TARGET_MAX}
                      step={100}
                      value={dailyTarget}
                      onChange={(e) => setDailyTarget(e.target.value)}
                      placeholder="10000"
                      autoComplete="off"
                      data-form-type="other"
                      size={isMobile ? 'sm' : 'sm'}
                      className="w-full"
                    />
                  </label>

                  <label className={`block ${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
                    <span
                      className={`${isMobile ? 'text-sm' : 'text-xs sm:text-sm'} font-semibold text-gray-700 dark:text-gray-300`}
                    >
                      {t('settings.moodLabel')}
                    </span>
                    <Select
                      value={mood || ''}
                      onChange={(e) => setMood((e.target.value || null) as Mood)}
                      size={isMobile ? 'sm' : 'sm'}
                      options={[
                        { value: '', label: t('settings.moodNone') },
                        { value: 'happy', label: t('settings.moodHappy') },
                        { value: 'cheerful', label: t('settings.moodCheerful') },
                        { value: 'sad', label: t('settings.moodSad') },
                        { value: 'unhappy', label: t('settings.moodUnhappy') },
                        { value: 'tired', label: t('settings.moodTired') },
                      ]}
                      className="w-full"
                    />
                  </label>
                </div>

                {/* Level Display */}
                <div
                  className={`${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-gray-200 dark:border-gray-700`}
                >
                  <LevelDisplay />
                </div>

                {/* App Settings Section */}
                <div
                  className={`${isMobile ? 'pt-2 space-y-1.5' : 'pt-2.5 space-y-2.5'} border-t border-gray-200 dark:border-gray-700`}
                >
                  <div>
                    <span
                      className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                    >
                      {lang === 'tr' ? 'Veri İşlemleri' : 'Data Operations'}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isAuthenticated && (
                        <Suspense
                          fallback={
                            <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                          }
                        >
                          <DataExportImport onSettingsClose={() => setOpen(false)} />
                        </Suspense>
                      )}
                      {isAuthenticated && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size={isMobile ? 'md' : 'sm'}
                            onClick={() => {
                              setOpen(false);
                              setTimeout(() => {
                                handleClearData();
                              }, 300);
                            }}
                            className={`${isMobile ? 'px-2 py-2' : 'px-1.5'} text-base flex items-center justify-center`}
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
                                : {
                                    height: '24px',
                                    minHeight: '24px',
                                    maxHeight: '24px',
                                    width: '24px',
                                    minWidth: '24px',
                                    maxWidth: '24px',
                                  }
                            }
                            title={t('settings.clearData')}
                            aria-label={t('settings.clearData')}
                          >
                            🗑️
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                    >
                      {lang === 'tr' ? 'Görünüm Ayarları' : 'Display Settings'}
                    </span>
                    <div
                      className={`flex items-center flex-wrap ${isMobile ? 'gap-1.5' : 'gap-3'}`}
                    >
                      <LanguageToggle />
                      <ThemeToggle />
                      {/* Reduce Animations Button */}
                      <Button
                        type="button"
                        variant={reduceAnimations ? 'primary' : 'ghost'}
                        size="sm"
                        className={`px-1 py-0.5 ${isMobile ? 'text-[7px] min-h-[20px]' : 'text-[8px] sm:text-[9px] min-h-[22px]'} hover:scale-110 active:scale-95`}
                        onClick={() => setReduceAnimations(!reduceAnimations)}
                        aria-pressed={reduceAnimations}
                        title={lang === 'tr' ? 'Animasyonları Azalt' : 'Reduce Animations'}
                      >
                        ⚡
                      </Button>
                      {/* Admin Mod Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`px-1 py-0.5 ${isMobile ? 'text-[7px] min-h-[20px]' : 'text-[8px] sm:text-[9px] min-h-[22px]'} hover:scale-110 active:scale-95`}
                        onClick={async () => {
                          // Close settings dialog immediately
                          setOpen(false);

                          // Small delay to allow dialog to close smoothly
                          await new Promise((resolve) => setTimeout(resolve, 300));

                          setIsLoadingDummyData(true);
                          // Set flag to disable badge notifications during dummy data loading
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('sporttrack.dummy_data_loading', 'true');
                          }
                          try {
                            // Clear existing data first
                            clearAllActivities();
                            clearAllBadges();
                            clearAllChallenges();

                            // Import BASE_ACTIVITY_DEFINITIONS
                            const { BASE_ACTIVITY_DEFINITIONS } = await import(
                              '@/lib/activityConfig'
                            );
                            const { checkBadges } = await import('@/lib/badges');
                            const {
                              createDailyChallenge,
                              createWeeklyChallenge,
                              createMonthlyChallenge,
                            } = await import('@/lib/challenges');

                            // Helper function to round numbers nicely
                            const roundAmount = (
                              amount: number,
                              activity: ActivityDefinition
                            ): number => {
                              if (
                                activity.unit.includes('adım') ||
                                activity.unit.includes('steps')
                              ) {
                                return Math.round(amount / 100) * 100; // Round to nearest 100 for steps
                              } else if (
                                activity.unit.includes('dakika') ||
                                activity.unit.includes('minutes')
                              ) {
                                return Math.round(amount / 5) * 5; // Round to nearest 5 for minutes
                              } else if (
                                activity.unit.includes('tekrar') ||
                                activity.unit.includes('reps')
                              ) {
                                return Math.round(amount / 5) * 5; // Round to nearest 5 for reps
                              } else if (activity.unit.includes('basamak')) {
                                return Math.round(amount / 10) * 10; // Round to nearest 10 for stairs
                              }
                              return Math.round(amount);
                            };

                            // Generate dummy activities for the last 240 days (8 months)
                            const now = new Date();
                            const activitiesToAdd: Parameters<typeof addActivity>[0][] = [];
                            const totalDays = 240;

                            for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
                              const baseDate = new Date(now);
                              baseDate.setDate(baseDate.getDate() - dayOffset);
                              baseDate.setHours(0, 0, 0, 0);
                              const dayOfWeek = baseDate.getDay(); // 0 = Sunday, 6 = Saturday

                              // Different activity patterns for different days
                              if (dayOfWeek === 0) {
                                // Sunday - Rest day, 1-2 activities
                                const numActivities = Math.random() > 0.3 ? 1 : 2;
                                for (let i = 0; i < numActivities; i++) {
                                  const activityDate = new Date(baseDate);
                                  activityDate.setHours(
                                    10 + Math.floor(Math.random() * 4),
                                    Math.floor(Math.random() * 60),
                                    0,
                                    0
                                  );
                                  const activity = BASE_ACTIVITY_DEFINITIONS.find(
                                    (a) => a.key === 'WALKING'
                                  )!;
                                  const amount = roundAmount(2000 + Math.random() * 2000, activity);
                                  activitiesToAdd.push({
                                    definition: activity,
                                    amount,
                                    performedAt: activityDate.toISOString(),
                                  });
                                }
                              } else if (dayOfWeek === 6) {
                                // Saturday - Active day, 3-4 activities
                                const numActivities = Math.random() > 0.5 ? 3 : 4;
                                const activityTypes = [
                                  'RUNNING',
                                  'SWIMMING',
                                  'WEIGHT_LIFTING',
                                  'PUSH_UP',
                                  'SIT_UP',
                                ];
                                for (let i = 0; i < numActivities; i++) {
                                  const activityKey =
                                    activityTypes[Math.floor(Math.random() * activityTypes.length)];
                                  const activity = BASE_ACTIVITY_DEFINITIONS.find(
                                    (a) => a.key === activityKey
                                  )!;
                                  const activityDate = new Date(baseDate);
                                  const hour =
                                    i === 0
                                      ? 7 + Math.floor(Math.random() * 2)
                                      : i === 1
                                        ? 10 + Math.floor(Math.random() * 2)
                                        : i === 2
                                          ? 15 + Math.floor(Math.random() * 2)
                                          : 18 + Math.floor(Math.random() * 2);
                                  activityDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

                                  let amount: number;
                                  if (activity.key === 'RUNNING') {
                                    amount = roundAmount(3000 + Math.random() * 3000, activity);
                                  } else if (activity.key === 'SWIMMING') {
                                    amount = roundAmount(20 + Math.random() * 40, activity);
                                  } else if (activity.key === 'WEIGHT_LIFTING') {
                                    amount = roundAmount(30 + Math.random() * 60, activity);
                                  } else {
                                    amount = roundAmount(
                                      activity.defaultAmount * (0.5 + Math.random() * 0.8),
                                      activity
                                    );
                                  }

                                  activitiesToAdd.push({
                                    definition: activity,
                                    amount,
                                    performedAt: activityDate.toISOString(),
                                  });
                                }
                              } else {
                                // Weekdays - Regular activity, 2-4 activities
                                const numActivities =
                                  Math.random() > 0.4 ? (Math.random() > 0.5 ? 2 : 3) : 4;

                                // Use different activities each day
                                const availableActivities = BASE_ACTIVITY_DEFINITIONS.filter(
                                  (a) => a.key !== 'WALKING' || Math.random() > 0.7 // Less walking on weekdays
                                );

                                for (let i = 0; i < numActivities; i++) {
                                  const activity =
                                    availableActivities[
                                      Math.floor(Math.random() * availableActivities.length)
                                    ];
                                  const activityDate = new Date(baseDate);
                                  const hour =
                                    i === 0
                                      ? 6 + Math.floor(Math.random() * 2)
                                      : i === 1
                                        ? 12 + Math.floor(Math.random() * 2)
                                        : i === 2
                                          ? 17 + Math.floor(Math.random() * 2)
                                          : 20 + Math.floor(Math.random() * 2);
                                  activityDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

                                  let amount: number;
                                  if (activity.key === 'WALKING') {
                                    amount = roundAmount(5000 + Math.random() * 5000, activity);
                                  } else if (activity.key === 'RUNNING') {
                                    amount = roundAmount(2000 + Math.random() * 3000, activity);
                                  } else if (activity.key === 'SWIMMING') {
                                    amount = roundAmount(15 + Math.random() * 30, activity);
                                  } else if (activity.key === 'WEIGHT_LIFTING') {
                                    amount = roundAmount(20 + Math.random() * 50, activity);
                                  } else if (activity.key === 'STAIRS') {
                                    amount = roundAmount(20 + Math.random() * 30, activity);
                                  } else {
                                    amount = roundAmount(
                                      activity.defaultAmount * (0.6 + Math.random() * 0.6),
                                      activity
                                    );
                                  }

                                  activitiesToAdd.push({
                                    definition: activity,
                                    amount,
                                    performedAt: activityDate.toISOString(),
                                  });
                                }
                              }
                            }

                            // Add all activities
                            activitiesToAdd.forEach((activity) => {
                              addActivity(activity);
                            });

                            // Wait a bit for activities to be processed
                            await new Promise((resolve) => setTimeout(resolve, 1500));

                            // Check and unlock badges silently (no notifications)
                            checkNewBadges();

                            // Create challenges only if they don't already exist
                            const currentSettings = settings || {
                              dailyTarget: DEFAULT_DAILY_TARGET,
                            };
                            const existingChallengeIds = new Set(challenges.map((c) => c.id));

                            // Check if daily challenge exists
                            const hasDailyChallenge = challenges.some(
                              (c) => c.type === 'daily' && c.status === 'active'
                            );
                            if (!hasDailyChallenge) {
                              const dailyChallenge = createDailyChallenge(
                                { tr: 'Günlük Hedef', en: 'Daily Goal' },
                                currentSettings.dailyTarget,
                                new Date()
                              );
                              if (!existingChallengeIds.has(dailyChallenge.id)) {
                                addChallenge(dailyChallenge);
                              }
                            }

                            // Check if weekly challenge exists
                            const hasWeeklyChallenge = challenges.some(
                              (c) => c.type === 'weekly' && c.status === 'active'
                            );
                            if (!hasWeeklyChallenge) {
                              const weeklyChallenge = createWeeklyChallenge(
                                { tr: 'Haftalık Hedef', en: 'Weekly Goal' },
                                50000,
                                new Date()
                              );
                              if (!existingChallengeIds.has(weeklyChallenge.id)) {
                                addChallenge(weeklyChallenge);
                              }
                            }

                            // Check if monthly challenge exists
                            const hasMonthlyChallenge = challenges.some(
                              (c) => c.type === 'monthly' && c.status === 'active'
                            );
                            if (!hasMonthlyChallenge) {
                              const monthlyChallenge = createMonthlyChallenge(
                                { tr: 'Aylık Hedef', en: 'Monthly Goal' },
                                200000,
                                new Date()
                              );
                              if (!existingChallengeIds.has(monthlyChallenge.id)) {
                                addChallenge(monthlyChallenge);
                              }
                            }

                            showToast(
                              lang === 'tr'
                                ? `✅ ${activitiesToAdd.length} aktivite, rozetler ve challenge'lar yüklendi!`
                                : `✅ ${activitiesToAdd.length} activities, badges, and challenges loaded!`,
                              'success'
                            );

                            // Navigate to homepage after a short delay
                            setTimeout(() => {
                              router.push('/');
                            }, 500);
                          } catch (error) {
                            console.error('Failed to load dummy data:', error);
                            showToast(
                              lang === 'tr'
                                ? 'Dummy veri yükleme hatası'
                                : 'Failed to load dummy data',
                              'error'
                            );
                          } finally {
                            // Clear flag to re-enable badge notifications
                            if (typeof window !== 'undefined') {
                              localStorage.removeItem('sporttrack.dummy_data_loading');
                            }
                            setIsLoadingDummyData(false);
                          }
                        }}
                        disabled={isLoadingDummyData}
                        title={lang === 'tr' ? 'Admin Mod' : 'Admin Mode'}
                      >
                        {isLoadingDummyData ? <span className="animate-spin">⏳</span> : '🧪'}
                      </Button>
                      {/* Clear Cache & Data Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`px-1 py-0.5 ${isMobile ? 'text-[7px] min-h-[20px]' : 'text-[8px] sm:text-[9px] min-h-[22px]'} hover:scale-110 active:scale-95`}
                        onClick={async () => {
                          if (
                            !confirm(
                              lang === 'tr'
                                ? 'Tüm cache ve verileri temizlemek istediğinize emin misiniz? Bu işlem geri alınamaz ve sayfa yenilenecektir.'
                                : 'Are you sure you want to clear all cache and data? This action cannot be undone and the page will reload.'
                            )
                          ) {
                            return;
                          }

                          try {
                            // Clear all localStorage data
                            if (typeof window !== 'undefined') {
                              // Clear all SportTrack related keys
                              Object.values(STORAGE_KEYS).forEach((key) => {
                                localStorage.removeItem(key);
                              });

                              // Clear other SportTrack related keys
                              const allKeys = Object.keys(localStorage);
                              allKeys.forEach((key) => {
                                if (key.startsWith('sporttrack') || key.startsWith('sportTrack')) {
                                  localStorage.removeItem(key);
                                }
                              });

                              // Clear Service Worker cache if available
                              if ('serviceWorker' in navigator && 'caches' in window) {
                                try {
                                  const cacheNames = await caches.keys();
                                  await Promise.all(
                                    cacheNames.map((cacheName) => caches.delete(cacheName))
                                  );
                                } catch (error) {
                                  console.warn('Failed to clear cache:', error);
                                }
                              }

                              // Clear IndexedDB if available
                              if ('indexedDB' in window) {
                                try {
                                  // Try to delete IndexedDB databases
                                  const databases = await indexedDB.databases();
                                  await Promise.all(
                                    databases.map((db) => {
                                      if (db.name) {
                                        return new Promise<void>((resolve, reject) => {
                                          const deleteReq = indexedDB.deleteDatabase(db.name!);
                                          deleteReq.onsuccess = () => resolve();
                                          deleteReq.onerror = () => reject(deleteReq.error);
                                          deleteReq.onblocked = () => resolve(); // Still resolve if blocked
                                        });
                                      }
                                    })
                                  );
                                } catch (error) {
                                  console.warn('Failed to clear IndexedDB:', error);
                                }
                              }

                              showToast(
                                lang === 'tr'
                                  ? 'Cache ve veriler temizlendi. Sayfa yenileniyor...'
                                  : 'Cache and data cleared. Reloading page...',
                                'success'
                              );

                              // Reload page after a short delay
                              setTimeout(() => {
                                window.location.reload();
                              }, 1000);
                            }
                          } catch (error) {
                            console.error('Failed to clear cache and data:', error);
                            showToast(lang === 'tr' ? 'Temizleme hatası' : 'Clear error', 'error');
                          }
                        }}
                        title={lang === 'tr' ? 'Cache ve Verileri Temizle' : 'Clear Cache & Data'}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>

                  <div>
                    <NotificationSettings />
                  </div>

                  <div>
                    <span
                      className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                    >
                      {lang === 'tr' ? 'Aktivite Hatırlatıcıları' : 'Activity Reminders'}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`px-1 py-0.5 ${isMobile ? 'text-[7px] min-h-[20px]' : 'text-[8px] sm:text-[9px] min-h-[22px]'} hover:scale-110 active:scale-95`}
                      onClick={() => {
                        setOpen(false);
                        setTimeout(() => {
                          setShowActivityRemindersDialog(true);
                        }, 300);
                      }}
                      title={lang === 'tr' ? 'Aktivite Hatırlatıcıları' : 'Activity Reminders'}
                    >
                      ⏰
                    </Button>
                  </div>

                  <div>
                    <Suspense
                      fallback={
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      }
                    >
                      <CloudSyncSettings
                        onSyncComplete={() => setOpen(false)}
                        onSyncingChange={(syncing) => {
                          setIsSyncing(syncing);
                          if (!syncing && isSyncing) {
                            // Syncing just finished, show success
                            setShowSyncSuccess(true);
                            setTimeout(() => {
                              setShowSyncSuccess(false);
                            }, 2000);
                          }
                        }}
                        onSettingsClose={() => setOpen(false)}
                      />
                    </Suspense>
                  </div>

                  {keyboardShortcuts && (
                    <div>
                      <span
                        className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                      >
                        {t('settings.keyboardShortcuts')}
                      </span>
                      {!isMobile && (
                        <p className={`text-xs text-gray-500 dark:text-gray-400 mb-2`}>
                          {t('settings.keyboardShortcutsHint')}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => keyboardShortcuts.showHelp()}
                        className={`w-full px-2 py-1 ${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold`}
                      >
                        {t('settings.keyboardShortcuts')}
                      </button>
                    </div>
                  )}

                  {/* Sign Out - Separate Row */}
                  {isAuthenticated && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex-1 min-w-[80px] relative"
                      >
                        {isLoggingOut ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            {lang === 'tr' ? 'Çıkış yapılıyor...' : 'Logging out...'}
                          </span>
                        ) : lang === 'tr' ? (
                          'Çıkış Yap'
                        ) : (
                          'Sign Out'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {error ? (
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500 font-medium`}>
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    );
  };

  const settingsDialog = renderSettingsDialog();

  // For authenticated users: prioritize Firebase displayName
  // For non-authenticated users: use settings name or emoji
  const displayName =
    isAuthenticated && user?.displayName
      ? user.displayName
      : settings?.name && settings.name.trim() !== ''
        ? settings.name
        : '👤';

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {triggerButton}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`${
            isMobile
              ? 'px-4 py-2.5 min-h-[44px] min-w-[360px] text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center flex-shrink-0 gap-2 overflow-hidden max-w-[500px] sm:max-w-none font-medium'
              : 'px-5 py-2 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2.5 max-w-[1800px] font-medium'
          } truncate`}
          title={displayName}
          aria-label={displayName}
          data-tour-id="profile"
        >
          <span className={`${isMobile ? 'text-sm' : 'text-sm'} truncate`}>
            {isMobile && typeof displayName === 'string' && displayName.length > 18
              ? displayName.substring(0, 18) + '...'
              : displayName}
          </span>
          <span className={`${isMobile ? 'text-base' : 'text-sm'} flex-shrink-0`}>⚙️</span>
        </button>
      )}
      {typeof window !== 'undefined' && settingsDialog
        ? createPortal(settingsDialog, document.body)
        : null}
      {showAuthDialog && (
        <AuthDialog
          open={showAuthDialog}
          onClose={() => {
            setShowAuthDialog(false);
          }}
        />
      )}
      <ConfirmDialog
        open={showClearDataDialog}
        title={lang === 'tr' ? 'Tüm Verileri Temizle' : 'Clear All Data'}
        message={
          lang === 'tr'
            ? 'Bu işlem tüm aktivitelerinizi, rozetlerinizi, meydan okumalarınızı ve ayarlarınızı kalıcı olarak silecektir. Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?'
            : 'This will permanently delete all your activities, badges, challenges, and settings. This action cannot be undone. Are you sure you want to continue?'
        }
        confirmLabel={lang === 'tr' ? 'Evet, Temizle' : 'Yes, Clear'}
        cancelLabel={lang === 'tr' ? 'İptal' : 'Cancel'}
        onConfirm={confirmClearData}
        onCancel={() => setShowClearDataDialog(false)}
        variant="danger"
      />

      {/* Clear Data Overlay - Shows while clearing */}
      {isClearingData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-white p-10 shadow-2xl dark:bg-gray-800 animate-in fade-in zoom-in duration-300">
            {/* Loading Spinner */}
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600 dark:border-t-red-400"></div>
            </div>

            {/* Clearing Message */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {lang === 'tr' ? 'Veriler Siliniyor...' : 'Clearing Data...'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {lang === 'tr'
                  ? 'Lütfen bekleyin, tüm verileriniz siliniyor.'
                  : 'Please wait, all your data is being cleared.'}
              </p>
            </div>

            {/* Loading dots */}
            <div className="flex gap-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-red-600 dark:bg-red-400 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-red-600 dark:bg-red-400 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-red-600 dark:bg-red-400"></div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Success Overlay */}
      {showClearDataSuccess && (
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
                {lang === 'tr' ? 'Veriler Başarıyla Silindi!' : 'Data Successfully Cleared!'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {lang === 'tr'
                  ? 'Tüm verileriniz temizlendi. Anasayfaya yönlendiriliyorsunuz...'
                  : 'All your data has been cleared. Redirecting to homepage...'}
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

      {/* Dummy Data Loading Overlay - Shows while loading dummy data */}
      {isLoadingDummyData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-white p-10 shadow-2xl dark:bg-gray-800 animate-in fade-in zoom-in duration-300">
            {/* Loading Spinner */}
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400"></div>
            </div>

            {/* Loading Message */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {lang === 'tr' ? 'Veriler Yükleniyor...' : 'Loading Data...'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {lang === 'tr'
                  ? 'Lütfen bekleyin, verileriniz yükleniyor.'
                  : 'Please wait, your data is being loaded.'}
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

      {/* Syncing Overlay - Shows while syncing */}
      {isSyncing && !showSyncSuccess && (
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

      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-brand/50 dark:border-brand/50 p-6 sm:p-8 shadow-2xl max-w-sm mx-4 animate-scale-in">
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl sm:text-6xl animate-spin">⏳</div>
              <div className="text-center">
                <h3
                  className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-950 dark:text-white mb-2`}
                >
                  {lang === 'tr' ? 'Çıkış yapılıyor...' : 'Logging out...'}
                </h3>
                <p
                  className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 dark:text-gray-400`}
                >
                  {lang === 'tr'
                    ? 'Verileriniz buluta senkronize ediliyor, lütfen bekleyin.'
                    : 'Syncing your data to cloud, please wait...'}
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand via-brand-light to-brand-dark animate-shimmer rounded-full"
                  style={{ width: '60%' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Reminders Dialog */}
      {showActivityRemindersDialog && (
        <div
          className="fixed inset-0 z-[10016] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowActivityRemindersDialog(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-brand/50 dark:border-brand/50 shadow-2xl max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                {lang === 'tr' ? 'Aktivite Hatırlatıcıları' : 'Activity Reminders'}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowActivityRemindersDialog(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <Suspense
                fallback={
                  <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                }
              >
                <ActivityReminders />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
