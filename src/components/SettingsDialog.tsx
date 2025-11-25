'use client';

import { FormEvent, useEffect, useState, useRef, lazy, Suspense } from 'react';
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
import { useCloudSync } from '@/hooks/useCloudSync';
import { useAutoSync } from '@/hooks/useAutoSync';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

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
  const { activities, clearAllActivities } = useActivities();
  const { badges, clearAllBadges } = useBadges();
  const { challenges, clearAllChallenges } = useChallenges();
  const { syncToCloud } = useCloudSync();
  const { flushPendingSync } = useAutoSync();
  const [open, setOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [name, setName] = useState<string>(settings?.name ?? '');
  const [dailyTarget, setDailyTarget] = useState<string>(
    String(settings?.dailyTarget ?? DEFAULT_DAILY_TARGET)
  );
  const [mood, setMood] = useState<Mood>(settings?.mood ?? null);
  const [listDensity, setListDensity] = useState<'compact' | 'comfortable'>(
    settings?.listDensity ?? 'compact'
  );
  const [reduceAnimations, setReduceAnimations] = useState<boolean>(
    settings?.reduceAnimations ?? false
  );
  const [error, setError] = useState<string | null>(null);
  const hasSyncedNameRef = useRef(false);

  useEffect(() => {
    if (settings) {
      setName(settings.name || '');
      setDailyTarget(String(settings.dailyTarget));
      setMood(settings.mood ?? null);
      setListDensity(settings.listDensity ?? 'compact');
      setReduceAnimations(settings.reduceAnimations ?? false);
    }
  }, [settings]);

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
      listDensity: listDensity,
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
          listDensity: listDensity,
          reduceAnimations: reduceAnimations,
        });
      }
    }, 1000); // Auto-save after 1 second of no changes

    return () => clearTimeout(timer);
  }, [
    name,
    dailyTarget,
    mood,
    listDensity,
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
    try {
      // CRITICAL: Flush any pending debounced sync operations first
      try {
        await flushPendingSync();
      } catch (flushError) {
        // Log only in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to flush pending sync:', flushError);
        }
        // Continue anyway - we'll do a full sync below
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
          await syncToCloud({
            activities: latestActivities,
            settings: latestSettings,
            badges: latestBadges,
            challenges: latestChallenges,
          });
        } catch (syncError) {
          // Log only in development
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to sync before logout:', syncError);
          }
          // Continue with logout even if sync fails
        }
      } else {
        // Debug log only in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Skipping sync before logout - no data to sync');
        }
      }

      await logout();

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

      // Close settings dialog
      setOpen(false);

      // Navigate to homepage
      router.push('/');

      showToast(
        lang === 'tr'
          ? 'Başarıyla çıkış yapıldı! Verileriniz buluta senkronize edildi.'
          : 'Successfully logged out! Your data has been synced to cloud.',
        'success'
      );
    } catch (error) {
      showToast(lang === 'tr' ? 'Çıkış hatası' : 'Logout error', 'error');
    }
  };

  const handleClearData = () => {
    setShowClearDataDialog(true);
  };

  const confirmClearData = async () => {
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
      }
      setShowClearDataDialog(false);
      setOpen(false);
      showToast(
        lang === 'tr'
          ? 'Tüm veriler temizlendi. Sayfa yenileniyor...'
          : 'All data cleared. Refreshing page...',
        'success'
      );
      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showToast(lang === 'tr' ? 'Veri temizleme hatası' : 'Error clearing data', 'error');
    }
  };

  // Settings dialog - Different content for authenticated vs non-authenticated users
  const settingsDialog =
    open && !showAuthDialog ? (
      <div
        className={`fixed inset-0 z-[10000] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/40 ${isMobile ? '' : 'backdrop-blur-sm'} px-4 py-4 overflow-y-auto safe-top safe-bottom safe-left safe-right`}
        onClick={(e) => {
          if (e.target === e.currentTarget && settings) {
            setOpen(false);
            setError(null);
            setName(settings.name || '');
            setDailyTarget(String(settings.dailyTarget));
          }
        }}
      >
        <div
          className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-lg'} ${isMobile ? 'rounded-t-xl' : 'rounded-xl'} border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 ${isMobile ? 'p-2.5' : 'p-4 sm:p-5'} ${isMobile ? '' : 'my-auto'} max-h-[90vh] overflow-y-auto ${isMobile ? 'slide-up-bottom' : 'animate-scale-in'}`}
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
                  className={`${isMobile ? 'text-xs' : 'text-[8px] sm:text-[9px]'} text-gray-400 dark:text-gray-500 font-normal whitespace-nowrap ml-2`}
                >
                  © {new Date().getFullYear()} · Mustafa Evleksiz · Beta v0.21.2
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
                className={`text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5`}
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
            className={isMobile ? 'space-y-1.5' : 'space-y-2.5'}
            onSubmit={submit}
            autoComplete="off"
          >
            {!isAuthenticated ? (
              <>
                {/* Non-authenticated users: Login options + Name + Daily Goal + Emotion */}

                {/* Login Section */}
                {isConfigured && (
                  <div
                    className={`${isMobile ? 'mb-3 pb-3' : 'mb-4 pb-4'} border-b border-gray-200 dark:border-gray-700`}
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
                    className={`${isMobile ? 'text-xs' : 'text-[11px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
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
                      className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
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
                      className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
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

                {/* Export/Import */}
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
                    <DataExportImport />
                  </Suspense>
                </div>

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
                      {lang === 'tr' ? '⚡' : '⚡'}
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
                      className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
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
                      className={`${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
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
                      <Suspense
                        fallback={
                          <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                        }
                      >
                        <DataExportImport />
                      </Suspense>
                      {isAuthenticated && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size={isMobile ? 'md' : 'sm'}
                            onClick={handleClearData}
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
                        {lang === 'tr' ? '⚡' : '⚡'}
                      </Button>
                      {/* List View - Compact/Comfortable Switch */}
                      <div className="inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card p-0.5">
                        <button
                          type="button"
                          onClick={() => setListDensity('compact')}
                          className={`px-1.5 py-0.5 ${isMobile ? 'text-sm min-h-[20px]' : 'text-base min-h-[22px]'} rounded transition-all ${
                            listDensity === 'compact'
                              ? 'bg-brand text-white'
                              : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          title={t('settings.listDensityCompact')}
                          aria-pressed={listDensity === 'compact'}
                        >
                          📋
                        </button>
                        <button
                          type="button"
                          onClick={() => setListDensity('comfortable')}
                          className={`px-1.5 py-0.5 ${isMobile ? 'text-sm min-h-[20px]' : 'text-base min-h-[22px]'} rounded transition-all ${
                            listDensity === 'comfortable'
                              ? 'bg-brand text-white'
                              : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          title={t('settings.listDensityComfortable')}
                          aria-pressed={listDensity === 'comfortable'}
                        >
                          📄
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <NotificationSettings />
                  </div>

                  <div>
                    <Suspense
                      fallback={
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      }
                    >
                      <CloudSyncSettings />
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
                        className="flex-1 min-w-[80px]"
                      >
                        {lang === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
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
    ) : null;

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
    </>
  );
}
